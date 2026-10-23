import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Private page: never indexed, even if a link to it leaks (robots.txt already disallows /admin).
export const metadata: Metadata = {
  title: 'Admin · DALILI',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
