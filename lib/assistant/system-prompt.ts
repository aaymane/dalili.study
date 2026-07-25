// The guardrail. This is the declarative half of "never invents a figure" —
// the structural half (the relevance gate and the citation-index validation)
// lives in app/api/assistant/route.ts and must not be weakened without
// flagging it, per the approved architecture.

import type Anthropic from '@anthropic-ai/sdk';

export interface RetrievedChunk {
  title: string;
  url: string;
  category: string | null;
  content: string;
}

const RULES = `Tu es l'assistant de Dalili Study, un guide pour les étudiants internationaux qui préparent leurs études en France.

RÈGLES STRICTES — NON NÉGOCIABLES :
1. Réponds UNIQUEMENT à partir des extraits numérotés fournis ci-dessous. N'utilise aucune autre connaissance, même si tu la crois correcte ou plus à jour.
2. N'invente JAMAIS un montant, un délai, une date ou une règle qui n'apparaît pas explicitement, mot pour mot ou en substance directe, dans les extraits fournis. En cas de doute sur un chiffre, ne le donne pas.
3. Détecte la langue de la question et réponds ENTIÈREMENT dans cette langue (français, arabe standard, darija/arabe dialectal, ou anglais) — même si les extraits fournis ci-dessous sont en français. Base ta réponse UNIQUEMENT sur ces extraits : traduis-les fidèlement dans la langue de l'utilisateur, mais n'ajoute JAMAIS une information qui n'y figure pas, même pour combler un trou de traduction. Ne mélange pas les langues dans une même réponse.
4. Si l'information demandée n'est pas dans les extraits fournis, réponds dans la langue de l'utilisateur avec l'équivalent exact de : "Je n'ai pas cette information dans nos guides." puis, si un extrait fourni est en rapport avec le sujet sans y répondre précisément, propose-le comme piste ("Cet article pourrait t'aider : ..."), toujours dans la langue de l'utilisateur.
5. Ne réponds aux questions juridiques ou médicales que dans la limite exacte de ce que les extraits énoncent. Pour tout ce qui dépasse ce contenu, renvoie explicitement vers un professionnel qualifié (avocat, médecin, service consulaire) plutôt que de compléter par ta propre estimation.
6. Sois concret et direct — pas de généralités si un extrait donne un chiffre ou une procédure précise.
7. Termine TOUJOURS ta réponse par une ligne, seule sur sa propre ligne, EXACTEMENT au format suivant, quelle que soit la langue de ta réponse — ne traduis JAMAIS cette ligne, ne la mets pas en RTL, garde-la mot pour mot :
SOURCES_USED: [n,n,...]
où chaque n est le numéro d'un extrait que tu as réellement utilisé pour construire ta réponse. Si tu n'as utilisé aucun extrait (cas du refus au point 4), écris SOURCES_USED: []. N'invente jamais un numéro qui ne correspond à aucun extrait fourni.`;

// Two cache_control breakpoints, each ephemeral (5 min TTL):
//   1. After RULES — the guardrails text, byte-identical on every request.
//      On its own this block is ~400 tokens, far under every current Claude
//      model's minimum cacheable prompt length (4096 tokens for Haiku 4.5,
//      the default model here — see MODEL above), so today it never caches
//      by itself. It's kept so it activates automatically if RULES grows or
//      the model changes to one with a lower minimum.
//   2. After the extracts block — covers RULES + the retrieved chunks, i.e.
//      the whole system prompt. This is the one that actually pays off:
//      confirmed via a live call that an identical question repeated within
//      the TTL reads ~4.3k tokens from cache instead of reprocessing them
//      (cache_read_input_tokens > 0, cache_creation_input_tokens 0 on the
//      repeat). It only hits on an exact repeat of the same question — a
//      different question retrieves different chunks, which changes this
//      block's bytes and busts the cache — but exact repeats (retries,
//      duplicate submissions, common FAQ-style questions) do happen in
//      practice, so this is a real, positive-EV breakpoint, not a no-op.
export function buildSystemPrompt(chunks: RetrievedChunk[]): Anthropic.TextBlockParam[] {
  const extracts = chunks
    .map((c, i) => `[${i + 1}] Source : ${c.title}${c.category ? ` (${c.category})` : ''}\n${c.content}`)
    .join('\n\n');

  return [
    { type: 'text', text: RULES, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: `EXTRAITS DISPONIBLES :\n\n${extracts}`, cache_control: { type: 'ephemeral' } },
  ];
}

/**
 * Parses the mandatory trailing "SOURCES_USED: [...]" line, validates every
 * index against the actual number of chunks that were sent to the model, and
 * returns the cleaned answer text plus only the chunks that are real.
 *
 * Any index outside [1, chunks.length] is discarded rather than surfaced —
 * this is the structural half of the citation guardrail. A model that
 * hallucinates a source number never gets to show it to a user.
 */
export function extractAndValidateSources<T extends RetrievedChunk>(
  fullText: string,
  chunks: T[]
): { answer: string; sources: T[] } {
  const match = fullText.match(/SOURCES_USED:\s*\[([^\]]*)\]\s*$/);
  const answer = match ? fullText.slice(0, match.index).trimEnd() : fullText.trimEnd();

  if (!match) return { answer, sources: [] };

  const indices = match[1]
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => Number.isInteger(n) && n >= 1 && n <= chunks.length);

  const uniqueIndices = Array.from(new Set(indices));
  const sources = uniqueIndices.map(i => chunks[i - 1]);

  return { answer, sources };
}
