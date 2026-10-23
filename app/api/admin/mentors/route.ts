// Admin — mentor sheets sent from the app. A new sheet is invisible to students
// (is_active = false) until one of the founders validates it here.
//   GET    → every sheet, waiting ones first, with the account email to contact the person
//   PATCH  { id, action: 'valider' | 'suspendre' } → a first validation notifies the mentor's phone
//   DELETE { id } → refuse a sheet that was never validated (the person can send a new one)

import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/admin-auth';
import { once, pushTo } from '@/lib/notify';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const { data: mentors, error } = await supabaseAdmin
    .from('mentors')
    .select('id, user_id, first_name, last_name, headline, study, city, origin, specialties, languages, quote, is_active, available_this_week, sessions_count, created_at')
    .order('is_active', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const userIds = (mentors ?? []).map(m => m.user_id).filter((id): id is string => !!id);
  const { data: profiles } = userIds.length
    ? await supabaseAdmin.from('profiles').select('id, country, origin_city, study_level, situation').in('id', userIds)
    : { data: [] };
  const emails = new Map<string, string>();
  await Promise.all(
    userIds.map(async id => {
      const { data } = await supabaseAdmin.auth.admin.getUserById(id);
      if (data.user?.email) emails.set(id, data.user.email);
    })
  );

  const data = (mentors ?? []).map(m => ({
    ...m,
    email: m.user_id ? emails.get(m.user_id) ?? null : null,
    profile: profiles?.find(p => p.id === m.user_id) ?? null,
  }));
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  const action = body?.action;
  if (!UUID_RE.test(id) || (action !== 'valider' && action !== 'suspendre')) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { data: m, error } = await supabaseAdmin
    .from('mentors')
    .update({ is_active: action === 'valider' })
    .eq('id', id)
    .select('id, user_id, city')
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // First validation only: the mentor learns that students can now find them.
  if (action === 'valider' && m?.user_id && (await once(m.id, 'mentor_validated'))) {
    await pushTo(m.user_id, {
      title: 'Ta fiche mentor est en ligne',
      body: `Les étudiants de ${m.city} peuvent maintenant te proposer un appel. Merci d’être là pour eux.`,
      url: '/(app)/(tabs)',
      role: 'mentor',
    });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  // Only a sheet that was never shown to students: a validated mentor has calls attached.
  const { data, error } = await supabaseAdmin.from('mentors').delete().eq('id', id).eq('is_active', false).select('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: 'Suspends d’abord la fiche : un mentor validé ne se supprime pas ici.' }, { status: 409 });
  return NextResponse.json({ ok: true });
}
