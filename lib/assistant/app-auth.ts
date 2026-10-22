// Authentication for the app's /api/v1/* endpoints: the Supabase access token
// (JWT) of the signed-in student, checked SERVER-SIDE with Supabase Auth.
// Never trust a user id sent in the body.

import { supabaseAdmin } from '@/lib/supabase-admin';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
};

export function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...extra },
  });
}

export function withCors(res: Response): Response {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.headers.set(k, v);
  return res;
}

export function preflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/** Returns the verified user id, or a 401 Response. */
export async function requireUser(request: Request): Promise<{ userId: string } | { error: Response }> {
  const header = request.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return { error: json({ error: 'Connecte-toi pour poser une question.' }, 401) };
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return { error: json({ error: 'Session expirée. Reconnecte-toi.' }, 401) };
  return { userId: data.user.id };
}
