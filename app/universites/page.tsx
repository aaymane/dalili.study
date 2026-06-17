import type { Metadata } from 'next';
import Link from 'next/link';
import { UNIVERSITIES } from '@/lib/universities';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Universités en France pour étudiants étrangers : guide complet 2026 | Dalili',
  description: 'Comparez les universités françaises : coût de la vie, frais de scolarité, logement CROUS, programmes populaires. Toutes les infos pour choisir votre université.',
  alternates: { canonical: `${SITE_URL}/universites` },
  openGraph: {
    title: 'Universités en France pour étudiants étrangers 2026 | Dalili',
    description: 'Guide complet des universités françaises : Bordeaux, Paris, Lyon, Nantes. Frais, logement, vie étudiante.',
    url: `${SITE_URL}/universites`,
    siteName: 'Dalili', type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const TYPE_COLORS: Record<string, string> = {
  'Université publique': '77,143,255',
  'Grande école': '245,158,11',
  'École de commerce': '16,185,129',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Universités', item: `${SITE_URL}/universites` },
  ],
};

export default function UniversitesPage() {
  const unis = Object.values(UNIVERSITIES);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,5vw,80px)' }}>

          {/* Header */}
          <div style={{ marginBottom: 'clamp(48px,8vw,80px)' }}>
            <div style={{ display: 'inline-flex', marginBottom: 20, padding: '5px 16px', border: '1px solid rgba(1,77,248,0.3)', borderRadius: 100, background: 'rgba(1,77,248,0.07)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.85)' }}>
                {unis.length} établissements
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-bebas)', fontWeight: 400,
              fontSize: 'clamp(3.5rem,8vw,9rem)',
              lineHeight: 0.9, letterSpacing: '0.04em',
              color: '#fff', margin: '0 0 clamp(16px,2vw,24px)',
            }}>
              UNIVERSITÉS<br />
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>EN FRANCE.</span>
            </h1>

            <p style={{
              fontFamily: 'var(--font-dm-sans)', fontWeight: 300,
              fontSize: 'clamp(0.88rem,1.3vw,1.05rem)',
              color: 'rgba(255,255,255,0.45)', maxWidth: 'min(540px,88vw)',
              lineHeight: 1.75, margin: 0,
            }}>
              Tout ce qu&apos;il faut savoir avant de choisir votre université :
              frais, logement, budget mensuel, programmes phares et avis honnêtes.
            </p>
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px,100%), 1fr))',
            gap: 'clamp(14px,2.5vw,22px)',
          }}>
            {unis.map(uni => {
              const rgb = TYPE_COLORS[uni.type] ?? '77,143,255';
              return (
                <Link key={uni.slug} href={`/universites/${uni.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    className="sc-card-hover"
                    style={{
                      height: '100%',
                      padding: 'clamp(24px,3vw,32px)',
                      background: `linear-gradient(145deg, rgba(${rgb},0.06) 0%, rgba(1,4,16,0.97) 65%)`,
                      border: `1px solid rgba(${rgb},0.15)`,
                      borderRadius: 20,
                      position: 'relative', overflow: 'hidden',
                      ['--hover-rgb' as string]: rgb,
                    }}
                                                          >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, rgba(${rgb},0.7), transparent)` }} />

                    {/* City + type */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <span style={{
                        fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                        fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: `rgb(${rgb})`,
                        padding: '3px 9px',
                        border: `1px solid rgba(${rgb},0.28)`,
                        borderRadius: 100, background: `rgba(${rgb},0.08)`,
                      }}>{uni.city}</span>
                      <span style={{
                        fontFamily: 'var(--font-montserrat)', fontWeight: 600,
                        fontSize: '0.5rem', letterSpacing: '0.1em',
                        color: 'rgba(255,255,255,0.32)',
                      }}>{uni.type}</span>
                    </div>

                    <h2 style={{
                      fontFamily: 'var(--font-bebas)', fontWeight: 400,
                      fontSize: 'clamp(1.6rem,2.8vw,2.1rem)', lineHeight: 0.95, letterSpacing: '0.02em',
                      color: '#fff', margin: '0 0 16px',
                    }}>{uni.name}</h2>

                    {/* Key stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                      {[
                        { label: 'Étudiants', value: `${(uni.students / 1000).toFixed(0)}k` },
                        { label: 'Internationaux', value: `${(uni.internationalStudents / 1000).toFixed(1)}k` },
                        { label: 'Budget min.', value: `${uni.monthlyBudgetMin}€/mois` },
                        { label: 'CROUS', value: uni.costCrous.split('–')[0].trim() },
                      ].map(stat => (
                        <div key={stat.label} style={{
                          padding: '10px 12px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: 10,
                        }}>
                          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.48rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{stat.label}</div>
                          <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    <span style={{
                      fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                      fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: `rgb(${rgb})`,
                    }}>Voir le guide →</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <p style={{
            marginTop: 48, textAlign: 'center',
            fontFamily: 'var(--font-dm-sans)', fontWeight: 300,
            fontSize: '0.875rem', color: 'rgba(255,255,255,0.3)',
          }}>
            D&apos;autres universités arrivent bientôt — <Link href="/blog" style={{ color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>consulter tous les guides</Link>
          </p>
        </div>
      </main>
    </>
  );
}
