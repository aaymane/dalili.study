'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

gsap.registerPlugin(ScrollTrigger);

const PlaneCinematic = dynamic(() => import('./PlaneCinematic'), { ssr: false });

// Mobile-first sizes: clamp(mobile, fluid, desktop)
const LINES = [
  { text: 'TON',     color: '#ffffff',               size: 'clamp(3.4rem,13.5vw,16rem)', ls: '0.02em' },
  { text: 'GUIDE',   color: '#ffffff',               size: 'clamp(3.4rem,13.5vw,16rem)', ls: '0.02em' },
  { text: 'POUR LA', color: 'rgba(255,255,255,0.5)', size: 'clamp(1.7rem,6.5vw,7.5rem)',  ls: '0.06em' },
  { text: 'FRANCE.', color: '#014df8',               size: 'clamp(3rem,12vw,14rem)',      ls: '0.02em' },
];

export default function HeroSection({ revealed = false }) {
  const sectionRef = useRef(null);
  const planeRef   = useRef(null);
  const textRef    = useRef(null);
  const linesRef   = useRef([]);
  const badgeRef   = useRef(null);
  const subRef     = useRef(null);
  const cueRef     = useRef(null);

  // ── Set section height + initial hidden state before paint
  useEffect(() => {
    const W      = window.innerWidth;
    const H      = window.innerHeight;
    const mobile = W < 768;

    // Adjust section scroll distance for mobile (300vh) vs desktop (420vh)
    if (sectionRef.current) {
      sectionRef.current.style.height = `${mobile ? 300 : 420}vh`;
    }

    if (planeRef.current) {
      // ── Coordinate system:
      //   wrapper: position:absolute left:50% top:50%
      //   xPercent:-50 yPercent:-50  →  element IS centered at (W/2, H/2) when x=0,y=0
      //   So x=0 means "centered" on mobile, NOT W*0.5 !
      gsap.set(planeRef.current, {
        xPercent: -50, yPercent: -50,
        x:  mobile ? 0       : W * 0.55,   // mobile: centered | desktop: right half
        y:  mobile ? -H * 0.7 : -H * 0.65, // start above viewport
        rotate: -8, opacity: 0,
      });
    }
    if (textRef.current) gsap.set(textRef.current, { opacity: 0 });
  }, []);

  // ── Entrance + scroll animations (run once logo disappears)
  useEffect(() => {
    if (!revealed) return;
    const section = sectionRef.current;
    const plane   = planeRef.current;
    const text    = textRef.current;
    if (!section || !plane || !text) return;

    const W      = window.innerWidth;
    const H      = window.innerHeight;
    const mobile = W < 768;

    // 1. Plane swoops in from off-screen
    gsap.to(plane, {
      xPercent: -50, yPercent: -50,
      x:      mobile ? 0       : W * 0.26,   // centered on mobile, right on desktop
      y:      mobile ? -H * 0.2 : -H * 0.18, // upper portion
      rotate: mobile ? 2 : 5,
      opacity: 1,
      duration: 1.7, ease: 'power3.out',
      onComplete: () => {
        // 2. Scroll-driven diagonal exit
        gsap.context(() => {
          gsap.to(plane, {
            xPercent: -50, yPercent: -50,
            x:       mobile ? -W * 0.7 : -W * 0.62,
            y:       mobile ?  H * 0.25 :  H * 0.38,
            rotate: -6, opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end:   '55% bottom',
              scrub: 2,
            },
          });
        }, section);
      },
    });

    // 3. Text & character reveal (scroll-linked)
    const ctx = gsap.context(() => {

      // Text container fades in
      gsap.fromTo(text,
        { opacity: 0 },
        {
          opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: mobile ? '28% center' : '32% center',
            end:   mobile ? '44% center' : '46% center',
            scrub: true,
          },
        },
      );

      // Badge + subtitle + scroll-cue
      gsap.fromTo(
        [badgeRef.current, subRef.current, cueRef.current].filter(Boolean),
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: mobile ? '42% center' : '44% center',
            end:   mobile ? '52% center' : '54% center',
            scrub: true,
          },
        },
      );

      // Per-character curtain reveal
      linesRef.current.forEach((line, i) => {
        if (!line) return;
        const chars = line.querySelectorAll('.hero-char');
        if (!chars.length) return;

        gsap.set(chars, { yPercent: 115, opacity: 0 });

        const offset = mobile ? 4 : 5;
        gsap.to(chars, {
          yPercent: 0, opacity: 1,
          ease: 'power3.out',
          stagger: { each: 0.028, from: 'start' },
          scrollTrigger: {
            trigger: section,
            start: `${(mobile ? 30 : 33) + i * offset}% center`,
            end:   `${(mobile ? 44 : 47) + i * offset}% center`,
            scrub: 1.0,
          },
        });
      });

    }, section);

    return () => ctx.revert();
  }, [revealed]);

  // ── Mouse parallax — desktop only
  useEffect(() => {
    if (window.innerWidth < 768) return;
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
    <section
      ref={sectionRef}
      className="hero-section"
      style={{ position: 'relative', height: '420vh' /* overridden by JS on mobile */ }}
    >
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* Volumetric spotlight */}
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

        {/* ── PLANE wrapper
            CSS class controls size (responsive).
            GSAP controls position via transform (x/y/xPercent/yPercent).
            x=0 + xPercent=-50 + left:50% = perfectly centered on mobile. */}
        <div
          ref={planeRef}
          className="hero-plane-wrap"
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            /* desktop fallback — CSS class overrides on mobile */
            width: 'clamp(460px, 60vw, 900px)',
            height: 'clamp(288px, 37.5vw, 562px)',
            zIndex: 4, pointerEvents: 'none',
            willChange: 'transform',
          }}
        >
          <PlaneCinematic />
        </div>

        {/* ── TEXT LAYER */}
        <div
          ref={textRef}
          className="hero-text-wrap"
          style={{
            position: 'relative', zIndex: 10,
            textAlign: 'center',
            userSelect: 'none', pointerEvents: 'none',
            padding: '0 20px', width: '100%',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Badge */}
          <div
            ref={badgeRef}
            className="hero-badge"
            style={{
              display: 'inline-flex', marginBottom: 32,
              padding: '7px 18px',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 100,
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              background: 'rgba(255,255,255,0.03)',
              animation: 'badgeGlow 4s ease-in-out infinite',
              maxWidth: '92vw',
            }}
          >
            <span className="hero-badge-text" style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem', letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              ✦ APP MOBILE &nbsp;·&nbsp; IOS &amp; ANDROID &nbsp;·&nbsp; BIENTÔT
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            margin: '0 0 28px',
            fontFamily: 'var(--font-bebas)',
            fontWeight: 400, lineHeight: 0.9,
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
                  marginBottom: i === 1 ? '0.06em' : 0,
                }}
              >
                {line.text.split('').map((ch, j) => (
                  <span key={j} className="char-wrap">
                    <span className="hero-char">{ch === ' ' ? ' ' : ch}</span>
                  </span>
                ))}
              </div>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            ref={subRef}
            className="hero-subtitle"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: 'clamp(0.82rem, 1.3vw, 1.05rem)',
              color: 'rgba(255,255,255,0.42)',
              maxWidth: 'min(440px, 88vw)',
              margin: '0 auto',
              lineHeight: 1.75,
            }}
          >
            L&apos;application qui accompagne les étudiants
            <span className="hero-br"><br /></span>
            {' '}internationaux à chaque étape de leur aventure.
          </p>
        </div>

        {/* Scroll cue */}
        <div ref={cueRef} className="scroll-cue" style={{
          position: 'absolute', bottom: 36, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          zIndex: 10, pointerEvents: 'none', userSelect: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.55rem', letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
          }}>
            Découvrir
          </span>
          <div style={{
            width: 1, height: 32,
            background: 'linear-gradient(to bottom, rgba(1,77,248,0.8), transparent)',
            animation: 'heroPulse 2.2s ease-in-out infinite',
          }} />
        </div>

      </div>
    </section>
  );
}
