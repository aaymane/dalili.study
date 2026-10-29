// Admin — « Je suis intéressé·e » sent from a partner school's page in the app. Kept by DALILI (decision of
// 29/10/2026): the founders contact the student themselves; nothing is passed on to the school without a new
// agreement from the student.
//   GET   → new requests first, then the latest handled ones, with the student (name, email, country, city)
//   PATCH { id, status: 'contacted' | 'closed', by } → note that a founder handled it

import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const COLUMNS = 'id, school_id, student_id, program, message, status, handled_by, created_at, partner_schools(name, city, is_published)';

export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const [fresh, handled] = await Promise.all([
    supabaseAdmin.from('school_leads').select(COLUMNS).eq('status', 'new').order('created_at', { ascending: false }),
    supabaseAdmin.from('school_leads').select(COLUMNS).neq('status', 'new').order('created_at', { ascending: false }).limit(50),
  ]);
  if (fresh.error) return NextResponse.json({ error: fresh.error.message }, { status: 500 });
  if (handled.error) return NextResponse.json({ error: handled.error.message }, { status: 500 });
  const leads = [...(fresh.data ?? []), ...(handled.data ?? [])];

  const ids = Array.from(new Set(leads.map(l => l.student_id as string)));
  const { data: profiles } = ids.length
    ? await supabaseAdmin.from('profiles').select('id, first_name, last_name, country, origin_city, study_level').in('id', ids)
    : { data: [] };
  const emails = new Map<string, string>();
  await Promise.all(
    ids.map(async id => {
      const { data } = await supabaseAdmin.auth.admin.getUserById(id);
      if (data.user?.email) emails.set(id, data.user.email);
    })
  );

  const data = leads.map(({ student_id, partner_schools, ...l }) => {
    const p = profiles?.find(x => x.id === student_id);
    const school = (Array.isArray(partner_schools) ? partner_schools[0] : partner_schools) as { name: string; city: string } | null;
    return {
      ...l,
      school: school ? `${school.name}` : 'École supprimée',
      student: {
        name: [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim() || null,
        email: emails.get(student_id) ?? null,
        country: p?.country ?? null,
        city: p?.origin_city ?? null,
        level: p?.study_level ?? null,
      },
    };
  });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  const status = body?.status;
  const by = String(body?.by ?? '').trim();
  if (!UUID_RE.test(id) || (status !== 'contacted' && status !== 'closed')) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  if (by.length < 2 || by.length > 40) return NextResponse.json({ error: 'Écris ton prénom.' }, { status: 400 });

  const { error } = await supabaseAdmin.from('school_leads').update({ status, handled_by: by }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
