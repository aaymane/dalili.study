import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export const metadata: Metadata = {
  title: { template: '%s | Dalili Blog', default: 'Blog | Dalili' },
  description: 'Guides pratiques pour les étudiants internationaux en France : visa, logement, banque, CAF et démarches administratives.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#010510', minHeight: '100vh', color: '#fff' }}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
