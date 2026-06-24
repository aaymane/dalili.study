'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { CITIES } from '@/lib/cities';
import { getScores, recommander, totalScore } from '@/lib/comparer-scores';
import type { CityScores } from '@/lib/comparer-scores';

// ── Config ───────────────────────────────────────────────────────────────

const VILLE_COLORS = ['#014DF8', '#22C55E', '#a855f7'] as const;

const CITY_LIST = [
  { slug: 'etudier-a-paris',            region: 'Île-de-France' },
  { slug: 'etudier-a-lyon',             region: 'Auvergne-Rhône-Alpes' },
  { slug: 'etudier-a-toulouse',         region: 'Occitanie' },
  { slug: 'etudier-a-marseille',        region: 'PACA' },
  { slug: 'etudier-a-bordeaux',         region: 'Nouvelle-Aquitaine' },
  { slug: 'etudier-a-montpellier',      region: 'Occitanie' },
  { slug: 'etudier-a-strasbourg',       region: 'Grand Est' },
  { slug: 'etudier-a-lille',            region: 'Hauts-de-France' },
  { slug: 'etudier-a-rennes',           region: 'Bretagne' },
  { slug: 'etudier-a-nantes',           region: 'Pays de la Loire' },
  { slug: 'etudier-a-grenoble',         region: 'Auvergne-Rhône-Alpes' },
  { slug: 'etudier-a-nice',             region: 'PACA' },
  { slug: 'etudier-a-clermont-ferrand', region: 'Auvergne' },
  { slug: 'etudier-a-dijon',            region: 'Bourgogne' },
];

const SCORE_LABELS: Array<{ key: keyof CityScores; label: string; desc: string }> = [
  { key: 'budget',     label: 'Budget',             desc: 'Budget mensuel accessible' },
  { key: 'emploi',     label: 'Emploi / Stage',     desc: 'Opportunités d\'emploi et de stage' },
  { key: 'communaute', label: 'Communauté',          desc: 'Présence maghrébine & africaine' },
  { key: 'meteo',      label: 'Qualité de vie',      desc: 'Climat, cadre de vie, loisirs' },
  { key: 'transport',  label: 'Transport',            desc: 'Réseau de transports en commun' },
];

// ── SVG icons ────────────────────────────────────────────────────────────

