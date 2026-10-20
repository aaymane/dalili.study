import { type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return createClient(request);
}

export const config = {
  matcher: [
    // Skip static files and images — only run on pages and API routes.
    // /api/content is the app's public, CDN-cached content API: no session to refresh.
    '/((?!_next/static|_next/image|api/content|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)',
  ],
};
