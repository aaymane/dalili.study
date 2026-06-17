import type { Metadata } from 'next';
import Link from 'next/link';
import { CITIES } from '@/lib/cities';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Étudier en France : guide des villes universitaires 2026 | Dalili',
  description: 'Comparez les villes universitaires françaises pour les étudiants étrangers : Bordeaux, Paris, Lyon, Nantes. Coût de la vie, logement, transport et avis.',
  alternates: { canonical: `${SITE_URL}/villes` },
  openGraph: {
    title: 'Villes universitaires en France pour étudiants étrangers | Dalili',
    description: 'Bordeaux, Paris, Lyon, Nantes : tout comparer avant de choisir votre ville d\'études.',
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

export default function VillesPage() {
  const cities = Object.values(CITIES);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,5vw,80px)' }}>

          {/* Header */}
          <div style={{ marginBottom: 'clamp(48px,8vw,80px)' }}>
            <div style={{ display: 'inline-flex', marginBottom: 20, padding: '5px 16px', border: '1px solid rgba(239,179,112,0.3)', borderRadius: 100, background: 'rgba(239,179,112,0.06)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(239,179,112,0.85)' }}>
                {cities.length} villes couvertes
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3.5rem,8vw,9rem)', lineHeight: 0.9, letterSpacing: '0.04em', color: '#fff', margin: '0 0 clamp(16px,2vw,24px)' }}>
              OÙ<br />
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>ÉTUDIER ?</span>
            </h1>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 'clamp(0.88rem,1.3vw,1.05rem)', color: 'rgba(255,255,255,0.45)', maxWidth: 'min(520px,88vw)', lineHeight: 1.75, margin: 0 }}>
              Budget, logement, ambiance, transport : tout ce qu&apos;il faut savoir
              pour choisir votre ville avant de partir.
            </p>
          </div>

          {/* Comparison table — desktop */}
          <div style={{ marginBottom: 56, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-dm-sans)', minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {['Ville', 'Budget min.', 'Budget max.', 'Studio privé', 'CROUS'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cities.map(city => (
                  <tr key={city.slug} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <Link href={`/villes/${city.slug}`} style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.875rem', color: '#fff', textDecoration: 'none' }}>
                        {city.name}
                      </Link>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: '#10B981', fontWeight: 600 }}>{city.monthlyBudgetMin}€</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>{city.monthlyBudgetMax}€</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>{city.costStudio}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>{city.costCrous}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* City cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px,100%), 1fr))', gap: 'clamp(14px,2.5vw,22px)' }}>
            {cities.map(city => (
              <Link key={city.slug} href={`/villes/${city.slug}`} style={{ textDecoration: 'none' }}>
                <div
                  className="sc-card-hover-amber"
                  style={{
                    height: '100%',
                    padding: 'clamp(24px,3vw,32px)',
                    background: 'linear-gradient(145deg, rgba(239,179,112,0.06) 0%, rgba(1,4,16,0.97) 65%)',
                    border: '1px solid rgba(239,179,112,0.14)',
                    borderRadius: 20,
                    position: 'relative', overflow: 'hidden',
                    }}
                                                    >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(239,179,112,0.6), transparent)' }} />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#EFB370', padding: '3px 9px', border: '1px solid rgba(239,179,112,0.28)', borderRadius: 100, background: 'rgba(239,179,112,0.08)' }}>{city.region}</span>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: '0.8rem', color: '#10B981' }}>{city.monthlyBudgetMin}€<span style={{ fontWeight: 400, fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>/mois</span></span>
                  </div>

                  <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(2.2rem,4vw,3rem)', lineHeight: 0.9, letterSpacing: '0.03em', color: '#fff', margin: '0 0 8px' }}>{city.name}</h2>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '0.82rem', color: 'rgba(255,255,255,0.38)', margin: '0 0 20px', lineHeight: 1.6 }}>{city.tagline}</p>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                    {[`${city.students.toLocaleString('fr-FR')} étudiants`, city.transportName].map(tag => (
                      <span key={tag} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.48rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', padding: '4px 8px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6 }}>{tag}</span>
                    ))}
                  </div>

                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#EFB370' }}>
                    Explorer la ville →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
