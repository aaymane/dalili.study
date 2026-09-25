// Public RAG assistant endpoint. No auth — rate-limited by IP instead.
//
// Two guardrails here are load-bearing and must not be relaxed without
// flagging it (per the approved architecture):
//   1. The relevance gate below — Claude is never called to GENERATE an
//      answer when retrieval didn't find anything close enough to the
//      question. Note: for non-French questions, a small, separate Claude
//      call *does* run before this gate — see translateToFrench() — but its
//      only job is translating the question for retrieval; its output is
//      never shown to a user and it runs whether or not the gate ends up
//      passing, so it does not reopen the hallucination risk this guardrail
//      exists to prevent. The same holds for condenseQuestion(), which
//      rewrites follow-up messages using the conversation history — also
//      retrieval-only, also never shown to a user.
//   2. extractAndValidateSources() — any source Claude claims to have used
//      is checked against the chunks we actually sent it before it can be
//      shown to a user.
//
// Runs on the Node.js runtime (not Edge) — needed for the Supabase admin
// client and keeps the Anthropic/Voyage calls straightforward.

import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { embedQueries } from '@/lib/assistant/voyage';
import { checkRateLimit, getClientIp } from '@/lib/assistant/rate-limit';
import { buildSystemPrompt, extractAndValidateSources, type RetrievedChunk } from '@/lib/assistant/system-prompt';
import { detectLanguage, fallbackMessage, translateToFrench } from '@/lib/assistant/language';
import { condenseQuestion, sanitizeHistory, type HistoryMessage } from '@/lib/assistant/conversation';

export const runtime = 'nodejs';

// Conservative on purpose — start by refusing borderline questions rather
// than risking a stretched answer. Tune upward only after reviewing real
// queries in assistant_queries (top_similarity column).
const RELEVANCE_THRESHOLD = 0.6;
const MATCH_COUNT = 6;
const MAX_QUESTION_LENGTH = 300;
const MAX_ANSWER_TOKENS = 800;

// Configurable without touching code if quality needs a quick swap.
// Note: on Vercel, changing this still requires a redeploy for the new
// value to reach the running function — env vars aren't hot-reloaded. If
// truly-instant swapping (no redeploy at all) turns out to matter, move
// this to a one-row Supabase config table read at request time instead.
const MODEL = process.env.ASSISTANT_MODEL || 'claude-haiku-4-5';

interface MatchedChunk extends RetrievedChunk {
  id: string;
  slug: string;
  similarity: number;
}

/** Unions several result sets, keeping each chunk's best similarity, top MATCH_COUNT by similarity. */
function mergeMatches(resultSets: MatchedChunk[][]): MatchedChunk[] {
  const best = new Map<string, MatchedChunk>();
  for (const chunk of resultSets.flat()) {
    const existing = best.get(chunk.id);
    if (!existing || chunk.similarity > existing.similarity) best.set(chunk.id, chunk);
  }
  return Array.from(best.values())
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, MATCH_COUNT);
}

function ndjsonLine(obj: unknown): string {
  return JSON.stringify(obj) + '\n';
}

