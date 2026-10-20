// The ONE assistant brain, shared by the site (/api/assistant) and the app
// (/api/v1/assistant). Routes only differ by authentication, rate limiting
// and the optional retrieval context — everything that decides WHAT the
// student reads lives here.
//
// The two load-bearing guardrails from the original route are unchanged and
// must not be relaxed without flagging it (per the approved architecture):
//   1. The relevance gate — Claude is never called to GENERATE an answer when
//      retrieval didn't find anything close enough. The condense/translate
//      calls that run before it are retrieval-only and never shown to a user.
//   2. extractAndValidateSources() — any source Claude claims to have used is
//      checked against the chunks we actually sent it before it is shown.
//
// Event stream (NDJSON, one JSON object per line):
//   meta     { queryId, lang }                    — always first
//   text     { delta }                            — one event (site) or many (app, real streaming)
//   sources  { sources: [{title,url,category,slug}] }
//   flags    { flags: ['legal'|'stress'|'complex'|'distress'] }
//   fallback { message, suggestions, queryId }    — refusal, no generation
//   error    { message }

import crypto from 'crypto';
import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { CountryCode } from '@/lib/content/guides';
import { embedQueries } from '@/lib/assistant/voyage';
import { buildSystemPrompt, extractAndValidateSources, type RetrievedChunk } from '@/lib/assistant/system-prompt';
import { detectLanguage, fallbackMessage, translateToFrench } from '@/lib/assistant/language';
import { condenseQuestion, type HistoryMessage } from '@/lib/assistant/conversation';
import { redactPersonalData } from '@/lib/assistant/redact';
import { expandWithGlossary, rankForCountry } from '@/lib/assistant/retrieval-hints';
import { detectDistress, parseModelFlags, type AssistantFlag } from '@/lib/assistant/flags';
import { ZERO_USAGE, addUsage, usageOf, type Usage } from '@/lib/assistant/cost';

// Conservative on purpose — start by refusing borderline questions rather
// than risking a stretched answer. Tune upward only after reviewing real
// queries in assistant_queries (top_similarity column).
export const RELEVANCE_THRESHOLD = 0.6;
const MATCH_COUNT = 6;
// Wider net when a country filter will drop other countries' guides.
const MATCH_COUNT_WITH_COUNTRY = 12;
export const MAX_QUESTION_LENGTH = 300;
const MAX_ANSWER_TOKENS = 800;

// Configurable without touching code if quality needs a quick swap.
// On Vercel, changing it still requires a redeploy (env vars aren't hot-reloaded).
const MODEL = process.env.ASSISTANT_MODEL || 'claude-haiku-4-5';

export type Channel = 'site' | 'app';

export interface AnswerInput {
  question: string;
  history: HistoryMessage[];
  channel: Channel;
  /** App only: retrieval context. Never injected into the prompt as a fact. */
  country?: CountryCode | null;
  stepId?: string | null;
  /** true = text deltas are sent as they arrive (app). false = one text event (site UI). */
  stream: boolean;
  /** Called once with the total Anthropic usage of this question (helpers included). */
  onUsage?: (usage: Usage) => Promise<void>;
}

interface MatchedChunk extends RetrievedChunk {
  id: string;
  slug: string;
  similarity: number;
}

const NDJSON_HEADERS = { 'Content-Type': 'application/x-ndjson; charset=utf-8' };
const line = (obj: unknown) => JSON.stringify(obj) + '\n';

/** Unions several result sets, keeping each chunk's best similarity. */
function mergeMatches(resultSets: MatchedChunk[][]): MatchedChunk[] {
  const best = new Map<string, MatchedChunk>();
  for (const chunk of resultSets.flat()) {
    const existing = best.get(chunk.id);
    if (!existing || chunk.similarity > existing.similarity) best.set(chunk.id, chunk);
  }
  return Array.from(best.values()).sort((a, b) => b.similarity - a.similarity);
}

const sourceRef = (c: MatchedChunk) => ({ title: c.title, url: c.url, category: c.category, slug: c.slug });

/** One entry per guide, best first (several chunks often come from the same guide). */
function nearestGuides(chunks: MatchedChunk[], max = 3) {
  const seen = new Set<string>();
  return chunks.filter(c => !seen.has(c.slug) && seen.add(c.slug)).slice(0, max).map(sourceRef);
}

// Columns added by the 20261020000200_assistant_app migration. If the site is
// deployed before the migration is applied, the insert is retried without
// them so the content-gap log never silently stops.
const LEGACY_COLUMNS = ['id', 'question', 'retrieval_query', 'retrieved_chunk_ids', 'top_similarity', 'fallback_triggered'];

async function logQuery(row: Record<string, unknown>) {
  const { error } = await supabaseAdmin.from('assistant_queries').insert(row);
  if (!error) return;
  if (error.code === 'PGRST204' || error.code === '42703') {
    const legacy = Object.fromEntries(Object.entries(row).filter(([k]) => LEGACY_COLUMNS.includes(k)));
    const retry = await supabaseAdmin.from('assistant_queries').insert(legacy);
    if (!retry.error) return;
    console.error('assistant_queries insert failed:', retry.error);
    return;
  }
  console.error('assistant_queries insert failed:', error);
}

/**
 * Holds back the trailing FLAGS / SOURCES_USED lines while streaming, so the
 * student never sees them flash on screen. Everything before them is released
 * as soon as it can no longer be the start of a marker.
 */
