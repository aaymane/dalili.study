// Video calls between a student and their mentor, with Daily (daily.co). Only this server talks to Daily, with
// DAILY_API_KEY (Vercel, Production only): the app gets a private room and a personal token for one confirmed call,
// after the database says the caller is the student or the mentor of that call.
// The mentor opens the room (founders' decision, 30/10): their first request notes bookings.call_started_at and tells
// the student; until then the student gets 423 and waits in the app's waiting room.

import { notifyCallStarted } from '@/lib/notify';
import { supabaseAdmin } from '@/lib/supabase-admin';

const DAILY_API = 'https://api.daily.co/v1';
/** The room opens 15 minutes before the call and closes 2 hours after it starts. */
const OPENS_BEFORE_MS = 15 * 60_000;
const CLOSES_AFTER_MS = 2 * 60 * 60_000;

export type CallAccess =
  | { ok: true; url: string; token: string; role: 'student' | 'mentor'; otherName: string; topic: string; startsAt: string }
  | { ok: false; status: number; error: string; opensAt?: string; waiting?: boolean };

/** « Aymen A. », or a neutral name when the profile has no first name yet. */
function shortName(first?: string | null, last?: string | null, fallback = 'Étudiant·e') {
  const f = first?.trim();
  if (!f) return fallback;
  const l = last?.trim();
  return l ? `${f} ${l[0].toUpperCase()}.` : f;
}

async function daily(path: string, init?: RequestInit) {
  return fetch(`${DAILY_API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.DAILY_API_KEY}`, ...(init?.headers ?? {}) },
  });
}

/** The private room of this call, created the first time someone opens it. */
async function roomFor(bookingId: string, exp: number): Promise<string | null> {
  const name = `dalili-${bookingId}`;
  const existing = await daily(`/rooms/${name}`);
  if (existing.ok) return ((await existing.json()) as { url: string }).url;
  const created = await daily('/rooms', {
    method: 'POST',
    body: JSON.stringify({
      name,
      privacy: 'private',
      properties: { exp, eject_at_room_exp: true, max_participants: 2, enable_chat: false, enable_screenshare: false, lang: 'fr' },
    }),
  });
  if (!created.ok) {
    console.error('Daily room creation failed:', created.status, await created.text().catch(() => ''));
    return null;
  }
  return ((await created.json()) as { url: string }).url;
}

export async function callAccess(bookingId: string, userId: string): Promise<CallAccess> {
  if (!process.env.DAILY_API_KEY) return { ok: false, status: 503, error: 'Les appels vidéo ne sont pas encore ouverts.' };

  const { data: b } = await supabaseAdmin
    .from('bookings')
    .select('id, student_id, starts_at, topic, status, call_started_at, mentors(user_id, first_name, last_name, is_active)')
    .eq('id', bookingId)
    .maybeSingle();
  const mentor = (Array.isArray(b?.mentors) ? b?.mentors[0] : b?.mentors) as
    | { user_id: string | null; first_name: string; last_name: string | null; is_active: boolean }
    | null;
  if (!b || !mentor) return { ok: false, status: 404, error: 'Rendez-vous introuvable.' };

  const role = userId === b.student_id ? 'student' : userId === mentor.user_id ? 'mentor' : null;
  if (!role) return { ok: false, status: 403, error: 'Ce rendez-vous n’est pas le tien.' };
  if (b.status !== 'confirmed') return { ok: false, status: 409, error: 'Ce rendez-vous n’est pas (ou plus) confirmé.' };
  if (!mentor.is_active) return { ok: false, status: 409, error: 'Ce mentor n’est plus disponible pour le moment.' };

  const other = role === 'student' ? b.student_id : mentor.user_id;
  if (other) {
    const { count: blocked } = await supabaseAdmin
      .from('mentorat_blocks')
      .select('*', { count: 'exact', head: true })
      .or(`and(blocker_id.eq.${userId},blocked_id.eq.${other}),and(blocker_id.eq.${other},blocked_id.eq.${userId})`);
    if (blocked) return { ok: false, status: 409, error: 'Ce rendez-vous n’est plus disponible.' };
  }

  const start = new Date(b.starts_at).getTime();
  const now = Date.now();
  if (now < start - OPENS_BEFORE_MS) {
    return { ok: false, status: 425, error: 'L’appel s’ouvre 15 minutes avant l’heure.', opensAt: new Date(start - OPENS_BEFORE_MS).toISOString() };
  }
  if (now > start + CLOSES_AFTER_MS) return { ok: false, status: 410, error: 'Cet appel est terminé.' };

  // The mentor opens the room; the student waits for them (423 = waiting room in the app).
  if (role === 'student' && !b.call_started_at) {
    return { ok: false, status: 423, error: 'Ton mentor n’a pas encore ouvert le salon.', waiting: true };
  }
  if (role === 'mentor' && !b.call_started_at) {
    const { data: opened } = await supabaseAdmin
      .from('bookings')
      .update({ call_started_at: new Date().toISOString() })
      .eq('id', b.id)
      .is('call_started_at', null)
      .select('id');
    if (opened?.length) await notifyCallStarted(b.id).catch(err => console.error('call_started push failed:', err));
  }

  const exp = Math.floor((start + CLOSES_AFTER_MS) / 1000);
  const url = await roomFor(b.id, exp);
  if (!url) return { ok: false, status: 502, error: 'Le service vidéo ne répond pas. Réessaie dans un instant.' };

  const { data: p } = await supabaseAdmin.from('profiles').select('first_name, last_name').eq('id', b.student_id).maybeSingle();
  const studentName = shortName(p?.first_name, p?.last_name);
  const mentorName = shortName(mentor.first_name, mentor.last_name, 'Mentor');

  const res = await daily('/meeting-tokens', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        room_name: `dalili-${b.id}`,
        user_name: role === 'student' ? studentName : mentorName,
        user_id: userId,
        exp,
        eject_at_token_exp: true,
        is_owner: false,
        enable_screenshare: false,
      },
    }),
  });
  if (!res.ok) {
    console.error('Daily token failed:', res.status, await res.text().catch(() => ''));
    return { ok: false, status: 502, error: 'Le service vidéo ne répond pas. Réessaie dans un instant.' };
  }
  const { token } = (await res.json()) as { token: string };
  return {
    ok: true,
    url,
    token,
    role,
    otherName: role === 'student' ? mentor.first_name : studentName,
    topic: b.topic,
    startsAt: b.starts_at,
  };
}
