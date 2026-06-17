import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUniversity, getAllUniversitySlugs } from '@/lib/universities';
import RelatedArticles from '@/components/blog/RelatedArticles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export async function generateStaticParams() {
  return getAllUniversitySlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const uni = getUniversity(params.slug);
  if (!uni) return {};
  const title = `${uni.name} : guide étudiant international 2026 | Dalili`;
  const description = `Tout savoir sur ${uni.name} : frais d'inscription, logement CROUS, budget mensuel à ${uni.city}, programmes et avis d'étudiants.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/universites/${params.slug}` },
    openGraph: {
      title, description, url: `${SITE_URL}/universites/${params.slug}`,
      siteName: 'Dalili', type: 'website',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
  };
}

const ACCENT = '77,143,255';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'inline-flex', marginBottom: 12, padding: '4px 14px', border: `1px solid rgba(${ACCENT},0.25)`, borderRadius: 100, background: `rgba(${ACCENT},0.06)` }}>
      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: `rgba(77,143,255,0.75)` }}>{children}</span>
    </div>
  );
}

export default function UniversityPage({ params }: { params: { slug: string } }) {
  const uni = getUniversity(params.slug);
  if (!uni) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Universités', item: `${SITE_URL}/universites` },
      { '@type': 'ListItem', position: 3, name: uni.name, item: `${SITE_URL}/universites/${uni.slug}` },
    ],
  };

  const eduSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: uni.name,
    address: { '@type': 'PostalAddress', addressLocality: uni.city, addressRegion: uni.region, addressCountry: 'FR' },
    url: uni.websiteUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eduSchema) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(16px,5vw,40px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Universités', href: '/universites' }, { label: uni.name, href: null }].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{item.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: `rgb(${ACCENT})`, padding: '4px 12px', border: `1px solid rgba(${ACCENT},0.3)`, borderRadius: 100, background: `rgba(${ACCENT},0.08)` }}>{uni.city}</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.58rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>{uni.type}</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3rem,7vw,6rem)', lineHeight: 0.9, letterSpacing: '0.03em', color: '#fff', margin: '0 0 16px' }}>
              {uni.name}
            </h1>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
              Guide complet pour les étudiants marocains, algériens, tunisiens et égyptiens qui souhaitent intégrer {uni.name}.
            </p>
          </div>

          {/* ── Informations clés ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Informations clés</SectionLabel>
            <div style={{ overflowX: 'auto', marginTop: 4 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-dm-sans)' }}>
                <tbody>
                  {[
                    { label: 'Ville', value: `${uni.city}, ${uni.region}` },
                    { label: 'Type', value: uni.type },
                    { label: 'Étudiants', value: `${uni.students.toLocaleString('fr-FR')}` },
                    { label: 'Étudiants internationaux', value: `~${uni.internationalStudents.toLocaleString('fr-FR')}` },
                    { label: 'Frais inscription Licence (hors exemption)', value: `${uni.tuitionLicence.toLocaleString('fr-FR')} €/an` },
                    { label: 'Frais inscription Master (hors exemption)', value: `${uni.tuitionMaster.toLocaleString('fr-FR')} €/an` },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '14px 0', fontWeight: 500, fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', width: '50%', paddingRight: 16 }}>{row.label}</td>
                      <td style={{ padding: '14px 0', fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Formations populaires ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Formations populaires</SectionLabel>
            <ul style={{ margin: '8px 0 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {uni.popularPrograms.map((prog, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: '#4d8fff', flexShrink: 0, marginTop: 2 }}>→</span>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>{prog}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Niveau de vie étudiant ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Niveau de vie étudiant à {uni.city}</SectionLabel>
            <div style={{ overflowX: 'auto', marginTop: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-dm-sans)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['Logement CROUS', 'Studio privé', 'Transport', 'Nourriture'].map(h => (
                      <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {[uni.costCrous, uni.costPrivate, uni.costTransport, uni.costFood].map((val, i) => (
                      <td key={i} style={{ padding: '14px 8px', fontWeight: 600, fontSize: '0.875rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{val}</td>
                    ))}
                  </tr>
                  <tr>
                    <td colSpan={4} style={{ padding: '12px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
                        Budget mensuel estimé : <strong style={{ color: '#fff' }}>{uni.monthlyBudgetMin}€ – {uni.monthlyBudgetMax}€</strong> selon le logement
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Avantages / Inconvénients ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Avantages & Inconvénients</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px,100%), 1fr))', gap: 16, marginTop: 12 }}>
              <div style={{ padding: 24, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16 }}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#10B981', margin: '0 0 14px' }}>✅ Avantages</p>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {uni.pros.map((pro, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: '#10B981', flexShrink: 0 }}>+</span>
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: 24, background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 16 }}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F43F5E', margin: '0 0 14px' }}>❌ Inconvénients</p>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {uni.cons.map((con, i) => (
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
            <div style={{ padding: 'clamp(24px,3vw,36px)', background: 'rgba(1,77,248,0.06)', border: '1px solid rgba(77,143,255,0.2)', borderRadius: 20 }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4d8fff', margin: '0 0 16px' }}>★ Avis Dalili</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '1rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, margin: 0 }}>{uni.avis}</p>
            </div>
          </section>

          {/* ── Liens officiels ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Liens officiels</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {[
                { label: `Site officiel de ${uni.name}`, url: uni.websiteUrl },
                { label: 'CROUS local — logement et restauration', url: uni.crousUrl },
                { label: 'Campus France — admission internationale', url: uni.campusFranceUrl },
                { label: 'Service-Public.fr — démarches administratives', url: 'https://www.service-public.fr' },
                { label: 'ANEF — titre de séjour en ligne', url: 'https://administration-etrangers-en-france.interieur.gouv.fr' },
              ].map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', fontWeight: 500,
                  color: 'rgba(255,255,255,0.72)', textDecoration: 'none',
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                }}
                                                >
                  <span>{link.label}</span>
                  <span style={{ color: '#4d8fff', flexShrink: 0 }}>↗</span>
                </a>
              ))}
            </div>
          </section>

          {/* ── Related articles ── */}
          {uni.relatedArticles.length > 0 && (
            <RelatedArticles articles={uni.relatedArticles} />
          )}

          {/* Back */}
          <div style={{ marginTop: 40 }}>
            <Link href="/universites" style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>
              ← Toutes les universités
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
