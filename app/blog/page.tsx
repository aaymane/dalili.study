import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { getAllPosts, CLUSTER_DEFINITIONS } from '@/lib/blog';
import SearchableBlogGrid from '@/components/blog/SearchableBlogGrid';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Blog — Guides pour étudiants maghrébins en France 2026 | Dalili',
  description: 'Guides pratiques visa, logement, CAF, compte bancaire et toutes les démarches — écrits par et pour les étudiants marocains, algériens, tunisiens et égyptiens en France.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Guides pour étudiants maghrébins en France | Dalili',
    description: 'Visa étudiant, logement, CAF, banque, OFII : guides pratiques pour les étudiants du Maghreb en France.',
    url: `${SITE_URL}/blog`,
    siteName: 'Dalili',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Dalili Blog — Guides étudiants maghrébins en France' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dalilistudy',
    title: 'Guides pour étudiants maghrébins en France | Dalili',
    description: 'Visa étudiant, logement, CAF, banque, OFII : guides pratiques pour les étudiants du Maghreb en France.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

const FEATURED_SLUGS = [
  'visa-etudiant-france-maroc-2026',
  'logement-crous-etudiant-etranger-demande',
  'caf-etudiant-etranger-delais-documents-erreurs',
];

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = FEATURED_SLUGS.map(slug => posts.find(p => p.slug === slug)).filter(Boolean) as typeof posts;
  const clusterKeys = Object.keys(CLUSTER_DEFINITIONS);

  return (
    <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 'clamp(32px,5vw,56px)' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.58rem', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(77,143,255,0.7)',
            textDecoration: 'none',
            marginBottom: 28,
          }}>
            ← Retour à l&apos;accueil
          </Link>

          <div style={{
            display: 'inline-flex', marginBottom: 20,
            padding: '5px 16px',
            border: '1px solid rgba(1,77,248,0.3)',
            borderRadius: 100, background: 'rgba(1,77,248,0.07)',
          }}>
            <span style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'rgba(77,143,255,0.85)',
            }}>Guide &amp; Ressources</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-bebas)',
            fontWeight: 400,
            fontSize: 'clamp(3.5rem,8vw,9rem)',
            lineHeight: 0.9, letterSpacing: '0.04em',
            color: '#fff', margin: '0 0 clamp(16px,2vw,24px)',
          }}>
            NOS GUIDES<br />
            <span style={{ color: 'rgba(255,255,255,0.38)' }}>POUR TOI.</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 'clamp(0.88rem,1.3vw,1.05rem)',
            color: 'rgba(255,255,255,0.38)',
            maxWidth: 'min(500px,88vw)',
            lineHeight: 1.75, margin: 0,
          }}>
            Guides pratiques pour les étudiants marocains, algériens, tunisiens et égyptiens.
            Écrits par des gens qui sont passés par là — avec les vraies démarches, pas la version officielle.
          </p>
        </div>

        {/* ── Checklist CTA ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
          padding: 'clamp(16px,2.5vw,24px) clamp(20px,3vw,32px)',
          background: 'linear-gradient(135deg, rgba(1,77,248,0.12) 0%, rgba(1,4,16,0.95) 70%)',
          border: '1px solid rgba(1,77,248,0.25)',
          borderRadius: 16,
          marginBottom: 'clamp(20px,3vw,36px)',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)', margin: '0 0 6px' }}>
              Ressource gratuite
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500, fontSize: '0.95rem', color: '#fff', margin: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, verticalAlign: 'middle' }}><FileText size={15} strokeWidth={2} color="#4d8fff" /> Checklist Complète Arrivée en France 2026 — PDF gratuit</span>
            </p>
          </div>
          <Link href="/checklist" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 22px',
            background: '#014DF8',
            borderRadius: 8,
            textDecoration: 'none',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#fff',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            Télécharger →
          </Link>
        </div>

        <SearchableBlogGrid posts={posts} featured={featured} clusterKeys={clusterKeys} />
      </div>
    </main>
  );
}
