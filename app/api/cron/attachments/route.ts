// Daily cron (vercel.json): removes attachments sent more than 30 days ago between a student and their mentor.
// Vercel calls it with `Authorization: Bearer <CRON_SECRET>` (CRON_SECRET set in Vercel, Production only).

import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { purgeExpiredAttachments } from '@/lib/attachments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fromVercelCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const given = request.headers.get('authorization');
  if (!secret || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request): Promise<Response> {
  if (!fromVercelCron(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return NextResponse.json({ removed: await purgeExpiredAttachments() });
  } catch (error) {
    console.error('attachments purge failed:', error);
    return NextResponse.json({ error: 'Purge failed' }, { status: 500 });
  }
}
