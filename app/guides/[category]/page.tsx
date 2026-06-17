import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, CATEGORY_COLORS, formatDate } from '@/lib/blog';
import { notFound } from 'next/navigation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

const CATEGORY_CONFIG: Record<string, {
  label: string;
  description: string;
  icon: string;
  articleCategories: string[];
}> = {
  visa: {
    label: 'Visa & Titre de séjour',
    description: 'Campus France, VLS-TS, OFII, renouvellement de titre. Tout pour entrer et rester légalement en France.',
    icon: '🛂',
    articleCategories: ['Visa'],
  },
  logement: {
    label: 'Logement',
    description: 'CROUS, résidences privées, garant, DossierFacile. Trouver et sécuriser un logement depuis l\'étranger.',
    icon: '🏠',
    articleCategories: ['Logement'],
  },
  banque: {
    label: 'Banque & Finances',
    description: 'Compte bancaire, cartes étudiantes, budget mensuel, bourses. Gérer son argent en France.',
    icon: '🏦',
    articleCategories: ['Banque', 'Finances'],
  },
  caf: {
    label: 'CAF & Aides sociales',
    description: 'APL, ALS, délais, documents, pièges à éviter. Les aides au logement qui changent tout.',
    icon: '💶',
    articleCategories: ['CAF', 'Démarches'],
  },
  sante: {
    label: 'Santé',
    description: 'Sécurité sociale, médecin traitant, SUMPPS, mutuelle. Être bien couvert en France.',
    icon: '🩺',
    articleCategories: ['Santé', 'Vie étudiante'],
  },
  etudes: {
    label: 'Études & Université',
    description: 'LMD, ECTS, vie de campus, bourses, orientation. Le système universitaire français expliqué.',
    icon: '🎓',
    articleCategories: ['Vie étudiante'],
  },
  travail: {
    label: 'Travail & Alternance',
    description: '964 heures, stage, alternance, droits des étudiants salariés. Travailler légalement pendant les études.',
    icon: '💼',
    articleCategories: ['Emploi'],
  },
  installation: {
    label: 'Installation',
    description: 'Les 30 premiers jours en France : démarches, budget, transports, services essentiels.',
    icon: '🧳',
    articleCategories: ['Démarches', 'Permis'],
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_CONFIG).map(category => ({ category }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const config = CATEGORY_CONFIG[params.category];
  if (!config) return {};
  const title = `${config.label} — Guides pour étudiants en France | Dalili`;
  const description = config.description;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/guides/${params.category}` },
    openGraph: {
      title, description,
      url: `${SITE_URL}/guides/${params.category}`,
      siteName: 'Dalili', type: 'website',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default function GuideCategoryPage({ params }: { params: { category: string } }) {
  const config = CATEGORY_CONFIG[params.category];
  if (!config) notFound();

  const allPosts = getAllPosts();
  const posts = allPosts.filter(p => config.articleCategories.includes(p.category));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
      { '@type': 'ListItem', position: 3, name: config.label, item: `${SITE_URL}/guides/${params.category}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,5vw,80px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
            {[
              { label: 'Accueil', href: '/' },
              { label: 'Guides', href: '/guides' },
              { label: config.label, href: null },
            ].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href ? (
                  <Link href={item.href} style={{
                    fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'rgba(77,143,255,0.6)', textDecoration: 'none',
                  }}>{item.label}</Link>
                ) : (
                  <span style={{
                    fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                  }}>{item.label}</span>
                )}
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>{config.icon}</div>
            <h1 style={{
              fontFamily: 'var(--font-bebas)', fontWeight: 400,
              fontSize: 'clamp(3rem,7vw,7rem)', lineHeight: 0.92,
              letterSpacing: '0.04em', color: '#fff',
              margin: '0 0 16px',
            }}>{config.label}</h1>
            <p style={{
              fontFamily: 'var(--font-dm-sans)', fontWeight: 300,
              fontSize: 'clamp(0.88rem,1.2vw,1rem)',
              color: 'rgba(255,255,255,0.45)', maxWidth: 500,
              lineHeight: 1.75, margin: 0,
            }}>{config.description}</p>
          </div>

          {/* Articles */}
          {posts.length === 0 ? (
            <div style={{
              padding: 'clamp(40px,6vw,64px)',
              border: '1px dashed rgba(255,255,255,0.1)',
              borderRadius: 20, textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'var(--font-dm-sans)', fontWeight: 300,
                fontSize: '1rem', color: 'rgba(255,255,255,0.35)',
                margin: '0 0 24px',
              }}>
                Les guides de cette catégorie arrivent bientôt.
              </p>
              <Link href="/guides" style={{
                fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#4d8fff', textDecoration: 'none',
              }}>
                ← Toutes les catégories
              </Link>
            </div>
          ) : (
            <div className="blog-index-grid">
              {posts.map(post => {
                const cat = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.Visa;
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                    <article
                      className="blog-card"
                      style={{
                        '--accent-rgb': cat.accentRgb,
                        flex: 1, display: 'flex', flexDirection: 'column',
                        padding: 'clamp(24px,3.5vw,36px)',
                        background: `linear-gradient(160deg, rgba(${cat.accentRgb},0.07) 0%, rgba(1,4,16,0.97) 60%)`,
                        border: `1px solid rgba(${cat.accentRgb},0.18)`,
                        borderRadius: 22,
                        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        position: 'relative', overflow: 'hidden',
                      } as React.CSSProperties}
                    >
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${cat.accent}, transparent)` }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                        <div style={{ padding: '4px 10px', border: `1px solid rgba(${cat.accentRgb},0.3)`, borderRadius: 100, background: `rgba(${cat.accentRgb},0.08)` }}>
                          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: cat.accent }}>{post.category}</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{post.readTime}</span>
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.5rem,2.5vw,2rem)', lineHeight: 1.0, letterSpacing: '0.03em', color: '#fff', margin: '0 0 12px' }}>{post.title}</h2>
                      <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '0.875rem', lineHeight: 1.72, color: 'rgba(255,255,255,0.42)', margin: '0 0 auto', paddingBottom: 20, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{post.excerpt}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>{formatDate(post.date)}</span>
                        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: cat.accent }}>Lire →</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Back */}
          <div style={{ marginTop: 56 }}>
            <Link href="/guides" style={{
              fontFamily: 'var(--font-montserrat)', fontWeight: 600,
              fontSize: '0.66rem', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(77,143,255,0.6)', textDecoration: 'none',
            }}>
              ← Tous les guides
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
