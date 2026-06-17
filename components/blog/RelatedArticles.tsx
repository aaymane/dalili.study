// Server-safe — no hooks, no 'use client' needed

export interface RelatedArticle {
  slug: string;
  title: string;
}

export default function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div
      className="articles-lies"
      style={{
        margin: '2.5em 0',
        padding: 'clamp(20px,3vw,28px) clamp(20px,3vw,28px)',
        background: 'rgba(1,77,248,0.05)',
        border: '1px solid rgba(1,77,248,0.18)',
        borderRadius: 14,
      }}
    >
      <p style={{
        fontFamily: 'var(--font-montserrat)',
        fontSize: '0.58rem',
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(77,143,255,0.7)',
        margin: '0 0 14px',
      }}>
        Tu pourrais aussi avoir besoin de…
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {articles.map(({ slug, title }) => (
          <a
            key={slug}
            href={`/blog/${slug}`}
            className="articles-lies-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.92rem',
              fontWeight: 400,
              lineHeight: 1.45,
              color: 'rgba(255,255,255,0.78)',
              textDecoration: 'none',
              transition: 'color 0.18s',
            }}
          >
            <span style={{
              color: '#014DF8',
              fontWeight: 700,
              fontSize: '1rem',
              flexShrink: 0,
              lineHeight: 1,
            }}>→</span>
            {title}
          </a>
        ))}
      </div>

      <style>{`
        .articles-lies-link:hover { color: #fff !important; }
        .articles-lies-link:hover span { color: #4d8fff !important; }
      `}</style>
    </div>
  );
}
