import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BLUR_DATA } from '@/lib/blur-data';
import dynamic from 'next/dynamic';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { getAllPosts, getRawPost, extractHeadings, extractFaqItems, getRelatedPosts, getClusterArticles, CATEGORY_COLORS, CLUSTER_MAP, formatDate } from '@/lib/blog';
import mdxComponents, { Callout } from '@/components/blog/MdxComponents';
import ClusterLinks from '@/components/blog/ClusterLinks';
import NextReading from '@/components/blog/NextReading';
import WaitlistCTA from '@/components/blog/WaitlistCTA';
import { notFound } from 'next/navigation';

// Client-only components loaded dynamically
const ReadingProgressBar = dynamic(() => import('@/components/blog/ReadingProgressBar'), { ssr: false });
const TableOfContents    = dynamic(() => import('@/components/blog/TableOfContents'),    { ssr: false });

// ── Static params for all articles ──────────────────────────────
export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

// ── Per-article metadata ──────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { frontmatter: fm } = getRawPost(params.slug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';
    const ogImageUrl = `${siteUrl}/blog/${params.slug}/opengraph-image`;
    return {
      title: fm.title,
      description: fm.description,
      alternates: {
        canonical: `${siteUrl}/blog/${params.slug}`,
      },
      openGraph: {
        title: fm.title,
        description: fm.description,
        type: 'article',
        publishedTime: fm.date,
        modifiedTime: fm.updatedDate ?? fm.date,
        authors: [fm.author],
        url: `${siteUrl}/blog/${params.slug}`,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: fm.title }],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@dalilistudy',
        title: fm.title,
        description: fm.description,
        images: [ogImageUrl],
      },
    };
  } catch {
    return { title: 'Article | Dalili' };
  }
}

