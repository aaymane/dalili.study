// Thin wrapper around Voyage AI's embeddings REST API. Anthropic has no
// first-party embeddings endpoint and officially points to Voyage AI for
// this — see https://docs.voyageai.com/docs/embeddings.
//
// Raw fetch() rather than the `voyageai` npm package on purpose: the exact
// field casing of that package's TypeScript surface isn't documented
// anywhere verifiable, while the REST request/response shape below is
// confirmed directly from Anthropic's own cookbook example. Verified beats
// convenient here.

const VOYAGE_EMBED_URL = 'https://api.voyageai.com/v1/embeddings';
const VOYAGE_MODEL = 'voyage-4-lite';

interface VoyageEmbedResponse {
  data: { embedding: number[]; index: number }[];
  model: string;
  usage: { total_tokens: number };
}

async function embed(input: string | string[], inputType: 'query' | 'document'): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    throw new Error('VOYAGE_API_KEY is not set');
  }

  const res = await fetch(VOYAGE_EMBED_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input,
      model: VOYAGE_MODEL,
      input_type: inputType,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Voyage embeddings request failed (${res.status}): ${body}`);
  }

  const json = (await res.json()) as VoyageEmbedResponse;
  // Voyage returns `data` sorted by `index`, but don't assume — sort explicitly.
  return json.data.sort((a, b) => a.index - b.index).map(d => d.embedding);
}

/** Embeds a single user question. Asymmetric retrieval: queries and documents use different input_type. */
export async function embedQuery(question: string): Promise<number[]> {
  const [vector] = await embed(question, 'query');
  return vector;
}

/** Embeds one or more corpus chunks for storage. Used by the ingestion script, not at request time. */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  return embed(texts, 'document');
}
