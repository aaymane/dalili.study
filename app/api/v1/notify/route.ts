// The app tells the server « something happened on this call request » or « I just sent this message » (fallback:
// the database webhook, /api/hooks/notify, normally gets there first). The caller must be the person who acted;
// everything else is re-read from the database in lib/notify.ts, and each alert is sent once.

import { json, preflight, requireUser } from '@/lib/assistant/app-auth';
import { notifyBooking, notifyMessage, type BookingKind } from '@/lib/notify';

export const runtime = 'nodejs';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const KINDS: BookingKind[] = ['booking_created', 'booking_answered', 'booking_cancelled'];

export function OPTIONS() {
  return preflight();
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireUser(request);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (body?.event === 'message_created') {
    const messageId = String(body?.messageId ?? '');
    if (!UUID_RE.test(messageId)) return json({ error: 'Requête invalide.' }, 400);
    return json({ sent: await notifyMessage(messageId, auth.userId) });
  }

  const bookingId = String(body?.bookingId ?? '');
  const kind = body?.event as BookingKind;
  if (!UUID_RE.test(bookingId) || !KINDS.includes(kind)) return json({ error: 'Requête invalide.' }, 400);

  const sent = await notifyBooking(bookingId, kind, auth.userId);
  return json({ sent });
}
