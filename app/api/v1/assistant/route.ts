// The app's assistant endpoint. Same brain as the site (lib/assistant/answer.ts),
// different gate: a verified Supabase session and a daily quota per account
// instead of the per-IP limit. Answers stream as they are generated.

import { sanitizeHistory, type HistoryMessage } from '@/lib/assistant/conversation';
import { answerQuestion, MAX_QUESTION_LENGTH } from '@/lib/assistant/answer';
import { isCountryCode } from '@/lib/assistant/retrieval-hints';
import { json, preflight, requireUser, withCors } from '@/lib/assistant/app-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { CountryCode } from '@/lib/content/guides';

export const runtime = 'nodejs';

// 30 questions per account per day to start (docs/VISION.md §9). Env override for tuning.
const DAILY_LIMIT = Number(process.env.ASSISTANT_DAILY_LIMIT) || 30;
const STEP_ID_RE = /^[a-z][a-z-]{0,39}$/;

export function OPTIONS() {
  return preflight();
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireUser(request);
  if ('error' in auth) return auth.error;

  let question: string;
  let history: HistoryMessage[];
  let country: CountryCode | null = null;
  let stepId: string | null = null;
  try {
    const body = await request.json();
    question = String(body?.question ?? '').trim();
    history = sanitizeHistory(body?.history);
    if (isCountryCode(body?.context?.country)) country = body.context.country;
    if (typeof body?.context?.stepId === 'string' && STEP_ID_RE.test(body.context.stepId)) stepId = body.context.stepId;
  } catch {
    return json({ error: 'Requête invalide.' }, 400);
  }
  if (!question || question.length > MAX_QUESTION_LENGTH) {
    return json({ error: 'Question vide ou trop longue.' }, 400);
  }

  const { data, error } = await supabaseAdmin.rpc('assistant_consume', { p_user: auth.userId, p_limit: DAILY_LIMIT });
  if (error) {
    console.error('assistant_consume failed:', error);
    return json({ error: 'Dalili IA arrive très bientôt dans l’app.' }, 503);
  }
  const quota = (Array.isArray(data) ? data[0] : data) as { allowed: boolean; used: number } | null;
  if (!quota?.allowed) {
    return json({ error: `Tu as posé tes ${DAILY_LIMIT} questions du jour. Reviens demain, ou demande à un mentor.`, limit: DAILY_LIMIT }, 429);
  }

  const res = await answerQuestion({
    question,
    history,
    channel: 'app',
    country,
    stepId,
    stream: true,
    onUsage: async u => {
      const { error: usageError } = await supabaseAdmin.rpc('assistant_record_usage', {
        p_user: auth.userId,
        p_input: u.inputTokens,
        p_output: u.outputTokens,
        p_cost: u.costUsd ?? 0,
      });
      if (usageError) console.error('assistant_record_usage failed:', usageError);
    },
  });
  res.headers.set('X-Quota-Remaining', String(Math.max(0, DAILY_LIMIT - quota.used)));
  return withCors(res);
}
