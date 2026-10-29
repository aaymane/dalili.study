// Push notifications to the DALILI app, sent by the server only (service key) after it has checked in the
// database that the event really happened. Expo Push Service is free; tokens come from public.push_tokens
// (supabase/migrations/20261024100000_notifications.sql in dalili-app).

import { supabaseAdmin } from '@/lib/supabase-admin';

export type NotifyEvent = 'booking_created' | 'booking_confirmed' | 'booking_declined' | 'booking_cancelled' | 'mentor_validated' | 'message_created';

export interface PushMessage {
  title: string;
  body: string;
  /** Expo Router path opened when the notification is tapped. */
  url: string;
  /** Switches the app to this role first (a mentor request opens the Mentor space). */
  role?: 'student' | 'mentor';
}

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * Records that this alert is being sent. Returns false if it already was:
 * the same request never notifies twice, even if the app calls again.
 */
export async function once(subjectId: string, event: NotifyEvent): Promise<boolean> {
  const { error } = await supabaseAdmin.from('notification_events').insert({ subject_id: subjectId, event });
  if (!error) return true;
  if (error.code === '23505') return false;
  console.error('notification_events insert failed:', error);
  return false;
}

/** Sends to every phone of this account. Phones where the app was removed are forgotten. */
export async function pushTo(userId: string, message: PushMessage): Promise<number> {
  const { data: rows, error } = await supabaseAdmin.from('push_tokens').select('token').eq('user_id', userId);
  if (error) {
    console.error('push_tokens read failed:', error);
    return 0;
  }
  const tokens = (rows ?? []).map(r => r.token as string);
  if (tokens.length === 0) return 0;

  const res = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(
      tokens.map(to => ({
        to,
        title: message.title,
        body: message.body,
        sound: 'default',
        data: { url: message.url, role: message.role ?? null },
      }))
    ),
  }).catch(err => {
    console.error('Expo push failed:', err);
    return null;
  });
  if (!res?.ok) return 0;

  const json = (await res.json().catch(() => null)) as { data?: { status: string; details?: { error?: string } }[] } | null;
  const tickets = json?.data ?? [];
  const gone = tickets.map((t, i) => (t.details?.error === 'DeviceNotRegistered' ? tokens[i] : null)).filter((t): t is string => !!t);
  if (gone.length) await supabaseAdmin.from('push_tokens').delete().in('token', gone);
  return tickets.filter(t => t.status === 'ok').length;
}

/** « samedi 24 octobre à 12h00 », in Paris time (mentors live in France). */
export function parisWhen(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris' });
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }).replace(':', 'h');
  return `${date} à ${time}`;
}

/** « samedi 24 octobre », without the hour: a student abroad may not be on Paris time. */
export function dayOnly(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris' });
}

// ── What happened on a call request, and who must hear about it ────────────────────────────────────────────
// Shared by /api/v1/notify (the app, as a fallback) and /api/hooks/notify (the database webhook). Everything is
// re-read from the database: the request only says « look at booking X ».

export type BookingKind = 'booking_created' | 'booking_answered' | 'booking_cancelled';

/** « Aymen A. », or « Un·e étudiant·e » when the profile has no first name yet. */
function shortName(first?: string | null, last?: string | null) {
  const f = first?.trim();
  if (!f) return 'Un·e étudiant·e';
  const l = last?.trim();
  return l ? `${f} ${l[0].toUpperCase()}.` : f;
}

/**
 * Notifies the other side of a call request, once. `callerId` (app route) must be the person who acted:
 * the student for a new or cancelled request, the mentor for an answer. The webhook passes none: the database
 * itself reported the change. Returns how many phones received it.
 */
