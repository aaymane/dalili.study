// Admin — partnership requests sent from dalili.study/partenaires (public.partner_leads).
//   GET   → new requests first, then the ones in discussion, then the latest closed ones
//   PATCH { id, status: 'en_cours' | 'partenaire' | 'sans_suite', by, notes? } → a founder moves the request on

import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/admin-auth';
import { isPartnerStatus } from '@/lib/partner-leads';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const COLUMNS = 'id, organization, kind, contact_name, job_title, email, phone, website, zone, message, status, handled_by, notes, created_at';

export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const [open, closed] = await Promise.all([
    supabaseAdmin.from('partner_leads').select(COLUMNS).in('status', ['nouveau', 'en_cours']).order('created_at', { ascending: false }),
    supabaseAdmin.from('partner_leads').select(COLUMNS).in('status', ['partenaire', 'sans_suite']).order('updated_at', { ascending: false }).limit(50),
  ]);
  if (open.error) return NextResponse.json({ error: open.error.message }, { status: 500 });
  if (closed.error) return NextResponse.json({ error: closed.error.message }, { status: 500 });
  return NextResponse.json({ data: [...(open.data ?? []), ...(closed.data ?? [])] });
}

export async function PATCH(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  const status = body?.status;
  const by = String(body?.by ?? '').trim();
  const notes = typeof body?.notes === 'string' ? body.notes.trim().slice(0, 2000) : undefined;
  if (!UUID_RE.test(id) || !isPartnerStatus(status) || status === 'nouveau') return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  if (by.length < 2 || by.length > 40) return NextResponse.json({ error: 'Écris ton prénom.' }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('partner_leads')
    .update({ status, handled_by: by, updated_at: new Date().toISOString(), ...(notes !== undefined ? { notes: notes || null } : {}) })
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
