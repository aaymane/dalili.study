import type { Metadata } from 'next';
import Link from 'next/link';
import { CITIES } from '@/lib/cities';
import SearchableVillesGrid from '@/components/villes/SearchableVillesGrid';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: '14 villes universitaires en France pour étudiants étrangers 2026 | Dalili',
  description: 'Comparez 14 villes universitaires françaises : Paris, Lyon, Bordeaux, Toulouse, Nice, Rennes, Grenoble, Clermont-Ferrand, Dijon et plus. Coût de la vie, logement, budget mensuel et avis honnêtes.',
  alternates: { canonical: `${SITE_URL}/villes` },
  openGraph: {
    title: '14 villes universitaires en France pour étudiants étrangers | Dalili',
    description: 'Paris, Lyon, Bordeaux, Toulouse, Nice, Rennes, Grenoble, Clermont-Ferrand, Dijon — comparez toutes les villes avant de choisir.',
    url: `${SITE_URL}/villes`, siteName: 'Dalili', type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Villes', item: `${SITE_URL}/villes` },
  ],
};

const ACCENT = { rgb: '239,179,112', hex: '#EFB370' };

export default function VillesPage() {
  const cities = Object.values(CITIES);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Header */}
          <div style={{ marginBottom: 'clamp(48px,8vw,80px)' }}>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: `rgba(${ACCENT.rgb},0.7)`, textDecoration: 'none', marginBottom: 28,
            }}>← Retour à l&apos;accueil</Link>

            <div style={{ display: 'inline-flex', marginBottom: 20, padding: '5px 16px', border: `1px solid rgba(${ACCENT.rgb},0.3)`, borderRadius: 100, background: `rgba(${ACCENT.rgb},0.06)` }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: `rgba(${ACCENT.rgb},0.85)` }}>
                {cities.length} villes couvertes
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3.5rem,8vw,9rem)', lineHeight: 0.9, letterSpacing: '0.04em', color: '#fff', margin: '0 0 clamp(16px,2vw,24px)' }}>
              OÙ<br />
              <span style={{ color: 'rgba(255,255,255,0.88)' }}>ÉTUDIER ?</span>
            </h1>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: 'clamp(0.88rem,1.3vw,1.05rem)', color: 'rgba(255,255,255,0.92)', maxWidth: 'min(520px,88vw)', lineHeight: 1.75, margin: 0 }}>
              Budget, logement, ambiance, transport : tout ce qu&apos;il faut savoir
              pour choisir votre ville avant de partir.
            </p>
          </div>

          <SearchableVillesGrid cities={cities} />

          <p style={{ marginTop: 48, textAlign: 'center', fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>
            Guides mis à jour en juin 2026 — <Link href="/blog" style={{ color: `rgba(239,179,112,0.6)`, textDecoration: 'none' }}>consulter tous les guides</Link>
          </p>
        </div>
      </main>
    </>
  );
}
