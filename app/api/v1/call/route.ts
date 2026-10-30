// The app asks to join a video call (lib/call.ts): it gets a private Daily room and a personal token, only if the
// caller is the student or the mentor of this confirmed call, and only from 15 minutes before to 2 hours after.
// The mentor opens the room; a student who arrives first gets 423 { waiting: true } and the app retries.

import { json, preflight, requireUser } from '@/lib/assistant/app-auth';
import { callAccess } from '@/lib/call';

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

  const access = await callAccess(bookingId, auth.userId);
  if (!access.ok) return json({ error: access.error, opensAt: access.opensAt, waiting: access.waiting }, access.status);
  return json({ url: access.url, token: access.token, role: access.role, otherName: access.otherName, topic: access.topic, startsAt: access.startsAt });
}