function createTailHolder() {
  const markers = ['\nFLAGS:', '\nSOURCES_USED:'];
  let buffer = '\n'; // virtual leading newline: a marker on the very first line is caught too
  let released = 1;
  let stopped = false;
  return (delta: string): string => {
    if (stopped) return '';
    buffer += delta;
    const hit = markers.map(m => buffer.indexOf(m, released - 1)).filter(i => i >= 0);
    if (hit.length > 0) {
      stopped = true;
      const out = buffer.slice(released, Math.min(...hit));
      released = buffer.length;
      return out;
    }
    let keep = 0;
    for (const m of markers) {
      for (let k = Math.min(m.length - 1, buffer.length); k > keep; k--) {
        if (buffer.endsWith(m.slice(0, k))) {
          keep = k;
          break;
        }
      }
    }
    const end = buffer.length - keep;
    const out = buffer.slice(released, Math.max(released, end));
    released = Math.max(released, end);
    return out;
  };
}

export async function answerQuestion(input: AnswerInput): Promise<Response> {
  const { question, history, channel, country, stepId } = input;
  const queryId = crypto.randomUUID();
  const lang = detectLanguage(question);
  let usage: Usage = ZERO_USAGE;
  const track = (model: string, u: Anthropic.Usage) => (usage = addUsage(usage, usageOf(model, u)));

  // ── Retrieval ──────────────────────────────────────────────────────────
  // Corpus is French-only: follow-ups are condensed into a standalone French
  // query, other non-French questions are translated (retrieval only).
  let retrievalQuery = question;
  if (history.length > 0) {
    try {
      retrievalQuery = await condenseQuestion(history, question, track);
    } catch (err) {
      console.error('Question condensing failed, falling back to single-turn retrieval:', err);
    }
  }
  if (retrievalQuery === question && lang !== 'fr') {
    try {
      retrievalQuery = await translateToFrench(question, lang, track);
    } catch (err) {
      console.error('Question translation failed, embedding original text:', err);
    }
  }
  const searchQuery = expandWithGlossary(retrievalQuery);

  const embedTexts = history.length > 0 && retrievalQuery !== question ? [searchQuery, question] : [searchQuery];
  const embeddings = await embedQueries(embedTexts);
  const matchCount = country ? MATCH_COUNT_WITH_COUNTRY : MATCH_COUNT;
  const results = await Promise.all(
    embeddings.map(query_embedding => supabaseAdmin.rpc('match_content_chunks', { query_embedding, match_count: matchCount }))
  );
  const matchError = results.find(r => r.error)?.error;
  if (matchError) {
    console.error('match_content_chunks failed:', matchError);
    return new Response(JSON.stringify({ error: 'Erreur serveur, réessaie dans un instant.' }), { status: 500 });
  }

  const chunks = rankForCountry(mergeMatches(results.map(r => (r.data ?? []) as MatchedChunk[])), country).slice(0, MATCH_COUNT);
  const topSimilarity = chunks[0]?.similarity ?? 0;
  const distress = detectDistress(question);

  const baseLog = {
    id: queryId,
    question: redactPersonalData(question),
    retrieval_query: redactPersonalData(searchQuery),
    retrieved_chunk_ids: chunks.map(c => c.id),
    top_similarity: topSimilarity,
    channel,
    lang,
    country: country ?? null,
    step_id: stepId ?? null,
  };

  // ── Guardrail #1: relevance gate — Claude is never called below this line ──
  if (chunks.length === 0 || topSimilarity < RELEVANCE_THRESHOLD) {
    await logQuery({
      ...baseLog,
      fallback_triggered: true,
      input_tokens: usage.inputTokens,
      output_tokens: usage.outputTokens,
      cost_usd: usage.costUsd,
    });
    await input.onUsage?.(usage).catch(err => console.error('Usage tracking failed:', err));
    const body =
      line({ type: 'meta', queryId, lang }) +
      (distress ? line({ type: 'flags', flags: ['distress'] }) : '') +
      line({ type: 'fallback', message: fallbackMessage(lang), suggestions: nearestGuides(chunks), queryId });
    return new Response(body, { headers: NDJSON_HEADERS });
  }

  // ── Generation ─────────────────────────────────────────────────────────
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
  const systemPrompt = buildSystemPrompt(chunks);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(line(obj)));
      send({ type: 'meta', queryId, lang });
      let fullText = '';
      try {
        const hold = createTailHolder();
        const anthropicStream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_ANSWER_TOKENS,
          system: systemPrompt,
          messages: [...history, { role: 'user', content: question }],
        });
        anthropicStream.on('text', delta => {
          fullText += delta;
          if (input.stream) {
            const visible = hold(delta);
            if (visible) send({ type: 'text', delta: visible });
          }
        });
        const final = await anthropicStream.finalMessage();
        usage = addUsage(usage, usageOf(MODEL, final.usage));

        const { answer, sources } = extractAndValidateSources(fullText, chunks);
        const flags: AssistantFlag[] = parseModelFlags(fullText);
        if (distress) flags.push('distress');

        if (!input.stream) send({ type: 'text', delta: answer });
        send({ type: 'sources', sources: nearestGuides(sources as MatchedChunk[], sources.length) });
        if (flags.length > 0) send({ type: 'flags', flags });

        await logQuery({
          ...baseLog,
          fallback_triggered: false,
          model: MODEL,
          input_tokens: usage.inputTokens,
          output_tokens: usage.outputTokens,
          cost_usd: usage.costUsd,
        });
      } catch (err) {
        console.error('Assistant generation failed:', err);
        send({ type: 'error', message: 'Erreur pendant la génération de la réponse.' });
      } finally {
        await input.onUsage?.(usage).catch(err => console.error('Usage tracking failed:', err));
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: NDJSON_HEADERS });
}

export const __test = { createTailHolder };
