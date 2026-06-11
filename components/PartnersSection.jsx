'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Category accent RGB values — pulled from the existing site palette
const CAT = {
  Banque:   { rgb: '77,143,255',   label: 'Banque'   },
  Logement: { rgb: '239,179,112',  label: 'Logement' },
  Permis:   { rgb: '34,197,94',    label: 'Permis'   },
};

const PARTNERS = [
  {
    id: 'n26',
    // Wordmark: ultra-bold condensed — N26's brand DNA
    wordmark: { text: 'N26', weight: 900, size: '1.75rem', ls: '-0.03em', upper: false },
    brandRgb: '43,13,255',
    category: 'Banque',
    tagline: 'La banque sans paperasse',
    desc: 'Compte 100% mobile, sans justificatif de domicile. Ouverture en 8 minutes depuis ton téléphone.',
    cta: 'Ouvrir un compte',
  },
  {
    id: 'revolut',
    // Wordmark: thin weight — Revolut's clean fintech look
    wordmark: { text: 'Revolut', weight: 300, size: '1.2rem', ls: '0.01em', upper: false },
    brandRgb: '135,60,255',
    category: 'Banque',
    tagline: 'Multi-devises, zéro frais',
    desc: 'Carte multi-devises sans frais de change. Pratique pour les virements depuis l\'étranger.',
    cta: 'Découvrir',
  },
  {
    id: 'spotahome',
    // Wordmark: solid medium weight
    wordmark: { text: 'Spotahome', weight: 700, size: '1.0rem', ls: '-0.01em', upper: false },
    brandRgb: '255,90,60',
    category: 'Logement',
    tagline: 'Logement vérifié en vidéo',
    desc: 'Studios et chambres visibles à distance, avant même ton arrivée en France. Réservation sécurisée.',
    cta: 'Trouver un logement',
  },
  {
    id: 'housinganywhere',
    // Wordmark: two-word stacked, compact
    wordmark: { text: 'Housing\nAnywhere', weight: 700, size: '0.95rem', ls: '-0.01em', upper: false },
    brandRgb: '0,180,149',
    category: 'Logement',
    tagline: 'Location étudiante internationale',
    desc: 'Contrats en ligne, sans garant local. Spécialisé pour les étudiants internationaux depuis 2009.',
    cta: 'Voir les logements',
  },
  {
    id: 'ornikar',
    // Wordmark: heavy lowercase — Ornikar's distinctive style
    wordmark: { text: 'ornikar', weight: 800, size: '1.45rem', ls: '-0.04em', upper: false },
    brandRgb: '108,87,243',
    category: 'Permis',
    tagline: 'Le permis en ligne',
    desc: 'Code de la route et conduite à prix réduit, 100% depuis ton téléphone. Reconnu en France.',
    cta: 'Passer son permis',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function PartnersSection() {
  const sectionRef = useRef(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(80px,12vw,160px) clamp(16px,5vw,80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient glow — cooler, less intense than other sections */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translateX(-50%)',
        width: '70vw', height: '60vh',
        background: 'radial-gradient(ellipse, rgba(1,77,248,0.032) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(40px,7vw,80px)' }}
        >
          {/* Top row: badge + disclaimer */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
            marginBottom: 'clamp(20px,3vw,32px)',
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '5px 16px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 100,
              background: 'rgba(255,255,255,0.04)',
            }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.24em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}>Partenaires recommandés</span>
            </div>

            {/* Integrity note */}
            <span style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.72rem', fontWeight: 300,
              color: 'rgba(255,255,255,0.22)',
              letterSpacing: '0.01em',
            }}>
              ✦ Sélectionnés pour leur utilité, pas pour une commission
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: 'var(--font-bebas)',
            fontWeight: 400,
            fontSize: 'clamp(3rem,7vw,8rem)',
            lineHeight: 0.9, letterSpacing: '0.04em',
            color: '#fff', margin: '0 0 clamp(14px,2vw,22px)',
          }}>
            NOS PARTENAIRES
            <br />
            <span style={{ color: 'rgba(255,255,255,0.38)' }}>RECOMMANDÉS.</span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 'clamp(0.82rem,1.3vw,1.0rem)',
            color: 'rgba(255,255,255,0.35)',
            maxWidth: 'min(520px,88vw)',
            lineHeight: 1.75, margin: 0,
          }}>
            Des services testés et recommandés par des étudiants internationaux
            pour simplifier chaque étape de ton installation.
          </p>
        </motion.div>

        {/* ── Category legend ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'flex', gap: 10, flexWrap: 'wrap',
            marginBottom: 'clamp(24px,4vw,40px)',
          }}
        >
          {Object.values(CAT).map(c => (
            <div key={c.label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 12px',
              border: `1px solid rgba(${c.rgb},0.22)`,
              borderRadius: 100,
              background: `rgba(${c.rgb},0.06)`,
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: `rgba(${c.rgb},0.9)`,
                boxShadow: `0 0 6px rgba(${c.rgb},0.6)`,
              }} />
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.55rem', fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: `rgba(${c.rgb},0.8)`,
              }}>{c.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Partner cards ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            // 5 cards: fills to 5 columns on wide screens, drops gracefully
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(210px,100%), 1fr))',
            gap: 'clamp(10px,2vw,18px)',
          }}
        >
          {PARTNERS.map((p) => {
            const cat = CAT[p.category];
            return (
              <motion.div
                key={p.id}
                variants={cardVariants}
                whileHover={{
                  y: -5,
                  borderColor: 'rgba(255,255,255,0.14)',
                  boxShadow: [
                    '0 0 0 1px rgba(255,255,255,0.05)',
                    '0 12px 40px rgba(0,0,0,0.4)',
                    `0 0 28px rgba(${p.brandRgb},0.07)`,
                    'inset 0 1px 0 rgba(255,255,255,0.07)',
                  ].join(', '),
                  transition: { duration: 0.22, ease: 'easeOut' },
                }}
                style={{
                  padding: 'clamp(20px,3vw,28px)',
                  background: 'rgba(255,255,255,0.025)',
                  borderWidth: 1, borderStyle: 'solid',
                  borderColor: 'rgba(255,255,255,0.07)',
                  borderRadius: 18,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: [
                    '0 8px 32px rgba(0,0,0,0.35)',
                    'inset 0 1px 0 rgba(255,255,255,0.05)',
                  ].join(', '),
                  position: 'relative', overflow: 'hidden',
                  cursor: 'default',
                  display: 'flex', flexDirection: 'column',
                  gap: 0,
                }}
              >
                {/* Category-colored top stripe — the only color accent */}
                <div aria-hidden="true" style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
                  background: `linear-gradient(90deg, transparent, rgba(${cat.rgb},0.6), rgba(${cat.rgb},0.3), transparent)`,
                }} />

                {/* ── Logo badge + category ── */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between', gap: 8,
                  marginBottom: 16,
                }}>
                  {/* Wordmark */}
                  <div style={{
                    padding: '7px 13px',
                    background: `rgba(${p.brandRgb},0.07)`,
                    border: `1px solid rgba(${p.brandRgb},0.14)`,
                    borderRadius: 10,
                    flexShrink: 0,
                    lineHeight: 1,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontWeight: p.wordmark.weight,
                      fontSize: p.wordmark.size,
                      letterSpacing: p.wordmark.ls,
                      color: 'rgba(255,255,255,0.88)',
                      whiteSpace: 'pre-line',
                      display: 'block',
                      lineHeight: 1.1,
                    }}>
                      {p.wordmark.text}
                    </span>
                  </div>

                  {/* Category badge */}
                  <div style={{
                    padding: '4px 9px',
                    border: `1px solid rgba(${cat.rgb},0.28)`,
                    borderRadius: 100,
                    background: `rgba(${cat.rgb},0.08)`,
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.5rem', fontWeight: 700,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: `rgba(${cat.rgb},0.88)`,
                      display: 'block', lineHeight: 1,
                    }}>{p.category}</span>
                  </div>
                </div>

                {/* ── Tagline ── */}
                <div style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.68rem', fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: 10,
                }}>
                  {p.tagline}
                </div>

                {/* ── Thin divider ── */}
                <div style={{
                  height: 1,
                  background: 'rgba(255,255,255,0.06)',
                  marginBottom: 12,
                }} />

                {/* ── Description ── */}
                <p style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300, fontSize: '0.8rem',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.35)',
                  margin: '0 0 auto',
                  paddingBottom: 18,
                }}>
                  {p.desc}
                </p>

                {/* ── CTA text link ── */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  paddingTop: 14,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.58rem', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: `rgba(${cat.rgb},0.65)`,
                  }}>
                    {p.cta}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    color: `rgba(${cat.rgb},0.5)`,
                    marginTop: '0.5px',
                  }}>→</span>
                </div>

                {/* Bottom-right corner brand tint */}
                <div aria-hidden="true" style={{
                  position: 'absolute', bottom: -20, right: -20,
                  width: 100, height: 100,
                  background: `radial-gradient(circle at bottom right, rgba(${p.brandRgb},0.07) 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Footer disclaimer ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300, fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.18)',
            textAlign: 'center',
            marginTop: 'clamp(24px,4vw,40px)',
            lineHeight: 1.6,
          }}
        >
          Dalili ne touche aucune commission sur ces recommandations.
          Les partenaires sont évalués uniquement sur leur utilité réelle pour les étudiants internationaux.
        </motion.p>

      </div>
    </section>
  );
}
