'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import DALILIPhones from './DALILIPhones';

gsap.registerPlugin(ScrollTrigger);

const PlaneCinematic = dynamic(() => import('./PlaneCinematic'), { ssr: false });
const ParisSkyline   = dynamic(() => import('./ParisSkyline'),   { ssr: false });

// Mobile-first sizes: clamp(mobile, fluid, desktop) — bigger on mobile
const LINES = [
  { text: 'TON',     color: '#ffffff',               size: 'clamp(5.2rem,13.5vw,16rem)', ls: '0.01em' },
  { text: 'GUIDE',   color: '#ffffff',               size: 'clamp(5.2rem,13.5vw,16rem)', ls: '0.01em' },
  { text: 'POUR LA', color: 'rgba(255,255,255,0.5)', size: 'clamp(2.6rem,6.5vw,7.5rem)',  ls: '0.04em' },
  { text: 'FRANCE.', color: '#014df8',               size: 'clamp(4.6rem,12vw,14rem)',    ls: '0.01em' },
];

export default function HeroSection({ revealed = false }) {
  const [isMobile, setIsMobile] = useState(null);
  const sectionRef        = useRef(null);
  const planeRef          = useRef(null);
  const textRef           = useRef(null);
  const linesRef          = useRef([]);
  const badgeRef          = useRef(null); // kept — still in GSAP array (filter(Boolean) handles null)
  const subRef            = useRef(null);
  const skylineWrap  = useRef(null); // fades out before text appears
  const horizonGlow  = useRef(null); // the blue ellipse following the plane — fades on scroll
  const heroBadgeRef = useRef(null); // "Bientôt disponible" pill above the phones

  // ── Set section height + initial hidden state before paint
  useEffect(() => {
    const W      = window.innerWidth;
    const H      = window.innerHeight;
    const mobile = W < 768;
    setIsMobile(mobile);

    if (sectionRef.current) {
      // Mobile: 200vh — phones fill first screen, text scroll-reveals in second.
      // Desktop: 420vh for the full cinematic scroll sequence.
      sectionRef.current.style.height = mobile ? '200vh' : '420vh';
    }

    if (planeRef.current && !mobile) {
      // Desktop: off-screen above-right, ready to swoop in.
      // Mobile: plane hidden via CSS (display:none), no GSAP needed.
      gsap.set(planeRef.current, {
        xPercent: -50, yPercent: -50,
        x: W * 0.55, y: -H * 0.65,
        rotate: -8, opacity: 0,
      });
    }

    // Text hidden until scroll-reveal on both mobile and desktop.
    if (textRef.current) gsap.set(textRef.current, { opacity: 0 });
    // Desktop badge starts hidden. Mobile badge (heroBadgeRef) is shown via CSS,
    // starts visible, and fades with phones via scroll trigger in revealed effect.
    if (!mobile && heroBadgeRef.current) gsap.set(heroBadgeRef.current, { opacity: 0, y: 10 });
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

    if (!mobile) {
      // 1. Plane swoops in from off-screen (1.7s entrance)
      gsap.to(plane, {
        xPercent: -50, yPercent: -50,
        x: W * 0.26, y: -H * 0.18,
        rotate: 5, opacity: 1,
        duration: 1.7, ease: 'power3.out',
        onComplete: () => {
          gsap.to(plane, {
            xPercent: -50, yPercent: -50,
            x: -W * 0.62, y: H * 0.38,
            rotate: -6, opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end:   '55% bottom',
              scrub: 2,
            },
          });
        },
      });

      // Badge pill fades in on desktop
      if (heroBadgeRef.current) {
        gsap.to(heroBadgeRef.current, {
          opacity: 1, y: 0,
          duration: 0.5, ease: 'power2.out',
          delay: 0.4,
        });
      }
    }

    const ctx = gsap.context(() => {

      // Text container fades in
      gsap.fromTo(text,
        { opacity: 0 },
        {
          opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: mobile ? '50% center' : '32% center',
            end:   mobile ? '60% center' : '46% center',
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
            start: mobile ? '54% center' : '44% center',
            end:   mobile ? '64% center' : '54% center',
            scrub: true,
          },
        },
      );

      if (!mobile) {
        // Background elements (skyline, glow, badge) → fade in first 320px of scroll.
        // gsap.to + immediateRender:false = nothing touched until trigger actually fires,
        // so these elements stay at their natural CSS state on page load.
        const bgEls = [skylineWrap.current, horizonGlow.current, heroBadgeRef.current].filter(Boolean);
        if (bgEls.length) {
          gsap.to(bgEls, {
            opacity: 0,
            ease: 'power2.in',
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+= 320',
              scrub: true,
            },
          });
        }

        // Phones → fade out as the plane sweeps past the left column.
        // CRITICAL: use gsap.to (not fromTo) + immediateRender:false so GSAP does NOT
        // touch the element on mount. fromTo with scrub applies the "from" values
        // immediately, which overrides the CSS transform:translateY(-50%) on
        // .hero-phones-wrap and pushes the phones off-screen inside overflow:hidden.
        // Only animating opacity (no y) avoids all CSS-transform conflicts.
        const chipEls = Array.from(section.querySelectorAll('.hero-chip-wrap'));
        if (chipEls.length) {
          gsap.to(chipEls, {
            opacity: 0,
            ease: 'power2.inOut',
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: `top top-=${Math.round(H * 0.58)}`,
              end:   `top top-=${Math.round(H * 0.92)}`,
              scrub: 1.5,
            },
          });
        }
      } else {
        // Mobile: badge fades out in sync with phones (phones fade by scrollY = H/2)
        if (heroBadgeRef.current) {
          gsap.fromTo(heroBadgeRef.current,
            { opacity: 1 },
            {
              opacity: 0,
              ease: 'power2.in',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: `+=${Math.round(H * 0.5)}`,
                scrub: true,
              },
            }
          );
        }
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
            start: `${(mobile ? 52 : 33) + i * offset}% center`,
            end:   `${(mobile ? 66 : 47) + i * offset}% center`,
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
      <div className="hero-sticky-inner" style={{
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

        {/* Horizon glow — très subtil pour ne pas créer de bande visible sur le fond */}
        <div ref={horizonGlow} aria-hidden="true" style={{
          position: 'absolute', bottom: '10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '40vw', height: '20vh',
          background: 'radial-gradient(ellipse at center bottom, rgba(1,77,248,0.025) 0%, transparent 70%)',
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
          {isMobile === false && <PlaneCinematic />}
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
              fontWeight: 400,
              fontSize: 'clamp(0.82rem, 1.3vw, 1.05rem)',
              color: 'rgba(255,255,255,0.62)',
              maxWidth: 'min(440px, 88vw)',
              margin: '0 auto',
              lineHeight: 1.75,
            }}
          >
            Guides pratiques, démarches administratives et conseils
            <span className="hero-br"><br /></span>
            {' '}— par des étudiants qui sont passés par là.
          </p>
        </div>
        </div>{/* /hero-text-offset */}

        {/* ── "Bientôt disponible" badge above the left card column ── */}
        <div
          ref={heroBadgeRef}
          className="hero-cards-badge"
          aria-hidden="true"
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 16px',
            border: '1px solid rgba(77,143,255,0.28)',
            borderRadius: 100,
            background: 'rgba(1,77,248,0.07)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 0 20px rgba(1,77,248,0.18), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#4d8fff',
              boxShadow: '0 0 8px #4d8fff, 0 0 18px rgba(77,143,255,0.55)',
              animation: 'badgeGlow 3s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.52rem', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(77,143,255,0.85)',
              whiteSpace: 'nowrap',
            }}>✦ Bientôt disponible</span>
          </div>
        </div>

        {/* ── Phone mockup — replaces card column; hero-chip-wrap keeps scroll-fade ── */}
        <div className="hero-chip-wrap hero-phones-wrap" aria-hidden="true">
          <DALILIPhones revealed={revealed} />
        </div>

        {/* Paris skyline — fades out on scroll before text appears (no overlap ever) */}
        <div ref={skylineWrap}>
          <ParisSkyline revealed={revealed} />
        </div>

      </div>
    </section>
  );
}