export async function POST(request: Request): Promise<Response> {
  const ip = getClientIp(request.headers);
  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Trop de questions envoyées. Réessaie dans quelques minutes.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let question: string;
  let history: HistoryMessage[];
  try {
    const body = await request.json();
    question = String(body?.question ?? '').trim();
    history = sanitizeHistory(body?.history);
  } catch {
    return new Response(JSON.stringify({ error: 'Requête invalide.' }), { status: 400 });
  }

  if (!question || question.length > MAX_QUESTION_LENGTH) {
    return new Response(JSON.stringify({ error: 'Question vide ou trop longue.' }), { status: 400 });
  }

  const detectedLang = detectLanguage(question);

  // ── Retrieval ────────────────────────────────────────────────────────────
  // Our corpus is French-only. Cross-lingual embedding similarity measured
  // meaningfully weaker than same-language similarity (see language.ts), so
  // non-French questions are translated to French before embedding — this
  // only affects which chunks get retrieved, not the language of the final
  // answer (which still comes from the model reading the ORIGINAL question
  // below). Falls back to embedding the raw question if translation fails.
  //
  // Follow-ups (history present) are instead condensed into a standalone
  // French query using the conversation (which also covers translation).
  // Both the condensed query and the raw question are searched and merged
  // by best similarity, so a question that already worked on its own can
  // never score lower than it did before history existed.
  let retrievalQuery = question;
  if (history.length > 0) {
    try {
      retrievalQuery = await condenseQuestion(history, question);
    } catch (err) {
      console.error('Question condensing failed, falling back to single-turn retrieval:', err);
    }
  }
  if (retrievalQuery === question && detectedLang !== 'fr') {
    try {
      retrievalQuery = await translateToFrench(question, detectedLang);
    } catch (err) {
      console.error('Question translation failed, embedding original text:', err);
    }
  }

  const embedTexts = history.length > 0 && retrievalQuery !== question ? [retrievalQuery, question] : [retrievalQuery];
  const embeddings = await embedQueries(embedTexts);

  const results = await Promise.all(
    embeddings.map(query_embedding =>
      supabaseAdmin.rpc('match_content_chunks', { query_embedding, match_count: MATCH_COUNT })
    )
  );

  const matchError = results.find(r => r.error)?.error;
  if (matchError) {
    console.error('match_content_chunks failed:', matchError);
    return new Response(JSON.stringify({ error: "Erreur serveur, réessaie dans un instant." }), { status: 500 });
  }

  const chunks = mergeMatches(results.map(r => (r.data ?? []) as MatchedChunk[]));
  const topSimilarity = chunks[0]?.similarity ?? 0;

  // ── Guardrail #1: relevance gate — Claude is never called below this line ──
  if (chunks.length === 0 || topSimilarity < RELEVANCE_THRESHOLD) {
    await supabaseAdmin.from('assistant_queries').insert({
      question,
      retrieval_query: retrievalQuery,
      retrieved_chunk_ids: chunks.map(c => c.id),
      top_similarity: topSimilarity,
      fallback_triggered: true,
    });

    const suggestions = chunks.slice(0, 3).map(c => ({ title: c.title, url: c.url, category: c.category }));
    return new Response(
      ndjsonLine({
        type: 'fallback',
        message: fallbackMessage(detectedLang),
        suggestions,
      }),
      { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8' } }
    );
  }

  // ── Generation ───────────────────────────────────────────────────────────
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
  const systemPrompt = buildSystemPrompt(chunks);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let fullText = '';
      try {
        const anthropicStream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_ANSWER_TOKENS,
          system: systemPrompt,
          messages: [...history, { role: 'user', content: question }],
        });

        anthropicStream.on('text', delta => {
          fullText += delta;
        });

        await anthropicStream.finalMessage();

        const { answer, sources } = extractAndValidateSources(fullText, chunks);
        const encoder = new TextEncoder();

        controller.enqueue(encoder.encode(ndjsonLine({ type: 'text', delta: answer })));
        controller.enqueue(
          encoder.encode(
            ndjsonLine({
              type: 'sources',
              sources: sources.map(s => ({ title: s.title, url: s.url, category: s.category })),
            })
          )
        );

        await supabaseAdmin.from('assistant_queries').insert({
          question,
          retrieval_query: retrievalQuery,
          retrieved_chunk_ids: chunks.map(c => c.id),
          top_similarity: topSimilarity,
          fallback_triggered: false,
        });
      } catch (err) {
        console.error('Assistant generation failed:', err);
        controller.enqueue(
          new TextEncoder().encode(ndjsonLine({ type: 'error', message: 'Erreur pendant la génération de la réponse.' }))
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8' } });
}
