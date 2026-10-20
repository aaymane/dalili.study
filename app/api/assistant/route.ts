// Public RAG assistant endpoint for the site. No auth — rate-limited by IP.
// The brain itself (retrieval, relevance gate, generation, citation check)
// lives in lib/assistant/answer.ts and is shared with the app's
// /api/v1/assistant. Runs on Node.js (Supabase admin client).

import { checkRateLimit, getClientIp } from '@/lib/assistant/rate-limit';
import { sanitizeHistory, type HistoryMessage } from '@/lib/assistant/conversation';
import { answerQuestion, MAX_QUESTION_LENGTH } from '@/lib/assistant/answer';

export const runtime = 'nodejs';

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

  // The site panel renders one text event (it replaces, not appends).
  return answerQuestion({ question, history, channel: 'site', stream: false });
}
