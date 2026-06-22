'use client';

import { useState, useTransition } from 'react';
import {
  PAYS_INFO,
  RENTREES,
  genererCalendrier,
  type CalendrierStep,
  type Urgence,
} from '@/lib/calendrier-data';

const URGENCE_COLOR: Record<Urgence, string> = {
  rouge:  '#ef4444',
  orange: '#f59e0b',
  vert:   '#014DF8',
};

const URGENCE_BG: Record<Urgence, string> = {
  rouge:  'rgba(239,68,68,0.07)',
  orange: 'rgba(245,158,11,0.06)',
  vert:   'rgba(1,77,248,0.06)',
};

const URGENCE_ICON: Record<Urgence, string> = {
  rouge: '🔴', orange: '🟡', vert: '🟢',
};

const PAYS_LIST = [
  { slug: 'maroc',       label: 'Maroc',           emoji: '🇲🇦' },
  { slug: 'algerie',     label: 'Algérie',          emoji: '🇩🇿' },
  { slug: 'tunisie',     label: 'Tunisie',          emoji: '🇹🇳' },
  { slug: 'senegal',     label: 'Sénégal',          emoji: '🇸🇳' },
  { slug: 'cote-ivoire', label: "Côte d'Ivoire",    emoji: '🇨🇮' },
  { slug: 'cameroun',    label: 'Cameroun',         emoji: '🇨🇲' },
  { slug: 'autre',       label: 'Autre pays franc.', emoji: '🌍' },
];

const RENTREE_LIST = [
  { slug: 'septembre-2026', label: 'Septembre 2026' },
  { slug: 'janvier-2027',   label: 'Janvier 2027' },
  { slug: 'septembre-2027', label: 'Septembre 2027' },
];

