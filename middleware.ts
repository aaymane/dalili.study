import { type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return createClient(request);
}

export const config = {
  matcher: [
    // Skip static files and images — only run on pages and API routes.
    // /api/content (public content API) and /api/v1 (app endpoints, Bearer token): no cookie session to refresh.
    '/((?!_next/static|_next/image|api/content|api/v1|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)',
  ],
};
