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
    // #014DF8 — blue
    bg:     'linear-gradient(145deg, rgba(1,77,248,0.22) 0%, rgba(2,6,22,0.92) 100%)',
    border: 'rgba(1,77,248,0.45)',
    topBar: '#014DF8',
    glow:   'rgba(1,77,248,0.12)',
    iconBg: 'rgba(1,77,248,0.15)',
    iconBorder: 'rgba(1,77,248,0.3)',
    iconGlow:   'rgba(1,77,248,0.5)',
  },
  {
    icon: '🤝',
    tag: '02',
    title: 'Dalili\nt\'accompagne',
    desc: 'Des mentors étudiants qui ont vécu la même expérience, prêts à partager leurs conseils et leur réseau.',
    // #EFB370 — amber/gold
    bg:     'linear-gradient(145deg, rgba(239,179,112,0.20) 0%, rgba(4,8,28,0.92) 100%)',
    border: 'rgba(239,179,112,0.40)',
    topBar: '#EFB370',
    glow:   'rgba(239,179,112,0.10)',
    iconBg: 'rgba(239,179,112,0.12)',
    iconBorder: 'rgba(239,179,112,0.3)',
    iconGlow:   'rgba(239,179,112,0.5)',
  },
  {
    icon: '⚡',
    tag: '03',
    title: 'Démarches\nSimplifiées',
    desc: 'CAF, CROUS, sécu étudiante — on centralise tout. Moins de stress, plus de temps pour vivre.',
    // #22C55E — emerald green
    bg:     'linear-gradient(145deg, rgba(34,197,94,0.18) 0%, rgba(2,10,18,0.92) 100%)',
    border: 'rgba(34,197,94,0.38)',
    topBar: '#22C55E',
    glow:   'rgba(34,197,94,0.10)',
    iconBg: 'rgba(34,197,94,0.12)',
    iconBorder: 'rgba(34,197,94,0.3)',
    iconGlow:   'rgba(34,197,94,0.5)',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const cardsRef   = useRef([]);

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

  // ── Cards scroll reveal
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  // ── 3D tilt on hover
  function onCardMove(e, el) {
    if (window.innerWidth < 768) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    el.style.transform  = `perspective(900px) rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg) translateZ(8px)`;
    el.style.transition = 'none';
  }
  function onCardLeave(el) {
    el.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1)';
    el.style.transform  = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  }

  return (
    <section
      ref={sectionRef}
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
        pointerEvents: 'none', filter: 'blur(4px)',
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

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(16px,2.5vw,28px)',
        }}>
          {CARDS.map((card, i) => (
            <div
              key={i}
              ref={el => { cardsRef.current[i] = el; }}
              onMouseMove={e => onCardMove(e, e.currentTarget)}
              onMouseLeave={e => onCardLeave(e.currentTarget)}
              className="feature-card"
              style={{
                padding: 'clamp(28px,4vw,44px)',
                background: card.bg,
                border: `1px solid ${card.border}`,
                borderRadius: 20,
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                boxShadow: `0 20px 60px rgba(0,0,0,0.35), 0 0 40px ${card.glow}`,
                position: 'relative', overflow: 'hidden',
                cursor: 'default', transformStyle: 'preserve-3d',
              }}
            >
              {/* Top accent stripe */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${card.topBar}, transparent)`,
              }} />

              {/* Icon + tag row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div style={{
                  width: 52, height: 52,
                  background: card.iconBg,
                  border: `1px solid ${card.iconBorder}`,
                  borderRadius: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem',
                  filter: `drop-shadow(0 0 12px ${card.iconGlow})`,
                }}>
                  {card.icon}
                </div>
                <span style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.65rem', fontWeight: 700,
                  letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)',
                }}>
                  {card.tag}
                </span>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-bebas)',
                fontWeight: 400, fontSize: 'clamp(1.8rem,3vw,2.5rem)',
                lineHeight: 0.95, letterSpacing: '0.04em',
                color: '#fff', margin: '0 0 16px', whiteSpace: 'pre-line',
              }}>
                {card.title}
              </h3>

              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300, fontSize: '0.92rem',
                lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', margin: 0,
              }}>
                {card.desc}
              </p>

              {/* Corner glow accent */}
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 130, height: 130,
                background: `radial-gradient(circle at bottom right, ${card.glow.replace('0.10', '0.2')} 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
