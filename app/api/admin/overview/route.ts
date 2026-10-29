// Admin — one look at the whole of DALILI: accounts, mentors, call requests,
// the assistant (questions, refusal rate, cost), the reports on its answers, and the open mentoring reports.

import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Number of rows, optionally since a date and/or with one column equal to a value. */
const count = async (table: string, opts: { since?: string; eq?: [string, string | boolean] } = {}) => {
  let q = supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
  if (opts.since) q = q.gte('created_at', opts.since);
  if (opts.eq) q = q.eq(opts.eq[0], opts.eq[1]);
  const { count: n, error } = await q;
  if (error) throw new Error(`${table}: ${error.message}`);
  return n ?? 0;
};

export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const week = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const month = new Date(Date.now() - 30 * 86_400_000).toISOString();

  try {
    const [accounts, accountsWeek, mentorsActive, mentorsWaiting, callsPending, callsConfirmed, callsDone, questions, refused, reports, safety, leads] = await Promise.all([
      count('profiles'),
      count('profiles', { since: week }),
      count('mentors', { eq: ['is_active', true] }),
      count('mentors', { eq: ['is_active', false] }),
      count('bookings', { eq: ['status', 'pending'] }),
      count('bookings', { eq: ['status', 'confirmed'] }),
      count('bookings', { eq: ['status', 'done'] }),
      count('assistant_queries', { since: week }),
      count('assistant_queries', { since: week, eq: ['fallback_triggered', true] }),
      count('assistant_feedback', { since: week }),
      count('mentorat_reports', { eq: ['status', 'open'] }),
      count('school_leads', { eq: ['status', 'new'] }),
    ]);
    const { data: costs } = await supabaseAdmin.from('assistant_queries').select('cost_usd').gte('created_at', month);
    const cost30 = (costs ?? []).reduce((sum, r) => sum + Number(r.cost_usd ?? 0), 0);

    return NextResponse.json({
      accounts: { total: accounts, week: accountsWeek },
      mentors: { active: mentorsActive, waiting: mentorsWaiting },
      calls: { pending: callsPending, confirmed: callsConfirmed, done: callsDone },
      assistant: { questions, refused, refusalRate: questions ? Math.round((refused / questions) * 100) : 0, cost30: Math.round(cost30 * 100) / 100 },
      reports,
      safety,
      leads,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
