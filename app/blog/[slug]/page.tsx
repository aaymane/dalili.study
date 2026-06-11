import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { getAllPosts, getRawPost, extractHeadings, CATEGORY_COLORS, formatDate } from '@/lib/blog';
import mdxComponents, { Callout } from '@/components/blog/MdxComponents';
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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili-waitlist.vercel.app';
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
        authors: [fm.author],
        url: `${siteUrl}/blog/${params.slug}`,
        ...(fm.ogImage ? { images: [{ url: `${siteUrl}${fm.ogImage}`, width: 1200, height: 630 }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: fm.title,
        description: fm.description,
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

  // MdxComponents.jsx infers each component's parameter type from destructuring,
  // making optional HTML attributes (children, id, href) appear required.
  // The runtime types are correct — cast to suppress the false TS error.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const components = { ...mdxComponents, Callout } as any;

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili-waitlist.vercel.app';
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.description,
    datePublished: fm.date,
    dateModified: fm.date,
    author: { '@type': 'Organization', name: 'Dalili', url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: 'Dalili',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/dalili-logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${params.slug}` },
    ...(fm.ogImage ? { image: `${siteUrl}${fm.ogImage}` } : {}),
  };

  return (
    <>
      {/* JSON-LD Article schema — server-rendered for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Reading progress bar (client) */}
      <ReadingProgressBar />

      <main style={{ paddingTop: 80, paddingBottom: 120 }}>

        {/* ── Article hero ── */}
        <header style={{
          padding: 'clamp(48px,8vw,96px) clamp(16px,5vw,80px) clamp(40px,6vw,72px)',
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

          <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative' }}>
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
            </div>
          </div>
        </header>

        {/* ── Content + ToC layout ── */}
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: 'clamp(40px,6vw,72px) clamp(16px,5vw,80px)',
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
          </article>

          {/* Sidebar */}
          <aside className="blog-toc-sidebar">
            <TableOfContents headings={headings} />
          </aside>
        </div>

        {/* ── End-of-article CTA ── */}
        <div style={{
          maxWidth: 780, margin: '0 auto',
          padding: '0 clamp(16px,5vw,80px) clamp(40px,6vw,72px)',
        }}>
          <div style={{
            padding: 'clamp(28px,5vw,48px)',
            background: 'linear-gradient(145deg, rgba(1,77,248,0.1) 0%, rgba(1,4,16,0.96) 100%)',
            borderWidth: 1, borderStyle: 'solid',
            borderColor: 'rgba(1,77,248,0.25)',
            borderRadius: 22,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 0 40px rgba(1,77,248,0.08), 0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative', overflow: 'hidden',
            textAlign: 'center',
          }}>
            <div aria-hidden="true" style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(1,77,248,0.7), rgba(77,143,255,0.9), rgba(1,77,248,0.7), transparent)',
            }} />

            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🇫🇷</div>

            <h2 style={{
              fontFamily: 'var(--font-bebas)',
              fontWeight: 400,
              fontSize: 'clamp(1.8rem,4vw,3rem)',
              lineHeight: 0.95, letterSpacing: '0.04em',
              color: '#fff', margin: '0 0 12px',
            }}>
              DALILI T&apos;ACCOMPAGNE<br />
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>À CHAQUE ÉTAPE.</span>
            </h2>

            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: 'clamp(0.85rem,1.2vw,0.97rem)',
              lineHeight: 1.75, color: 'rgba(255,255,255,0.45)',
              maxWidth: 440, margin: '0 auto clamp(24px,3vw,32px)',
            }}>
              Visa, logement, banque, CAF — Dalili guide les étudiants internationaux
              pas à pas dans leurs démarches en France.
            </p>

            <Link
              href="/#main-content"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: 'clamp(12px,2vw,16px) clamp(24px,4vw,36px)',
                background: '#014DF8',
                borderRadius: 100,
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#fff', textDecoration: 'none',
                boxShadow: '0 0 24px rgba(1,77,248,0.5), 0 8px 32px rgba(0,0,0,0.3)',
                transition: 'box-shadow 0.25s, transform 0.25s',
              }}
            >
              Rejoindre la waitlist Dalili →
            </Link>
          </div>

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
