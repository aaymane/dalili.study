// Mentor applications: the residence permit and the enrolment certificate sent from the app
// (private bucket `mentor-documents`, one folder per account). The founders look at them in the admin,
// then they are deleted as soon as a decision is made (validated or refused), and with the account.

import { supabaseAdmin } from '@/lib/supabase-admin';

const BUCKET = 'mentor-documents';

export type MentorDocument = { kind: 'titre_sejour' | 'certificat_scolarite'; url: string | null; sentAt: string };

/** Each person's documents, with a link valid 10 minutes (only the admin page asks for them). */
export async function signedMentorDocuments(userIds: string[]): Promise<Map<string, MentorDocument[]>> {
  const out = new Map<string, MentorDocument[]>();
  if (!userIds.length) return out;
  const { data } = await supabaseAdmin.from('mentor_documents').select('user_id, kind, path, created_at').in('user_id', userIds);
  await Promise.all(
    (data ?? []).map(async d => {
      const { data: signed } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(d.path, 600);
      const list = out.get(d.user_id) ?? [];
      list.push({ kind: d.kind, url: signed?.signedUrl ?? null, sentAt: d.created_at });
      out.set(d.user_id, list);
    })
  );
  return out;
}

/** Deletes every file of the folder (Storage never cascades) and the matching rows. */
export async function purgeMentorDocuments(userId: string): Promise<{ error: unknown } | null> {
  const bucket = supabaseAdmin.storage.from(BUCKET);
  const { data: files, error: listError } = await bucket.list(userId, { limit: 100 });
  if (listError) return { error: listError };
  if (files.length) {
    const { error } = await bucket.remove(files.map(f => `${userId}/${f.name}`));
    if (error) return { error };
  }
  const { error } = await supabaseAdmin.from('mentor_documents').delete().eq('user_id', userId);
  return error ? { error } : null;
}
