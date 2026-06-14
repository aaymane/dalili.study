'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Phase = 'flying' | 'impact' | 'logo' | 'text';

// Particles defined as ratios of logo size so they scale automatically
const PARTICLES = [
  { angle:  15, distR: 0.50, size: 4 },
  { angle:  60, distR: 0.38, size: 3 },
  { angle: 110, distR: 0.54, size: 5 },
  { angle: 165, distR: 0.44, size: 3 },
  { angle: 210, distR: 0.52, size: 4 },
  { angle: 265, distR: 0.40, size: 5 },
  { angle: 315, distR: 0.56, size: 3 },
  { angle: 355, distR: 0.46, size: 4 },
];

const SNAP      = [0.22, 1.55, 0.36, 1] as const;
const EXPO_OUT  = [0.16, 1,    0.3,  1] as const;
const EXIT_EASE = [0.4,  0,    0.6,  1] as const;

// Both paths from /public/images/logo-dalili.svg, viewBox="-1 105 70 71"
const S1 = 'M45.83,124.17h-13.08s-12.61,12.62-12.61,12.62l6.87,6.9,10.2-10.03c.93-.48,3.49-.48,4.16.29l11.98,13.73-12.33,12.45c-1.41,1.43-2.43,2.99-4.05,4.34h-16.74c-1.73-1.43-2.84-2.99-4.25-4.58-5.09-5.75-10.17-11.5-15.26-17.25-.21-.22-.38-.39-.5-.5-.05-.04-.11-.1-.21-.14,0,0,0,0-.01,0,.1.12.08.58.08.84v14.73s14.37,16.39,14.37,16.39l26.56.04,2.49-2.55,23.38-23.49-21.05-23.8Z';
const S2 = 'M66.99,125.02l-14.38-16.39-26.56-.04-2.49,2.55L.19,134.62l21.05,23.8h13.08s12.61-12.62,12.61-12.62l-6.87-6.9-10.2,10.03c-.93.48-3.49.48-4.16-.29l-11.98-13.73,12.33-12.45c1.41-1.43,2.43-2.99,4.05-4.34h16.74c1.73,1.43,2.84,2.99,4.25,4.58l15.26,17.25c.28.32.46.55.73.65-.03-5.2-.05-10.39-.08-15.59Z';

type Sizes = {
  logo:   number;
  flyX:   number;
  flyY:   number;
  glowIn: number;
};

function computeSizes(): Sizes {
  const vw   = window.innerWidth;
  const vh   = window.innerHeight;
  const vmin = Math.min(vw, vh);
  const logo = Math.round(Math.min(vmin * 0.28, 200));
  return {
    logo,
    flyX:   Math.round(vw * 1.6),
    flyY:   Math.round(vh * 1.6),
    glowIn: Math.round(logo * 0.16),
  };
}

