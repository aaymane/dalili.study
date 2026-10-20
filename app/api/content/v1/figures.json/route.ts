import { buildFigures, contentResponse } from '@/lib/content/api';

// API de contenu pour l'app mobile — générée au build, servie par le CDN.
export const dynamic = 'force-static';

export function GET() {
  return contentResponse(buildFigures());
}