export async function notifyBooking(bookingId: string, kind: BookingKind, callerId?: string): Promise<number> {
  const { data: b, error } = await supabaseAdmin
    .from('bookings')
    .select('id, student_id, starts_at, topic, status, cancelled_by, mentors(user_id, first_name)')
    .eq('id', bookingId)
    .maybeSingle();
  if (error || !b) return 0;
  const mentor = (Array.isArray(b.mentors) ? b.mentors[0] : b.mentors) as { user_id: string | null; first_name: string } | null;
  if (!mentor?.user_id) return 0;
  const byStudent = callerId === undefined || callerId === b.student_id;
  const byMentor = callerId === undefined || callerId === mentor.user_id;

  let to: string | null = null;
  let event: NotifyEvent | null = null;
  let message: PushMessage | null = null;

  if (kind === 'booking_created' && byStudent && b.status === 'pending') {
    const { data: p } = await supabaseAdmin.from('profiles').select('first_name, last_name').eq('id', b.student_id).maybeSingle();
    to = mentor.user_id;
    event = 'booking_created';
    message = {
      title: 'Nouvelle demande d’appel',
      body: `${shortName(p?.first_name, p?.last_name)} · ${b.topic} · ${parisWhen(b.starts_at)}`,
      url: '/(app)/(tabs)',
      role: 'mentor',
    };
  } else if (kind === 'booking_answered' && byMentor && (b.status === 'confirmed' || (b.status === 'cancelled' && b.cancelled_by !== 'student'))) {
    to = b.student_id;
    event = b.status === 'confirmed' ? 'booking_confirmed' : 'booking_declined';
    message =
      b.status === 'confirmed'
        ? {
            title: `${mentor.first_name} a accepté ton appel`,
            body: `Rendez-vous ${dayOnly(b.starts_at)}. L’heure exacte est sur ton accueil.`,
            url: '/(app)/(tabs)',
            role: 'student',
          }
        : {
            title: `${mentor.first_name} n’est pas disponible`,
            body: 'Propose un autre moment, ou demande à un autre mentor.',
            url: '/(app)/(tabs)/explorer',
            role: 'student',
          };
  } else if (kind === 'booking_cancelled' && byStudent && b.status === 'cancelled' && b.cancelled_by !== 'mentor') {
    const { data: p } = await supabaseAdmin.from('profiles').select('first_name').eq('id', b.student_id).maybeSingle();
    to = mentor.user_id;
    event = 'booking_cancelled';
    message = {
      title: 'Demande annulée',
      body: `${p?.first_name?.trim() || 'L’étudiant·e'} a annulé l’appel du ${parisWhen(b.starts_at)}.`,
      url: '/(app)/(tabs)',
      role: 'mentor',
    };
  }

  // Wrong person or wrong state: nothing to send.
  if (!to || !event || !message) return 0;
  if (!(await once(b.id, event))) return 0;
  return pushTo(to, message);
}

/** A mentor sheet has just been validated: the mentor learns that students can now find them (once). */
export async function notifyMentorValidated(mentorId: string): Promise<number> {
  const { data: m } = await supabaseAdmin.from('mentors').select('id, user_id, city, is_active').eq('id', mentorId).maybeSingle();
  if (!m?.user_id || !m.is_active) return 0;
  if (!(await once(m.id, 'mentor_validated'))) return 0;
  return pushTo(m.user_id, {
    title: 'Ta fiche mentor est en ligne',
    body: `Les étudiants de ${m.city} peuvent maintenant te proposer un appel. Merci d’être là pour eux.`,
    url: '/(app)/(tabs)',
    role: 'mentor',
  });
}

// ── A new message between a student and their mentor ─────────────────────────────────────────────────────────
// (supabase/migrations/20261029100000_messagerie.sql in dalili-app). One alert per unread burst: only the first
// message the other person has not read yet rings, the following ones wait until they open the conversation.

const preview = (text: string) => (text.length > 120 ? `${text.slice(0, 117).trimEnd()}…` : text);

export async function notifyMessage(messageId: string): Promise<number> {
  const { data: msg } = await supabaseAdmin.from('messages').select('id, conversation_id, sender_id, body, created_at').eq('id', messageId).maybeSingle();
  if (!msg) return 0;
  const { data: c } = await supabaseAdmin
    .from('conversations')
    .select('id, student_id, student_read_at, mentor_read_at, mentors(user_id, first_name, is_active)')
    .eq('id', msg.conversation_id)
    .maybeSingle();
  const mentor = (Array.isArray(c?.mentors) ? c?.mentors[0] : c?.mentors) as { user_id: string | null; first_name: string; is_active: boolean } | null;
  if (!c || !mentor?.user_id || !mentor.is_active) return 0;

  const fromStudent = msg.sender_id === c.student_id;
  if (!fromStudent && msg.sender_id !== mentor.user_id) return 0;
  const to = fromStudent ? mentor.user_id : c.student_id;
  const readAt = fromStudent ? c.mentor_read_at : c.student_read_at;

  // Blocked either way: the conversation is hidden from both, nothing rings.
  const { count: blocked } = await supabaseAdmin
    .from('mentorat_blocks')
    .select('*', { count: 'exact', head: true })
    .or(`and(blocker_id.eq.${msg.sender_id},blocked_id.eq.${to}),and(blocker_id.eq.${to},blocked_id.eq.${msg.sender_id})`);
  if (blocked) return 0;

  const { count: earlier } = await supabaseAdmin
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', c.id)
    .eq('sender_id', msg.sender_id)
    .gt('created_at', readAt)
    .lt('created_at', msg.created_at);
  if (earlier) return 0;
  if (!(await once(msg.id, 'message_created'))) return 0;

  let name = mentor.first_name;
  if (fromStudent) {
    const { data: p } = await supabaseAdmin.from('profiles').select('first_name, last_name').eq('id', c.student_id).maybeSingle();
    name = shortName(p?.first_name, p?.last_name);
  }
  return pushTo(to, {
    title: `${name} t’a écrit`,
    body: preview(msg.body),
    url: `/(app)/messages/${c.id}`,
    role: fromStudent ? 'mentor' : 'student',
  });
}