function StepCard({ step, index }: { step: CalendrierStep; index: number }) {
  const color = URGENCE_COLOR[step.urgence];
  const bg    = URGENCE_BG[step.urgence];
  const icon  = URGENCE_ICON[step.urgence];

  return (
    <div
      style={{
        position:         'relative',
        background:       bg,
        border:           `1px solid ${color}33`,
        borderLeft:       `3px solid ${color}`,
        borderRadius:     '0 12px 12px 0',
        padding:          '20px 24px 20px 24px',
        marginBottom:     12,
        animation:        `fadeSlideIn 0.4s ease both`,
        animationDelay:   `${index * 60}ms`,
      }}
    >
      {step.isArrivee && (
        <div style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            6,
          padding:        '3px 10px',
          background:     'rgba(239,68,68,0.15)',
          border:         '1px solid rgba(239,68,68,0.3)',
          borderRadius:   100,
          marginBottom:   12,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ef4444', fontFamily: 'var(--font-montserrat)' }}>
            ✈️ Arrivée en France
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <p style={{
            margin:         '0 0 4px',
            fontFamily:     'var(--font-montserrat)',
            fontSize:       '0.6rem',
            fontWeight:     700,
            letterSpacing:  '0.15em',
            textTransform:  'uppercase',
            color:          color,
          }}>
            {icon} {step.mois}
          </p>
          <h3 style={{
            margin:     '0 0 8px',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize:   '0.95rem',
            color:      '#ffffff',
            lineHeight: 1.3,
          }}>
            {step.action}
          </h3>
          <p style={{
            margin:     0,
            fontFamily: 'var(--font-dm-sans)',
            fontSize:   '0.82rem',
            color:      'rgba(255,255,255,0.6)',
            lineHeight: 1.65,
          }}>
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
            display:        'inline-flex',
            alignItems:     'center',
            gap:            4,
            marginTop:      10,
            fontFamily:     'var(--font-montserrat)',
            fontWeight:     700,
            fontSize:       '0.6rem',
            letterSpacing:  '0.1em',
            textTransform:  'uppercase',
            color:          color === '#014DF8' ? '#4d8fff' : color,
            textDecoration: 'none',
          }}
        >
          {step.lien.label} →
        </a>
      )}
    </div>
  );
}

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
      await fetch('/api/calendrier', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, pays, rentree }),
      });
      setSent(true);
    } catch { /* non-blocking */ } finally {
      setSending(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);  }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── Question block ─────────────────────────────────────────── */}
      <div style={{
        background:   'rgba(255,255,255,0.025)',
        border:       '1px solid rgba(255,255,255,0.07)',
        borderRadius:  20,
        padding:      'clamp(28px,4vw,48px)',
        marginBottom:  steps ? 'clamp(32px,4vw,48px)' : 0,
      }}>

        {/* Q1 — Pays */}
        <div style={{ marginBottom: 36 }}>
          <p style={{
            margin:        '0 0 16px',
            fontFamily:    'var(--font-montserrat)',
            fontSize:      '0.62rem',
            fontWeight:    700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         '#4d8fff',
          }}>
            01 — Ton pays d&apos;origine
          </p>
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap:                 10,
          }}>
            {PAYS_LIST.map(p => (
              <button
                key={p.slug}
                onClick={() => setPays(p.slug)}
                style={{
                  display:       'flex',
                  alignItems:    'center',
                  gap:           8,
                  padding:       '12px 14px',
                  background:    pays === p.slug ? 'rgba(1,77,248,0.15)' : 'rgba(255,255,255,0.03)',
                  border:        pays === p.slug ? '1px solid rgba(1,77,248,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius:  10,
                  cursor:        'pointer',
                  transition:    'all 0.18s ease',
                  textAlign:     'left',
                  width:         '100%',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{p.emoji}</span>
                <span style={{
                  fontFamily:  'var(--font-montserrat)',
                  fontWeight:  pays === p.slug ? 700 : 500,
                  fontSize:    '0.78rem',
                  color:       pays === p.slug ? '#ffffff' : 'rgba(255,255,255,0.65)',
                }}>
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Q2 — Rentrée */}
        <div style={{ marginBottom: 36 }}>
          <p style={{
            margin:        '0 0 16px',
            fontFamily:    'var(--font-montserrat)',
            fontSize:      '0.62rem',
            fontWeight:    700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         '#4d8fff',
          }}>
            02 — Ta rentrée souhaitée
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {RENTREE_LIST.map(r => (
              <button
                key={r.slug}
                onClick={() => setRentree(r.slug)}
                style={{
                  padding:     '12px 22px',
                  background:  rentree === r.slug ? 'rgba(1,77,248,0.15)' : 'rgba(255,255,255,0.03)',
                  border:      rentree === r.slug ? '1px solid rgba(1,77,248,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  cursor:      'pointer',
                  transition:  'all 0.18s ease',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight:  rentree === r.slug ? 700 : 500,
                  fontSize:   '0.88rem',
                  color:       rentree === r.slug ? '#ffffff' : 'rgba(255,255,255,0.6)',
                }}>
                  {r.slug === 'septembre-2026' && '🍂 '}{r.slug === 'janvier-2027' && '❄️ '}{r.slug === 'septembre-2027' && '🍂 '}
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          10,
            padding:      '16px 32px',
            background:    canGenerate ? 'rgba(1,77,248,1)' : 'rgba(255,255,255,0.06)',
            border:       'none',
            borderRadius:  10,
            cursor:        canGenerate ? 'pointer' : 'not-allowed',
            transition:   'all 0.2s ease',
            width:        'fit-content',
          }}
        >
          <span style={{
            fontFamily:    'var(--font-montserrat)',
            fontWeight:    700,
            fontSize:      '0.85rem',
            letterSpacing: '0.08em',
            color:          canGenerate ? '#ffffff' : 'rgba(255,255,255,0.3)',
          }}>
            {paysInfo && rentreeInfo
              ? `Générer le calendrier ${paysInfo.emoji} → ${rentreeInfo.label}`
              : 'Générer mon calendrier →'}
          </span>
        </button>
      </div>

      {/* ── Timeline résultat ───────────────────────────────────────── */}
      {steps && (
        <div id="calendrier-result" style={{ animation: 'fadeIn 0.5s ease' }}>

          {/* Header résultat */}
          <div style={{
            display:        'flex',
            alignItems:     'center',
            gap:            16,
            marginBottom:   32,
            paddingBottom:  24,
            borderBottom:   '1px solid rgba(255,255,255,0.08)',
            flexWrap:       'wrap',
          }}>
            <span style={{ fontSize: 40 }}>{paysInfo?.emoji}</span>
            <div>
              <p style={{
                margin:        '0 0 4px',
                fontFamily:    'var(--font-montserrat)',
                fontSize:      '0.6rem',
                fontWeight:    700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         '#4d8fff',
              }}>
                Ton planning personnalisé
              </p>
              <h2 style={{
                margin:     0,
                fontFamily: 'var(--font-bebas)',
                fontWeight: 400,
                fontSize:   'clamp(1.6rem,3vw,2.2rem)',
                letterSpacing: '0.04em',
                color:      '#ffffff',
              }}>
                {paysInfo?.label} → {rentreeInfo?.label}
              </h2>
            </div>

            {/* Légende */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {(['rouge', 'orange', 'vert'] as Urgence[]).map(u => (
                <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 3, height: 16, background: URGENCE_COLOR[u], borderRadius: 2 }} />
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>
                    {u === 'rouge' ? 'Urgent' : u === 'orange' ? 'Important' : 'Préparation'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Barre de progression */}
          <div style={{ marginBottom: 24, position: 'relative' }}>
            <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#014DF8,#4d8fff)', borderRadius: 4, transition: 'width 1s ease' }} />
            </div>
            <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
              {steps.length} étapes · De {steps[0]?.mois} à {steps[steps.length - 1]?.mois}
            </p>
          </div>

          {/* Cards */}
          <div>
            {steps.map((step, i) => (
              <StepCard key={`${step.mois}-${i}`} step={step} index={i} />
            ))}
          </div>

          {/* Email CTA */}
          <div style={{
            marginTop:    40,
            padding:      'clamp(24px,4vw,40px)',
            background:   'rgba(1,77,248,0.07)',
            border:       '1px solid rgba(1,77,248,0.2)',
            borderRadius:  16,
            textAlign:    'center',
          }}>
            {!sent ? (
              <>
                <p style={{
                  margin:     '0 0 8px',
                  fontFamily: 'var(--font-bebas)',
                  fontWeight: 400,
                  fontSize:   'clamp(1.3rem,2.5vw,1.8rem)',
                  letterSpacing: '0.04em',
                  color:      '#ffffff',
                }}>
                  📧 Reçois ce calendrier en PDF
                </p>
                <p style={{
                  margin:     '0 0 24px',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize:   '0.88rem',
                  color:      'rgba(255,255,255,0.55)',
                }}>
                  Télécharge ton planning {paysInfo?.label} → {rentreeInfo?.label} en PDF avec tous les liens cliquables
                </p>
                <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    required
                    style={{
                      flex:         1,
                      minWidth:     220,
                      padding:      '13px 18px',
                      background:   'rgba(255,255,255,0.06)',
                      border:       '1px solid rgba(255,255,255,0.12)',
                      borderRadius:  8,
                      color:        '#ffffff',
                      fontFamily:   'var(--font-dm-sans)',
                      fontSize:     '0.9rem',
                      outline:      'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      padding:      '13px 24px',
                      background:   '#014DF8',
                      border:       'none',
                      borderRadius:  8,
                      cursor:        sending ? 'not-allowed' : 'pointer',
                      opacity:       sending ? 0.7 : 1,
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.8rem', color: '#fff' }}>
                      {sending ? 'Envoi…' : 'Envoyer mon PDF →'}
                    </span>
                  </button>
                </form>
              </>
            ) : (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-bebas)', fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', letterSpacing: '0.04em', color: '#ffffff' }}>
                  PDF envoyé sur ta boîte !
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
