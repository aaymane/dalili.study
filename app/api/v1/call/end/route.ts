// The mentor ends the call (lib/call.ts endCall): the booking becomes « done », the room closes for both, the student
// is invited to rate the mentor and can book a new call right away.

import { json, preflight, requireUser } from '@/lib/assistant/app-auth';
import { endCall } from '@/lib/call';

export const runtime = 'nodejs';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function OPTIONS() {
  return preflight();
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireUser(request);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const bookingId = String(body?.bookingId ?? '');
  if (!UUID_RE.test(bookingId)) return json({ error: 'Requête invalide.' }, 400);

  const done = await endCall(bookingId, auth.userId);
  if (!done.ok) return json({ error: done.error }, done.status);
  return json({ ended: true });
}