// A single shape that flies in from one corner
function FlyingShape({
  d, from, delay = 0, sizes,
}: { d: string; from: 'tl' | 'br'; delay?: number; sizes: Sizes }) {
  const ix = from === 'tl' ? -sizes.flyX : sizes.flyX;
  const iy = from === 'tl' ? -sizes.flyY : sizes.flyY;
  const ir = from === 'tl' ? -38 : 38;

  return (
    <motion.div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0 }}
      initial={{ x: ix, y: iy, rotate: ir, scale: 1.85, opacity: 0 }}
      animate={{ x: 0,  y: 0,  rotate: 0,  scale: 1,    opacity: 1 }}
      transition={{
        x:       { duration: 0.70, delay, ease: SNAP },
        y:       { duration: 0.70, delay, ease: SNAP },
        rotate:  { duration: 0.70, delay, ease: SNAP },
        scale:   { duration: 0.66, delay, ease: EXPO_OUT },
        opacity: { duration: 0.20, delay },
      }}
    >
      <svg
        viewBox="-1 105 70 71"
        width={sizes.logo}
        height={sizes.logo}
        style={{ display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={d} fill="#006cfd" />
      </svg>
    </motion.div>
  );
}

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [show,  setShow]  = useState(false);
  const [phase, setPhase] = useState<Phase>('flying');
  const [sizes, setSizes] = useState<Sizes>({
    logo: 200, flyX: 1800, flyY: 1200, glowIn: 32,
  });
  const cb = useRef(onComplete);
  useEffect(() => { cb.current = onComplete; }, [onComplete]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cb.current();
      return;
    }

    // Internal navigation sets this flag so animation is skipped.
    // On a real page refresh the flag is absent → animation plays.
    if (sessionStorage.getItem('skipIntro')) {
      sessionStorage.removeItem('skipIntro');
      cb.current();
      return;
    }

    // Compute responsive sizes once, before the overlay appears.
    // React batches this with setShow so the first render already has correct sizes.
    setSizes(computeSizes());
    setShow(true);

    const T = [
      setTimeout(() => setPhase('impact'), 720),
      setTimeout(() => setPhase('logo'),  1020),
      setTimeout(() => setPhase('text'),  1320),
      setTimeout(() => { cb.current(); setShow(false); }, 2650),
    ];
    return () => T.forEach(clearTimeout);
  }, []);

  const showParticles = phase === 'impact' || phase === 'logo';
  const showGlow      = phase === 'logo'   || phase === 'text';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="dalili-intro"
          exit={{ opacity: 0, scale: 1.016, transition: { duration: 0.65, ease: EXIT_EASE } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#040d1e',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* ── Ambient depth glow ─────────────────────────────────────────── */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: EXPO_OUT, delay: 0.72 }}
            style={{
              position: 'absolute',
              width:  'clamp(280px, 88vmin, 900px)',
              height: 'clamp(280px, 88vmin, 900px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.11) 0%, rgba(29,78,216,0.04) 55%, transparent 72%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* ── Logo + effects container ───────────────────────────────────── */}
          <div style={{
            position: 'relative',
            width:  sizes.logo,
            height: sizes.logo,
            marginBottom: 'clamp(16px, 4vmin, 28px)',
            flexShrink: 0,
            zIndex: 1,
          }}>
            {/* Breathing glow ring */}
            <AnimatePresence>
              {showGlow && (
                <motion.span
                  key="glow"
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    position: 'absolute',
                    inset: -sizes.glowIn,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.52) 0%, rgba(37,99,235,0.16) 52%, transparent 72%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.18, 0.9] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </AnimatePresence>

            {/* S1 — flies from top-left */}
            <FlyingShape d={S1} from="tl" sizes={sizes} />

            {/* S2 — flies from bottom-right, 40 ms stagger for drama */}
            <FlyingShape d={S2} from="br" delay={0.04} sizes={sizes} />

            {/* Scatter particles — burst out on collision */}
            <AnimatePresence>
              {showParticles && PARTICLES.map((p, i) => {
                const r    = (p.angle * Math.PI) / 180;
                const dist = p.distR * sizes.logo;
                const sz   = Math.max(2, Math.round(p.size * (sizes.logo / 200)));
                return (
                  <motion.span
                    key={`p${i}`}
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      marginTop:  -sz / 2,
                      marginLeft: -sz / 2,
                      width:  sz,
                      height: sz,
                      borderRadius: '50%',
                      background: '#93c5fd',
                      boxShadow: '0 0 6px #60a5fa, 0 0 14px rgba(59,130,246,0.7)',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 2 }}
                    animate={{ x: Math.cos(r) * dist, y: Math.sin(r) * dist, opacity: 0, scale: 0 }}
                    transition={{ duration: 0.72 + (i % 3) * 0.1, delay: i * 0.016, ease: [0.2, 1, 0.8, 1] }}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* ── White impact flash ─────────────────────────────────────────── */}
          <AnimatePresence>
            {phase === 'impact' && (
              <motion.div
                key="flash"
                aria-hidden="true"
                style={{ position: 'absolute', inset: 0, background: '#fff', pointerEvents: 'none', zIndex: 20 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.78, 0] }}
                transition={{ duration: 0.4, times: [0, 0.18, 1] }}
              />
            )}
          </AnimatePresence>


{/* ── "DALILI" letter-by-letter stagger ─────────────────────────── */}
          <AnimatePresence>
            {phase === 'text' && (
              <motion.div
                key="txt"
                style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.3em', zIndex: 1 }}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -6, transition: { duration: 0.22 } }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.082 } },
                }}
              >
                {'DALILI'.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
                      show: {
                        opacity: 1, y: 0, filter: 'blur(0px)',
                        transition: { duration: 0.44, ease: EXPO_OUT },
                      },
                    }}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-montserrat, "Montserrat", sans-serif)',
                      fontWeight: 700,
                      fontSize: 'clamp(1.35rem, 5.5vw, 2.4rem)',
                      color: '#fff',
                      letterSpacing: '0.3em',
                      lineHeight: 1,
                    }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
