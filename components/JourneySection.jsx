'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Home, Landmark, ClipboardList, Calculator } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    Icon: ShieldCheck,
    title: 'Visa',
    subtitle: 'TON PASSEPORT POUR LA FRANCE',
    desc: 'Campus France, visa long séjour, validation OFII. On te guide sur chaque document requis avant le départ.',
    accent: '#014DF8',
    accentRgb: '1,77,248',
    href: '/blog/visa-etudiant-france-maroc-2026',
    badge: 'Guide disponible →',
  },
  {
    number: '02',
    Icon: Home,
    title: 'Logement',
    subtitle: 'TROUVE TON CHEZ-TOI',
    desc: 'CROUS, résidences privées, colocation — compare tes options et monte ton dossier sans stress.',
    accent: '#7C3AED',
    accentRgb: '124,58,237',
    href: '/blog/logement-crous-etudiant-etranger-demande',
    badge: 'Guide disponible →',
  },
  {
    number: '03',
    Icon: Landmark,
    title: 'Banque',
    subtitle: 'OUVRE TON COMPTE EN 48H',
    desc: "Sans compte bancaire français, impossible de signer un bail ou toucher la CAF. On t'explique quoi faire.",
    accent: '#22C55E',
    accentRgb: '34,197,94',
    href: '/blog/ouvrir-compte-bancaire-etudiant-etranger-2026',
    badge: 'Guide disponible →',
  },
  {
    number: '04',
    Icon: ClipboardList,
    title: 'CAF',
    subtitle: "JUSQU'À 200€/MOIS",
    desc: 'La CAF peut couvrir une grande partie de ton loyer. Chaque jour de retard = aide perdue définitivement.',
    accent: '#EFB370',
    accentRgb: '239,179,112',
    href: '/blog/caf-etudiant-etranger-delais-documents-erreurs',
    badge: 'Guide disponible →',
  },
  {
    number: '05',
    Icon: Calculator,
    title: 'Simulateur',
    subtitle: 'CALCULE TON VRAI BUDGET',
    desc: 'Réponds à 5 questions. On te calcule le budget exact pour ta ville, ton logement et ta situation.',
    accent: '#22C55E',
    accentRgb: '34,197,94',
    href: '/simulateur',
    badge: 'Essayer gratuitement →',
  },
];

