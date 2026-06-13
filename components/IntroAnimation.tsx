'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Phase = 'flying' | 'impact' | 'logo' | 'text';

const PARTICLES = [
  { angle:  15, dist:  90, size: 4 },
  { angle:  60, dist:  70, size: 3 },
  { angle: 110, dist: 100, size: 5 },
  { angle: 165, dist:  80, size: 3 },
  { angle: 210, dist:  95, size: 4 },
  { angle: 265, dist:  75, size: 5 },
  { angle: 315, dist: 105, size: 3 },
  { angle: 355, dist:  85, size: 4 },
];

// Easing presets
const SNAP      = [0.22, 1.55, 0.36, 1] as const;
const EXPO_OUT  = [0.16, 1,    0.3,  1] as const;
const EXIT_EASE = [0.4,  0,    0.6,  1] as const;

// Both paths from /public/images/logo-dalili.svg, viewBox="-1 105 70 71"
const S1 = 'M45.83,124.17h-13.08s-12.61,12.62-12.61,12.62l6.87,6.9,10.2-10.03c.93-.48,3.49-.48,4.16.29l11.98,13.73-12.33,12.45c-1.41,1.43-2.43,2.99-4.05,4.34h-16.74c-1.73-1.43-2.84-2.99-4.25-4.58-5.09-5.75-10.17-11.5-15.26-17.25-.21-.22-.38-.39-.5-.5-.05-.04-.11-.1-.21-.14,0,0,0,0-.01,0,.1.12.08.58.08.84v14.73s14.37,16.39,14.37,16.39l26.56.04,2.49-2.55,23.38-23.49-21.05-23.8Z';
const S2 = 'M66.99,125.02l-14.38-16.39-26.56-.04-2.49,2.55L.19,134.62l21.05,23.8h13.08s12.61-12.62,12.61-12.62l-6.87-6.9-10.2,10.03c-.93.48-3.49.48-4.16-.29l-11.98-13.73,12.33-12.45c1.41-1.43,2.43-2.99,4.05-4.34h16.74c1.73,1.43,2.84,2.99,4.25,4.58l15.26,17.25c.28.32.46.55.73.65-.03-5.2-.05-10.39-.08-15.59Z';

const LOGO_SIZE = 200;

// A single shape that flies in from one corner and lands at rest position
function FlyingShape({
  d, from, delay = 0,
}: { d: string; from: 'tl' | 'br'; delay?: number }) {
  const ix = from === 'tl' ? -1800 : 1800;
  const iy = from === 'tl' ? -1200 : 1200;
  const ir = from === 'tl' ?   -38 :   38;

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
        width={LOGO_SIZE}
        height={LOGO_SIZE}
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
  const cb = useRef(onComplete);
  useEffect(() => { cb.current = onComplete; }, [onComplete]);

  useEffect(() => {
    // Respect reduced-motion preference — skip immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cb.current();
      return;
    }

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
              width: 'clamp(400px, 72vmin, 980px)',
              height: 'clamp(400px, 72vmin, 980px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.11) 0%, rgba(29,78,216,0.04) 55%, transparent 72%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* ── Logo + effects container ───────────────────────────────────── */}
          <div style={{
            position: 'relative',
            width:  LOGO_SIZE,
            height: LOGO_SIZE,
            marginBottom: 28,
            flexShrink: 0,
            zIndex: 1,
          }}>
            {/* Breathing glow ring — appears after impact */}
            <AnimatePresence>
              {showGlow && (
                <motion.span
                  key="glow"
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    position: 'absolute', inset: -30, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.52) 0%, rgba(37,99,235,0.16) 52%, transparent 72%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    scale:   [0.9, 1.18, 0.9],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </AnimatePresence>

            {/* S1 — flies from top-left */}
            <FlyingShape d={S1} from="tl" />

            {/* S2 — flies from bottom-right, 40ms stagger for dramatic feel */}
            <FlyingShape d={S2} from="br" delay={0.04} />

            {/* Scatter particles — burst out on collision */}
            <AnimatePresence>
              {showParticles && PARTICLES.map((p, i) => {
                const r = (p.angle * Math.PI) / 180;
                return (
                  <motion.span
                    key={`p${i}`}
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      marginTop:  -p.size / 2,
                      marginLeft: -p.size / 2,
                      width:  p.size,
                      height: p.size,
                      borderRadius: '50%',
                      background: '#93c5fd',
                      boxShadow: '0 0 6px #60a5fa, 0 0 14px rgba(59,130,246,0.7)',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 2 }}
                    animate={{
                      x: Math.cos(r) * p.dist,
                      y: Math.sin(r) * p.dist,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{
                      duration: 0.72 + (i % 3) * 0.1,
                      delay: i * 0.016,
                      ease: [0.2, 1, 0.8, 1],
                    }}
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
                style={{
                  position: 'absolute', inset: 0,
                  background: '#fff',
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.78, 0] }}
                transition={{ duration: 0.4, times: [0, 0.18, 1] }}
              />
            )}
          </AnimatePresence>

          {/* ── Shockwave ring ─────────────────────────────────────────────── */}
          <AnimatePresence>
            {phase === 'impact' && (
              <motion.span
                key="shock"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  borderRadius: '50%',
                  border: '2px solid rgba(147,197,253,0.8)',
                  pointerEvents: 'none',
                  zIndex: 15,
                }}
                initial={{ width: 0, height: 0, marginLeft: 0, marginTop: 0, opacity: 1 }}
                animate={{ width: 360, height: 360, marginLeft: -180, marginTop: -180, opacity: 0 }}
                transition={{ duration: 0.68, ease: [0.2, 1, 0.8, 1] }}
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
                      hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
                      show: {
                        opacity: 1, y: 0, filter: 'blur(0px)',
                        transition: { duration: 0.44, ease: EXPO_OUT },
                      },
                    }}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-montserrat, "Montserrat", sans-serif)',
                      fontWeight: 700,
                      fontSize: 'clamp(1.7rem, 5.5vw, 2.4rem)',
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
