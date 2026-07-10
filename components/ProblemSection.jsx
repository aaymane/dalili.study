'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    numericValue: 49,
    suffix: '',
    pill: 'GUIDES GRATUITS',
    pillColor: '#4d8fff',
    pillBg: 'rgba(1,77,248,0.1)',
    valueColor: '#ffffff',
    desc: 'Visa, Campus France, logement, CAF, banque — documentés sur sources officielles.',
  },
  {
    numericValue: 14,
    suffix: '',
    pill: 'VILLES COUVERTES',
    pillColor: '#22c55e',
    pillBg: 'rgba(34,197,94,0.1)',
    valueColor: '#ffffff',
    desc: 'Paris, Lyon, Bordeaux, Toulouse, Marseille, Nice et 8 autres — budget réel et communauté comparés.',
  },
  {
    numericValue: 615,
    suffix: '€',
    pill: 'EXIGÉ PAR LE CONSULAT',
    pillColor: '#4d8fff',
    pillBg: 'rgba(77,143,255,0.1)',
    valueColor: '#4d8fff',
    desc: 'Par mois de ressources prouvables. Notre simulateur calcule exactement ce dont tu as besoin.',
  },
];

export default function ProblemSection() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const cardsRef   = useRef([]);
  const numbersRef = useRef([]);

  // ── Title lines reveal on scroll
  useEffect(() => {
    const title = titleRef.current;
    if (!title || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lines = title.querySelectorAll('.prob-line');
    gsap.set(lines, { opacity: 0, y: 24 });

    const ctx = gsap.context(() => {
      gsap.to(lines, {
        opacity: 1, y: 0,
        duration: 0.55, ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: title, start: 'top 88%', toggleActions: 'play none none none' },
      });
    }, title);

    return () => ctx.revert();
  }, []);

  // ── Counting number animation on scroll
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      numbersRef.current.forEach((el, i) => {
        if (!el) return;
        const { numericValue, suffix } = STATS[i];
        const obj = { val: 0 };

        gsap.to(obj, {
          val: numericValue,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
          onUpdate() { el.textContent = `${Math.round(obj.val)}${suffix}`; },
          onComplete() { el.textContent = `${numericValue}${suffix}`; },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  // ── Cards scroll entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 20, opacity: 0,
          duration: 0.4, ease: 'power3.out',
          delay: i * 0.07,
          scrollTrigger: { trigger: card, start: 'top 93%', toggleActions: 'play none none none' },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(64px,8vw,120px) clamp(16px,5vw,80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle blue glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translateX(-50%)',
        width: '60vw', height: '50vh',
        background: 'radial-gradient(ellipse, rgba(1,77,248,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* ── Title */}
        <div
          ref={titleRef}
          style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,80px)' }}
        >
          <h2 style={{ margin: 0 }}>
            <span
              className="prob-line"
              style={{
                display: 'block',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 700,
                fontSize: 'clamp(22px,3.5vw,42px)',
                letterSpacing: '0.05em',
                color: 'rgba(255,255,255,0.78)',
                margin: 0,
                lineHeight: 1.15,
                textTransform: 'uppercase',
              }}
            >
              Chaque année,
            </span>
            {' '}
            <span
              className="prob-line"
              style={{
                display: 'block',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 900,
                fontSize: 'clamp(22px,3.5vw,42px)',
                letterSpacing: '0.02em',
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.15,
                textTransform: 'uppercase',
              }}
            >
              des milliers d&apos;étudiants
            </span>
            {' '}
            <span
              className="prob-line"
              style={{
                display: 'block',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 900,
                fontSize: 'clamp(22px,3.5vw,42px)',
                letterSpacing: '0.02em',
                color: '#014DF8',
                margin: '0 0 clamp(20px,2.5vw,32px)',
                lineHeight: 1.15,
                textTransform: 'uppercase',
              }}
            >
              font les mêmes erreurs.
            </span>
          </h2>
          <p
            className="prob-line"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 400,
              fontSize: '16px',
              color: 'rgba(255,255,255,0.52)',
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Visa refusé, logement raté, CAF perdue... Dalili documente chaque erreur pour que tu ne la répètes pas.
          </p>
        </div>

        {/* ── Stats cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          maxWidth: 860,
          margin: '0 auto',
        }}
          className="prob-stats-grid"
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              ref={el => { cardsRef.current[i] = el; }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(1,77,248,0.35)';
                e.currentTarget.style.background = 'rgba(1,77,248,0.04)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '28px 32px',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'border-color 0.2s, background 0.2s',
                cursor: 'default',
              }}
            >
              {/* Pill */}
              <div style={{
                display: 'inline-block',
                background: stat.pillBg,
                color: stat.pillColor,
                fontSize: 10,
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 700,
                letterSpacing: '0.15em',
                padding: '3px 10px',
                borderRadius: 20,
                marginBottom: 14,
                textTransform: 'uppercase',
              }}>
                {stat.pill}
              </div>

              {/* Number */}
              <div
                ref={el => { numbersRef.current[i] = el; }}
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 800,
                  fontSize: i === 2 ? 48 : 52,
                  lineHeight: 1,
                  color: stat.valueColor,
                  marginBottom: 10,
                }}
              >
                0{stat.suffix}
              </div>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 400,
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive: single column on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .prob-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
