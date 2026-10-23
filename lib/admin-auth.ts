// Shared gate for every /api/admin/* route: the x-admin-token header must match
// ADMIN_TOKEN (Production only on Vercel). Compared in constant time so the
// response time never hints at how much of the token was right.

import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

export function isAdmin(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  const given = request.headers.get('x-admin-token');
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
