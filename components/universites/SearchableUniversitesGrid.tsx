'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { University } from '@/lib/universities';
import { BLUR_DATA } from '@/lib/blur-data';

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const ACCENT = { rgb: '77,143,255', hex: '#4d8fff' };

interface Props {
  unis: University[];
}

export default function SearchableUniversitesGrid({ unis }: Props) {
  const [query, setQuery] = useState('');
  const q = normalize(query.trim());

  const filtered = useMemo(() => {
    if (!q) return unis;
    return unis.filter(u =>
      normalize(u.name).includes(q)
      || normalize(u.city).includes(q)
      || normalize(u.region).includes(q)
      || normalize(u.type).includes(q)
      || u.popularPrograms.some(p => normalize(p).includes(q))
    );
  }, [unis, q]);

  return (
    <>
      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: 'clamp(20px,3vw,36px)' }}>
        <div style={{
          position: 'relative', display: 'flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid rgba(${ACCENT.rgb},0.22)`,
          borderRadius: 14, overflow: 'hidden',
          boxShadow: query ? `0 0 0 3px rgba(${ACCENT.rgb},0.12)` : 'none',
        }}>
          <svg style={{ position: 'absolute', left: 18, flexShrink: 0, opacity: 0.45, color: ACCENT.hex }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher une université… ex: bordeaux, médecine, paris"
            style={{
              width: '100%', padding: '14px 48px 14px 50px',
              background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'var(--font-dm-sans)', fontWeight: 400,
              fontSize: 'clamp(0.875rem,1.2vw,1rem)',
              color: '#fff', caretColor: ACCENT.hex,
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 14, background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.92)', borderRadius: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {q && (
        <p style={{
          fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: filtered.length > 0 ? `rgba(${ACCENT.rgb},0.8)` : 'rgba(239,68,68,0.7)',
          marginBottom: 24,
        }}>
          {filtered.length > 0
            ? `${filtered.length} université${filtered.length > 1 ? 's' : ''} pour "${query}"`
            : `Aucun résultat pour "${query}"`}
        </p>
      )}

      {filtered.length > 0 ? (
        <div className="blog-index-grid">
          {filtered.map((uni, idx) => (
            <Link key={uni.slug} href={`/universites/${uni.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
              <article className="blog-card" style={{
                '--accent-rgb': ACCENT.rgb,
                flex: 1, display: 'flex', flexDirection: 'column',
                background: `linear-gradient(160deg, rgba(${ACCENT.rgb},0.07) 0%, rgba(1,4,16,0.97) 60%)`,
                borderWidth: 1, borderStyle: 'solid', borderColor: `rgba(${ACCENT.rgb},0.18)`,
                borderRadius: 22, backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                position: 'relative', overflow: 'hidden',
              } as React.CSSProperties}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${ACCENT.hex}, transparent)`, zIndex: 1 }} />
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
                  <Image src={uni.thumbnail} alt={uni.name} fill sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw" style={{ objectFit: 'cover' }} placeholder="blur" blurDataURL={BLUR_DATA[uni.thumbnail]} priority={idx < 3} loading={idx < 3 ? 'eager' : 'lazy'} />
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 50%, rgba(1,4,16,0.75) 100%)` }} />
                </div>
                <div style={{ padding: 'clamp(20px,3vw,28px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: `1px solid rgba(${ACCENT.rgb},0.3)`, borderRadius: 100, background: `rgba(${ACCENT.rgb},0.08)` }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: ACCENT.hex, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT.hex }}>{uni.city}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.78)' }}>{uni.type}</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.5rem,2.5vw,2rem)', lineHeight: 1.0, letterSpacing: '0.03em', color: '#fff', margin: '0 0 10px' }}>{uni.name}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 'auto', paddingBottom: 16 }}>
                    {[
                      { label: 'Étudiants', value: `${(uni.students / 1000).toFixed(0)}k` },
                      { label: 'Internationaux', value: `${(uni.internationalStudents / 1000).toFixed(1)}k` },
                      { label: 'Budget min.', value: `${uni.monthlyBudgetMin}€/mois` },
                      { label: 'CROUS', value: uni.costCrous.split('–')[0].trim() },
                    ].map(stat => (
                      <div key={stat.label} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.44rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)', marginBottom: 3 }}>{stat.label}</div>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: '0.82rem', color: '#fff' }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)' }}>
                      {(uni.internationalStudents / uni.students * 100).toFixed(0)}% étrangers
                    </span>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT.hex }}>Voir le guide →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : q ? (
        <div style={{ textAlign: 'center', padding: 'clamp(48px,8vw,96px) 0' }}>
          <p style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'rgba(255,255,255,0.92)', letterSpacing: '0.06em', margin: '0 0 12px' }}>AUCUNE UNIVERSITÉ</p>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Essaie — bordeaux, paris, lyon, nantes, médecine, droit…</p>
        </div>
      ) : null}
    </>
  );
}
