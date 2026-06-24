'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Calculator, GraduationCap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const cardsRef   = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Title reveal
  useEffect(() => {
    const title = titleRef.current;
    if (!title || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lines = title.querySelectorAll('.feat-line');
    gsap.set(lines, { opacity: 0, y: 20 });

    const ctx = gsap.context(() => {
      gsap.to(lines, {
        opacity: 1, y: 0,
        duration: 0.5, ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: title, start: 'top 88%', toggleActions: 'play none none none' },
      });
    }, title);

    return () => ctx.revert();
  }, []);

  // ── Cards scroll entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 30, opacity: 0,
          duration: 0.45, ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: card, start: 'top 93%', toggleActions: 'play none none none' },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const hoverEnter = (el, bg, border) => {
    el.style.background = bg;
    el.style.borderColor = border;
  };
  const hoverLeave = (el, bg, border) => {
    el.style.background = bg;
    el.style.borderColor = border;
  };

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(64px,8vw,120px) clamp(16px,5vw,80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translateX(-50%)',
        width: '70vw', height: '50vh',
        background: 'radial-gradient(ellipse, rgba(1,77,248,0.045) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* ── Title */}
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: 'clamp(40px,5vw,64px)' }}>
          <p className="feat-line" style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(77,143,255,0.7)',
            margin: '0 0 12px',
          }}>
            La plateforme
          </p>
          <h2 className="feat-line" style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 900,
            fontSize: 'clamp(28px,4vw,52px)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.1,
          }}>
            Ce que tu trouves ici
          </h2>
        </div>

        {/* ── Bento grid */}
        <div
          className="bento-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
            gridTemplateRows: isMobile ? 'auto' : '1fr 1fr',
            gap: 14,
          }}
        >

          {/* ── Card 1: GUIDES VÉRIFIÉS — spans both rows on left */}
          <div
            ref={el => { cardsRef.current[0] = el; }}
            onMouseEnter={e => hoverEnter(e.currentTarget, 'rgba(1,77,248,0.08)', 'rgba(1,77,248,0.2)')}
            onMouseLeave={e => hoverLeave(e.currentTarget, 'rgba(1,77,248,0.05)', 'rgba(1,77,248,0.12)')}
            style={{
              background: 'rgba(1,77,248,0.05)',
              border: '1px solid rgba(1,77,248,0.12)',
              borderRadius: 20,
              padding: 36,
              gridRow: isMobile ? 'auto' : '1 / 3',
              minHeight: isMobile ? 'auto' : 320,
              display: 'flex',
              flexDirection: 'column',
              transition: 'background 0.2s, border-color 0.2s',
              cursor: 'default',
            }}
          >
            <BookOpen size={26} color="#4d8fff" strokeWidth={1.5} aria-hidden="true" />

            <h3 style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 800,
              fontSize: 20,
              color: '#ffffff',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: '20px 0 0',
            }}>
              Guides vérifiés
            </h3>

            <div style={{
              display: 'inline-block',
              background: 'rgba(1,77,248,0.1)',
              color: '#4d8fff',
              fontSize: 10,
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: 20,
              margin: '10px 0 16px',
              width: 'fit-content',
            }}>
              Sources officielles
            </div>

            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 400,
              fontSize: 14,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.75,
              margin: 0,
              flex: 1,
            }}>
              {"Chaque guide est vérifié sur Campus France, Ameli et CAF.fr. Pas d'infos inventées, pas de dates périmées."}
            </p>

            {/* Bottom bar */}
            <div style={{
              marginTop: 'auto',
              paddingTop: 20,
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 12,
                color: 'rgba(255,255,255,0.65)',
                margin: '0 0 16px',
              }}>
                49 guides · Mis à jour juin 2026
              </p>
              <Link
                href="/blog"
                style={{
                  display: 'inline-block',
                  background: 'transparent',
                  border: '1px solid rgba(1,77,248,0.35)',
                  color: '#4d8fff',
                  padding: '9px 20px',
                  borderRadius: 8,
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(1,77,248,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Voir les guides →
              </Link>
            </div>
          </div>

          {/* ── Card 2: 3 OUTILS INTERACTIFS — top right */}
          <div
            ref={el => { cardsRef.current[1] = el; }}
            onMouseEnter={e => hoverEnter(e.currentTarget, 'rgba(34,197,94,0.07)', 'rgba(34,197,94,0.2)')}
            onMouseLeave={e => hoverLeave(e.currentTarget, 'rgba(34,197,94,0.04)', 'rgba(34,197,94,0.12)')}
            style={{
              background: 'rgba(34,197,94,0.04)',
              border: '1px solid rgba(34,197,94,0.12)',
              borderRadius: 20,
              padding: 28,
              gridRow: isMobile ? 'auto' : '1',
              gridColumn: isMobile ? 'auto' : '2',
              display: 'flex',
              flexDirection: 'column',
              transition: 'background 0.2s, border-color 0.2s',
              cursor: 'default',
            }}
          >
            <Calculator size={22} color="#22c55e" strokeWidth={1.5} aria-hidden="true" />

            <h3 style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 800,
              fontSize: 16,
              color: '#ffffff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: '12px 0 6px',
            }}>
              3 Outils interactifs
            </h3>

            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 12,
              color: 'rgba(255,255,255,0.82)',
              margin: '0 0 16px',
              flex: 1,
            }}>
              Simulateur · Calendrier · Comparateur
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { href: '/simulateur', label: 'Simulateur →' },
                { href: '/calendrier', label: 'Calendrier →' },
                { href: '/comparer',   label: 'Comparateur →' },
              ].map(btn => (
                <Link
                  key={btn.href}
                  href={btn.href}
                  style={{
                    display: 'inline-block',
                    background: 'rgba(34,197,94,0.12)',
                    color: '#22c55e',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: 12,
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.12)'; }}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Card 3: MENTORS BIENTÔT — bottom right */}
          <div
            ref={el => { cardsRef.current[2] = el; }}
            onMouseEnter={e => hoverEnter(e.currentTarget, 'rgba(251,191,36,0.06)', 'rgba(251,191,36,0.18)')}
            onMouseLeave={e => hoverLeave(e.currentTarget, 'rgba(251,191,36,0.03)', 'rgba(251,191,36,0.1)')}
            style={{
              background: 'rgba(251,191,36,0.03)',
              border: '1px solid rgba(251,191,36,0.1)',
              borderRadius: 20,
              padding: 28,
              gridRow: isMobile ? 'auto' : '2',
              gridColumn: isMobile ? 'auto' : '2',
              display: 'flex',
              flexDirection: 'column',
              transition: 'background 0.2s, border-color 0.2s',
              cursor: 'default',
            }}
          >
            <GraduationCap size={22} color="#fbbf24" strokeWidth={1.5} aria-hidden="true" />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 6px', flexWrap: 'wrap' }}>
              <h3 style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 800,
                fontSize: 16,
                color: '#ffffff',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                margin: 0,
              }}>
                Mentors bientôt
              </h3>
              <div style={{
                display: 'inline-block',
                background: 'rgba(251,191,36,0.1)',
                color: '#fbbf24',
                fontSize: 9,
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: 20,
              }}>
                Liste ouverte
              </div>
            </div>

            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 12,
              color: 'rgba(255,255,255,0.82)',
              margin: '0 0 16px',
              flex: 1,
            }}>
              {"Des étudiants de ton pays, dans ta filière."}
            </p>

            <Link
              href="#waitlist"
              style={{
                display: 'inline-block',
                background: 'rgba(251,191,36,0.1)',
                color: '#fbbf24',
                border: 'none',
                padding: '7px 16px',
                borderRadius: 20,
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 12,
                fontWeight: 500,
                textDecoration: 'none',
                width: 'fit-content',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.1)'; }}
            >
              Rejoindre la liste →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