// Step width on desktop — all layout math derives from this
const STEP_W = 256;
// Node diameter
const NODE_D = 56;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function JourneySection() {
  const sectionRef = useRef(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.15 });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Track line geometry:
  // Desktop — horizontal line, centered on nodes:
  //   top  = NODE_D / 2  (28px, relative to the flex-row container)
  //   left = STEP_W / 2  (first node center)
  //   right= STEP_W / 2  (last node center from right edge)
  // Mobile — vertical line, centered on nodes:
  //   left = NODE_D / 2  (28px, nodes are leftmost item in each row)
  //   top = 0, bottom = 0 (spans all steps)
  const trackLineDesktop = {
    position: 'absolute',
    top: NODE_D / 2 - 1,        // 27px — bisects node circles
    left: STEP_W / 2,            // 128px — center of step 1
    right: STEP_W / 2,           // 128px — center of step 5 from right
    height: 2,
    background: 'linear-gradient(90deg, #014DF8, #7C3AED 35%, #22C55E 55%, #EFB370 75%, #06B6D4)',
    opacity: 0.45,
    transformOrigin: 'left center',
    pointerEvents: 'none',
  };

  const trackLineMobile = {
    position: 'absolute',
    top: NODE_D / 2,
    bottom: NODE_D / 2,
    left: NODE_D / 2 - 1,
    width: 2,
    background: 'linear-gradient(180deg, #014DF8, #7C3AED 35%, #22C55E 55%, #EFB370 75%, #06B6D4)',
    opacity: 0.45,
    transformOrigin: 'center top',
    pointerEvents: 'none',
  };

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(44px,6vw,88px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '35%', left: '50%',
        transform: 'translateX(-50%)',
        width: '80vw', height: '65vh',
        background: 'radial-gradient(ellipse, rgba(1,77,248,0.045) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Section header ── */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 clamp(16px,5vw,80px)',
        marginBottom: 'clamp(32px,5vw,64px)',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
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
            }}>Ton parcours étape par étape</span>
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: 'var(--font-bebas)',
            fontWeight: 400,
            fontSize: 'clamp(3.5rem,8vw,9rem)',
            lineHeight: 0.9, letterSpacing: '0.04em',
            color: '#fff', margin: '0 0 clamp(16px,2vw,24px)',
          }}>
            TON CHEMIN
            <br />
            {' '}<span style={{ color: 'rgba(255,255,255,0.92)' }}>VERS LA FRANCE.</span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 400,
            fontSize: 'clamp(0.82rem,1.3vw,1.05rem)',
            color: 'rgba(255,255,255,0.92)',
            maxWidth: 'min(460px,88vw)',
            margin: '0 auto',
            lineHeight: 1.75,
          }}>
            De la demande de visa jusqu&apos;à ton premier mentor —
            chaque étape guidée, simplifiée, dans l&apos;ordre.
          </p>
        </motion.div>
      </div>

      {/* ── Timeline scroll container ── */}
      <div
        className="journey-scroll"
        style={{
          overflowX: isMobile ? 'visible' : 'auto',
          padding: isMobile
            ? '0 clamp(16px,5vw,80px)'
            : '0 clamp(16px,5vw,80px) clamp(12px,2vw,24px)',
        }}
      >
        {/* Inner flex container — width:max-content on desktop so it scrolls;
            margin:0 auto centers it when all steps fit in the viewport        */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            position: 'relative',
            width: isMobile ? '100%' : 'max-content',
            margin: '0 auto',
          }}
        >
          {/* ── Animated track line ── */}
          {isMobile ? (
            <motion.div
              aria-hidden="true"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              style={trackLineMobile}
            />
          ) : (
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              style={trackLineDesktop}
            />
          )}

          {/* ── Steps ── */}
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                alignItems: isMobile ? 'flex-start' : 'center',
                width: isMobile ? '100%' : STEP_W,
                padding: isMobile ? `0 0 ${i < STEPS.length - 1 ? 36 : 0}px 0` : '0',
                gap: isMobile ? 20 : 0,
                position: 'relative',
              }}
            >
              {/* ── Node circle ── */}
              <motion.div
                aria-hidden="true"
                whileHover={{ scale: 1.18 }}
                transition={{ type: 'spring', stiffness: 340, damping: 18 }}
                style={{
                  width: NODE_D, height: NODE_D,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 35%, rgba(${step.accentRgb},0.3) 0%, rgba(${step.accentRgb},0.07) 100%)`,
                  border: `2px solid rgba(${step.accentRgb},0.55)`,
                  boxShadow: [
                    `0 0 18px rgba(${step.accentRgb},0.35)`,
                    `0 0 40px rgba(${step.accentRgb},0.12)`,
                    'inset 0 1px 0 rgba(255,255,255,0.12)',
                  ].join(', '),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative', zIndex: 2,
                  marginBottom: isMobile ? 0 : 28,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'default',
                }}
              >
                <step.Icon size={24} color={step.accent} strokeWidth={1.5} />

                {/* Step number dot — sits outside node on the right/bottom */}
                <div style={{
                  position: 'absolute',
                  top: -6, right: -6,
                  width: 20, height: 20,
                  borderRadius: '50%',
                  background: '#010510',
                  border: `1.5px solid rgba(${step.accentRgb},0.6)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 10px rgba(${step.accentRgb},0.4)`,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.45rem', fontWeight: 700,
                    color: step.accent,
                    letterSpacing: '0.02em',
                  }}>{i + 1}</span>
                </div>
              </motion.div>

              {/* ── Step card ── */}
              <Link href={step.href} style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: isMobile ? '100%' : 'calc(100% - 16px)', margin: isMobile ? 0 : '0 8px' }}>
              <motion.div
                whileHover={{
                  borderColor: `rgba(${step.accentRgb},0.65)`,
                  boxShadow: [
                    `0 0 0 1px rgba(${step.accentRgb},0.18)`,
                    `0 0 30px rgba(${step.accentRgb},0.28)`,
                    `0 0 60px rgba(${step.accentRgb},0.1)`,
                    '0 24px 56px rgba(0,0,0,0.55)',
                  ].join(', '),
                  y: -5,
                  scale: 1.02,
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  padding: 'clamp(16px,2.5vw,24px)',
                  background: `linear-gradient(145deg, rgba(${step.accentRgb},0.09) 0%, rgba(1,4,16,0.97) 100%)`,
                  border: `1px solid rgba(${step.accentRgb},0.22)`,
                  borderRadius: 18,
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                {/* Top accent stripe */}
                <div aria-hidden="true" style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)`,
                }} />

                {/* Corner ambient glow */}
                <div aria-hidden="true" style={{
                  position: 'absolute', top: -24, right: -24,
                  width: 110, height: 110,
                  background: `radial-gradient(circle at top right, rgba(${step.accentRgb},0.2) 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Number row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 10,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.52rem', fontWeight: 700,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: `rgba(${step.accentRgb},0.75)`,
                  }}>{step.number}</span>
                  <div style={{
                    flex: 1, height: 1,
                    background: `linear-gradient(90deg, rgba(${step.accentRgb},0.4), transparent)`,
                  }} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-bebas)',
                  fontWeight: 400,
                  fontSize: 'clamp(1.6rem,3vw,2.1rem)',
                  lineHeight: 0.95, letterSpacing: '0.04em',
                  color: '#fff',
                  margin: '0 0 6px',
                }}>
                  {step.title}
                </h3>

                {/* Subtitle */}
                <div style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.6rem', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: step.accent,
                  marginBottom: 12,
                  opacity: 0.9,
                }}>
                  {step.subtitle}
                </div>

                {/* Divider */}
                <div style={{
                  height: 1,
                  background: `linear-gradient(90deg, rgba(${step.accentRgb},0.35), transparent)`,
                  marginBottom: 12,
                }} />

                {/* Description */}
                <p style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 400, fontSize: '0.83rem',
                  lineHeight: 1.72, color: 'rgba(255,255,255,0.92)',
                  margin: '0 0 14px',
                }}>
                  {step.desc}
                </p>

                {/* Badge CTA */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '4px 12px',
                  background: `rgba(${step.accentRgb},0.12)`,
                  border: `1px solid rgba(${step.accentRgb},0.35)`,
                  borderRadius: 100,
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.58rem', fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: step.accent,
                }}>
                  {step.badge}
                </div>

                {/* Bottom accent */}
                <div aria-hidden="true" style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, transparent, rgba(${step.accentRgb},0.25), transparent)`,
                }} />
              </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Desktop scroll hint — fades out after inView + delay ── */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginTop: 18,
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.52rem', fontWeight: 700,
            letterSpacing: '0.26em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.92)',
            userSelect: 'none',
          }}
        >
          ← faire défiler →
        </motion.div>
      )}
    </section>
  );
}
