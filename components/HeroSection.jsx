'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

gsap.registerPlugin(ScrollTrigger);

const PlaneScene = dynamic(() => import('./PlaneScene'), { ssr: false });

const LINES = [
  { text: 'TON',     color: '#ffffff',               size: 'clamp(5.5rem,13.5vw,16rem)', ls: '0.02em' },
  { text: 'GUIDE',   color: '#ffffff',               size: 'clamp(5.5rem,13.5vw,16rem)', ls: '0.02em' },
  { text: 'POUR LA', color: 'rgba(255,255,255,0.5)', size: 'clamp(2.6rem,6.5vw,7.5rem)',  ls: '0.06em' },
  { text: 'FRANCE.', color: '#014df8',               size: 'clamp(5rem,12vw,14rem)',      ls: '0.02em' },
];

const SECTION_VH = 420;

export default function HeroSection({ revealed = false }) {
  const sectionRef = useRef(null);
  const planeRef   = useRef(null);
  const textRef    = useRef(null);
  const linesRef   = useRef([]);
  const badgeRef   = useRef(null);
  const subRef     = useRef(null);
  const cueRef     = useRef(null);

  // ── Hide everything until reveal
  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    if (planeRef.current) {
      // Start off-screen: top-right corner
      gsap.set(planeRef.current, {
        xPercent: -50, yPercent: -50,
        x:  W * 0.85, y: -H * 0.65,
        rotate: -6, opacity: 0,
      });
    }
    if (textRef.current) gsap.set(textRef.current, { opacity: 0 });
  }, []);

  // ── Triggered when logo disappears: plane entrance + all scroll animations
  useEffect(() => {
    if (!revealed) return;
    const section = sectionRef.current;
    const plane   = planeRef.current;
    const text    = textRef.current;
    if (!section || !plane || !text) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // 1. Plane enters from off-screen top-right → lands at visible top-right
    gsap.to(plane, {
      xPercent: -50, yPercent: -50,
      x:  W * 0.28, y: -H * 0.18,
      rotate: 5, opacity: 1,
      duration: 1.7, ease: 'power3.out',
      onComplete: () => {
        // 2. Scroll-driven diagonal: top-right → bottom-left
        gsap.context(() => {
          gsap.to(plane, {
            xPercent: -50, yPercent: -50,
            x: -W * 0.62,
            y:  H * 0.38,
            rotate: -4,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '58% bottom',
              scrub: 2.2,
            },
          });
        }, section);
      },
    });

    // 3. Text & character animations (scroll-linked)
    const ctx = gsap.context(() => {

      // Text container fades in as plane exits
      gsap.fromTo(text,
        { opacity: 0 },
        {
          opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: '32% center',
            end:   '46% center',
            scrub: true,
          },
        },
      );

      // Badge / subtitle / scroll-cue slide up
      gsap.fromTo(
        [badgeRef.current, subRef.current, cueRef.current].filter(Boolean),
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: '44% center',
            end:   '54% center',
            scrub: true,
          },
        },
      );

      // 4. Per-character curtain reveal — each line staggered in sequence
      linesRef.current.forEach((line, i) => {
        if (!line) return;
        const chars = line.querySelectorAll('.hero-char');
        if (!chars.length) return;

        // Start: characters hidden below clip box
        gsap.set(chars, { yPercent: 115, opacity: 0 });

        // Stagger into view from left, scrubbed to scroll
        gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          ease: 'power3.out',
          stagger: {
            each: 0.032,
            from: 'start',
          },
          scrollTrigger: {
            trigger: section,
            start: `${33 + i * 5}% center`,
            end:   `${47 + i * 5}% center`,
            scrub: 1.2,
          },
        });
      });

    }, section);

    return () => ctx.revert();
  }, [revealed]);

  // ── Mouse parallax — 3D tilt on text block
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const el = textRef.current;
    if (!el) return;

    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;
      el.style.transform = `perspective(1400px) rotateY(${(cx * 3.5).toFixed(2)}deg) rotateX(${(-cy * 2.5).toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} style={{ position: 'relative', height: `${SECTION_VH}vh` }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* Volumetric spotlight cone */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '140vw', height: '130vh',
          background: 'conic-gradient(from 258deg at 50% 0%, rgba(1,77,248,0) 0deg, rgba(1,77,248,0.05) 14deg, rgba(1,77,248,0) 28deg)',
          pointerEvents: 'none', zIndex: 1, filter: 'blur(1px)',
        }} />

        {/* Horizon glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '8%', left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw', height: '35vh',
          background: 'radial-gradient(ellipse at center bottom, rgba(1,77,248,0.07) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 1, filter: 'blur(2px)',
        }} />

        {/* ── PLANE wrapper — left/top 50% + GSAP xPercent/yPercent = centered */}
        <div ref={planeRef} style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: 'clamp(520px, 68vw, 980px)',
          height: 'clamp(320px, 42.5vw, 612px)',
          zIndex: 4, pointerEvents: 'none',
          willChange: 'transform',
        }}>
          <PlaneScene />
        </div>

        {/* ── TEXT LAYER (scroll-revealed) */}
        <div
          ref={textRef}
          style={{
            position: 'relative', zIndex: 10,
            textAlign: 'center',
            userSelect: 'none', pointerEvents: 'none',
            padding: '0 24px', width: '100%',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Badge */}
          <div ref={badgeRef} style={{
            display: 'inline-flex', marginBottom: 36,
            padding: '7px 22px',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 100,
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            background: 'rgba(255,255,255,0.03)',
            animation: 'badgeGlow 4s ease-in-out infinite',
          }}>
            <span style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.62rem', letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              ✦ APPLICATION MOBILE &nbsp;·&nbsp; IOS &amp; ANDROID &nbsp;·&nbsp; BIENTÔT DISPONIBLE
            </span>
          </div>

          {/* Title — per-character cascade reveal */}
          <h1 style={{
            margin: '0 0 32px',
            fontFamily: 'var(--font-bebas)',
            fontWeight: 400, lineHeight: 0.88,
          }}>
            {LINES.map((line, i) => (
              <div
                key={i}
                ref={el => { linesRef.current[i] = el; }}
                style={{
                  display: 'block',
                  fontSize: line.size,
                  letterSpacing: line.ls,
                  color: line.color,
                  marginBottom: i === 1 ? '0.08em' : 0,
                }}
              >
                {line.text.split('').map((ch, j) => (
                  <span key={j} className="char-wrap">
                    <span className="hero-char">
                      {ch === ' ' ? ' ' : ch}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </h1>

          {/* Subtitle */}
          <p ref={subRef} style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)',
            color: 'rgba(255,255,255,0.42)',
            maxWidth: 440, margin: '0 auto', lineHeight: 1.75,
          }}>
            L&apos;application qui accompagne les étudiants<br />
            internationaux à chaque étape de leur aventure.
          </p>
        </div>

        {/* Scroll cue */}
        <div ref={cueRef} style={{
          position: 'absolute', bottom: 44, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          zIndex: 10, pointerEvents: 'none', userSelect: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.6rem', letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
          }}>
            Découvrir
          </span>
          <div style={{
            width: 1, height: 40,
            background: 'linear-gradient(to bottom, rgba(1,77,248,0.8), transparent)',
            animation: 'heroPulse 2.2s ease-in-out infinite',
          }} />
        </div>

      </div>
    </section>
  );
}
