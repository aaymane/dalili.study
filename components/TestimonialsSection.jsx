'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Mehdi R.',
    country: 'Algérie',
    flag: '🇩🇿',
    university: 'Université Paris-Saclay',
    initials: 'M',
    avatarRgb: '1,77,248',
    quote: "J'ai perdu 3 semaines sur mon dossier CAF avant de découvrir Dalili. En 48h, tout était déposé. Je recommande à chaque étudiant qui débarque en France sans réseau.",
    rating: 5,
  },
  {
    name: 'Priya S.',
    country: 'Inde',
    flag: '🇮🇳',
    university: 'Sciences Po Paris',
    initials: 'P',
    avatarRgb: '124,58,237',
    quote: "The administrative maze in France nearly broke me. My Dalili mentor had been through the same thing — she guided me step by step, in my language. I felt human again.",
    rating: 5,
  },
  {
    name: 'Carlos M.',
    country: 'Brésil',
    flag: '🇧🇷',
    university: 'École Polytechnique',
    initials: 'C',
    avatarRgb: '34,197,94',
    quote: "Sans adresse fixe, ouvrir un compte bancaire semblait impossible. Mon mentor Dalili avait vécu exactement ça — il m'a montré les bons documents, la bonne banque. Réglé en 2 jours.",
    rating: 5,
  },
];

const SOCIAL_PROOF = [
  { value: '500+',  label: 'étudiants accompagnés' },
  { value: '4.9/5', label: 'note moyenne'           },
  { value: '40+',   label: 'nationalités'            },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden:   { opacity: 0, y: 52, scale: 0.96 },
  visible:  { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] } },
};

