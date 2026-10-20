// « On l'ajoute à nos guides » : after a refusal, the student asks for the
// topic to be covered. Flags the (already anonymised) logged question; feeds
// docs/GUIDES-A-ECRIRE.md. No personal data is stored.
//
// No session required: the random queryId (returned with the refusal) is the
// only key, it can only flip `requested` on a refusal from the last 24 h, and
// it carries nothing personal. Works from the app's demo mode and the site.

import { json, preflight } from '@/lib/assistant/app-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function OPTIONS() {
  return preflight();
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null);
  const queryId = String(body?.queryId ?? '');
  if (!UUID_RE.test(queryId)) return json({ error: 'Requête invalide.' }, 400);

  const { error } = await supabaseAdmin
    .from('assistant_queries')
    .update({ requested: true })
    .eq('id', queryId)
    .eq('fallback_triggered', true)
    .gte('created_at', new Date(Date.now() - 86_400_000).toISOString());
  if (error) {
    console.error('assistant request flag failed:', error);
    return json({ error: 'Erreur serveur, réessaie dans un instant.' }, 500);
  }
  return json({ ok: true });
}
