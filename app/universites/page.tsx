import type { Metadata } from 'next';
import Link from 'next/link';
import { UNIVERSITIES } from '@/lib/universities';
import SearchableUniversitesGrid from '@/components/universites/SearchableUniversitesGrid';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: '14 universités françaises pour étudiants étrangers : guide complet 2026 | Dalili',
  description: 'Comparez 14 universités françaises : frais de scolarité hors UE, budget mensuel, logement CROUS, programmes phares. Bordeaux, Sorbonne, Lyon 1, Toulouse 3, Montpellier, Strasbourg, Aix-Marseille, Lille, Nantes, Nice, Rennes, Grenoble, Clermont-Ferrand, Dijon.',
  alternates: { canonical: `${SITE_URL}/universites` },
  openGraph: {
    title: '14 universités françaises pour étudiants étrangers 2026 | Dalili',
    description: 'Guide complet des universités françaises : Bordeaux, Sorbonne, Lyon 1, Toulouse 3, Montpellier, Strasbourg, Aix-Marseille, Lille, Nantes, Nice, Rennes, Grenoble, Clermont, Dijon. Frais, logement, vie étudiante.',
    url: `${SITE_URL}/universites`,
    siteName: 'Dalili', type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Universités', item: `${SITE_URL}/universites` },
  ],
};

const ACCENT = { rgb: '77,143,255', hex: '#4d8fff' };

const COMPARISON = [
  { slug: 'universite-de-bordeaux',   name: 'Bordeaux',    spec: 'Droit · Sciences · Médecine', budget: '650–1 100 €', classement: '251–300', note: '4,5/5' },
  { slug: 'sorbonne-universite',      name: 'Sorbonne',    spec: 'Lettres · Sciences · Médecine', budget: '1 100–1 900 €', classement: 'Top 100', note: '4/5' },
  { slug: 'universite-de-nantes',     name: 'Nantes',      spec: 'Droit · Santé · Ingénierie', budget: '650–1 050 €', classement: '601–650', note: '4/5' },
  { slug: 'universite-de-lille',      name: 'Lille',       spec: 'Médecine · Sciences · Droit', budget: '580–950 €', classement: '601–650', note: '4/5' },
  { slug: 'universite-lyon-1',        name: 'Lyon 1',      spec: 'Santé · Biotech · Informatique', budget: '700–1 150 €', classement: '381–400', note: '4,5/5' },
  { slug: 'universite-toulouse-3',    name: 'Toulouse 3',  spec: 'Ingénierie · Aéro · Sciences', budget: '650–1 050 €', classement: '451–500', note: '4/5' },
  { slug: 'universite-de-montpellier',name: 'Montpellier', spec: 'Médecine · Pharmacie · Droit', budget: '650–1 050 €', classement: '601–650', note: '4,5/5' },
  { slug: 'universite-de-strasbourg', name: 'Strasbourg',  spec: 'Droit EU · Sciences Po · Chimie', budget: '650–1 000 €', classement: '301–350', note: '4/5' },
  { slug: 'aix-marseille-universite', name: 'Aix-Marseille', spec: 'Médecine · Droit · Sciences', budget: '660–1 100 €', classement: '401–450', note: '4/5' },
  { slug: 'universite-cote-azur',      name: 'Nice (UCA)',   spec: 'IA · Maths · Droit international', budget: '750–1 200 €', classement: '601–800', note: '4/5' },
  { slug: 'universite-rennes-1',       name: 'Rennes',       spec: 'Cybersécurité · Droit · Médecine', budget: '600–950 €', classement: '801–1000', note: '4/5' },
  { slug: 'universite-grenoble-alpes', name: 'Grenoble',     spec: 'Physique · Énergie · Ingénierie', budget: '620–1 000 €', classement: '601–800', note: '4,5/5' },
  { slug: 'universite-clermont-auvergne', name: 'Clermont',  spec: 'Chimie · Médecine · Michelin', budget: '500–800 €', classement: 'Non classée', note: '3,5/5' },
  { slug: 'universite-bourgogne',      name: 'Dijon',        spec: 'Droit du vin · Agronomie · Droit', budget: '550–850 €', classement: 'Non classée', note: '3,5/5' },
];

export default function UniversitesPage() {
  const unis = Object.values(UNIVERSITIES);

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

            <div style={{ display: 'inline-flex', marginBottom: 20, padding: '5px 16px', border: `1px solid rgba(${ACCENT.rgb},0.3)`, borderRadius: 100, background: `rgba(${ACCENT.rgb},0.07)` }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: `rgba(${ACCENT.rgb},0.85)` }}>
                {unis.length} établissements
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3.5rem,8vw,9rem)', lineHeight: 0.9, letterSpacing: '0.04em', color: '#fff', margin: '0 0 clamp(16px,2vw,24px)' }}>
              UNIVERSITÉS<br />
              <span style={{ color: 'rgba(255,255,255,0.88)' }}>EN FRANCE.</span>
            </h1>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: 'clamp(0.88rem,1.3vw,1.05rem)', color: 'rgba(255,255,255,0.92)', maxWidth: 'min(540px,88vw)', lineHeight: 1.75, margin: 0 }}>
              Tout ce qu&apos;il faut savoir avant de choisir votre université :
              frais, logement, budget mensuel, programmes phares et avis honnêtes.
            </p>
          </div>

          <SearchableUniversitesGrid unis={unis} />

          {/* Comparison table */}
          <div style={{ marginTop: 'clamp(64px,10vw,100px)' }}>
            <div style={{ display: 'inline-flex', marginBottom: 20, padding: '5px 16px', border: `1px solid rgba(${ACCENT.rgb},0.3)`, borderRadius: 100, background: `rgba(${ACCENT.rgb},0.07)` }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: `rgba(${ACCENT.rgb},0.85)` }}>
                Comparatif rapide
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(2rem,5vw,5rem)', lineHeight: 0.95, letterSpacing: '0.04em', color: '#fff', margin: '0 0 clamp(24px,3vw,40px)' }}>
              QUELLE UNIVERSITÉ<br />
              <span style={{ color: 'rgba(255,255,255,0.88)' }}>CHOISIR ?</span>
            </h2>

            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-dm-sans)', minWidth: 700 }}>
                <thead>
                  <tr>
                    {['Université', 'Point fort', 'Budget / mois', 'QS 2026', 'Avis Dalili'].map(h => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '12px 16px',
                        fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700,
                        letterSpacing: '0.16em', textTransform: 'uppercase',
                        color: `rgba(${ACCENT.rgb},0.7)`,
                        borderBottom: `1px solid rgba(255,255,255,0.08)`,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((u, i) => (
                    <tr key={u.slug} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Link href={`/universites/${u.slug}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                          {u.name}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.92)', fontSize: '0.85rem' }}>{u.spec}</td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.92)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{u.budget}</td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.92)', fontSize: '0.85rem' }}>{u.classement}</td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: `rgba(${ACCENT.rgb},0.9)`, fontSize: '0.85rem', fontWeight: 600 }}>{u.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p style={{ marginTop: 48, textAlign: 'center', fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>
            Guides mis à jour en juin 2026 — <Link href="/blog" style={{ color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>consulter tous les guides</Link>
          </p>
        </div>
      </main>
    </>
  );
}
