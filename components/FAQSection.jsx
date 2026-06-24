'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FAQ_ITEMS } from '@/lib/faq-data';

// Entrance animation for each row
const rowVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function FAQSection() {
  const sectionRef = useRef(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.1 });
  const [open, setOpen] = useState(null); // index of open item, or null

  const toggle = (i) => setOpen(prev => prev === i ? null : i);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(44px,6vw,88px) clamp(16px,5vw,80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '20%', right: '-10%',
        width: '50vw', height: '70vh',
        background: 'radial-gradient(ellipse at right, rgba(1,77,248,0.04) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Two-column layout: header left, FAQ right ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'clamp(200px,28%,320px) 1fr',
          gap: 'clamp(40px,6vw,100px)',
          alignItems: 'start',
        }}
        className="faq-layout"
        >

          {/* ── Left: sticky header ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'sticky', top: 100 }}
            className="faq-header-col"
          >
            <div style={{
              display: 'inline-flex', marginBottom: 20,
              padding: '5px 14px',
              border: '1px solid rgba(1,77,248,0.3)',
              borderRadius: 100, background: 'rgba(1,77,248,0.07)',
            }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.58rem', fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(77,143,255,0.85)',
              }}>FAQ</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-bebas)',
              fontWeight: 400,
              fontSize: 'clamp(3rem,6vw,6.5rem)',
              lineHeight: 0.9, letterSpacing: '0.03em',
              color: '#fff', margin: '0 0 clamp(16px,2vw,24px)',
            }}>
              TES<br />
              QUES&shy;<br />TIONS.<br />
              <span style={{ color: 'rgba(255,255,255,0.92)' }}>RÉPONDUES.</span>
            </h2>

            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 400, fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.72, margin: 0,
            }}>
              Visa, logement, banque, CAF — les vraies réponses aux vraies questions des étudiants internationaux en France.
            </p>

            {/* Item counter */}
            <div style={{
              marginTop: 32,
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.55rem', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.92)',
            }}>
              {open !== null
                ? `Question ${String(open + 1).padStart(2, '0')} / ${String(FAQ_ITEMS.length).padStart(2, '0')}`
                : `${FAQ_ITEMS.length} questions`}
            </div>
          </motion.div>

          {/* ── Right: accordion list ── */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
            style={{ minWidth: 0 }}
          >
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={i}
                  variants={rowVariants}
                  style={{ position: 'relative' }}
                >
                  {/* Active left accent bar */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        aria-hidden="true"
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        exit={{ scaleY: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          position: 'absolute',
                          left: 0, top: 0, bottom: 0,
                          width: 2,
                          background: 'linear-gradient(180deg, #014DF8, rgba(77,143,255,0.4))',
                          borderRadius: 1,
                          transformOrigin: 'top center',
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* ── Question row (button) ── */}
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                    style={{
                      width: '100%', background: 'none', border: 'none',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: 'clamp(18px,2.5vw,26px) 0 clamp(18px,2.5vw,26px) clamp(12px,2vw,20px)',
                      textAlign: 'left',
                    }}
                  >
                    {/* Number */}
                    <span style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.52rem', fontWeight: 700,
                      letterSpacing: '0.18em',
                      color: isOpen ? 'rgba(77,143,255,0.9)' : 'rgba(255,255,255,0.5)',
                      flexShrink: 0,
                      transition: 'color 0.25s',
                      minWidth: 22,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Question text */}
                    <span style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontWeight: isOpen ? 500 : 400,
                      fontSize: 'clamp(0.9rem,1.3vw,1.05rem)',
                      color: isOpen ? '#fff' : 'rgba(255,255,255,0.88)',
                      lineHeight: 1.45,
                      flex: 1,
                      transition: 'color 0.25s, font-weight 0.1s',
                    }}>
                      {item.q}
                    </span>

                    {/* Toggle icon */}
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, flexShrink: 0,
                        borderRadius: '50%',
                        border: `1px solid ${isOpen ? 'rgba(1,77,248,0.6)' : 'rgba(255,255,255,0.12)'}`,
                        background: isOpen ? 'rgba(1,77,248,0.12)' : 'transparent',
                        color: isOpen ? '#4d8fff' : 'rgba(255,255,255,0.65)',
                        fontSize: '1.1rem', lineHeight: 1,
                        fontWeight: 400,
                        transition: 'border-color 0.25s, background 0.25s, color 0.25s',
                      }}
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>

                  {/* ── Answer panel ── */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        role="region"
                        aria-labelledby={`faq-question-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: `0 0 clamp(20px,3vw,32px) clamp(38px,5vw,54px)`,
                        }}>
                          {/* Answer text */}
                          <p style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontWeight: 400,
                            fontSize: 'clamp(0.84rem,1.1vw,0.95rem)',
                            lineHeight: 1.8,
                            color: 'rgba(255,255,255,0.92)',
                            margin: 0,
                          }}>
                            {item.a}
                          </p>

                          {/* Dalili CTA pill */}
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            marginTop: 16,
                            padding: '5px 12px',
                            border: '1px solid rgba(1,77,248,0.25)',
                            borderRadius: 100,
                            background: 'rgba(1,77,248,0.07)',
                            cursor: 'default',
                          }}>
                            <div style={{
                              width: 4, height: 4, borderRadius: '50%',
                              background: '#4d8fff',
                              boxShadow: '0 0 6px rgba(77,143,255,0.8)',
                            }} />
                            <span style={{
                              fontFamily: 'var(--font-montserrat)',
                              fontSize: '0.55rem', fontWeight: 700,
                              letterSpacing: '0.14em', textTransform: 'uppercase',
                              color: 'rgba(77,143,255,0.8)',
                            }}>Dalili t&apos;accompagne</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Item divider */}
                  <div style={{
                    height: 1,
                    background: isOpen
                      ? 'linear-gradient(90deg, rgba(1,77,248,0.3) 0%, rgba(255,255,255,0.05) 40%, transparent 100%)'
                      : 'rgba(255,255,255,0.06)',
                    transition: 'background 0.3s',
                    marginLeft: 'clamp(12px,2vw,20px)',
                  }} />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
