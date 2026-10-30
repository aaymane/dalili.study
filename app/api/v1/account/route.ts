// Account deletion from the app (App Store guideline 5.1.1(v), RGPD art. 17).
// Every table linked to auth.users cascades, except what is handled here first:
// profile photos and mentor application documents (Storage never cascades), and the mentor card (it would only be detached).
// Groups and events the student created stay, detached from their name.
// Questions asked to Dalili IA are already anonymous (assistant_queries has no user id).

import { json, preflight, requireUser } from '@/lib/assistant/app-auth';
import { purgeMentorDocuments } from '@/lib/mentor-documents';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export function OPTIONS() {
  return preflight();
}

export async function DELETE(request: Request): Promise<Response> {
  const auth = await requireUser(request);
  if ('error' in auth) return auth.error;
  const fail = (step: string, error: unknown) => {
    console.error(`account deletion failed (${step}):`, error);
    return json({ error: 'Suppression impossible pour le moment. Réessaie dans quelques minutes.' }, 503);
  };

  const avatars = supabaseAdmin.storage.from('avatars');
  const { data: files, error: listError } = await avatars.list(auth.userId, { limit: 1000 });
  if (listError) return fail('list avatars', listError);
  if (files.length) {
    const { error } = await avatars.remove(files.map(f => `${auth.userId}/${f.name}`));
    if (error) return fail('remove avatars', error);
  }

  const documents = await purgeMentorDocuments(auth.userId);
  if (documents) return fail('mentor documents', documents.error);

  const { error: mentorError } = await supabaseAdmin.from('mentors').delete().eq('user_id', auth.userId);
  if (mentorError) return fail('mentor card', mentorError);

  const { error: userError } = await supabaseAdmin.auth.admin.deleteUser(auth.userId);
  if (userError) return fail('auth user', userError);

  return json({ ok: true });
}
