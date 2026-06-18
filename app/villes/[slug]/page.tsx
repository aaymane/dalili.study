import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCity, getAllCitySlugs } from '@/lib/cities';
import RelatedArticles from '@/components/blog/RelatedArticles';
import { BLUR_DATA } from '@/lib/blur-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export async function generateStaticParams() {
  return getAllCitySlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const city = getCity(params.slug);
  if (!city) return {};
  const title = `Étudier à ${city.name} : guide étudiant étranger 2026 | Dalili`;
  const description = `Tout savoir pour étudier à ${city.name} : budget mensuel, logement, transport, universités et quartiers étudiants. Guide par Dalili.`;
  return {
    title, description,
    alternates: { canonical: `${SITE_URL}/villes/${params.slug}` },
    openGraph: {
      title, description, url: `${SITE_URL}/villes/${params.slug}`,
      siteName: 'Dalili', type: 'website',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'inline-flex', marginBottom: 12, padding: '4px 14px', border: '1px solid rgba(239,179,112,0.22)', borderRadius: 100, background: 'rgba(239,179,112,0.05)' }}>
      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(239,179,112,0.7)' }}>{children}</span>
    </div>
  );
}

export default function VillePage({ params }: { params: { slug: string } }) {
  const city = getCity(params.slug);
  if (!city) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Villes', item: `${SITE_URL}/villes` },
      { '@type': 'ListItem', position: 3, name: `Étudier à ${city.name}`, item: `${SITE_URL}/villes/${city.slug}` },
    ],
  };

  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: city.name,
    containedInPlace: { '@type': 'AdministrativeArea', name: city.region },
    address: { '@type': 'PostalAddress', addressLocality: city.name, addressCountry: 'FR' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Villes', href: '/villes' }, { label: `Étudier à ${city.name}`, href: null }].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(239,179,112,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{item.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#EFB370', padding: '4px 12px', border: '1px solid rgba(239,179,112,0.3)', borderRadius: 100, background: 'rgba(239,179,112,0.08)' }}>{city.region}</span>
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)' }}>{city.students.toLocaleString('fr-FR')} étudiants</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3.5rem,9vw,7rem)', lineHeight: 0.88, letterSpacing: '0.03em', color: '#fff', margin: '0 0 14px' }}>
              Étudier à<br />{city.name}
            </h1>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: '0 0 32px' }}>{city.tagline}</p>

            {/* Cover thumbnail */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(239,179,112,0.18)', boxShadow: '0 24px 80px rgba(0,0,0,0.55)' }}>
              <Image
                src={city.thumbnail}
                alt={`Étudier à ${city.name}`}
                fill
                sizes="(max-width:900px) 100vw, 860px"
                style={{ objectFit: 'cover' }}
                placeholder="blur"
                blurDataURL={BLUR_DATA[city.thumbnail]}
                priority
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(1,4,16,0.4) 100%)' }} />
            </div>
          </div>

          {/* ── Coût de la vie ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Coût de la vie à {city.name}</SectionLabel>
            <div style={{ overflowX: 'auto', marginTop: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-dm-sans)', minWidth: 480 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['Chambre CROUS', 'Studio privé', 'Colocation', 'Transport', 'Budget mensuel moyen'].map(h => (
                      <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.48rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {[city.costCrous, city.costStudio, city.costColoc, city.costTransport, `${city.monthlyBudgetMin}–${city.monthlyBudgetMax}€`].map((val, i) => (
                      <td key={i} style={{ padding: '14px 8px', fontWeight: 600, fontSize: '0.82rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{val}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Universités ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Universités à {city.name}</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {city.universities.map(uni => (
                <Link key={uni.slug} href={`/universites/${uni.slug}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, textDecoration: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                >
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{uni.name}</span>
                  <span style={{ color: '#EFB370', fontSize: '0.8rem' }}>→</span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Trouver un logement ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Trouver un logement à {city.name}</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {[
                { label: `CROUS de ${city.name} — résidences universitaires`, url: city.crousUrl },
                { label: 'Studapart — logements étudiants vérifiés', url: 'https://www.studapart.com' },
                { label: 'HousingAnywhere — location depuis l\'étranger', url: 'https://housinganywhere.com' },
                { label: 'VISALE — garantie locative gratuite', url: 'https://www.visale.fr' },
                { label: 'DossierFacile — dossier certifié gouvernement', url: 'https://www.dossierfacile.logement.gouv.fr' },
              ].map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', fontWeight: 500,
                  color: 'rgba(255,255,255,0.72)', textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                >
                  <span>{link.label}</span>
                  <span style={{ color: '#EFB370', flexShrink: 0 }}>↗</span>
                </a>
              ))}
            </div>
          </section>

          {/* ── Quartiers étudiants ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Quartiers étudiants</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
              {city.neighborhoods.map((n, i) => (
                <div key={i} style={{ padding: 24, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.82rem', color: '#fff', margin: '0 0 10px' }}>{n.name}</h3>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '0.875rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.72, margin: 0 }}>{n.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Avantages / Inconvénients ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Avantages & Inconvénients</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px,100%), 1fr))', gap: 16, marginTop: 12 }}>
              <div style={{ padding: 24, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.14)', borderRadius: 16 }}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#10B981', margin: '0 0 14px' }}>✅ Avantages</p>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {city.pros.map((pro, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: '#10B981', flexShrink: 0 }}>+</span>
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: 24, background: 'rgba(244,63,94,0.04)', border: '1px solid rgba(244,63,94,0.14)', borderRadius: 16 }}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F43F5E', margin: '0 0 14px' }}>❌ Inconvénients</p>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {city.cons.map((con, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: '#F43F5E', flexShrink: 0 }}>–</span>
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── Avis Dalili ── */}
          <section style={{ marginBottom: 56 }}>
            <div style={{ padding: 'clamp(24px,3vw,36px)', background: 'rgba(239,179,112,0.05)', border: '1px solid rgba(239,179,112,0.2)', borderRadius: 20 }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#EFB370', margin: '0 0 16px' }}>★ Avis Dalili</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '1rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, margin: 0 }}>{city.avis}</p>
            </div>
          </section>

          {/* ── Liens officiels ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Liens officiels</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {[
                { label: `${city.transportName} — abonnements et plans`, url: city.transportUrl },
                { label: `Préfecture — titre de séjour et démarches`, url: city.prefectureUrl },
                { label: `CAF locale — aide au logement`, url: city.cafUrl },
                { label: 'CROUS national — demande DSE', url: 'https://www.messervices.etudiant.gouv.fr' },
                { label: 'Service-Public.fr — toutes les démarches', url: 'https://www.service-public.fr' },
              ].map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', fontWeight: 500,
                  color: 'rgba(255,255,255,0.72)', textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                >
                  <span>{link.label}</span>
                  <span style={{ color: '#EFB370', flexShrink: 0 }}>↗</span>
                </a>
              ))}
            </div>
          </section>

          {/* Related articles */}
          {city.relatedArticles.length > 0 && <RelatedArticles articles={city.relatedArticles} />}

          {/* Back */}
          <div style={{ marginTop: 40 }}>
            <Link href="/villes" style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(239,179,112,0.6)', textDecoration: 'none' }}>
              ← Toutes les villes
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
