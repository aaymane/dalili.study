import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { UNIVERSITIES } from '@/lib/universities';
import { BLUR_DATA } from '@/lib/blur-data';

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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Universités', item: `${SITE_URL}/universites` },
  ],
};

const ACCENT = { rgb: '77,143,255', hex: '#4d8fff' };

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
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>EN FRANCE.</span>
            </h1>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 'clamp(0.88rem,1.3vw,1.05rem)', color: 'rgba(255,255,255,0.45)', maxWidth: 'min(540px,88vw)', lineHeight: 1.75, margin: 0 }}>
              Tout ce qu&apos;il faut savoir avant de choisir votre université :
              frais, logement, budget mensuel, programmes phares et avis honnêtes.
            </p>
          </div>

          {/* Cards grid — 3 col desktop / 2 tablet / 1 mobile */}
          <div className="blog-index-grid">
            {unis.map((uni, idx) => (
              <Link key={uni.slug} href={`/universites/${uni.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                <article
                  className="blog-card"
                  style={{
                    '--accent-rgb': ACCENT.rgb,
                    flex: 1, display: 'flex', flexDirection: 'column',
                    background: `linear-gradient(160deg, rgba(${ACCENT.rgb},0.07) 0%, rgba(1,4,16,0.97) 60%)`,
                    borderWidth: 1, borderStyle: 'solid',
                    borderColor: `rgba(${ACCENT.rgb},0.18)`,
                    borderRadius: 22,
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    position: 'relative', overflow: 'hidden',
                  } as React.CSSProperties}
                >
                  {/* Top accent line */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${ACCENT.hex}, transparent)`, zIndex: 1 }} />

                  {/* Thumbnail */}
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
                    <Image
                      src={uni.thumbnail}
                      alt={uni.name}
                      fill
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA[uni.thumbnail]}
                      priority={idx < 3}
                      loading={idx < 3 ? 'eager' : 'lazy'}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 50%, rgba(1,4,16,0.75) 100%)` }} />
                  </div>

                  {/* Card body */}
                  <div style={{ padding: 'clamp(20px,3vw,28px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Badge + city */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: `1px solid rgba(${ACCENT.rgb},0.3)`, borderRadius: 100, background: `rgba(${ACCENT.rgb},0.08)` }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: ACCENT.hex, flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT.hex }}>{uni.city}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>{uni.type}</span>
                    </div>

                    {/* Title */}
                    <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.5rem,2.5vw,2rem)', lineHeight: 1.0, letterSpacing: '0.03em', color: '#fff', margin: '0 0 10px' }}>
                      {uni.name}
                    </h2>

                    {/* Key stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 'auto', paddingBottom: 16 }}>
                      {[
                        { label: 'Étudiants', value: `${(uni.students / 1000).toFixed(0)}k` },
                        { label: 'Internationaux', value: `${(uni.internationalStudents / 1000).toFixed(1)}k` },
                        { label: 'Budget min.', value: `${uni.monthlyBudgetMin}€/mois` },
                        { label: 'CROUS', value: uni.costCrous.split('–')[0].trim() },
                      ].map(stat => (
                        <div key={stat.label} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
                          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.44rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 3 }}>{stat.label}</div>
                          <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: '0.82rem', color: '#fff' }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>
                        {(uni.internationalStudents / uni.students * 100).toFixed(0)}% étrangers
                      </span>
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT.hex }}>
                        Voir le guide →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <p style={{ marginTop: 48, textAlign: 'center', fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '0.875rem', color: 'rgba(255,255,255,0.3)' }}>
            D&apos;autres universités arrivent bientôt — <Link href="/blog" style={{ color: `rgba(${ACCENT.rgb},0.6)`, textDecoration: 'none' }}>consulter tous les guides</Link>
          </p>
        </div>
      </main>
    </>
  );
}
