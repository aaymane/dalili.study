// Admin — mentor applications sent from the app (only possible once in France, with a residence permit and an
// enrolment certificate). A new sheet is invisible to students (is_active = false) until a founder validates it here.
//   GET    → every sheet, waiting ones first, with the account email, the charter, the verification and the documents
//   PATCH  { id, action: 'verifier', proof, by } → a founder looked at the documents
//   PATCH  { id, action: 'valider' | 'suspendre' } → a first validation notifies the mentor's phone and deletes the
//          documents; the database refuses to validate a mentor nobody has verified
//   DELETE { id, reason } → refuse a sheet that was never validated: the reason is shown in the app, the documents
//          are deleted, and the person can apply again

import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/admin-auth';
import { purgeMentorDocuments, signedMentorDocuments } from '@/lib/mentor-documents';
import { notifyMentorValidated } from '@/lib/notify';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PROOFS = ['carte_etudiante', 'linkedin', 'titre_sejour'];

export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const { data: mentors, error } = await supabaseAdmin
    .from('mentors')
    .select('id, user_id, first_name, last_name, headline, study, city, origin, specialties, languages, quote, is_active, available_this_week, sessions_count, created_at')
    .order('is_active', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const userIds = (mentors ?? []).map(m => m.user_id).filter((id): id is string => !!id);
  const [{ data: profiles }, { data: trust }] = userIds.length
    ? await Promise.all([
        supabaseAdmin.from('profiles').select('id, country, origin_city, study_level, situation').in('id', userIds),
        supabaseAdmin
          .from('mentor_trust')
          .select('user_id, birth_year, charter_version, charter_accepted_at, verified_at, verified_proof, verified_by')
          .in('user_id', userIds),
      ])
    : [{ data: [] }, { data: [] }];
  const documents = await signedMentorDocuments(userIds);
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
    trust: trust?.find(t => t.user_id === m.user_id) ?? null,
    documents: m.user_id ? documents.get(m.user_id) ?? [] : [],
  }));
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  const action = body?.action;
  if (!UUID_RE.test(id) || !['valider', 'suspendre', 'verifier'].includes(action)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (action === 'verifier') {
    const proof = String(body?.proof ?? '');
    const by = String(body?.by ?? '').trim();
    if (!PROOFS.includes(proof) || by.length < 2 || by.length > 40) {
      return NextResponse.json({ error: 'Choisis la preuve vue et écris ton prénom.' }, { status: 400 });
    }
    const { data: mentor } = await supabaseAdmin.from('mentors').select('user_id').eq('id', id).maybeSingle();
    if (!mentor?.user_id) return NextResponse.json({ error: 'Fiche introuvable ou sans compte relié.' }, { status: 404 });
    const { data, error } = await supabaseAdmin
      .from('mentor_trust')
      .update({ verified_at: new Date().toISOString(), verified_proof: proof, verified_by: by })
      .eq('user_id', mentor.user_id)
      .select('user_id');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data?.length) return NextResponse.json({ error: 'Cette personne n’a pas encore accepté la charte dans l’app.' }, { status: 409 });
    return NextResponse.json({ ok: true });
  }

  const { data: updated, error } = await supabaseAdmin.from('mentors').update({ is_active: action === 'valider' }).eq('id', id).select('user_id');
  // 23514 = the database refuses: nobody has verified this mentor yet.
  if (error) return NextResponse.json({ error: error.message }, { status: error.code === '23514' ? 409 : 500 });
  if (action === 'valider') {
    // Decision made: the documents are not kept.
    const userId = updated?.[0]?.user_id;
    if (userId) {
      const purge = await purgeMentorDocuments(userId);
      if (purge) console.error('mentor documents not deleted after validation:', purge.error);
    }
    // The database webhook notifies the mentor; this is the fallback (sent once either way).
    await notifyMentorValidated(id);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  const reason = String(body?.reason ?? '').trim();
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if (reason.length < 3 || reason.length > 300) {
    return NextResponse.json({ error: 'Écris le motif (3 à 300 caractères) : la personne le lit dans l’app.' }, { status: 400 });
  }
  // Only a sheet that was never shown to students: a validated mentor has calls attached.
  const { data, error } = await supabaseAdmin.from('mentors').delete().eq('id', id).eq('is_active', false).select('user_id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: 'Suspends d’abord la fiche : un mentor validé ne se supprime pas ici.' }, { status: 409 });
  const userId = data[0].user_id;
  if (userId) {
    // The reason is shown in the app; applying again (new charter acceptance) clears it.
    const { error: trustError } = await supabaseAdmin
      .from('mentor_trust')
      .update({ rejected_at: new Date().toISOString(), rejected_reason: reason })
      .eq('user_id', userId);
    if (trustError) console.error('mentor refusal reason not saved:', trustError);
    const purge = await purgeMentorDocuments(userId);
    if (purge) console.error('mentor documents not deleted after refusal:', purge.error);
  }
  return NextResponse.json({ ok: true });
}
