// « Cette réponse est fausse » : tied to the logged question, never to the
// person. The optional comment is redacted before storage.

import { json, preflight, requireUser } from '@/lib/assistant/app-auth';
import { redactPersonalData } from '@/lib/assistant/redact';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REASONS = ['faux', 'incomplet', 'pas_clair', 'autre'];

export function OPTIONS() {
  return preflight();
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireUser(request);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const queryId = String(body?.queryId ?? '');
  const reason = String(body?.reason ?? '');
  const comment = typeof body?.comment === 'string' ? redactPersonalData(body.comment.trim()).slice(0, 500) : null;
  if (!UUID_RE.test(queryId) || !REASONS.includes(reason)) return json({ error: 'Requête invalide.' }, 400);

  const { error } = await supabaseAdmin.from('assistant_feedback').insert({ query_id: queryId, reason, comment: comment || null, channel: 'app' });
  if (error) {
    console.error('assistant_feedback insert failed:', error);
    return json({ error: 'Erreur serveur, réessaie dans un instant.' }, 500);
  }
  return json({ ok: true });
}