export default function TestimonialsSection() {
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
      {/* Central blue nebula */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: '90vw', height: '80vh',
        background: 'radial-gradient(ellipse at center, rgba(1,77,248,0.055) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      {/* Left edge accent */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '35%', left: '-8%',
        width: '32vw', height: '55vh',
        background: 'radial-gradient(ellipse at left, rgba(77,143,255,0.035) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 'clamp(48px,8vw,96px)' }}
        >
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
            }}>Ils ont fait confiance à Dalili</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-bebas)',
            fontWeight: 400,
            fontSize: 'clamp(3.5rem,8vw,9rem)',
            lineHeight: 0.9, letterSpacing: '0.04em',
            color: '#fff', margin: '0 0 clamp(16px,2vw,24px)',
          }}>
            ILS EN<br />
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>PARLENT.</span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 'clamp(0.82rem,1.3vw,1.05rem)',
            color: 'rgba(255,255,255,0.38)',
            maxWidth: 'min(460px,88vw)',
            margin: '0 auto',
            lineHeight: 1.75,
          }}>
            Des étudiants du monde entier qui ont simplifié leur arrivée en France grâce à Dalili.
          </p>
        </motion.div>

        {/* ── Cards grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px,100%), 1fr))',
            gap: 'clamp(14px,2.5vw,26px)',
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{
                y: -8,
                borderColor: 'rgba(1,77,248,0.5)',
                boxShadow: [
                  '0 0 0 1px rgba(1,77,248,0.14)',
                  '0 0 36px rgba(1,77,248,0.22)',
                  '0 0 72px rgba(1,77,248,0.09)',
                  '0 28px 70px rgba(0,0,0,0.6)',
                  'inset 0 1px 0 rgba(255,255,255,0.08)',
                ].join(', '),
                transition: { duration: 0.28, ease: 'easeOut' },
              }}
              style={{
                padding: 'clamp(28px,4vw,40px)',
                background: 'linear-gradient(145deg, rgba(1,77,248,0.07) 0%, rgba(1,4,16,0.95) 100%)',
                borderWidth: 1, borderStyle: 'solid',
                borderColor: 'rgba(1,77,248,0.18)',
                borderRadius: 22,
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                boxShadow: [
                  '0 0 0 1px rgba(1,77,248,0.05)',
                  '0 20px 60px rgba(0,0,0,0.45)',
                  'inset 0 1px 0 rgba(255,255,255,0.06)',
                  'inset 0 -1px 0 rgba(0,0,0,0.35)',
                ].join(', '),
                position: 'relative', overflow: 'hidden',
                cursor: 'default',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Top shimmer stripe */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, transparent 0%, rgba(1,77,248,0.55) 30%, rgba(77,143,255,0.85) 50%, rgba(1,77,248,0.55) 70%, transparent 100%)',
              }} />

              {/* Corner nebula per-card accent */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: -32, right: -32,
                width: 160, height: 160,
                background: `radial-gradient(circle at top right, rgba(${t.avatarRgb},0.12) 0%, transparent 65%)`,
                pointerEvents: 'none',
              }} />

              {/* Bottom-left subtle glow */}
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: -24, left: -24,
                width: 120, height: 120,
                background: 'radial-gradient(circle at bottom left, rgba(1,77,248,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* ── Decorative quote mark ── */}
              <div aria-hidden="true" style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '5rem', lineHeight: 0.72,
                color: 'rgba(1,77,248,0.2)',
                marginBottom: 8,
                userSelect: 'none',
                letterSpacing: '-0.02em',
              }}>&ldquo;</div>

              {/* ── Quote text ── */}
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: 'clamp(0.87rem,1.1vw,0.97rem)',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.68)',
                margin: '0 0 clamp(22px,3vw,32px)',
                fontStyle: 'italic',
                flex: 1,
                position: 'relative', zIndex: 1,
              }}>
                {t.quote}
              </p>

              {/* Divider */}
              <div style={{
                height: 1,
                background: 'linear-gradient(90deg, rgba(1,77,248,0.28) 0%, rgba(77,143,255,0.14) 60%, transparent 100%)',
                marginBottom: 'clamp(18px,2.5vw,26px)',
              }} />

              {/* ── Author row ── */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                position: 'relative', zIndex: 1,
              }}>

                {/* Avatar + flag */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 48, height: 48,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, rgba(${t.avatarRgb},0.9) 0%, rgba(${t.avatarRgb},0.45) 100%)`,
                    border: `2px solid rgba(${t.avatarRgb},0.45)`,
                    boxShadow: [
                      `0 0 14px rgba(${t.avatarRgb},0.4)`,
                      `0 0 28px rgba(${t.avatarRgb},0.14)`,
                    ].join(', '),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontWeight: 700, fontSize: '1.1rem',
                      color: '#fff', letterSpacing: '-0.01em',
                      textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    }}>
                      {t.initials}
                    </span>
                  </div>

                  {/* Flag badge */}
                  <div style={{
                    position: 'absolute', bottom: -5, right: -5,
                    width: 22, height: 22,
                    borderRadius: '50%',
                    background: '#010a22',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', lineHeight: 1,
                  }}>
                    {t.flag}
                  </div>
                </div>

                {/* Name + university */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 700, fontSize: '0.82rem',
                    color: '#fff', letterSpacing: '0.02em',
                    marginBottom: 3,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {t.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontWeight: 300, fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.36)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {t.university}
                  </div>
                </div>

                {/* Star rating */}
                <div style={{
                  display: 'flex', gap: 2, flexShrink: 0,
                  alignSelf: 'flex-start', paddingTop: 1,
                }}>
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <span key={si} style={{
                      fontSize: '0.7rem', color: '#EFB370',
                      filter: 'drop-shadow(0 0 3px rgba(239,179,112,0.65))',
                    }}>★</span>
                  ))}
                </div>
              </div>

              {/* Bottom accent */}
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(1,77,248,0.2), transparent)',
              }} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Social proof pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.62 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(10px,2.5vw,20px)',
            marginTop: 'clamp(36px,5vw,60px)',
            flexWrap: 'wrap',
          }}
        >
          {SOCIAL_PROOF.map((stat, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: 'clamp(10px,1.5vw,14px) clamp(20px,3vw,32px)',
              border: '1px solid rgba(1,77,248,0.16)',
              borderRadius: 100,
              background: 'rgba(1,77,248,0.045)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 0 0 1px rgba(1,77,248,0.04), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(1.25rem,2vw,1.65rem)',
                letterSpacing: '0.06em', lineHeight: 1,
                color: '#4d8fff',
              }}>
                {stat.value}
              </span>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.52rem', fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)',
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
