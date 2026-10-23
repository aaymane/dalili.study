// Push notifications to the DALILI app, sent by the server only (service key) after it has checked in the
// database that the event really happened. Expo Push Service is free; tokens come from public.push_tokens
// (supabase/migrations/20261024100000_notifications.sql in dalili-app).

import { supabaseAdmin } from '@/lib/supabase-admin';

export type NotifyEvent = 'booking_created' | 'booking_confirmed' | 'booking_declined' | 'booking_cancelled' | 'mentor_validated';

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
