// Admin — the latest « Cette réponse est fausse » reports, with the question they
// are about (already redacted when it was logged). Never tied to a person.

import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const { data: reports, error } = await supabaseAdmin
    .from('assistant_feedback')
    .select('id, query_id, reason, comment, channel, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ids = Array.from(new Set((reports ?? []).map(r => r.query_id)));
  const { data: queries } = ids.length
    ? await supabaseAdmin.from('assistant_queries').select('id, question, lang, country, step_id, top_similarity').in('id', ids)
    : { data: [] };

  const data = (reports ?? []).map(r => ({ ...r, query: queries?.find(q => q.id === r.query_id) ?? null }));
  return NextResponse.json({ data });
}
