'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LOGO_PATH =
  'M294.4 149.333h435.2L930.133 349.867v324.266L729.6 874.667H294.4L93.867 674.133V349.867L294.4 149.333Zm64 106.667L221.867 392.533l166.4 166.4L533.333 413.867h72.534L772.267 580.267 644.267 708.267H349.867L221.867 580.267l-72.534 72.533 166.4 166.4h392.534L874.667 652.8 661.333 439.467H490.667L345.6 584.533 256 494.933 430.933 320h230.4l110.934 110.933V320l-64-64H332.8L157.867 430.933l115.2 115.2 76.8-76.8L358.4 256Z';

// Desktop constants — overridden dynamically on mobile inside useEffect
const DESKTOP_SVG   = 90;
const DESKTOP_FONT  = '5rem';
const DESKTOP_GAP   = 36;
const DESKTOP_TEXTH = 80;

export default function LogoReveal({ onComplete }) {
  const overlayRef          = useRef(null);
  const pathRef             = useRef(null);
  const svgElRef            = useRef(null);   // the <svg> element
  const lettersRef          = useRef([]);
  const lettersWrapRef      = useRef(null);   // flex row holding letters
  const groupRef            = useRef(null);
  const glowRef             = useRef(null);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { onCompleteRef.current(); return; }

    const path = pathRef.current;
    if (!path) return;

    // ── Compute sizes based on viewport
    const W        = window.innerWidth;
    const isMobile = W < 768;

    const svgSize = isMobile ? 60  : DESKTOP_SVG;
    const fontSz  = isMobile ? '2.8rem' : DESKTOP_FONT;
    const gap     = isMobile ? 16  : DESKTOP_GAP;
    const textH   = isMobile ? 52  : DESKTOP_TEXTH;
    const groupH  = svgSize + gap + textH;
    const svgOff  = groupH / 2 - svgSize / 2;

    // Apply sizing to DOM elements before animation starts
    if (svgElRef.current) {
      svgElRef.current.setAttribute('width',  svgSize);
      svgElRef.current.setAttribute('height', svgSize);
    }
    if (lettersWrapRef.current) {
      lettersWrapRef.current.style.gap = isMobile ? '2px' : '4px';
    }
    if (groupRef.current) {
      groupRef.current.style.gap = `${gap}px`;
    }
    lettersRef.current.forEach(l => {
      if (l) {
        l.style.fontSize      = fontSz;
        l.style.letterSpacing = isMobile ? '0.2em' : '0.3em';
      }
    });

    // ── Animate
    const len = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray:  len,
      strokeDashoffset: len,
      fill:             'none',
      stroke:           '#014df8',
      strokeWidth:      isMobile ? 14 : 10,
    });
    gsap.set(lettersRef.current, { y: 36, opacity: 0 });
    // Glow starts hidden — will show briefly, then FULLY removed from paint
    gsap.set(glowRef.current, { opacity: 0, scale: 0.8 });

    const SHRINK_DUR = 0.5;   // was 0.65 — save 0.15s

    const tl = gsap.timeline({
      onComplete: () => {
        if (overlayRef.current) overlayRef.current.style.display = 'none';
      },
    });

    // 1. Draw stroke — faster
    tl.to(path, {
      strokeDashoffset: 0,
      duration: isMobile ? 0.9 : 1.1,   // was 1.2 / 1.6 — save 0.3–0.5s
      ease: 'power2.inOut',
    });

    // 2. Fill — no glow on mobile (avoids the circle artifact)
    if (isMobile) {
      tl.to(path, { fill: '#014df8', strokeWidth: 0, duration: 0.25, ease: 'power2.out' }, '-=0.06');
    } else {
      tl.to(path, { fill: '#014df8', strokeWidth: 0, duration: 0.28, ease: 'power2.out' }, '-=0.1')
        .to(glowRef.current, { opacity: 1, scale: 1.15, duration: 0.3, ease: 'power2.out' }, '<')
        .to(glowRef.current, { opacity: 0, scale: 1,    duration: 0.35, ease: 'power2.in',
          // Fully remove from paint after fade to prevent GPU artifact
          onComplete: () => { if (glowRef.current) glowRef.current.style.display = 'none'; },
        }, '+=0.05');
    }

    // 3. Letters rise
    tl.to(lettersRef.current, {
      y: 0, opacity: 1,
      duration: isMobile ? 0.35 : 0.45,  // was 0.4 / 0.55 — save 0.1s
      ease: 'power3.out',
      stagger: 0.055,
    }, '-=0.2');

    // 4. Hold — shorter
    tl.to({}, { duration: isMobile ? 0.2 : 0.3 });   // was 0.45 / 0.7 — save 0.25–0.4s

    // 5. Shrink + fly to navbar logo
    tl.add(() => {
      const navLogo = document.querySelector('[data-navbar-logo]');
      const s = 32 / svgSize;   // scale to match 32px navbar icon
      let tx, ty;

      if (navLogo) {
        const r  = navLogo.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        tx = cx - window.innerWidth  / 2;
        ty = cy - window.innerHeight / 2 + svgOff * s;
      } else {
        tx = (isMobile ? 32 : 48) - window.innerWidth  / 2;
        ty = 32 - window.innerHeight / 2 + svgOff * s;
      }

      gsap.to(groupRef.current, {
        x: tx, y: ty, scale: s,
        opacity: 0,
        duration: SHRINK_DUR,
        ease: 'power3.inOut',
      });
    });

    tl.to({}, { duration: SHRINK_DUR });

    // 6. Reveal page
    tl.add(() => onCompleteRef.current())
      .to(overlayRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' });

    return () => tl.kill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        ref={groupRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: DESKTOP_GAP,        // overridden by JS for mobile
          transformOrigin: 'center center',
        }}
      >
        {/* SVG logo */}
        <div style={{ position: 'relative' }}>
          {/* Glow — desktop only (hidden on mobile via isMobile check in useEffect) */}
          <div
            ref={glowRef}
            style={{
              position:    'absolute',
              inset:       -20,
              borderRadius: '50%',
              background:  'radial-gradient(circle, rgba(1,77,248,0.5) 0%, transparent 70%)',
              filter:      'blur(18px)',
              pointerEvents: 'none',
            }}
          />
          <svg
            ref={svgElRef}
            viewBox="0 0 1024 1024"
            width={DESKTOP_SVG}
            height={DESKTOP_SVG}
            style={{ display: 'block', position: 'relative' }}
          >
            <path ref={pathRef} d={LOGO_PATH} fill="#014df8" />
          </svg>
        </div>

        {/* DALILI letters */}
        <div ref={lettersWrapRef} style={{ display: 'flex', gap: 4 }}>
          {'DALILI'.split('').map((ch, i) => (
            <span
              key={i}
              ref={el => { lettersRef.current[i] = el; }}
              style={{
                display:       'inline-block',
                fontFamily:    'var(--font-montserrat)',
                fontWeight:    900,
                fontSize:      DESKTOP_FONT,   // overridden by JS for mobile
                color:         '#fff',
                letterSpacing: '0.3em',
                lineHeight:    1,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