// ── Page component ────────────────────────────────────────────────
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = getRawPost(params.slug);
  } catch {
    notFound();
  }

  const { frontmatter: fm, content: mdxSource } = post;
  const cat      = CATEGORY_COLORS[fm.category] ?? CATEGORY_COLORS.Visa;
  const headings = extractHeadings(mdxSource);

  const related       = getRelatedPosts(params.slug, 3);
  const clusterSlug   = CLUSTER_MAP[params.slug];
  const clusterArticles = clusterSlug ? getClusterArticles(clusterSlug, params.slug) : [];
  const nextReading   = getRelatedPosts(params.slug, 3);

  // MdxComponents.jsx infers each component's parameter type from destructuring,
  // making optional HTML attributes (children, id, href) appear required.
  // The runtime types are correct — cast to suppress the false TS error.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const components = { ...mdxComponents, Callout, WaitlistCTA } as any;

  const { content } = await compileMDX({
    source: mdxSource,
    components,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

  // ── JSON-LD schemas ───────────────────────────────────────────────

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.description,
    datePublished: fm.date,
    dateModified: fm.updatedDate ?? fm.date,
    author: { '@type': 'Person', name: fm.author, url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: 'Dalili',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${params.slug}` },
    image: fm.thumbnail ? `${siteUrl}${fm.thumbnail}` : `${siteUrl}/og-image.jpg`,
  };

  const faqItems = extractFaqItems(mdxSource);
  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog',    item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: fm.title,  item: `${siteUrl}/blog/${params.slug}` },
    ],
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`\n[Dalili JSON-LD] /blog/${params.slug}`);
    console.log('── Article ──');
    console.log(JSON.stringify(articleSchema, null, 2));
    if (faqSchema) {
      console.log(`── FAQ (${faqItems.length} questions) ──`);
      console.log(JSON.stringify(faqSchema, null, 2));
    } else {
      console.log('── FAQ — aucune section FAQ trouvée, schema omis ──');
    }
    console.log('── Breadcrumb ──');
    console.log(JSON.stringify(breadcrumbSchema, null, 2));
  }

  return (
    <>
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* FAQ JSON-LD — only rendered when article has a FAQ section */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Reading progress bar (client) */}
      <ReadingProgressBar />

      <main style={{ paddingTop: 80, paddingBottom: 120 }}>

        {/* ── Article hero ── */}
        <header style={{
          padding: 'clamp(48px,8vw,96px) clamp(16px,2vw,32px) clamp(40px,6vw,72px)',
          position: 'relative', overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          {/* Ambient glow */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '80vw', height: '100%',
            background: `radial-gradient(ellipse at top, rgba(${cat.accentRgb},0.06) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
              <Link href="/" style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.55rem', fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
              }}>Accueil</Link>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem' }}>/</span>
              <Link href="/blog" style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.55rem', fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
              }}>Blog</Link>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem' }}>/</span>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.55rem', fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: `rgba(${cat.accentRgb},0.7)`,
              }}>{fm.category}</span>
            </div>

            {/* Category pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 13px', marginBottom: 24,
              border: `1px solid rgba(${cat.accentRgb},0.35)`,
              borderRadius: 100, background: `rgba(${cat.accentRgb},0.09)`,
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: cat.accent, boxShadow: `0 0 6px ${cat.accent}`,
              }} />
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.55rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: cat.accent,
              }}>{fm.category}</span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'var(--font-bebas)',
              fontWeight: 400,
              fontSize: 'clamp(2.2rem,5.5vw,4.2rem)',
              lineHeight: 0.95, letterSpacing: '0.03em',
              color: '#fff', margin: '0 0 clamp(16px,2.5vw,28px)',
            }}>{fm.title}</h1>

            {/* Description */}
            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: 'clamp(0.9rem,1.3vw,1.05rem)',
              lineHeight: 1.75, color: 'rgba(255,255,255,0.48)',
              margin: '0 0 clamp(24px,3.5vw,36px)',
            }}>{fm.description}</p>

            {/* Meta row */}
            <div style={{
              display: 'flex', alignItems: 'center',
              flexWrap: 'wrap', gap: 20,
              paddingTop: 20,
              borderTop: `1px solid rgba(${cat.accentRgb},0.15)`,
              marginBottom: fm.thumbnail ? 'clamp(32px,5vw,52px)' : 0,
            }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.58rem', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
              }}>{fm.author}</span>
              <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.58rem', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
              }}>{formatDate(fm.date)}</span>
              <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.58rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: cat.accent,
              }}>{fm.readTime} de lecture</span>
              {fm.updatedDate && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.58rem', fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                  }}>Mis à jour le {formatDate(fm.updatedDate)}</span>
                </>
              )}
            </div>

            {/* Cover thumbnail */}
            {fm.thumbnail && (
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: 16,
                overflow: 'hidden',
                border: `1px solid rgba(${cat.accentRgb},0.18)`,
                boxShadow: `0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)`,
              }}>
                <Image
                  src={fm.thumbnail}
                  alt={fm.title}
                  fill
                  sizes="(max-width:900px) 100vw, 780px"
                  style={{ objectFit: 'cover' }}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA[fm.thumbnail] ?? BLUR_DATA[Object.keys(BLUR_DATA)[0]]}
                  priority
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(to bottom, transparent 60%, rgba(1,4,16,0.4) 100%)`,
                }} />
              </div>
            )}
          </div>
        </header>

        {/* ── Content + ToC layout ── */}
        <div style={{
          maxWidth: 1300, margin: '0 auto',
          padding: 'clamp(40px,6vw,72px) clamp(16px,2vw,32px)',
          display: 'grid',
          gridTemplateColumns: '1fr clamp(200px,22%,260px)',
          gap: 'clamp(32px,5vw,80px)',
          alignItems: 'start',
        }}
        className="blog-content-grid"
        >
          {/* Article body */}
          <article className="article-prose">
            {content}
            <ClusterLinks currentSlug={params.slug} articles={clusterArticles} />
            <NextReading articles={nextReading} />
          </article>

          {/* Sidebar */}
          <aside className="blog-toc-sidebar">
            <TableOfContents headings={headings} />
          </aside>
        </div>

        {/* ── Articles similaires ── */}
        {related.length > 0 && (
          <div style={{
            maxWidth: 1300, margin: '0 auto',
            padding: '0 clamp(16px,2vw,32px) clamp(48px,7vw,80px)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              marginBottom: 32,
            }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.58rem', fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)',
                whiteSpace: 'nowrap',
              }}>Articles similaires</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px,100%), 1fr))',
              gap: 'clamp(14px,2.5vw,26px)',
            }}>
              {related.map(rpost => {
                const rcat = CATEGORY_COLORS[rpost.category] ?? CATEGORY_COLORS.Visa;
                return (
                  <Link
                    key={rpost.slug}
                    href={`/blog/${rpost.slug}`}
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
                  >
                    <article
                      className="blog-card"
                      style={{
                        '--accent-rgb': rcat.accentRgb,
                        flex: 1, display: 'flex', flexDirection: 'column',
                        padding: 'clamp(24px,3.5vw,36px)',
                        background: `linear-gradient(160deg, rgba(${rcat.accentRgb},0.07) 0%, rgba(1,4,16,0.97) 60%)`,
                        borderWidth: 1, borderStyle: 'solid',
                        borderColor: `rgba(${rcat.accentRgb},0.18)`,
                        borderRadius: 22,
                        backdropFilter: 'blur(18px)',
                        WebkitBackdropFilter: 'blur(18px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        position: 'relative', overflow: 'hidden',
                      } as React.CSSProperties}
                    >
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                        background: `linear-gradient(90deg, transparent, ${rcat.accent}, transparent)`,
                      }} />

                      <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', gap: 10,
                        marginBottom: 18,
                      }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '4px 10px',
                          border: `1px solid rgba(${rcat.accentRgb},0.3)`,
                          borderRadius: 100,
                          background: `rgba(${rcat.accentRgb},0.08)`,
                        }}>
                          <div style={{
                            width: 4, height: 4, borderRadius: '50%',
                            background: rcat.accent, flexShrink: 0,
                          }} />
                          <span style={{
                            fontFamily: 'var(--font-montserrat)',
                            fontSize: '0.5rem', fontWeight: 700,
                            letterSpacing: '0.16em', textTransform: 'uppercase',
                            color: rcat.accent,
                          }}>{rpost.category}</span>
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-montserrat)',
                          fontSize: '0.5rem', fontWeight: 600,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.25)',
                        }}>{rpost.readTime} de lecture</span>
                      </div>

                      <h2 style={{
                        fontFamily: 'var(--font-bebas)',
                        fontWeight: 400,
                        fontSize: 'clamp(1.5rem,2.5vw,2rem)',
                        lineHeight: 1.0, letterSpacing: '0.03em',
                        color: '#fff',
                        margin: '0 0 12px',
                      }}>{rpost.title}</h2>

                      <p style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 300, fontSize: '0.875rem',
                        lineHeight: 1.72, color: 'rgba(255,255,255,0.42)',
                        margin: '0 0 auto', paddingBottom: 20,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      } as React.CSSProperties}>{rpost.excerpt}</p>

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
                        }}>{formatDate(rpost.date)}</span>
                        <span style={{
                          fontFamily: 'var(--font-montserrat)',
                          fontSize: '0.58rem', fontWeight: 700,
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                          color: rcat.accent,
                        }}>Lire l&apos;article →</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── End-of-article CTA ── */}
        <div style={{
          maxWidth: 900, margin: '0 auto',
          padding: '0 clamp(16px,2vw,32px) clamp(40px,6vw,72px)',
        }}>
          <WaitlistCTA />

          {/* Back to blog */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/blog" style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)', textDecoration: 'none',
            }}>
              ← Tous les articles
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
