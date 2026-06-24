'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PostMeta } from '@/lib/blog-client';
import { CATEGORY_COLORS, CLUSTER_DEFINITIONS, formatDate } from '@/lib/blog-client';
import { BLUR_DATA } from '@/lib/blur-data';

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: 'relative', marginBottom: 'clamp(20px,3vw,36px)' }}>
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(1,77,248,0.22)',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: value ? '0 0 0 3px rgba(1,77,248,0.12)' : 'none',
      }}>
        <svg style={{ position: 'absolute', left: 18, flexShrink: 0, opacity: 0.45 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Rechercher un guide… ex: sénégal, visa, logement"
          style={{
            width: '100%',
            padding: '14px 48px 14px 50px',
            background: 'transparent',
            border: 'none', outline: 'none',
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 400,
            fontSize: 'clamp(0.875rem,1.2vw,1rem)',
            color: '#fff',
            caretColor: '#014DF8',
          }}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            style={{
              position: 'absolute', right: 14,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, display: 'flex', alignItems: 'center',
              color: 'rgba(255,255,255,0.88)',
              borderRadius: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

interface Props {
  posts: PostMeta[];
  featured: PostMeta[];
  clusterKeys: string[];
}

export default function SearchableBlogGrid({ posts, featured, clusterKeys }: Props) {
  const [query, setQuery] = useState('');
  const q = normalize(query.trim());

  const filtered = useMemo(() => {
    if (!q) return posts;
    return posts.filter(p => {
      const clusterLabel = p.cluster ? (CLUSTER_DEFINITIONS[p.cluster]?.label ?? '') : '';
      return normalize(p.title).includes(q)
        || normalize(p.excerpt).includes(q)
        || normalize(p.category).includes(q)
        || normalize(clusterLabel).includes(q)
        || (p.cluster ? normalize(p.cluster).includes(q) : false);
    });
  }, [posts, q]);

  const showFeatured = !q && featured.length > 0;
  const showClusterNav = !q;

  return (
    <>
      <SearchInput value={query} onChange={setQuery} />

      {/* Cluster navigation — hidden during search */}
      {showClusterNav && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 'clamp(20px,4vw,40px)' }}>
          {clusterKeys.map(key => {
            const def = CLUSTER_DEFINITIONS[key];
            return (
              <a key={key} href={`#cluster-${key}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '6px 16px',
                border: `1px solid rgba(${def.accentRgb},0.28)`,
                borderRadius: 100,
                background: `rgba(${def.accentRgb},0.07)`,
                textDecoration: 'none',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.52rem', fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: def.color,
              }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: def.color, boxShadow: `0 0 6px ${def.color}`, flexShrink: 0 }} />
                {def.label}
              </a>
            );
          })}
        </div>
      )}

      {/* Search result count */}
      {q && (
        <p style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '0.6rem', fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: filtered.length > 0 ? 'rgba(77,143,255,0.7)' : 'rgba(239,68,68,0.7)',
          marginBottom: 24,
        }}>
          {filtered.length > 0
            ? `${filtered.length} résultat${filtered.length > 1 ? 's' : ''} pour "${query}"`
            : `Aucun résultat pour "${query}"`}
        </p>
      )}

      {/* Featured — hidden during search */}
      {showFeatured && (
        <div style={{ marginBottom: 'clamp(24px,4vw,48px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap' }}>Guides essentiels</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px,100%), 1fr))', gap: 'clamp(14px,2vw,22px)' }}>
            {featured.map(post => {
              const cat = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.Visa;
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                  <article style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    padding: 'clamp(24px,3.5vw,36px)',
                    background: `linear-gradient(160deg, rgba(${cat.accentRgb},0.1) 0%, rgba(1,4,16,0.97) 60%)`,
                    border: `1px solid rgba(${cat.accentRgb},0.25)`,
                    borderRadius: 22, position: 'relative', overflow: 'hidden',
                    boxShadow: `0 0 40px rgba(${cat.accentRgb},0.05)`,
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${cat.accent}, transparent)` }} />
                    {post.thumbnail && (
                      <div style={{ position: 'relative', width: 'calc(100% + clamp(48px,7vw,72px))', marginLeft: 'calc(-1 * clamp(24px,3.5vw,36px))', marginTop: 'calc(-1 * clamp(24px,3.5vw,36px))', marginBottom: 20, aspectRatio: '16/9', overflow: 'hidden' }}>
                        <Image src={post.thumbnail} alt={post.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 480px" style={{ objectFit: 'cover' }} placeholder="blur" blurDataURL={BLUR_DATA[post.thumbnail] ?? BLUR_DATA[Object.keys(BLUR_DATA)[0]]} priority />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 55%, rgba(1,4,16,0.85) 100%)` }} />
                      </div>
                    )}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', marginBottom: 16, border: `1px solid rgba(${cat.accentRgb},0.35)`, borderRadius: 100, background: `rgba(${cat.accentRgb},0.09)`, alignSelf: 'flex-start' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: cat.accent }} />
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: cat.accent }}>Guide essentiel</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.6rem,2.8vw,2.2rem)', lineHeight: 1.0, letterSpacing: '0.03em', color: '#fff', margin: '0 0 12px' }}>{post.title}</h2>
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.72, color: 'rgba(255,255,255,0.85)', margin: '0 0 auto', paddingBottom: 20 }}>{post.excerpt}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)' }}>{post.readTime} de lecture</span>
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: cat.accent }}>Lire →</span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main grid */}
      {filtered.length > 0 ? (
        <div className="blog-index-grid">
          {filtered.map((post, idx) => {
            const cat = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.Visa;
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                <article className="blog-card" style={{
                  '--accent-rgb': cat.accentRgb,
                  flex: 1, display: 'flex', flexDirection: 'column',
                  padding: 'clamp(24px,3.5vw,36px)',
                  background: `linear-gradient(160deg, rgba(${cat.accentRgb},0.07) 0%, rgba(1,4,16,0.97) 60%)`,
                  borderWidth: 1, borderStyle: 'solid', borderColor: `rgba(${cat.accentRgb},0.18)`,
                  borderRadius: 22, backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  position: 'relative', overflow: 'hidden',
                } as React.CSSProperties}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${cat.accent}, transparent)` }} />
                  {post.thumbnail && (
                    <div style={{ position: 'relative', width: 'calc(100% + clamp(48px,7vw,72px))', marginLeft: 'calc(-1 * clamp(24px,3.5vw,36px))', marginTop: 'calc(-1 * clamp(24px,3.5vw,36px))', marginBottom: 20, aspectRatio: '16/9', overflow: 'hidden' }}>
                      <Image src={post.thumbnail} alt={post.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 400px" style={{ objectFit: 'cover' }} placeholder="blur" blurDataURL={BLUR_DATA[post.thumbnail] ?? BLUR_DATA[Object.keys(BLUR_DATA)[0]]} priority={idx < 3} loading={idx < 3 ? 'eager' : 'lazy'} />
                      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 55%, rgba(1,4,16,0.85) 100%)` }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: `1px solid rgba(${cat.accentRgb},0.3)`, borderRadius: 100, background: `rgba(${cat.accentRgb},0.08)` }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: cat.accent, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: cat.accent }}>{post.category}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)' }}>{post.readTime} de lecture</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.5rem,2.5vw,2rem)', lineHeight: 1.0, letterSpacing: '0.03em', color: '#fff', margin: '0 0 12px' }}>{post.title}</h2>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.72, color: 'rgba(255,255,255,0.92)', margin: '0 0 auto', paddingBottom: 20, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{post.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)' }}>{formatDate(post.date)}</span>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: cat.accent }}>Lire l&apos;article →</span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : q ? (
        <div style={{ textAlign: 'center', padding: 'clamp(48px,8vw,96px) 0' }}>
          <p style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'rgba(255,255,255,0.92)', letterSpacing: '0.06em', margin: '0 0 12px' }}>AUCUN RÉSULTAT</p>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.92)', margin: 0 }}>Essaie un autre mot-clé — visa, logement, caf, maroc, algérie…</p>
        </div>
      ) : null}
    </>
  );
}
