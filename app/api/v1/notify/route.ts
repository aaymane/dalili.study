// The app tells the server « something happened on this call request ». The server re-reads the request in the
// database, checks that the caller is the right person and that the state matches, then notifies the OTHER side.
// A forged call can't notify anyone of something that didn't happen, and each alert is sent once (lib/notify.ts).

import { json, preflight, requireUser } from '@/lib/assistant/app-auth';
import { dayOnly, once, parisWhen, pushTo, type NotifyEvent, type PushMessage } from '@/lib/notify';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** « Aymen A. », or « Un étudiant » when the profile has no first name yet. */
function shortName(first?: string | null, last?: string | null) {
  const f = first?.trim();
  if (!f) return 'Un·e étudiant·e';
  const l = last?.trim();
  return l ? `${f} ${l[0].toUpperCase()}.` : f;
}

export function OPTIONS() {
  return preflight();
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireUser(request);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const bookingId = String(body?.bookingId ?? '');
  const kind = body?.event;
  if (!UUID_RE.test(bookingId) || !['booking_created', 'booking_answered', 'booking_cancelled'].includes(kind)) {
    return json({ error: 'Requête invalide.' }, 400);
  }

  const { data: b, error } = await supabaseAdmin
    .from('bookings')
    .select('id, student_id, starts_at, topic, status, mentors(user_id, first_name)')
    .eq('id', bookingId)
    .maybeSingle();
  if (error) return json({ error: 'Erreur serveur.' }, 500);
  if (!b) return json({ error: 'Demande introuvable.' }, 404);

  const mentor = (Array.isArray(b.mentors) ? b.mentors[0] : b.mentors) as { user_id: string | null; first_name: string } | null;
  const isStudent = b.student_id === auth.userId;
  const isMentor = !!mentor?.user_id && mentor.user_id === auth.userId;

  let to: string | null = null;
  let event: NotifyEvent | null = null;
  let message: PushMessage | null = null;

  if (kind === 'booking_created' && isStudent && b.status === 'pending' && mentor?.user_id) {
    const { data: p } = await supabaseAdmin.from('profiles').select('first_name, last_name').eq('id', b.student_id).maybeSingle();
    to = mentor.user_id;
    event = 'booking_created';
    message = {
      title: 'Nouvelle demande d’appel',
      body: `${shortName(p?.first_name, p?.last_name)} · ${b.topic} · ${parisWhen(b.starts_at)}`,
      url: '/(app)/(tabs)',
      role: 'mentor',
    };
  } else if (kind === 'booking_answered' && isMentor && (b.status === 'confirmed' || b.status === 'cancelled')) {
    to = b.student_id;
    event = b.status === 'confirmed' ? 'booking_confirmed' : 'booking_declined';
    message =
      b.status === 'confirmed'
        ? {
            title: `${mentor!.first_name} a accepté ton appel`,
            body: `Rendez-vous ${dayOnly(b.starts_at)}. L’heure exacte est sur ton accueil.`,
            url: '/(app)/(tabs)',
            role: 'student',
          }
        : {
            title: `${mentor!.first_name} n’est pas disponible`,
            body: 'Propose un autre moment, ou demande à un autre mentor.',
            url: '/(app)/(tabs)/explorer',
            role: 'student',
          };
  } else if (kind === 'booking_cancelled' && isStudent && b.status === 'cancelled' && mentor?.user_id) {
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

  // Wrong person or wrong state: nothing to send (not an error for the app, which calls without waiting).
  if (!to || !event || !message) return json({ sent: 0 });
  if (!(await once(b.id, event))) return json({ sent: 0, already: true });
  const sent = await pushTo(to, message);
  return json({ sent });
}
