// Supabase-table-based rate limiter for the public assistant endpoint.
// No new vendor (Upstash/Redis) for an unproven traffic pattern — a plain
// Postgres table is enough at this scale. Revisit only if volume justifies it.
//
// The IP address itself is never stored — only a SHA-256 hash of it, purely
// to bound abuse. This is a separate concern from assistant_queries (the
// content-gap log), which stores no client-identifying data at all.

import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 20;

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

/** Extracts the client IP from standard proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') ?? 'unknown';
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * Fixed-window rate limit keyed by hashed IP. Resets the window when it has
 * expired rather than sliding — simpler, and good enough at this volume.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const ipHash = hashIp(ip);
  const now = new Date();

  const { data: existing } = await supabaseAdmin
    .from('assistant_rate_limits')
    .select('window_start, request_count')
    .eq('ip_hash', ipHash)
    .maybeSingle();

  if (!existing || now.getTime() - new Date(existing.window_start).getTime() > WINDOW_MS) {
    // New window (first request ever, or the previous window expired).
    await supabaseAdmin
      .from('assistant_rate_limits')
      .upsert({ ip_hash: ipHash, window_start: now.toISOString(), request_count: 1 });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (existing.request_count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  await supabaseAdmin
    .from('assistant_rate_limits')
    .update({ request_count: existing.request_count + 1 })
    .eq('ip_hash', ipHash);

  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - existing.request_count - 1 };
}
