// Database webhook (supabase/migrations/20261024120000_notifications_webhook.sql in dalili-app): the database
// reports « booking X changed » or « mentor sheet Y was validated ». Protected by a shared secret kept in the
// database vault and in NOTIFY_WEBHOOK_SECRET (Vercel, Production only). Same checks and same once-only journal
// as the app route: the payload carries no personal data, everything is re-read here.

import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { notifyBooking, notifyMentorValidated, type BookingKind } from '@/lib/notify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BOOKING_KINDS: BookingKind[] = ['booking_created', 'booking_answered', 'booking_cancelled'];

function fromDatabase(request: Request): boolean {
  const expected = process.env.NOTIFY_WEBHOOK_SECRET;
  const given = request.headers.get('x-webhook-secret');
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request): Promise<Response> {
  if (!fromDatabase(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  const event = body?.event;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  if (event === 'mentor_validated') return NextResponse.json({ sent: await notifyMentorValidated(id) });
  if (BOOKING_KINDS.includes(event)) return NextResponse.json({ sent: await notifyBooking(id, event) });
  return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
}
