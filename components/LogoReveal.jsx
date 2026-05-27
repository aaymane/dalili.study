'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

const LOGO_PATH =
  'M294.4 149.333h435.2L930.133 349.867v324.266L729.6 874.667H294.4L93.867 674.133V349.867L294.4 149.333Zm64 106.667L221.867 392.533l166.4 166.4L533.333 413.867h72.534L772.267 580.267 644.267 708.267H349.867L221.867 580.267l-72.534 72.533 166.4 166.4h392.534L874.667 652.8 661.333 439.467H490.667L345.6 584.533 256 494.933 430.933 320h230.4l110.934 110.933V320l-64-64H332.8L157.867 430.933l115.2 115.2 76.8-76.8L358.4 256Z';

// The SVG is 90×90 inside a flex-column group.
// Group layout: SVG container (90px) + gap (36px) + letters (~80px) = 206px total.
// SVG center is 58px above the group center vertically.
const SVG_SIZE   = 90;
const GROUP_H    = 206; // SVG (90) + gap (36) + letters (80)
const SVG_OFFSET = GROUP_H / 2 - SVG_SIZE / 2; // = 58px above group center

export default function LogoReveal({ onComplete }) {
  const overlayRef    = useRef(null);
  const pathRef       = useRef(null);
  const lettersRef    = useRef([]);
  const groupRef      = useRef(null);
  const glowRef       = useRef(null);
  // Keep latest onComplete in a ref so the timeline effect never re-runs
  // when the parent re-renders (which would kill the animation mid-flight).
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { onCompleteRef.current(); return; }

    const path = pathRef.current;
    if (!path) return;

    const len = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: len,
      strokeDashoffset: len,
      fill: 'none',
      stroke: '#014df8',
      strokeWidth: 10,
    });
    gsap.set(lettersRef.current, { y: 44, opacity: 0 });
    gsap.set(glowRef.current, { opacity: 0, scale: 0.8 });

    const SHRINK_DUR = 0.72;

    const tl = gsap.timeline({
      onComplete: () => {
        if (overlayRef.current) overlayRef.current.style.display = 'none';
      },
    });

    // 1. Draw stroke
    tl.to(path, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' });

    // 2. Fill + glow pulse
    tl.to(path, { fill: '#014df8', strokeWidth: 0, duration: 0.35, ease: 'power2.out' }, '-=0.1')
      .to(glowRef.current, { opacity: 1, scale: 1.15, duration: 0.4, ease: 'power2.out' }, '<')
      .to(glowRef.current, { opacity: 0, scale: 1,    duration: 0.5, ease: 'power2.in'  }, '+=0.1');

    // 3. Letters rise
    tl.to(lettersRef.current, {
      y: 0, opacity: 1,
      duration: 0.55, ease: 'power3.out', stagger: 0.07,
    }, '-=0.3');

    // 4. Hold
    tl.to({}, { duration: 0.7 });

    // 5. Shrink + fade group to navbar logo position simultaneously.
    //    opacity → 0 during travel = invisible on arrival → no double-logo.
    tl.add(() => {
      const navLogo = document.querySelector('[data-navbar-logo]');
      const s = 32 / SVG_SIZE; // scale 90px SVG → 32px navbar logo
      let tx, ty;

      if (navLogo) {
        const r  = navLogo.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        tx = cx - window.innerWidth  / 2;
        ty = cy - window.innerHeight / 2 + SVG_OFFSET * s;
      } else {
        tx = 48 - window.innerWidth  / 2;
        ty = 32 - window.innerHeight / 2 + SVG_OFFSET * s;
      }

      gsap.to(groupRef.current, {
        x: tx, y: ty, scale: s,
        opacity: 0,         // fades while moving — invisible on arrival
        duration: SHRINK_DUR,
        ease: 'power3.inOut',
      });
    });

    // Wait for shrink to complete
    tl.to({}, { duration: SHRINK_DUR });

    // 6. Group is gone. Reveal page + fade overlay (just black bg now) together.
    tl.add(() => onCompleteRef.current())
      .to(overlayRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });

    return () => tl.kill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps: run once on mount. onComplete stays fresh via onCompleteRef.

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
          gap: 36,
          transformOrigin: 'center center',
        }}
      >
        {/* SVG logo */}
        <div style={{ position: 'relative' }}>
          <div
            ref={glowRef}
            style={{
              position: 'absolute',
              inset: -20,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(1,77,248,0.55) 0%, transparent 70%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }}
          />
          <svg
            viewBox="0 0 1024 1024"
            width={SVG_SIZE}
            height={SVG_SIZE}
            style={{ display: 'block', position: 'relative' }}
          >
            <path ref={pathRef} d={LOGO_PATH} fill="#014df8" />
          </svg>
        </div>

        {/* DALILI letters */}
        <div style={{ display: 'flex', gap: 4 }}>
          {'DALILI'.split('').map((ch, i) => (
            <span
              key={i}
              ref={el => { lettersRef.current[i] = el; }}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 900,
                fontSize: '5rem',
                color: '#fff',
                letterSpacing: '0.3em',
                lineHeight: 1,
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
