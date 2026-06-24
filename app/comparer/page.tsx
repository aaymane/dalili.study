import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ComparateurVilles = dynamic(() => import('@/components/ComparateurVilles'), { ssr: false });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Comparer les villes étudiantes en France : outil comparatif 2026 | Dalili',
  description:
    'Compare Bordeaux, Lyon, Paris, Toulouse, Marseille... Budget, universités, communauté maghrébine, emploi — tous les critères pour choisir ta ville d\'études en France.',
  alternates: { canonical: `${SITE_URL}/comparer` },
  openGraph: {
    title: 'Comparer les villes étudiantes en France : outil comparatif 2026 | Dalili',
    description:
      'Outil interactif : compare 2 ou 3 villes selon le budget, les universités, l\'emploi, la communauté et la qualité de vie. Recommandation personnalisée.',
    url: `${SITE_URL}/comparer`,
    siteName: 'Dalili',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Comparateur villes étudiantes France 2026 — Dalili' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dalilistudy',
    title: 'Comparer les villes étudiantes en France 2026 | Dalili',
    description: 'Compare 14 villes françaises sur le budget, l\'emploi, la communauté et la qualité de vie. Recommandation automatique.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Comparer les villes', item: `${SITE_URL}/comparer` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Comparateur villes étudiantes France 2026 — Dalili',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'All',
    description:
      'Outil interactif pour comparer 2 ou 3 villes étudiantes françaises selon le budget, les universités présentes, les opportunités d\'emploi, la qualité de vie, les transports et la communauté maghrébine et africaine.',
    url: `${SITE_URL}/comparer`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
    author: { '@type': 'Organization', name: 'Dalili', url: SITE_URL },
    dateModified: '2026-06-23',
    inLanguage: 'fr',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quelle est la ville universitaire la moins chère en France ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Clermont-Ferrand est la ville universitaire la moins chère de France : il est possible de vivre avec 500-800 €/mois tout compris. Viennent ensuite Dijon (550-850 €/mois), Rennes, Nantes et Lille (600-950 €/mois). À titre de comparaison, Paris nécessite 1 000-1 900 €/mois.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quelle ville française a la plus grande communauté maghrébine pour les étudiants étrangers ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Marseille possède la plus grande communauté maghrébine de France — pour un étudiant marocain, algérien ou tunisien, l\'intégration y est la plus naturelle. Toulouse (quartiers très accueillants), Paris (18e, 19e, 20e arrondissements) et Montpellier sont également de très bonnes options avec des communautés bien établies.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quelle ville choisir pour l\'ingénierie et les stages ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Toulouse est la capitale mondiale de l\'aéronautique (Airbus, Thales, ATR, Safran). Grenoble est idéale pour la tech et l\'énergie (CEA, STMicroelectronics, Schneider Electric). Lyon offre un bassin d\'emploi très diversifié (pharma, banque, multinationales). Paris reste incontournable pour la finance et le conseil.',
        },
      },
    ],
  },
];

export default function ComparerPage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Comparer les villes', href: null }].map((item, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(239,179,112,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>{item.label}</span>
                }
                {i < 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          {/* Hero header */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,72px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 16px', border: '1px solid rgba(77,143,255,0.25)', borderRadius: 100, background: 'rgba(77,143,255,0.07)', marginBottom: 20 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4d8fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4d8fff' }}>
                Outil gratuit
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(2.2rem,6vw,4rem)', letterSpacing: '0.04em', color: '#fff', margin: '0 0 16px', lineHeight: 1.05 }}>
              Compare les villes étudiantes<br />en France
            </h1>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.55)', maxWidth: 560, margin: '0 auto 12px', lineHeight: 1.7 }}>
              Choisis 2 ou 3 villes et vois en temps réel les différences de budget, d&apos;universités, d&apos;emploi et de qualité de vie — avec une recommandation personnalisée.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              14 villes · 5 critères · Données 2025-2026 · Gratuit
            </p>
          </div>

          {/* Separator */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(77,143,255,0.2),transparent)', marginBottom: 'clamp(32px,5vw,56px)' }} />

          {/* Tool */}
          <ComparateurVilles />

          {/* Cross-links */}
          <div style={{ marginTop: 80, paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
              {[
                { title: 'Simulateur budget',        desc: 'Calcule ton budget mensuel exact selon ta ville, ton logement et ta bourse.',        href: '/simulateur',   label: 'Calculer mon budget →' },
                { title: 'Calendrier Campus France',  desc: 'Génère ton planning mois par mois pour préparer ton dossier et ton arrivée.',        href: '/calendrier',   label: 'Voir mon calendrier →' },
                { title: 'Toutes les villes',         desc: 'Explore nos guides complets pour les 14 villes étudiantes couvertes par Dalili.',    href: '/villes',       label: 'Explorer les villes →' },
              ].map(item => (
                <div key={item.href} style={{ padding: 24, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.9rem', color: '#fff', margin: '0 0 8px' }}>{item.title}</h3>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.82)', margin: '0 0 16px', lineHeight: 1.6 }}>{item.desc}</p>
                  <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4d8fff', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
