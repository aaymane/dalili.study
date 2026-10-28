// Admin — reports sent from the app's mentoring: a student reports a mentor, a mentor reports a student.
// Only the founders read them (service key); the reported person is never told.
//   GET   → open reports first (all of them), then the 50 latest closed ones, with both people
//           (name, email), the mentor sheet, the call request, and how many reports target the same person
//   PATCH { id, status: 'handled' | 'dismissed', by } → close an open report, noting which founder did it

import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const COLUMNS = 'id, reporter_id, reporter_role, reported_id, mentor_id, booking_id, reason, comment, status, handled_at, handled_by, created_at';

type Row = {
  id: string;
  reporter_id: string | null;
  reported_id: string | null;
  mentor_id: string | null;
  booking_id: string | null;
  [key: string]: unknown;
};

export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const [open, closed] = await Promise.all([
    supabaseAdmin.from('mentorat_reports').select(COLUMNS).eq('status', 'open').order('created_at', { ascending: false }),
    supabaseAdmin.from('mentorat_reports').select(COLUMNS).neq('status', 'open').order('created_at', { ascending: false }).limit(50),
  ]);
  if (open.error) return NextResponse.json({ error: open.error.message }, { status: 500 });
  if (closed.error) return NextResponse.json({ error: closed.error.message }, { status: 500 });
  const reports = [...(open.data ?? []), ...(closed.data ?? [])] as Row[];

  const uniq = (ids: (string | null)[]) => Array.from(new Set(ids.filter((id): id is string => !!id)));
  const userIds = uniq(reports.flatMap(r => [r.reporter_id, r.reported_id]));
  const reportedIds = uniq(reports.map(r => r.reported_id));
  const mentorIds = uniq(reports.map(r => r.mentor_id));
  const bookingIds = uniq(reports.map(r => r.booking_id));

  const [profiles, mentors, bookings, targets] = await Promise.all([
    userIds.length ? supabaseAdmin.from('profiles').select('id, first_name, last_name, country, origin_city').in('id', userIds) : { data: [] },
    mentorIds.length ? supabaseAdmin.from('mentors').select('id, user_id, first_name, last_name, city, is_active').in('id', mentorIds) : { data: [] },
    bookingIds.length ? supabaseAdmin.from('bookings').select('id, starts_at, topic, status').in('id', bookingIds) : { data: [] },
    reportedIds.length ? supabaseAdmin.from('mentorat_reports').select('reported_id').in('reported_id', reportedIds) : { data: [] },
  ]);

  const emails = new Map<string, string>();
  await Promise.all(
    userIds.map(async id => {
      const { data } = await supabaseAdmin.auth.admin.getUserById(id);
      if (data.user?.email) emails.set(id, data.user.email);
    })
  );
  const person = (id: string | null) => {
    if (!id) return null;
    const p = profiles.data?.find(x => x.id === id);
    const name = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim();
    return { name: name || null, email: emails.get(id) ?? null, country: p?.country ?? null, city: p?.origin_city ?? null };
  };
  const timesReported = (id: string | null) => (id ? (targets.data ?? []).filter(t => t.reported_id === id).length : 0);

  const data = reports.map(r => ({
    ...r,
    reporter: person(r.reporter_id),
    reported: person(r.reported_id),
    mentor: mentors.data?.find(m => m.id === r.mentor_id) ?? null,
    booking: bookings.data?.find(b => b.id === r.booking_id) ?? null,
    times_reported: timesReported(r.reported_id),
  }));
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  const status = body?.status;
  const by = String(body?.by ?? '').trim();
  if (!UUID_RE.test(id) || (status !== 'handled' && status !== 'dismissed')) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  if (by.length < 2 || by.length > 40) return NextResponse.json({ error: 'Écris ton prénom.' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('mentorat_reports')
    .update({ status, handled_at: new Date().toISOString(), handled_by: by })
    .eq('id', id)
    .eq('status', 'open')
    .select('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: 'Déjà classé par un autre fondateur. Actualise la page.' }, { status: 409 });
  return NextResponse.json({ ok: true });
}