function IconCheck({ color = '#22C55E', size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconWarning({ color = '#f59e0b', size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconTrophy({ color = '#f59e0b', size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="8 6 8 2 16 2 16 6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
      <path d="M8 6H4a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4h2" />
      <path d="M16 6h4a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4h-2" />
      <rect x="6" y="6" width="12" height="8" rx="1" />
    </svg>
  );
}

function IconShare({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function IconEmail({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconDownload({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// ── Stars component ───────────────────────────────────────────────────────

function Stars({ score, color, size = 14 }: { score: number; color: string; size?: number }) {
  const full  = Math.floor(score);
  const half  = score % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {Array(full).fill(0).map((_, i) => (
        <svg key={`f${i}`} width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      {half && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )}
      {Array(empty).fill(0).map((_, i) => (
        <svg key={`e${i}`} width={size} height={size} viewBox="0 0 24 24" fill="#1e2d4a" stroke="none" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function ComparateurVilles({ initialSlugs = [] }: { initialSlugs?: string[] }) {
  const [selected, setSelected]  = useState<string[]>(initialSlugs);
  const [showing,  setShowing]   = useState(initialSlugs.length >= 2);
  const [email,    setEmail]     = useState('');
  const [sending,  setSending]   = useState(false);
  const [sent,     setSent]      = useState(false);
  const [copied,   setCopied]    = useState(false);
  const [, start] = useTransition();

  // Sync URL param
  useEffect(() => {
    if (selected.length === 0) return;
    const slugNames = selected.map(s => CITIES[s]?.name.toLowerCase().replace(/\s+/g, '-') ?? s);
    const url = new URL(window.location.href);
    url.searchParams.set('villes', slugNames.join(','));
    window.history.replaceState({}, '', url.toString());
  }, [selected]);

  function toggleCity(slug: string) {
    setSelected(prev => {
      if (prev.includes(slug)) return prev.filter(s => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
    setShowing(false);
  }

  function handleCompare() {
    if (selected.length < 2) return;
    start(() => setShowing(true));
    setTimeout(() => {
      document.getElementById('comparer-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@') || sending) return;
    setSending(true);
    try {
      const payload = { email, villes: selected };
      console.log('[Comparer] Envoi payload:', JSON.stringify(payload));
      const response = await fetch('/api/comparer', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await response.json();
      console.log('🔵 Réponse API comparer:', JSON.stringify(data));
      if (response.ok && data.ok) {
        setSent(true);
      } else {
        console.error('[Comparer] Erreur API:', data);
        alert('Erreur envoi email: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('[Comparer] Fetch error:', error);
      alert('Erreur réseau: ' + error);
    } finally {
      setSending(false);
    }
  }

  async function handleShare() {
    const url = window.location.href;
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const selectedCities = selected.map(slug => ({ slug, city: CITIES[slug], scores: getScores(slug) })).filter(x => x.city);
  const recoSlug       = showing ? recommander(selected) : '';
  const recoCity       = CITIES[recoSlug];

  function buildRecoText(): string {
    if (!recoCity) return '';
    const scores  = getScores(recoSlug);
    const reasons: string[] = [];
    if (scores.budget >= 4)     reasons.push('excellent rapport qualité/coût');
    if (scores.emploi >= 4.5)   reasons.push('opportunités de stages et d\'emploi exceptionnelles');
    if (scores.meteo >= 4.5)    reasons.push('qualité de vie et climat remarquables');
    if (scores.communaute >= 4.5) reasons.push('communauté maghrébine bien intégrée');
    const others = selected.filter(s => s !== recoSlug).map(s => CITIES[s]?.name).filter(Boolean).join(' et ');
    const reasonStr = reasons.slice(0, 2).join(' et ') || 'son équilibre global';
    return `${others ? `Parmi ${others} et ${recoCity.name}` : recoCity.name}, nous recommandons ${recoCity.name} pour son ${reasonStr}. Budget estimé : ${recoCity.monthlyBudgetMin}–${recoCity.monthlyBudgetMax} €/mois.`;
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          .cv-cols-grid { grid-template-columns: 1fr !important; }
          .cv-email-form { flex-direction: column !important; }
          .cv-email-form input, .cv-email-form button { width: 100% !important; min-width: 0 !important; }
          .cv-reco-btns { flex-direction: column !important; }
          .cv-reco-btns a { text-align: center; justify-content: center; }
        }
      `}</style>

      {/* ── City selection ─────────────────────────────────────────────── */}
      <div style={{
        background:   'rgba(255,255,255,0.025)',
        border:       '1px solid rgba(255,255,255,0.07)',
        borderRadius:  20,
        padding:      'clamp(24px,4vw,40px)',
        marginBottom:  showing ? 'clamp(32px,4vw,48px)' : 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              Sélectionne tes villes
            </p>
            <p style={{ margin: 0, fontFamily: 'var(--font-dm-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
              {selected.length === 0 ? 'Choisis 2 ou 3 villes pour comparer' : `${selected.length} / 3 ville${selected.length > 1 ? 's' : ''} sélectionnée${selected.length > 1 ? 's' : ''}`}
            </p>
          </div>
          {selected.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selectedCities.map((item, i) => (
                <span key={item.slug} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px',
                  background: `${VILLE_COLORS[i]}18`,
                  border: `1px solid ${VILLE_COLORS[i]}44`,
                  borderRadius: 100,
                  fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', fontWeight: 700, color: '#fff',
                }}>
                  {item.city?.name}
                  <button onClick={() => toggleCity(item.slug)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(255,255,255,0.5)', lineHeight: 1, fontSize: 14 }} aria-label="Retirer">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginBottom: 28 }}>
          {CITY_LIST.map(({ slug, region }) => {
            const city    = CITIES[slug];
            const idx     = selected.indexOf(slug);
            const isOn    = idx >= 0;
            const disabled = !isOn && selected.length >= 3;
            const color   = isOn ? VILLE_COLORS[idx] : undefined;
            return (
              <button
                key={slug}
                onClick={() => !disabled && toggleCity(slug)}
                disabled={disabled}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '12px 14px',
                  background: isOn ? `${color}14` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isOn ? `${color}55` : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 10,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.35 : 1,
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  position: 'relative',
                }}
              >
                {isOn && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 16, height: 16,
                    background: color, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOn ? color : 'rgba(255,255,255,0.3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 6 }} aria-hidden="true">
                  <path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: isOn ? 700 : 600, fontSize: '0.78rem', color: isOn ? '#fff' : 'rgba(255,255,255,0.7)', lineHeight: 1.2 }}>
                  {city?.name}
                </span>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                  {region}
                </span>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button
            onClick={handleCompare}
            disabled={selected.length < 2}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 28px',
              background: selected.length >= 2 ? '#014DF8' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${selected.length >= 2 ? '#014DF8' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 10,
              cursor: selected.length >= 2 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={selected.length >= 2 ? '#fff' : 'rgba(255,255,255,0.25)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.06em', color: selected.length >= 2 ? '#fff' : 'rgba(255,255,255,0.25)' }}>
              {selected.length >= 2
                ? `Comparer ${selectedCities.map(x => x.city?.name).join(' vs ')} →`
                : 'Sélectionne au moins 2 villes'}
            </span>
          </button>

          {showing && (
            <button
              onClick={handleShare}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.72rem' }}
            >
              <IconShare />
              {copied ? 'Lien copié !' : 'Partager'}
            </button>
          )}
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────────────────── */}
      {showing && selectedCities.length >= 2 && (
        <div id="comparer-result" style={{ animation: 'fadeIn 0.5s ease' }}>

          {/* ── Section 1 — Budget & Logement ──────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <SectionHeader label="Budget & Logement" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4d8fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            } />

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, textAlign: 'left', width: '30%' }}> </th>
                    {selectedCities.map((item, i) => (
                      <th key={item.slug} style={{ ...thStyle, background: `${VILLE_COLORS[i]}18`, borderTop: `2px solid ${VILLE_COLORS[i]}` }}>
                        <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>{item.city?.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    { label: 'Chambre CROUS',   getter: (c: typeof CITIES[string]) => c.costCrous        },
                    { label: 'Studio privé',    getter: (c: typeof CITIES[string]) => c.costStudio       },
                    { label: 'Colocation',      getter: (c: typeof CITIES[string]) => c.costColoc        },
                    { label: 'Transport/mois',  getter: (c: typeof CITIES[string]) => c.costTransport    },
                    { label: 'Budget min/mois', getter: (c: typeof CITIES[string]) => c.monthlyBudgetMin },
                    { label: 'Budget max/mois', getter: (c: typeof CITIES[string]) => c.monthlyBudgetMax },
                  ] as const).map((row, ri) => (
                    <tr key={row.label} style={{ background: ri % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', fontWeight: 600 }}>{row.label}</td>
                      {selectedCities.map((item, i) => {
                        const city = item.city;
                        const val  = city ? row.getter(city) : '-';
                        const text = typeof val === 'number' ? `${val} €/mois` : String(val ?? '-');
                        const isBestKey = row.label === 'Budget min/mois';
                        const isBest = isBestKey && city && city.monthlyBudgetMin === Math.min(...selectedCities.map(x => x.city?.monthlyBudgetMin ?? Infinity));
                        return (
                          <td key={item.slug} style={{ ...tdStyle, fontWeight: isBest ? 700 : 400, color: isBest ? VILLE_COLORS[i] : 'rgba(255,255,255,0.78)', position: 'relative' }}>
                            {text}
                            {isBest && <span style={{ marginLeft: 6, fontSize: '0.6rem', color: '#22C55E', fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.08em' }}>MEILLEUR</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Section 2 — Universités ────────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <SectionHeader label="Universités présentes" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4d8fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            } />
            <div className="cv-cols-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedCities.length}, 1fr)`, gap: 12 }}>
              {selectedCities.map((item, i) => (
                <div key={item.slug} style={{
                  padding: 20,
                  background: `${VILLE_COLORS[i]}08`,
                  border: `1px solid ${VILLE_COLORS[i]}22`,
                  borderRadius: 12,
                }}>
                  <p style={{ margin: '0 0 14px', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: VILLE_COLORS[i] }}>
                    {item.city?.name}
                  </p>
                  {item.city?.universities.map(u => (
                    <div key={u.slug} style={{ marginBottom: 8 }}>
                      <Link
                        href={`/universites/${u.slug}`}
                        style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)', textDecoration: 'none', lineHeight: 1.5 }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; }}
                      >
                        {u.name}
                        <span style={{ color: 'rgba(255,255,255,0.65)', marginLeft: 4, fontSize: '0.65rem' }}>→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 3 — Scores DALILI ──────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <SectionHeader label="Scores DALILI" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4d8fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            } />
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, textAlign: 'left', width: '30%' }}> </th>
                    {selectedCities.map((item, i) => (
                      <th key={item.slug} style={{ ...thStyle, background: `${VILLE_COLORS[i]}18`, borderTop: `2px solid ${VILLE_COLORS[i]}` }}>
                        <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>{item.city?.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SCORE_LABELS.map(({ key, label, desc }, ri) => (
                    <tr key={key} style={{ background: ri % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                      <td style={{ ...tdStyle }}>
                        <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', display: 'block' }}>{label}</span>
                        <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>{desc}</span>
                      </td>
                      {selectedCities.map((item, i) => {
                        const score   = item.scores[key];
                        const isBest  = score === Math.max(...selectedCities.map(x => x.scores[key]));
                        return (
                          <td key={item.slug} style={{ ...tdStyle }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <Stars score={score} color={VILLE_COLORS[i]} size={13} />
                              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.65rem', color: isBest ? VILLE_COLORS[i] : 'rgba(255,255,255,0.4)' }}>
                                {score}/5{isBest && selectedCities.length > 1 ? ' ★' : ''}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr style={{ background: 'rgba(1,77,248,0.06)' }}>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.72rem', color: '#fff' }}>Score total</td>
                    {selectedCities.map((item, i) => {
                      const total   = totalScore(item.scores);
                      const isBest  = total === Math.max(...selectedCities.map(x => totalScore(x.scores)));
                      return (
                        <td key={item.slug} style={{ ...tdStyle }}>
                          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.88rem', color: isBest ? VILLE_COLORS[i] : 'rgba(255,255,255,0.6)' }}>
                            {total.toFixed(1)}/25
                          </span>
                          {isBest && selectedCities.length > 1 && (
                            <span style={{ marginLeft: 6, fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', fontWeight: 700, color: '#22C55E', letterSpacing: '0.1em' }}>MEILLEUR</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Section 4 — Avantages & Inconvénients ──────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <SectionHeader label="Avantages & Inconvénients" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4d8fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            } />
            <div className="cv-cols-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedCities.length}, 1fr)`, gap: 12 }}>
              {selectedCities.map((item, i) => (
                <div key={item.slug} style={{ padding: 20, background: `${VILLE_COLORS[i]}07`, border: `1px solid ${VILLE_COLORS[i]}20`, borderRadius: 12 }}>
                  <p style={{ margin: '0 0 14px', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: VILLE_COLORS[i] }}>
                    {item.city?.name}
                  </p>
                  {item.city?.pros.map((pro, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <div style={{ paddingTop: 1, flexShrink: 0 }}><IconCheck size={12} /></div>
                      <p style={{ margin: 0, fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{pro}</p>
                    </div>
                  ))}
                  <div style={{ margin: '12px 0 8px', height: 1, background: 'rgba(255,255,255,0.06)' }} />
                  {item.city?.cons.map((con, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <div style={{ paddingTop: 1, flexShrink: 0 }}><IconWarning size={12} /></div>
                      <p style={{ margin: 0, fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{con}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 5 — Avis DALILI ────────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <SectionHeader label="Avis DALILI" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4d8fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            } />
            <div className="cv-cols-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedCities.length}, 1fr)`, gap: 12 }}>
              {selectedCities.map((item, i) => (
                <div key={item.slug} style={{
                  padding: '20px 20px 20px 22px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderLeft: `3px solid ${VILLE_COLORS[i]}`,
                  borderRadius: '0 12px 12px 0',
                }}>
                  <p style={{ margin: '0 0 10px', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: VILLE_COLORS[i] }}>
                    {item.city?.name}
                  </p>
                  <p style={{ margin: 0, fontFamily: 'var(--font-dm-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, fontStyle: 'italic' }}>
                    &ldquo;{item.city?.avis}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 6 — Notre recommandation ───────────────────────── */}
          {recoCity && (
            <div style={{
              padding: 'clamp(24px,4vw,36px)',
              background: 'rgba(245,158,11,0.05)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 16,
              marginBottom: 48,
              animation: 'slideUp 0.5s ease 0.2s both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <IconTrophy />
                <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f59e0b' }}>
                  Notre recommandation
                </span>
              </div>
              <h2 style={{ margin: '0 0 12px', fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '0.04em', color: '#fff' }}>
                {recoCity.name}
              </h2>
              <p style={{ margin: '0 0 20px', fontFamily: 'var(--font-dm-sans)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>
                {buildRecoText()}
              </p>
              <div className="cv-reco-btns" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href={`/villes/${recoCity.slug}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '11px 22px',
                  background: '#f59e0b', color: '#000',
                  borderRadius: 8,
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em',
                  textDecoration: 'none',
                }}>
                  Guide complet {recoCity.name}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
                <Link href="/simulateur" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '11px 22px',
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em',
                  textDecoration: 'none',
                }}>
                  Calculer mon budget →
                </Link>
                <Link href="/calendrier" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '11px 22px',
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em',
                  textDecoration: 'none',
                }}>
                  Calendrier Campus France →
                </Link>
              </div>
            </div>
          )}

          {/* ── Email CTA ───────────────────────────────────────────────── */}
          <div style={{
            padding: 'clamp(24px,4vw,40px)',
            background: 'rgba(1,77,248,0.07)',
            border: '1px solid rgba(1,77,248,0.2)',
            borderRadius: 16,
          }}>
            {!sent ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <IconEmail color="#4d8fff" />
                  <p style={{ margin: 0, fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.2rem,2.5vw,1.7rem)', letterSpacing: '0.04em', color: '#fff' }}>
                    Reçois cette comparaison en PDF
                  </p>
                </div>
                <p style={{ margin: '0 0 24px', fontFamily: 'var(--font-dm-sans)', fontSize: '0.87rem', color: 'rgba(255,255,255,0.5)' }}>
                  Tableau comparatif complet + guides pour {selectedCities.map(x => x.city?.name).join(', ')} — directement dans ta boîte
                </p>
                <form onSubmit={handleEmailSubmit} className="cv-email-form" style={{ display: 'flex', gap: 10, maxWidth: 460, flexWrap: 'wrap' }}>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="ton@email.com" required
                    style={{ flex: 1, minWidth: 200, padding: '13px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontFamily: 'var(--font-dm-sans)', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <button
                    type="submit" disabled={sending}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 22px', background: '#014DF8', border: 'none', borderRadius: 8, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1 }}
                  >
                    <IconDownload />
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.78rem', color: '#fff' }}>
                      {sending ? 'Envoi…' : 'Envoyer le PDF'}
                    </span>
                  </button>
                </form>
              </>
            ) : (
              <div style={{ animation: 'fadeIn 0.4s ease', textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 12px' }} aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-bebas)', fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', letterSpacing: '0.04em', color: '#fff' }}>
                  PDF envoyé sur ta boîte
                </p>
                <p style={{ margin: 0, fontFamily: 'var(--font-dm-sans)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.82)' }}>
                  Vérifie aussi tes spams. Pense à ajouter bonjour@dalili.study à tes contacts.
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────

function SectionHeader({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(77,143,255,0.1)', border: '1px solid rgba(77,143,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <h2 style={{ margin: 0, fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
        {label}
      </h2>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontFamily: 'var(--font-montserrat)',
  fontSize: '0.7rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  textAlign: 'center',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const tdStyle: React.CSSProperties = {
  padding: '11px 16px',
  fontFamily: 'var(--font-dm-sans)',
  fontSize: '0.8rem',
  color: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(255,255,255,0.05)',
  verticalAlign: 'middle',
};
