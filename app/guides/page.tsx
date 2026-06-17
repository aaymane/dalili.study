import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, CATEGORY_COLORS } from '@/lib/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Guides pratiques pour étudier en France | Dalili',
  description: 'Tous les guides Dalili pour les étudiants marocains, algériens, tunisiens et égyptiens en France : visa, logement, banque, CAF, santé, emploi et installation.',
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    title: 'Guides pratiques pour étudier en France | Dalili',
    description: 'Guides complets par catégorie : visa, logement, banque, CAF, santé, études, travail et installation.',
    url: `${SITE_URL}/guides`,
    siteName: 'Dalili',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const GUIDE_CATEGORIES = [
  {
    slug: 'visa',
    label: 'Visa & Titre de séjour',
    description: 'Campus France, procédure consulaire, VLS-TS, OFII et renouvellements. Tout ce qu\'il faut faire avant et après l\'arrivée.',
    icon: '🛂',
    articleCategories: ['Visa'],
  },
  {
    slug: 'logement',
    label: 'Logement',
    description: 'CROUS, résidences privées, garant, DossierFacile. Trouver et sécuriser un logement depuis ton pays.',
    icon: '🏠',
    articleCategories: ['Logement'],
  },
  {
    slug: 'banque',
    label: 'Banque & Finances',
    description: 'Ouvrir un compte bancaire sans adresse fixe, cartes étudiantes, virements internationaux et gestion de budget.',
    icon: '🏦',
    articleCategories: ['Banque', 'Finances'],
  },
  {
    slug: 'caf',
    label: 'CAF & Aides',
    description: 'APL, ALS, délais, documents, erreurs à éviter. L\'aide au logement qui peut te faire économiser jusqu\'à 250€/mois.',
    icon: '💶',
    articleCategories: ['CAF', 'Démarches'],
  },
  {
    slug: 'sante',
    label: 'Santé',
    description: 'Sécurité sociale étudiante, médecin traitant, SUMPPS, mutuelle. Tout ce qu\'il faut savoir pour être bien couvert.',
    icon: '🩺',
    articleCategories: ['Santé', 'Vie étudiante'],
  },
  {
    slug: 'etudes',
    label: 'Études & Université',
    description: 'Système LMD, crédits ECTS, équivalences, bourses, vie de campus. Comprendre l\'université française de l\'intérieur.',
    icon: '🎓',
    articleCategories: ['Vie étudiante'],
  },
  {
    slug: 'travail',
    label: 'Travail & Alternance',
    description: '964 heures, contrats d\'apprentissage, stages, droits. Travailler légalement en France pendant tes études.',
    icon: '💼',
    articleCategories: ['Emploi'],
  },
  {
    slug: 'installation',
    label: 'Installation',
    description: 'Budget, transports, carte d\'étudiant, découverte de la ville. Tout ce qu\'il faut faire dans les 30 premiers jours.',
    icon: '🧳',
    articleCategories: ['Démarches', 'Permis'],
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
  ],
};

export default function GuidesPage() {
  const posts = getAllPosts();

  // Count articles per guide category
  const countByCategory = (articleCategories: string[]) =>
    posts.filter(p => articleCategories.includes(p.category)).length;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,5vw,80px)' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: 'clamp(48px,8vw,80px)' }}>
            <div style={{
              display: 'inline-flex', marginBottom: 20,
              padding: '5px 16px',
              border: '1px solid rgba(1,77,248,0.3)',
              borderRadius: 100, background: 'rgba(1,77,248,0.07)',
            }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.85)',
              }}>
                Base de connaissance
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-bebas)', fontWeight: 400,
              fontSize: 'clamp(3.5rem,8vw,9rem)',
              lineHeight: 0.9, letterSpacing: '0.04em',
              color: '#fff', margin: '0 0 clamp(16px,2vw,24px)',
            }}>
              TOUS LES<br />
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>GUIDES.</span>
            </h1>

            <p style={{
              fontFamily: 'var(--font-dm-sans)', fontWeight: 300,
              fontSize: 'clamp(0.88rem,1.3vw,1.05rem)',
              color: 'rgba(255,255,255,0.45)', maxWidth: 'min(520px,88vw)',
              lineHeight: 1.75, margin: 0,
            }}>
              Guides pratiques pour les étudiants marocains, algériens, tunisiens et égyptiens
              qui viennent étudier en France. Écrits par des gens qui sont passés par là.
            </p>
          </div>

          {/* ── Category grid ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px,100%), 1fr))',
            gap: 'clamp(12px,2vw,20px)',
          }}>
            {GUIDE_CATEGORIES.map(cat => {
              const count = countByCategory(cat.articleCategories);
              const accentColor = cat.articleCategories
                .map(ac => CATEGORY_COLORS[ac])
                .find(Boolean) ?? CATEGORY_COLORS.Visa;

              return (
                <Link
                  key={cat.slug}
                  href={`/guides/${cat.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      height: '100%',
                      padding: 'clamp(24px,3vw,32px)',
                      background: `linear-gradient(145deg, rgba(${accentColor.accentRgb},0.07) 0%, rgba(1,4,16,0.96) 65%)`,
                      border: `1px solid rgba(${accentColor.accentRgb},0.16)`,
                      borderRadius: 20,
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      cursor: 'pointer',
                      ['--hover-rgb' as string]: accentColor.accentRgb,
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    {/* Top accent line */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                      background: `linear-gradient(90deg, transparent, ${accentColor.accent}80, transparent)`,
                    }} />

                    <div style={{ fontSize: '2rem', marginBottom: 16, lineHeight: 1 }}>{cat.icon}</div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                      <h2 style={{
                        fontFamily: 'var(--font-montserrat)', fontWeight: 800,
                        fontSize: 'clamp(0.88rem,1.3vw,1rem)',
                        color: '#fff', margin: 0, letterSpacing: '0.01em',
                      }}>{cat.label}</h2>

                      {count > 0 && (
                        <span style={{
                          flexShrink: 0,
                          fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                          fontSize: '0.52rem', letterSpacing: '0.14em',
                          color: accentColor.accent,
                          padding: '3px 9px',
                          border: `1px solid rgba(${accentColor.accentRgb},0.28)`,
                          borderRadius: 100,
                          background: `rgba(${accentColor.accentRgb},0.08)`,
                          whiteSpace: 'nowrap',
                        }}>
                          {count} guide{count > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <p style={{
                      fontFamily: 'var(--font-dm-sans)', fontWeight: 300,
                      fontSize: '0.875rem', lineHeight: 1.7,
                      color: 'rgba(255,255,255,0.45)', margin: '0 0 20px',
                    }}>{cat.description}</p>

                    <span style={{
                      fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                      fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: accentColor.accent,
                    }}>
                      Explorer →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── All articles link ── */}
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <Link href="/blog" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-montserrat)', fontWeight: 600,
              fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(77,143,255,0.7)',
              textDecoration: 'none',
            }}>
              Voir tous les {posts.length} articles →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
