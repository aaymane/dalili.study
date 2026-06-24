'use client';

import { useState, useTransition } from 'react';
import {
  PAYS_INFO,
  RENTREES,
  genererCalendrier,
  type CalendrierStep,
  type Urgence,
} from '@/lib/calendrier-data';

// ── Professional SVG icons ────────────────────────────────────────────────

function IconAlert({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconClock({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCheckCircle({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconPlane({ color = '#ef4444', size = 12 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

function UrgenceIcon({ urgence, color }: { urgence: Urgence; color: string }) {
  if (urgence === 'rouge')  return <IconAlert color={color} />;
  if (urgence === 'orange') return <IconClock color={color} />;
  return <IconCheckCircle color={color} />;
}

// ── Config ────────────────────────────────────────────────────────────────

const URGENCE_COLOR: Record<Urgence, string> = {
  rouge:  '#ef4444',
  orange: '#f59e0b',
  vert:   '#014DF8',
};

const URGENCE_BG: Record<Urgence, string> = {
  rouge:  'rgba(239,68,68,0.06)',
  orange: 'rgba(245,158,11,0.05)',
  vert:   'rgba(1,77,248,0.06)',
};

const URGENCE_LABEL: Record<Urgence, string> = {
  rouge:  'Urgent',
  orange: 'Important',
  vert:   'Préparation',
};

const PAYS_LIST = [
  { slug: 'maroc',       label: 'Maroc',            emoji: '🇲🇦' },
  { slug: 'algerie',     label: 'Algérie',           emoji: '🇩🇿' },
  { slug: 'tunisie',     label: 'Tunisie',           emoji: '🇹🇳' },
  { slug: 'senegal',     label: 'Sénégal',           emoji: '🇸🇳' },
  { slug: 'cote-ivoire', label: "Côte d'Ivoire",     emoji: '🇨🇮' },
  { slug: 'cameroun',    label: 'Cameroun',          emoji: '🇨🇲' },
  { slug: 'autre',       label: 'Autre pays franc.', emoji: '🌍' },
];

const RENTREE_LIST = [
  { slug: 'septembre-2026', label: 'Septembre 2026', sub: 'Rentrée d\'automne' },
  { slug: 'janvier-2027',   label: 'Janvier 2027',   sub: 'Rentrée d\'hiver' },
  { slug: 'septembre-2027', label: 'Septembre 2027', sub: 'Rentrée d\'automne' },
];

// ── StepCard ──────────────────────────────────────────────────────────────

function StepCard({ step, index }: { step: CalendrierStep; index: number }) {
  const color = URGENCE_COLOR[step.urgence];
  const bg    = URGENCE_BG[step.urgence];

  return (
    <div
      style={{
        position:       'relative',
        background:     bg,
        border:         `1px solid ${color}2a`,
        borderLeft:     `3px solid ${color}`,
        borderRadius:   '0 12px 12px 0',
        padding:        '18px 22px',
        marginBottom:   10,
        animation:      `fadeSlideIn 0.4s ease both`,
        animationDelay: `${index * 55}ms`,
      }}
    >
      {step.isArrivee && (
        <div style={{
          display:     'inline-flex',
          alignItems:  'center',
          gap:          6,
          padding:     '3px 10px',
          background:  'rgba(239,68,68,0.12)',
          border:      '1px solid rgba(239,68,68,0.3)',
          borderRadius: 100,
          marginBottom: 12,
        }}>
          <IconPlane />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#ef4444', fontFamily: 'var(--font-montserrat)' }}>
            Arrivée en France
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <div style={{ paddingTop: 1, flexShrink: 0 }}>
          <UrgenceIcon urgence={step.urgence} color={color} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{
            margin:        '0 0 4px',
            fontFamily:    'var(--font-montserrat)',
            fontSize:      '0.58rem',
            fontWeight:    700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color:          color,
          }}>
            {step.mois}
          </p>
          <h3 style={{ margin: '0 0 7px', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.92rem', color: '#ffffff', lineHeight: 1.3 }}>
            {step.action}
          </h3>
          <p style={{ margin: 0, fontFamily: 'var(--font-dm-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
            {step.description}
          </p>
        </div>
      </div>

      {step.lien && (
        <a
          href={step.lien.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:       'inline-flex',
            alignItems:    'center',
            gap:            5,
            marginTop:     8,
            marginLeft:    24,
            fontFamily:    'var(--font-montserrat)',
            fontWeight:    700,
            fontSize:      '0.58rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:          color === '#014DF8' ? '#4d8fff' : color,
            textDecoration: 'none',
          }}
        >
          {step.lien.label}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function CalendrierOutil() {
  const [pays,    setPays]    = useState('');
  const [rentree, setRentree] = useState('');
  const [steps,   setSteps]   = useState<CalendrierStep[] | null>(null);
  const [email,   setEmail]   = useState('');
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [, start] = useTransition();

  const paysInfo    = pays    ? PAYS_INFO[pays]    : null;
  const rentreeInfo = rentree ? RENTREES[rentree]  : null;
  const canGenerate = pays !== '' && rentree !== '';

  function handleGenerate() {
    if (!canGenerate) return;
    const generated = genererCalendrier(pays, rentree);
    start(() => setSteps(generated));
    setTimeout(() => {
      document.getElementById('calendrier-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@') || sending) return;
    setSending(true);
    try {
      const payload = { email, pays, rentree };
      console.log('[Calendrier] Envoi payload:', JSON.stringify(payload));
      const response = await fetch('/api/calendrier', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await response.json();
      console.log('🔵 Réponse API calendrier:', JSON.stringify(data));
      if (response.ok && data.ok) {
        setSent(true);
      } else {
        console.error('[Calendrier] Erreur API:', data);
        alert('Erreur envoi email: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('[Calendrier] Fetch error:', error);
      alert('Erreur réseau: ' + error);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 640px) {
          .cal-generate-btn { width: 100% !important; justify-content: center !important; }
          .cal-email-form { flex-direction: column !important; }
          .cal-email-form input { width: 100% !important; min-width: 0 !important; }
          .cal-email-form button { width: 100% !important; justify-content: center !important; }
        }
      `}</style>

      {/* ── Question block ──────────────────────────────────────────── */}
      <div style={{
        background:   'rgba(255,255,255,0.025)',
        border:       '1px solid rgba(255,255,255,0.07)',
        borderRadius:  20,
        padding:      'clamp(28px,4vw,48px)',
        marginBottom:  steps ? 'clamp(32px,4vw,48px)' : 0,
      }}>

        {/* Q1 — Pays */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(1,77,248,0.15)', border: '1px solid rgba(1,77,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.52rem', color: '#4d8fff' }}>01</span>
            </div>
            <p style={{ margin: 0, fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
              Ton pays d&apos;origine
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
            {PAYS_LIST.map(p => (
              <button
                key={p.slug}
                onClick={() => setPays(p.slug)}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:           8,
                  padding:      '11px 14px',
                  background:    pays === p.slug ? 'rgba(1,77,248,0.14)' : 'rgba(255,255,255,0.03)',
                  border:       `1px solid ${pays === p.slug ? 'rgba(1,77,248,0.45)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius:  10,
                  cursor:       'pointer',
                  transition:   'all 0.15s ease',
                  textAlign:    'left',
                  width:        '100%',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{p.emoji}</span>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: pays === p.slug ? 700 : 500, fontSize: '0.78rem', color: pays === p.slug ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Q2 — Rentrée */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(1,77,248,0.15)', border: '1px solid rgba(1,77,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.52rem', color: '#4d8fff' }}>02</span>
            </div>
            <p style={{ margin: 0, fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
              Ta rentrée souhaitée
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {RENTREE_LIST.map(r => (
              <button
                key={r.slug}
                onClick={() => setRentree(r.slug)}
                style={{
                  padding:      '12px 20px',
                  background:    rentree === r.slug ? 'rgba(1,77,248,0.14)' : 'rgba(255,255,255,0.03)',
                  border:       `1px solid ${rentree === r.slug ? 'rgba(1,77,248,0.45)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius:  10,
                  cursor:       'pointer',
                  transition:   'all 0.15s ease',
                  textAlign:    'left',
                }}
              >
                <p style={{ margin: '0 0 2px', fontFamily: 'var(--font-montserrat)', fontWeight: rentree === r.slug ? 700 : 600, fontSize: '0.88rem', color: rentree === r.slug ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>
                  {r.label}
                </p>
                <p style={{ margin: 0, fontFamily: 'var(--font-dm-sans)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)' }}>
                  {r.sub}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="cal-generate-btn"
          style={{
            display:     'flex',
            alignItems:  'center',
            gap:          10,
            padding:     '15px 28px',
            background:   canGenerate ? '#014DF8' : 'rgba(255,255,255,0.05)',
            border:      `1px solid ${canGenerate ? '#014DF8' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 10,
            cursor:       canGenerate ? 'pointer' : 'not-allowed',
            transition:  'all 0.2s ease',
            width:       'fit-content',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={canGenerate ? '#fff' : 'rgba(255,255,255,0.25)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.06em', color: canGenerate ? '#ffffff' : 'rgba(255,255,255,0.25)' }}>
            {paysInfo && rentreeInfo
              ? `Générer le calendrier ${paysInfo.emoji} → ${rentreeInfo.label}`
              : 'Générer mon calendrier'}
          </span>
          {canGenerate && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Timeline résultat ──────────────────────────────────────────── */}
      {steps && (
        <div id="calendrier-result" style={{ animation: 'fadeIn 0.5s ease' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 40 }}>{paysInfo?.emoji}</span>
            <div>
              <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4d8fff' }}>
                Ton planning personnalisé
              </p>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '0.04em', color: '#ffffff' }}>
                {paysInfo?.label} → {rentreeInfo?.label}
              </h2>
            </div>

            {/* Légende SVG */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              {(['rouge', 'orange', 'vert'] as Urgence[]).map(u => (
                <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <UrgenceIcon urgence={u} color={URGENCE_COLOR[u]} />
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
                    {URGENCE_LABEL[u]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#014DF8,#4d8fff)', borderRadius: 4 }} />
            </div>
            <p style={{ margin: '7px 0 0', fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
              {steps.length} étapes · {steps[0]?.mois} → {steps[steps.length - 1]?.mois}
            </p>
          </div>

          {/* Cards */}
          <div>
            {steps.map((step, i) => <StepCard key={`${step.mois}-${i}`} step={step} index={i} />)}
          </div>

          {/* Email CTA */}
          <div style={{
            marginTop:   40,
            padding:     'clamp(24px,4vw,40px)',
            background:  'rgba(1,77,248,0.07)',
            border:      '1px solid rgba(1,77,248,0.2)',
            borderRadius: 16,
            textAlign:   'center',
          }}>
            {!sent ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4d8fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <p style={{ margin: 0, fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.2rem,2.5vw,1.7rem)', letterSpacing: '0.04em', color: '#ffffff' }}>
                    Reçois ce calendrier en PDF
                  </p>
                </div>
                <p style={{ margin: '0 0 24px', fontFamily: 'var(--font-dm-sans)', fontSize: '0.87rem', color: 'rgba(255,255,255,0.5)' }}>
                  Ton planning {paysInfo?.label} → {rentreeInfo?.label} avec tous les liens cliquables
                </p>
                <form onSubmit={handleEmailSubmit} className="cal-email-form" style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    required
                    style={{ flex: 1, minWidth: 200, padding: '13px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontFamily: 'var(--font-dm-sans)', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 22px', background: '#014DF8', border: 'none', borderRadius: 8, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.78rem', color: '#fff' }}>
                      {sending ? 'Envoi…' : 'Envoyer le PDF'}
                    </span>
                  </button>
                </form>
              </>
            ) : (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 12px' }} aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-bebas)', fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', letterSpacing: '0.04em', color: '#ffffff' }}>
                  PDF envoyé sur ta boîte
                </p>
                <p style={{ margin: 0, fontFamily: 'var(--font-dm-sans)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
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
