import { contentResponse } from '@/lib/content/api';
import { getGuide, listGuides } from '@/lib/content/guides';

// Un guide complet pour l'app (résumé, chiffres clés, documents, FAQ, sources, blocs).
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return listGuides().map(g => ({ slug: g.slug }));
}

export function GET(_request: Request, { params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) return Response.json({ error: 'Guide introuvable' }, { status: 404 });
  return contentResponse(guide);
}
