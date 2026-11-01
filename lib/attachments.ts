// Files people send in the app (supabase/migrations/20261101120000_photos_et_pieces_jointes.sql in dalili-app):
// attachments between a student and their mentor (private bucket `message-files`, one folder per conversation) and
// photos in group posts (private bucket `post-photos`). Storage never cascades: this is where they are removed,
// 30 days after being sent for attachments (daily cron), and with the account.

import { supabaseAdmin } from '@/lib/supabase-admin';

const MESSAGE_FILES = 'message-files';
const POST_PHOTOS = 'post-photos';
/** Founders' decision (01/11/2026): attachments are kept 30 days. */
export const ATTACHMENT_DAYS = 30;

/**
 * Removes attachments older than 30 days. The message stays, with the file name: the app shows
 * « Fichier supprimé après 30 jours ». Returns how many files were removed.
 */
export async function purgeExpiredAttachments(): Promise<number> {
  const cutoff = new Date(Date.now() - ATTACHMENT_DAYS * 86_400_000).toISOString();
  let removed = 0;
  // 500 at a time, 20 rounds at most per run: anything left goes the next day.
  for (let round = 0; round < 20; round++) {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('id, attachment_path')
      .not('attachment_path', 'is', null)
      .lt('created_at', cutoff)
      .limit(500);
    if (error) throw error;
    if (!data.length) break;
    const { error: removeError } = await supabaseAdmin.storage.from(MESSAGE_FILES).remove(data.map(m => m.attachment_path as string));
    if (removeError) throw removeError;
    const { error: updateError } = await supabaseAdmin
      .from('messages')
      .update({ attachment_path: null })
      .in('id', data.map(m => m.id));
    if (updateError) throw updateError;
    removed += data.length;
  }
  return removed;
}

/**
 * Account deletion: every attachment of their conversations (the conversations themselves cascade, for both
 * people) and the photos of their group posts (the posts cascade too).
 */
export async function purgeUserFiles(userId: string): Promise<{ error: unknown } | null> {
  const { data: mentor, error: mentorError } = await supabaseAdmin.from('mentors').select('id').eq('user_id', userId).maybeSingle();
  if (mentorError) return { error: mentorError };
  const { data: conversations, error: convError } = await supabaseAdmin
    .from('conversations')
    .select('id')
    .or(mentor ? `student_id.eq.${userId},mentor_id.eq.${mentor.id}` : `student_id.eq.${userId}`);
  if (convError) return { error: convError };

  const files = supabaseAdmin.storage.from(MESSAGE_FILES);
  for (const c of conversations) {
    const { data: list, error } = await files.list(c.id, { limit: 1000 });
    if (error) return { error };
    if (list.length) {
      const { error: removeError } = await files.remove(list.map(f => `${c.id}/${f.name}`));
      if (removeError) return { error: removeError };
    }
  }

  const { data: posts, error: postsError } = await supabaseAdmin.from('posts').select('image_path').eq('author_id', userId).not('image_path', 'is', null);
  if (postsError) return { error: postsError };
  if (posts.length) {
    const { error } = await supabaseAdmin.storage.from(POST_PHOTOS).remove(posts.map(p => p.image_path as string));
    if (error) return { error };
  }
  return null;
}
