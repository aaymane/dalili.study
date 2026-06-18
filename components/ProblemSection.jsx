'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PAIN_POINTS = [
  {
    prefix: '+',
    numericValue: 15,
    suffix: '',
    label: 'démarches obligatoires',
    source: 'Campus France, 2023',
    title: 'Perdu dans\nl\'administration',
    desc: 'Visa, OFII, CAF, CROUS, sécurité sociale étudiante… Dès ton arrivée, une quinzaine de démarches obligatoires t\'attendent — chacune avec ses délais, ses formulaires, ses pièges.',
    accent: '#FF4D4D',
    accentRgb: '255,77,77',
    icon: '📋',
    tag: '01',
  },
  {
    prefix: '',
    numericValue: 68,
    suffix: '%',
    label: "manquent d'accompagnement",
    source: 'Enquête CROUS, 2023',
    title: 'Personne\npour t\'aider',
    desc: "68 % des étudiants étrangers déclarent manquer d'accompagnement dans leurs démarches administratives. Sans mentor ni réseau local, chaque blocage prend des semaines.",
    accent: '#FF8C00',
    accentRgb: '255,140,0',
    icon: '🫥',
    tag: '02',
  },
  {
    prefix: '',
    numericValue: 100,
    suffix: '%',
    label: 'en français',
    source: 'Ministère de l\'Enseignement Supérieur, 2024',
    title: 'Tout en\nfrançais',
    desc: 'Contrats, convocations, formulaires officiels — tout arrive dans une langue que tu maîtrises peut-être pas encore. Chaque document incompris peut coûter : refus, pénalité, dossier bloqué.',
    accent: '#FFCC00',
    accentRgb: '255,204,0',
    icon: '🔤',
    tag: '03',
  },
];

