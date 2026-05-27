'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    icon: '🧭',
    tag: '01',
    title: 'Navigation\nIntelligente',
    desc: 'Un guide personnalisé qui t\'accompagne dans chaque démarche — de la visa jusqu\'à ton premier appartement.',
    accent: '#014DF8',
    bg:     'linear-gradient(145deg, rgba(1,77,248,0.18) 0%, rgba(2,6,22,0.95) 100%)',
    border: 'rgba(1,77,248,0.40)',
    topBar: '#014DF8',
    glow:   'rgba(1,77,248,0.12)',
    blobBg: 'rgba(1,77,248,0.16)',
    iconBg: 'rgba(1,77,248,0.15)',
    iconBorder: 'rgba(1,77,248,0.3)',
    iconGlow: '0 0 20px rgba(1,77,248,0.7), 0 0 40px rgba(1,77,248,0.3)',
    shimmer: 'rgba(77,143,255,0.12)',
  },
  {
    icon: '🤝',
    tag: '02',
    title: 'Dalili\nt\'accompagne',
    desc: 'Des mentors étudiants qui ont vécu la même expérience, prêts à partager leurs conseils et leur réseau.',
    accent: '#EFB370',
    bg:     'linear-gradient(145deg, rgba(239,179,112,0.16) 0%, rgba(4,8,28,0.95) 100%)',
    border: 'rgba(239,179,112,0.38)',
    topBar: '#EFB370',
    glow:   'rgba(239,179,112,0.10)',
    blobBg: 'rgba(239,179,112,0.14)',
    iconBg: 'rgba(239,179,112,0.12)',
    iconBorder: 'rgba(239,179,112,0.3)',
    iconGlow: '0 0 20px rgba(239,179,112,0.7), 0 0 40px rgba(239,179,112,0.3)',
    shimmer: 'rgba(239,179,112,0.10)',
  },
  {
    icon: '⚡',
    tag: '03',
    title: 'Démarches\nSimplifiées',
    desc: 'CAF, CROUS, sécu étudiante — on centralise tout. Moins de stress, plus de temps pour vivre.',
    accent: '#22C55E',
    bg:     'linear-gradient(145deg, rgba(34,197,94,0.15) 0%, rgba(2,10,18,0.95) 100%)',
    border: 'rgba(34,197,94,0.35)',
    topBar: '#22C55E',
    glow:   'rgba(34,197,94,0.10)',
    blobBg: 'rgba(34,197,94,0.13)',
    iconBg: 'rgba(34,197,94,0.12)',
    iconBorder: 'rgba(34,197,94,0.3)',
    iconGlow: '0 0 20px rgba(34,197,94,0.7), 0 0 40px rgba(34,197,94,0.3)',
    shimmer: 'rgba(34,197,94,0.10)',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const cardsRef   = useRef([]);
  const shimmerRef = useRef([]);   // shimmer layer per card
  const blobRef    = useRef([]);   // animated blob per card

  // ── Title 3D character reveal on scroll
  useEffect(() => {
    const title = titleRef.current;
    if (!title || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const chars = title.querySelectorAll('.feat-char');
    gsap.set(chars, { yPercent: 115 });

    const ctx = gsap.context(() => {
      gsap.to(chars, {
        yPercent: 0,
        duration: 0.9, ease: 'power4.out',
        stagger: { each: 0.025, from: 'start' },
        scrollTrigger: { trigger: title, start: 'top 80%', toggleActions: 'play none none none' },
      });
    }, title);

    return () => ctx.revert();
  }, []);

  // ── Cards scroll reveal + GSAP float idle
  useEffect(() => {
    const reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile  = window.innerWidth < 768;
    const floatAmp  = isMobile ? -6 : -10; // smaller amplitude on mobile

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        // Scroll entrance
        gsap.from(card, {
          y: 70, opacity: 0, duration: 0.95, ease: 'power3.out',
          delay: i * 0.14,
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        });

        // Idle float — starts immediately (GSAP handles compose with entrance)
        if (!reduced) {
          gsap.to(card, {
            y: floatAmp,
            duration: 3.6 + i * 0.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.8,
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  // ── Shimmer sweep animation per card (every ~7s, staggered)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    shimmerRef.current.forEach((el, i) => {
      if (!el) return;
      function runShimmer() {
        gsap.fromTo(el,
          { x: '-110%', opacity: 0 },
          {
            x: '110%', opacity: 1,
            duration: 0.9, ease: 'power2.inOut',
            onComplete: () => { gsap.set(el, { opacity: 0 }); },
          }
        );
      }
      // Initial delay staggered per card
      const id = setTimeout(() => {
        runShimmer();
        setInterval(runShimmer, 7000 + i * 800);
      }, 3200 + i * 900);

      return () => clearTimeout(id);
    });
  }, []);

  // ── Blob drift animations per card
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    blobRef.current.forEach((blob, i) => {
      if (!blob) return;
      gsap.to(blob, {
        x: (i % 2 === 0 ? 18 : -18),
        y: (i % 2 === 0 ? -12 : 14),
        duration: 5 + i * 0.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.7,
      });
    });
  }, []);

  // ── 3D tilt via GSAP (composes with float y)
  function onCardMove(e, i) {
    if (window.innerWidth < 768) return;
    const el = cardsRef.current[i];
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const y  = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    gsap.to(el, {
      rotateY:  x * 10,
      rotateX: -y *  8,
      z: 16,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  function onCardLeave(i) {
    const el = cardsRef.current[i];
    if (!el) return;
    gsap.to(el, {
      rotateY: 0, rotateX: 0, z: 0,
      duration: 0.65,
      ease: 'elastic.out(1, 0.55)',
      overwrite: 'auto',
    });
  }

  return (
    <section
      ref={sectionRef}
      className="features-section"
      style={{
        padding: 'clamp(80px,12vw,160px) clamp(16px,5vw,80px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translateX(-50%)',
        width: '80vw', height: '60vh',
        background: 'radial-gradient(ellipse, rgba(1,77,248,0.055) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Section title */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,8vw,100px)' }}>
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
            }}>Comment ça marche</span>
          </div>

          <h2 ref={titleRef} style={{
            fontFamily: 'var(--font-bebas)',
            fontWeight: 400,
            fontSize: 'clamp(3.5rem,8vw,9rem)',
            lineHeight: 0.9, letterSpacing: '0.04em',
            color: '#fff', margin: 0,
          }}>
            {'DALILI'.split('').map((ch, i) => (
              <span key={i} className="char-wrap" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                <span className="feat-char" style={{ display: 'inline-block' }}>{ch}</span>
              </span>
            ))}
            <br />
            {'T\'ACCOMPAGNE'.split('').map((ch, i) => (
              <span key={i} className="char-wrap" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                <span className="feat-char" style={{ display: 'inline-block', color: 'rgba(255,255,255,0.5)' }}>{ch}</span>
              </span>
            ))}
          </h2>
        </div>

        {/* ── Cards grid ── */}
        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: 'clamp(14px,2.5vw,28px)',
        }}>
          {CARDS.map((card, i) => (
            <div
              key={i}
              ref={el => { cardsRef.current[i] = el; }}
              onMouseMove={e => onCardMove(e, i)}
              onMouseLeave={() => onCardLeave(i)}
              className="feature-card"
              style={{
                padding: 'clamp(28px,4vw,44px)',
                background: card.bg,
                border: `1px solid ${card.border}`,
                borderRadius: 22,
                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                boxShadow: `0 20px 60px rgba(0,0,0,0.35), 0 0 40px ${card.glow}`,
                position: 'relative', overflow: 'hidden',
                cursor: 'default',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              {/* ── Animated gradient blob (slow drift) */}
              <div
                ref={el => { blobRef.current[i] = el; }}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '-20%', left: '-20%',
                  width: '140%', height: '140%',
                  background: `radial-gradient(circle at 40% 40%, ${card.blobBg} 0%, transparent 60%)`,
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  zIndex: 0,
                  filter: 'blur(28px)',
                }}
              />

              {/* ── Shimmer sweep line */}
              <div
                ref={el => { shimmerRef.current[i] = el; }}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '60%', height: '100%',
                  background: `linear-gradient(105deg, transparent 30%, ${card.shimmer} 50%, transparent 70%)`,
                  transform: 'translateX(-110%)',
                  pointerEvents: 'none',
                  zIndex: 5,
                  opacity: 0,
                }}
              />

              {/* Top accent stripe */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${card.topBar}, transparent)`,
                zIndex: 2,
              }} />

              {/* Corner glow bottom-right */}
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: -10, right: -10,
                width: 160, height: 160,
                background: `radial-gradient(circle at bottom right, ${card.glow.replace('0.10', '0.22')} 0%, transparent 70%)`,
                pointerEvents: 'none', zIndex: 1,
              }} />

              {/* ── Icon + tag row */}
              <div style={{
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 28,
                position: 'relative', zIndex: 3,
              }}>
                {/* Icon — larger, 3D depth feel */}
                <div style={{
                  width: 64, height: 64,
                  background: card.iconBg,
                  border: `1px solid ${card.iconBorder}`,
                  borderRadius: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: card.iconGlow,
                  flexShrink: 0,
                  /* CSS pulse animation via class */
                }}>
                  <span
                    aria-hidden="true"
                    className={`card-icon card-icon-${i}`}
                    style={{ display: 'block', lineHeight: 1 }}
                  >
                    {card.icon}
                  </span>
                </div>

                {/* Tag + decorative dots */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.65rem', fontWeight: 700,
                    letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)',
                  }}>
                    {card.tag}
                  </span>
                  {/* Decorative 3 dots */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 0.4, 0.15].map((op, j) => (
                      <div
                        key={j}
                        style={{
                          width: 5, height: 5,
                          borderRadius: '50%',
                          background: card.accent,
                          opacity: op,
                          boxShadow: `0 0 6px ${card.accent}`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-bebas)',
                fontWeight: 400,
                fontSize: 'clamp(1.8rem,3vw,2.6rem)',
                lineHeight: 0.95, letterSpacing: '0.04em',
                color: '#fff', margin: '0 0 16px',
                whiteSpace: 'pre-line',
                position: 'relative', zIndex: 3,
              }}>
                {card.title}
              </h3>

              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300, fontSize: '0.92rem',
                lineHeight: 1.72, color: 'rgba(255,255,255,0.45)',
                margin: 0,
                position: 'relative', zIndex: 3,
              }}>
                {card.desc}
              </p>

              {/* Bottom accent line */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${card.border}, transparent)`,
                zIndex: 2,
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
