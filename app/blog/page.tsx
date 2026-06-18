import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, CATEGORY_COLORS, formatDate } from '@/lib/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Blog — Guides pour étudiants maghrébins en France 2026 | Dalili',
  description: 'Guides pratiques visa, logement, CAF, compte bancaire et toutes les démarches — écrits par et pour les étudiants marocains, algériens, tunisiens et égyptiens en France.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Guides pour étudiants maghrébins en France | Dalili',
    description: 'Visa étudiant, logement, CAF, banque, OFII : guides pratiques pour les étudiants du Maghreb en France.',
    url: `${SITE_URL}/blog`,
    siteName: 'Dalili',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Dalili Blog — Guides étudiants maghrébins en France' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dalilistudy',
    title: 'Guides pour étudiants maghrébins en France | Dalili',
    description: 'Visa étudiant, logement, CAF, banque, OFII : guides pratiques pour les étudiants du Maghreb en France.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,5vw,80px)' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 'clamp(48px,8vw,96px)' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.58rem', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(77,143,255,0.7)',
            textDecoration: 'none',
            marginBottom: 28,
          }}>
            ← Retour à l&apos;accueil
          </Link>

          <div style={{
            display: 'inline-flex', marginBottom: 20,
            padding: '5px 16px',
            border: '1px solid rgba(1,77,248,0.3)',
            borderRadius: 100, background: 'rgba(1,77,248,0.07)',
          }}>
            <span style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'rgba(77,143,255,0.85)',
            }}>Guide &amp; Ressources</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-bebas)',
            fontWeight: 400,
            fontSize: 'clamp(3.5rem,8vw,9rem)',
            lineHeight: 0.9, letterSpacing: '0.04em',
            color: '#fff', margin: '0 0 clamp(16px,2vw,24px)',
          }}>
            NOS GUIDES<br />
            <span style={{ color: 'rgba(255,255,255,0.38)' }}>POUR TOI.</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 'clamp(0.88rem,1.3vw,1.05rem)',
            color: 'rgba(255,255,255,0.38)',
            maxWidth: 'min(500px,88vw)',
            lineHeight: 1.75, margin: 0,
          }}>
            Guides pratiques pour les étudiants marocains, algériens, tunisiens et égyptiens.
            Écrits par des gens qui sont passés par là — avec les vraies démarches, pas la version officielle.
          </p>
        </div>

        {/* ── Grid — 3 cols desktop / 2 tablet / 1 mobile ── */}
        <div className="blog-index-grid">
          {posts.map(post => {
            const cat = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.Visa;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
              >
                <article
                  className="blog-card"
                  style={{
                    '--accent-rgb': cat.accentRgb,
                    flex: 1, display: 'flex', flexDirection: 'column',
                    padding: 'clamp(24px,3.5vw,36px)',
                    background: `linear-gradient(160deg, rgba(${cat.accentRgb},0.07) 0%, rgba(1,4,16,0.97) 60%)`,
                    borderWidth: 1, borderStyle: 'solid',
                    borderColor: `rgba(${cat.accentRgb},0.18)`,
                    borderRadius: 22,
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    position: 'relative', overflow: 'hidden',
                  } as React.CSSProperties}
                >
                  {/* Top accent */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent, ${cat.accent}, transparent)`,
                  }} />

                  {/* Thumbnail */}
                  {post.thumbnail && (
                    <div style={{
                      position: 'relative', width: 'calc(100% + clamp(48px,7vw,72px))',
                      marginLeft: 'calc(-1 * clamp(24px,3.5vw,36px))',
                      marginTop: 'calc(-1 * clamp(24px,3.5vw,36px))',
                      marginBottom: 20,
                      aspectRatio: '16/9',
                      overflow: 'hidden',
                    }}>
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        priority={false}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: `linear-gradient(to bottom, transparent 55%, rgba(1,4,16,0.85) 100%)`,
                      }} />
                    </div>
                  )}

                  {/* Category + read time */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 10,
                    marginBottom: 18,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px',
                      border: `1px solid rgba(${cat.accentRgb},0.3)`,
                      borderRadius: 100,
                      background: `rgba(${cat.accentRgb},0.08)`,
                    }}>
                      <div style={{
                        width: 4, height: 4, borderRadius: '50%',
                        background: cat.accent, flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: 'var(--font-montserrat)',
                        fontSize: '0.5rem', fontWeight: 700,
                        letterSpacing: '0.16em', textTransform: 'uppercase',
                        color: cat.accent,
                      }}>{post.category}</span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.5rem', fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.25)',
                    }}>{post.readTime} de lecture</span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: 'var(--font-bebas)',
                    fontWeight: 400,
                    fontSize: 'clamp(1.5rem,2.5vw,2rem)',
                    lineHeight: 1.0, letterSpacing: '0.03em',
                    color: '#fff',
                    margin: '0 0 12px',
                  }}>{post.title}</h2>

                  {/* Excerpt */}
                  <p style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontWeight: 300, fontSize: '0.875rem',
                    lineHeight: 1.72, color: 'rgba(255,255,255,0.42)',
                    margin: '0 0 auto', paddingBottom: 20,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  } as React.CSSProperties}>{post.excerpt}</p>

                  {/* Footer */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 16,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.52rem', fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.22)',
                    }}>{formatDate(post.date)}</span>
                    <span style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.58rem', fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: cat.accent,
                    }}>Lire l&apos;article →</span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