export default function ProblemSection() {
  const sectionRef  = useRef(null);
  const titleRef    = useRef(null);
  const cardsRef    = useRef([]);
  const numbersRef  = useRef([]);
  const shimmerRef  = useRef([]);
  const blobRef     = useRef([]);

  // ── Title character reveal (same pattern as FeaturesSection)
  useEffect(() => {
    const title = titleRef.current;
    if (!title || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const chars = title.querySelectorAll('.prob-char');
    gsap.set(chars, { yPercent: 115 });

    const ctx = gsap.context(() => {
      gsap.to(chars, {
        yPercent: 0,
        duration: 0.5, ease: 'power4.out',
        stagger: { each: 0.016, from: 'start' },
        scrollTrigger: { trigger: title, start: 'top 90%', toggleActions: 'play none none none' },
      });
    }, title);

    return () => ctx.revert();
  }, []);

  // ── Counting number animation on scroll
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      numbersRef.current.forEach((el, i) => {
        if (!el) return;
        const { numericValue, prefix, suffix } = PAIN_POINTS[i];
        const obj = { val: 0 };

        gsap.to(obj, {
          val: numericValue,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
          onUpdate() {
            el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
          },
          onComplete() {
            el.textContent = `${prefix}${numericValue}${suffix}`;
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  // ── Cards scroll reveal — alternate slide from left/right
  useEffect(() => {
    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const fromX = isMobile ? 0 : (i % 2 === 0 ? -60 : 60);

        gsap.from(card, {
          x: fromX, y: isMobile ? 30 : 20,
          opacity: 0,
          duration: 0.5, ease: 'power3.out',
          delay: isMobile ? 0 : i * 0.06,
          scrollTrigger: { trigger: card, start: 'top 93%', toggleActions: 'play none none none' },
        });

        // Idle float
        if (!reduced) {
          gsap.to(card, {
            y: isMobile ? -5 : -9,
            duration: 3.8 + i * 0.55,
            ease: 'sine.inOut',
            yoyo: true, repeat: -1,
            delay: i * 0.9,
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  // ── Shimmer sweep per card
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
            duration: 0.85, ease: 'power2.inOut',
            onComplete: () => gsap.set(el, { opacity: 0 }),
          }
        );
      }
      const id = setTimeout(() => {
        runShimmer();
        setInterval(runShimmer, 7500 + i * 900);
      }, 3500 + i * 1100);

      return () => clearTimeout(id);
    });
  }, []);

  // ── Blob drift per card
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    blobRef.current.forEach((blob, i) => {
      if (!blob) return;
      gsap.to(blob, {
        x: i % 2 === 0 ? 20 : -20,
        y: i % 2 === 0 ? -14 : 16,
        duration: 5.5 + i * 0.7,
        ease: 'sine.inOut',
        yoyo: true, repeat: -1,
        delay: i * 0.6,
      });
    });
  }, []);

  // ── 3D tilt on mouse (desktop)
  function onCardMove(e, i) {
    if (window.innerWidth < 768) return;
    const el = cardsRef.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    gsap.to(el, {
      rotateY:  x * 10, rotateX: -y * 8, z: 16,
      duration: 0.3, ease: 'power2.out', overwrite: 'auto',
    });
  }

  function onCardLeave(i) {
    const el = cardsRef.current[i];
    if (!el) return;
    gsap.to(el, {
      rotateY: 0, rotateX: 0, z: 0,
      duration: 0.65, ease: 'elastic.out(1, 0.55)', overwrite: 'auto',
    });
  }

  const LINE1 = 'ARRIVER';
  const LINE2 = 'EN FRANCE';
  const LINE3 = 'C\'EST PAS';
  const LINE4 = 'SIMPLE.';

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(44px,6vw,88px) clamp(16px,5vw,80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Deep red radial background glow — marks the "problem" emotional zone */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: '90vw', height: '70vh',
        background: 'radial-gradient(ellipse, rgba(200,30,30,0.045) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Section header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,64px)' }}>

          {/* Tag badge */}
          <div style={{
            display: 'inline-flex', marginBottom: 20,
            padding: '5px 16px',
            border: '1px solid rgba(255,77,77,0.28)',
            borderRadius: 100,
            background: 'rgba(255,77,77,0.06)',
          }}>
            <span style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'rgba(255,120,120,0.85)',
            }}>La réalité des étudiants étrangers</span>
          </div>

          {/* Big title — char-by-char curtain reveal */}
          <h2 ref={titleRef} style={{
            fontFamily: 'var(--font-bebas)',
            fontWeight: 400,
            fontSize: 'clamp(3rem,8vw,9rem)',
            lineHeight: 0.92, letterSpacing: '0.04em',
            color: '#fff', margin: 0,
          }}>
            {[LINE1, LINE2, LINE3, LINE4].map((line, li) => (
              <span key={li} style={{ display: 'block' }}>
                {line.split('').map((ch, ci) => (
                  <span key={ci} className="char-wrap" style={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    verticalAlign: 'bottom',
                  }}>
                    <span
                      className="prob-char"
                      style={{
                        display: 'inline-block',
                        color: li === 3 ? '#FF4D4D' : li === 2 ? 'rgba(255,255,255,0.5)' : '#fff',
                      }}
                    >
                      {ch === ' ' ? ' ' : ch}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h2>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 'clamp(0.82rem, 1.3vw, 1.05rem)',
            color: 'rgba(255,255,255,0.38)',
            maxWidth: 'min(480px, 88vw)',
            margin: 'clamp(20px,3vw,32px) auto 0',
            lineHeight: 1.75,
          }}>
            Chaque année, des milliers d&apos;étudiants arrivent en France
            avec les mêmes obstacles. Dalili les résout, un par un.
          </p>
        </div>

        {/* ── Pain point cards */}
        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: 'clamp(14px,2.5vw,28px)',
        }}>
          {PAIN_POINTS.map((point, i) => (
            <div
              key={i}
              ref={el => { cardsRef.current[i] = el; }}
              onMouseMove={e => onCardMove(e, i)}
              onMouseLeave={() => onCardLeave(i)}
              style={{
                padding: 'clamp(28px,4vw,44px)',
                background: `linear-gradient(145deg, rgba(${point.accentRgb},0.12) 0%, rgba(2,5,18,0.97) 100%)`,
                border: `1px solid rgba(${point.accentRgb},0.32)`,
                borderRadius: 22,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: [
                  '0 20px 60px rgba(0,0,0,0.4)',
                  `0 0 40px rgba(${point.accentRgb},0.07)`,
                ].join(', '),
                position: 'relative', overflow: 'hidden',
                cursor: 'default',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              {/* Animated blob */}
              <div
                ref={el => { blobRef.current[i] = el; }}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '-20%', left: '-20%',
                  width: '140%', height: '140%',
                  background: `radial-gradient(circle at 40% 40%, rgba(${point.accentRgb},0.10) 0%, transparent 60%)`,
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  zIndex: 0,
                  filter: 'blur(28px)',
                }}
              />

              {/* Shimmer sweep */}
              <div
                ref={el => { shimmerRef.current[i] = el; }}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '60%', height: '100%',
                  background: `linear-gradient(105deg, transparent 30%, rgba(${point.accentRgb},0.09) 50%, transparent 70%)`,
                  transform: 'translateX(-110%)',
                  pointerEvents: 'none',
                  zIndex: 5,
                  opacity: 0,
                }}
              />

              {/* Top accent stripe */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${point.accent}, transparent)`,
                zIndex: 2,
              }} />

              {/* Corner glow */}
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: -10, right: -10,
                width: 160, height: 160,
                background: `radial-gradient(circle at bottom right, rgba(${point.accentRgb},0.14) 0%, transparent 70%)`,
                pointerEvents: 'none', zIndex: 1,
              }} />

              {/* ── Icon + tag row */}
              <div style={{
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 24,
                position: 'relative', zIndex: 3,
              }}>
                <div style={{
                  width: 56, height: 56,
                  background: `rgba(${point.accentRgb},0.12)`,
                  border: `1px solid rgba(${point.accentRgb},0.28)`,
                  borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem',
                  boxShadow: `0 0 20px rgba(${point.accentRgb},0.5), 0 0 40px rgba(${point.accentRgb},0.2)`,
                  flexShrink: 0,
                }}>
                  <span aria-hidden="true" style={{ display: 'block', lineHeight: 1 }}>{point.icon}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.65rem', fontWeight: 700,
                    letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)',
                  }}>{point.tag}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 0.4, 0.15].map((op, j) => (
                      <div key={j} style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: point.accent,
                        opacity: op,
                        boxShadow: `0 0 6px ${point.accent}`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* ── BIG NUMBER */}
              <div style={{
                fontFamily: 'var(--font-bebas)',
                fontWeight: 400,
                fontSize: 'clamp(4rem,8vw,6.5rem)',
                lineHeight: 1,
                letterSpacing: '0.02em',
                color: point.accent,
                textShadow: `0 0 40px rgba(${point.accentRgb},0.6), 0 0 80px rgba(${point.accentRgb},0.25)`,
                marginBottom: 4,
                position: 'relative', zIndex: 3,
              }}>
                <span
                  ref={el => { numbersRef.current[i] = el; }}
                >
                  {point.prefix}0{point.suffix}
                </span>
              </div>

              {/* Stat label */}
              <div style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: `rgba(${point.accentRgb},0.7)`,
                marginBottom: 20,
                position: 'relative', zIndex: 3,
              }}>
                {point.label}
              </div>

              {/* Divider */}
              <div style={{
                height: 1,
                background: `linear-gradient(90deg, rgba(${point.accentRgb},0.4), transparent)`,
                marginBottom: 18,
                position: 'relative', zIndex: 3,
              }} />

              {/* Card title */}
              <h3 style={{
                fontFamily: 'var(--font-bebas)',
                fontWeight: 400,
                fontSize: 'clamp(1.8rem,3vw,2.6rem)',
                lineHeight: 0.95, letterSpacing: '0.04em',
                color: '#fff', margin: '0 0 14px',
                whiteSpace: 'pre-line',
                position: 'relative', zIndex: 3,
              }}>
                {point.title}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300, fontSize: '0.9rem',
                lineHeight: 1.72, color: 'rgba(255,255,255,0.42)',
                margin: '0 0 14px',
                position: 'relative', zIndex: 3,
              }}>
                {point.desc}
              </p>

              {/* Source footnote */}
              <p style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.5rem', fontWeight: 500,
                letterSpacing: '0.08em',
                color: `rgba(${point.accentRgb},0.35)`,
                margin: 0,
                position: 'relative', zIndex: 3,
              }}>
                * Source : {point.source}
              </p>

              {/* Bottom accent line */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, rgba(${point.accentRgb},0.32), transparent)`,
                zIndex: 2,
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
