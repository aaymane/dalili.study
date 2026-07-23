import type { Metadata } from 'next';
import Link from 'next/link';
import SimulateurBudget from '@/components/SimulateurBudget';
import { CITIES } from '@/lib/cities';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';
const VILLES_COUNT = Object.keys(CITIES).length;

export const metadata: Metadata = {
  title: 'Simulateur budget étudiant étranger France 2026 | Dalili',
  description:
    'Calcule ton budget exact pour étudier en France selon ta ville. Loyer CROUS ou privé, CAF, nourriture, transport — résultat en 2 minutes. Vrais prix 2026. Consulat accepte ce budget ? Vérifie ici.',
  alternates: { canonical: `${SITE_URL}/simulateur` },
  openGraph: {
    title: 'Simulateur budget étudiant étranger France 2026 | Dalili',
    description:
      'Calcule ton budget mensuel réel pour étudier en France : loyer, CAF, nourriture, transport. Personnalisé selon ta ville et ta situation.',
    url: `${SITE_URL}/simulateur`,
    siteName: 'Dalili',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Simulateur budget étudiant étranger France 2026 — Dalili' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dalilistudy',
    title: 'Simulateur budget étudiant étranger France 2026 | Dalili',
    description:
      'Calcule ton budget mensuel réel pour étudier en France. Personnalisé selon ta ville, ton logement et ta situation. Gratuit.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Simulateur budget', item: `${SITE_URL}/simulateur` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Simulateur budget étudiant étranger France 2026',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    description:
      'Outil interactif gratuit pour estimer le budget mensuel d\'un étudiant étranger en France. Calcule le loyer, la nourriture, le transport et les aides CAF selon la ville choisie.',
    url: `${SITE_URL}/simulateur`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
    author: { '@type': 'Organization', name: 'Dalili', url: SITE_URL },
    dateModified: '2026-06-22',
    inLanguage: 'fr',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quel est le budget mensuel moyen d\'un étudiant étranger en France ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Le budget mensuel d\'un étudiant étranger en France varie de 500 € à 1 900 € selon la ville et le type de logement. À Clermont-Ferrand, il est possible de vivre avec 500-800 €/mois. À Paris, il faut prévoir 1 000-1 900 €/mois minimum. Le simulateur de Dalili calcule une estimation personnalisée selon ta ville, ton logement et ton niveau d\'études.',
        },
      },
      {
        '@type': 'Question',
        name: 'La CAF est-elle accessible aux étudiants étrangers en France ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, la CAF (Caisse d\'Allocations Familiales) est accessible aux étudiants étrangers titulaires d\'un titre de séjour valide. L\'aide au logement (APL ou ALS) varie de 80 à 200 €/mois selon la ville, le type de logement et les ressources. Elle n\'est pas accordée automatiquement : il faut en faire la demande sur caf.fr dès l\'arrivée en France.',
        },
      },
      {
        '@type': 'Question',
        name: 'Combien coûte un logement CROUS pour un étudiant étranger ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Les résidences CROUS sont les logements les plus abordables pour les étudiants en France. Le loyer varie de 150 à 500 €/mois selon la ville et le type de chambre. À Clermont-Ferrand, une chambre CROUS commence à 150 €/mois. À Paris, le tarif est de 280 à 500 €/mois. Les demandes se font via Trouvermonmaster.gouv.fr et le DSE (Dossier Social Étudiant) qui ouvre en janvier pour la rentrée suivante.',
        },
      },
    ],
  },
];

export default function SimulateurPage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Simulateur budget', href: null }].map((item, i) => (
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
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="8" y2="10" strokeWidth="3" />
                <line x1="12" y1="10" x2="12" y2="10" strokeWidth="3" />
                <line x1="16" y1="10" x2="16" y2="10" strokeWidth="3" />
                <line x1="8" y1="14" x2="8" y2="14" strokeWidth="3" />
                <line x1="12" y1="14" x2="12" y2="14" strokeWidth="3" />
                <line x1="16" y1="14" x2="16" y2="14" strokeWidth="3" />
              </svg>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4d8fff' }}>
                Outil gratuit
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(2.4rem,6vw,4rem)', letterSpacing: '0.04em', color: '#fff', margin: '0 0 16px', lineHeight: 1.05 }}>
              Combien ça coûte vraiment<br />d&apos;étudier en France ?
            </h1>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.55)', maxWidth: 540, margin: '0 auto 12px', lineHeight: 1.7 }}>
              5 questions. Une estimation personnalisée de ton budget mensuel, les aides CAF auxquelles tu as droit, et les ressources adaptées à ta situation.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              {VILLES_COUNT} villes · Données 2025-2026 · Gratuit
            </p>
          </div>

          {/* Separator */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(77,143,255,0.2),transparent)', marginBottom: 'clamp(32px,5vw,56px)' }} />

          {/* Simulator component */}
          <SimulateurBudget />

          {/* Bottom context */}
          <div style={{ marginTop: 80, paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
              {[
                {
                  title: 'Budget détaillé',
                  desc: 'Notre guide complet sur le budget mensuel d\'un étudiant étranger en France pour 2026.',
                  href: '/blog/budget-mensuel-etudiant-etranger-france-2026',
                  label: 'Lire le guide →',
                },
                {
                  title: 'Logement CROUS',
                  desc: 'Tout ce qu\'il faut savoir pour obtenir un logement CROUS depuis l\'étranger.',
                  href: '/blog/logement-crous-etudiant-etranger-demande',
                  label: 'Guide CROUS →',
                },
                {
                  title: 'CAF & APL',
                  desc: 'Délais, documents, erreurs à éviter pour ne pas rater ton aide au logement.',
                  href: '/blog/caf-etudiant-etranger-delais-documents-erreurs',
                  label: 'Guide CAF →',
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
