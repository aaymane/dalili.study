'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

gsap.registerPlugin(ScrollTrigger);

const PlaneCinematic = dynamic(() => import('./PlaneCinematic'), { ssr: false });
const ParisSkyline   = dynamic(() => import('./ParisSkyline'),   { ssr: false });

// Floating stat chips — fill the empty hero space
const HERO_CHIPS = [
  { icon: '🌍', value: '200+', label: 'étudiants inscrits' },
  { icon: '🇫🇷', value: 'Paris',      label: 'Destination' },
  { icon: '📱', value: 'iOS & Android', label: 'Bientôt' },
];

// Mobile-first sizes: clamp(mobile, fluid, desktop) — bigger on mobile
const LINES = [
  { text: 'TON',     color: '#ffffff',               size: 'clamp(5.2rem,13.5vw,16rem)', ls: '0.01em' },
  { text: 'GUIDE',   color: '#ffffff',               size: 'clamp(5.2rem,13.5vw,16rem)', ls: '0.01em' },
  { text: 'POUR LA', color: 'rgba(255,255,255,0.5)', size: 'clamp(2.6rem,6.5vw,7.5rem)',  ls: '0.04em' },
  { text: 'FRANCE.', color: '#014df8',               size: 'clamp(4.6rem,12vw,14rem)',    ls: '0.01em' },
];

export default function HeroSection({ revealed = false }) {
  const sectionRef = useRef(null);
  const planeRef   = useRef(null);
  const textRef    = useRef(null);
  const linesRef   = useRef([]);
  const badgeRef   = useRef(null);
  const subRef     = useRef(null);
  const chipsRef   = useRef([]);

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
        // Chips: fade in + GSAP float + 3D perspective wobble
        chipsRef.current.forEach((chip, i) => {
          if (!chip) return;
          const wrap = chip.parentElement;

          // Fade in
          gsap.to(chip, { opacity: 1, duration: 0.7, ease: 'power2.out', delay: i * 0.25 });

          // Float (y axis) on the outer wrapper — replaces CSS animation
          gsap.to(wrap, {
            y: -(7 + i * 2),
            duration: 4 + i * 0.6,
            ease: 'sine.inOut',
            yoyo: true, repeat: -1,
            delay: i * 1.1,
          });

          // 3D perspective wobble on inner chip (rotates independently of float)
          gsap.to(chip, {
            rotateX: i % 2 === 0 ?  6 : -5,
            rotateY: i % 2 === 0 ? -8 :  7,
            z: 14,
            duration: 3.5 + i * 0.9,
            ease: 'sine.inOut',
            yoyo: true, repeat: -1,
            delay: 0.4 + i * 1.1,
          });
        });

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

      // Badge + subtitle
      gsap.fromTo(
        [badgeRef.current, subRef.current].filter(Boolean),
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

      // ── Chips fade OUT before text arrives (opacity only — y handled by GSAP float)
      const chipEls = Array.from(section.querySelectorAll('.hero-chip-wrap'));
      if (chipEls.length) {
        gsap.to(chipEls, {
          opacity: 0,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${mobile ? 200 : 320}`,
            scrub: true,
          },
        });
      }

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

  // ── Mouse parallax — desktop only; pauses when hero is off-screen or tab hidden
  useEffect(() => {
    if (window.innerWidth < 768) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const el      = textRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    let inView = true;

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

    // Stop loop when hero scrolls out of viewport
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver((entries) => {
          inView = entries[0].isIntersecting;
          if (!inView) {
            cancelAnimationFrame(raf);
          } else {
            raf = requestAnimationFrame(loop);
          }
        }, { threshold: 0 })
      : null;
    if (io) io.observe(section);

    // Stop loop when tab hidden
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (inView) {
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(raf);
      if (io) io.unobserve(section);
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

        {/* Volumetric spotlight — no filter:blur (CSS gradient is soft enough) */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '140vw', height: '130vh',
          background: 'conic-gradient(from 258deg at 50% 0%, rgba(1,77,248,0) 0deg, rgba(1,77,248,0.04) 14deg, rgba(1,77,248,0) 28deg)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Horizon glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '8%', left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw', height: '35vh',
          background: 'radial-gradient(ellipse at center bottom, rgba(1,77,248,0.07) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 1,
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

        {/* ── TEXT LAYER
            hero-text-offset: CSS-only upward shift on mobile so content
            sits at ~35% from top instead of 50% — prevents the visual void
            when the plane has flown away. Does NOT touch GSAP transforms. */}
        <div className="hero-text-offset" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
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
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              background: 'rgba(255,255,255,0.04)',
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
        </div>{/* /hero-text-offset */}

        {/* ── Floating 3D stat chips
            Outer div: CSS absolute position only (GSAP handles float + fade)
            Inner div (ref): GSAP opacity entrance + 3D rotateX/Y wobble */}
        {HERO_CHIPS.map((chip, i) => (
          <div
            key={i}
            className={`hero-chip-wrap hero-chip-wrap-${i}`}
            aria-hidden="true"
            style={{ perspective: '600px' }}
          >
            <div
              ref={el => { chipsRef.current[i] = el; }}
              className="hero-chip"
              style={{
                opacity: 0,
                transformStyle: 'preserve-3d',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 18px 11px 12px',
                background: 'linear-gradient(135deg, rgba(1,12,40,0.93) 0%, rgba(1,5,22,0.90) 100%)',
                border: '1px solid rgba(1,77,248,0.28)',
                borderLeft: '3px solid rgba(1,77,248,0.92)',
                borderRadius: 18,
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                boxShadow: [
                  '0 12px 40px rgba(0,0,0,0.60)',
                  '0 0 28px rgba(1,77,248,0.14)',
                  'inset 0 1px 0 rgba(255,255,255,0.08)',
                  'inset 0 -1px 0 rgba(0,0,0,0.35)',
                ].join(', '),
                whiteSpace: 'nowrap',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer sweep */}
              <div className={`chip-shimmer chip-shimmer-${i}`} aria-hidden="true" style={{
                position: 'absolute', top: 0, left: 0,
                width: '60%', height: '100%',
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Icon box */}
              <div style={{
                width: 36, height: 36,
                borderRadius: 10,
                background: 'rgba(1,77,248,0.16)',
                border: '1px solid rgba(1,77,248,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', flexShrink: 0,
                boxShadow: '0 0 14px rgba(1,77,248,0.25)',
              }}>
                <span style={{ lineHeight: 1 }}>{chip.icon}</span>
              </div>

              <div>
                <div style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 700, fontSize: '0.84rem',
                  color: '#fff', lineHeight: 1.15,
                }}>{chip.value}</div>
                <div style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.57rem',
                  color: 'rgba(77,143,255,0.78)',
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  marginTop: 2,
                }}>{chip.label}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Paris skyline — cinematic bottom decoration, fades in after plane lands */}
        <ParisSkyline revealed={revealed} />

      </div>
    </section>
  );
}
