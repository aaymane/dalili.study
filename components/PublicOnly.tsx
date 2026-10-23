'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Site chrome (navbar, assistant bubble) that must not cover the founders' admin page.
export default function PublicOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <>{children}</>;
}
