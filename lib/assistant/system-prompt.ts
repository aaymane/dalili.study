// The guardrail. This is the declarative half of "never invents a figure" —
// the structural half (the relevance gate and the citation-index validation)
// lives in app/api/assistant/route.ts and must not be weakened without
// flagging it, per the approved architecture.

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
3. Si l'information demandée n'est pas dans les extraits fournis, réponds EXACTEMENT : "Je n'ai pas cette information dans nos guides." puis, si un extrait fourni est en rapport avec le sujet sans y répondre précisément, propose-le comme piste ("Cet article pourrait t'aider : ...").
4. Ne réponds aux questions juridiques ou médicales que dans la limite exacte de ce que les extraits énoncent. Pour tout ce qui dépasse ce contenu, renvoie explicitement vers un professionnel qualifié (avocat, médecin, service consulaire) plutôt que de compléter par ta propre estimation.
5. Sois concret et direct — pas de généralités si un extrait donne un chiffre ou une procédure précise.
6. Termine TOUJOURS ta réponse par une ligne, seule sur sa propre ligne, au format exact :
SOURCES_USED: [n,n,...]
où chaque n est le numéro d'un extrait que tu as réellement utilisé pour construire ta réponse. Si tu n'as utilisé aucun extrait (cas du refus au point 3), écris SOURCES_USED: []. N'invente jamais un numéro qui ne correspond à aucun extrait fourni.`;

export function buildSystemPrompt(chunks: RetrievedChunk[]): string {
  const extracts = chunks
    .map((c, i) => `[${i + 1}] Source : ${c.title}${c.category ? ` (${c.category})` : ''}\n${c.content}`)
    .join('\n\n');

  return `${RULES}\n\nEXTRAITS DISPONIBLES :\n\n${extracts}`;
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
