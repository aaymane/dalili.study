import type { Metadata } from 'next';
import Link from 'next/link';
import CalendrierOutil from '@/components/CalendrierOutil';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Calendrier Campus France 2026 : quand faire quoi pour étudier en France ?',
  description:
    'Calendrier personnalisé mois par mois pour préparer ton dossier Campus France et ton arrivée en France selon ton pays d\'origine et ta rentrée souhaitée.',
  alternates: { canonical: `${SITE_URL}/calendrier` },
  openGraph: {
    title: 'Calendrier Campus France 2026 : quand faire quoi pour étudier en France ?',
    description:
      'Génère ton planning Campus France personnalisé par pays et par rentrée : visa, logement, OFII, CAF. Mois par mois, avec les liens vers chaque guide.',
    url: `${SITE_URL}/calendrier`,
    siteName: 'Dalili',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Calendrier Campus France 2026 — Dalili' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dalilistudy',
    title: 'Calendrier Campus France 2026 : quand faire quoi pour étudier en France ?',
    description: 'Génère ton planning personnalisé mois par mois pour préparer ton arrivée en France.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Calendrier Campus France', item: `${SITE_URL}/calendrier` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Calendrier Campus France 2026 — Dalili',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'All',
    description:
      'Outil interactif gratuit pour générer un calendrier personnalisé mois par mois pour préparer ton dossier Campus France et ton arrivée en France selon ton pays et ta rentrée.',
    url: `${SITE_URL}/calendrier`,
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
        name: 'Quand commencer les démarches Campus France ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pour une rentrée en septembre, les démarches Campus France pour les pays CEF (Maroc, Algérie, Tunisie) doivent commencer au moins 6 mois à l\'avance, en mars pour un départ en septembre. Le TCF doit être passé avant mars, soit dès janvier-février. Pour les autres pays (Sénégal, Côte d\'Ivoire, Cameroun), il faut compter au moins 5 à 6 mois à l\'avance.',
        },
      },
      {
        '@type': 'Question',
        name: 'Combien de temps prend le traitement du visa étudiant France ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Le traitement du visa étudiant pour la France prend généralement 3 à 6 semaines après l\'avis favorable de Campus France. Pour les pays d\'Afrique subsaharienne (Sénégal, Côte d\'Ivoire, Cameroun), prévoir 4 à 8 semaines. Il est conseillé de ne pas acheter son billet d\'avion avant d\'avoir le visa en main.',
        },
      },
      {
        '@type': 'Question',
        name: 'Qu\'est-ce que l\'OFII et pourquoi est-ce obligatoire ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'L\'OFII (Office Français de l\'Immigration et de l\'Intégration) permet de valider ton visa long séjour une fois arrivé en France. La validation se fait sur ANEF (administration-etrangers-en-france.interieur.gouv.fr) et est OBLIGATOIRE dans les 3 mois suivant ton arrivée. Ne pas le faire peut entraîner des problèmes pour le renouvellement de ton titre de séjour.',
        },
      },
    ],
  },
];

export default function CalendrierPage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Calendrier Campus France', href: null }].map((item, i) => (
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
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4d8fff' }}>
                Outil gratuit
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(2.2rem,6vw,3.8rem)', letterSpacing: '0.04em', color: '#fff', margin: '0 0 16px', lineHeight: 1.05 }}>
              Calendrier Campus France<br />Quand faire quoi ?
            </h1>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.55)', maxWidth: 520, margin: '0 auto 12px', lineHeight: 1.7 }}>
              Sélectionne ton pays et ta rentrée. On génère ton planning mois par mois avec exactement quoi faire et quand.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              7 pays · 3 rentrées · Données officielles 2025-2026 · Gratuit
            </p>
          </div>

          {/* Separator */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(77,143,255,0.2),transparent)', marginBottom: 'clamp(32px,5vw,48px)' }} />

          {/* Tool */}
          <CalendrierOutil />

          {/* Cross-links */}
          <div style={{ marginTop: 80, paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, maxWidth: 820, margin: '0 auto' }}>
              {[
                {
                  title: 'Simulateur budget',
                  desc: 'Calcule ton budget mensuel exact selon ta ville et ton logement.',
                  href: '/simulateur',
                  label: 'Estimer mon budget →',
                },
                {
                  title: 'Checklist arrivée',
                  desc: '32 démarches dans le bon ordre pour bien préparer ton arrivée.',
                  href: '/checklist',
                  label: 'Télécharger la checklist →',
                },
                {
                  title: 'Guide Campus France',
                  desc: 'Tout sur la procédure CEF : dossier, entretien, avis favorable.',
                  href: '/blog/campusfrance-maroc-guide-complet',
                  label: 'Lire le guide →',
                },
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
