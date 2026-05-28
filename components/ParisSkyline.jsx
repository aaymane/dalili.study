'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Cinematic Paris skyline — NO gradient mask (scroll-fade in HeroSection handles visibility).
 * Eiffel Tower is the hero: glowing, animated beacon beam, atmospheric halo.
 */
export default function ParisSkyline({ revealed = false }) {
  const wrapRef   = useRef(null);
  const blinkRef  = useRef(null);   // antenna dot
  const beamRef   = useRef(null);   // light beam line
  const haloRef   = useRef(null);   // ground atmospheric glow

  // Entrance: delayed to sync with plane landing
  useEffect(() => {
    if (!revealed || !wrapRef.current) return;
    gsap.fromTo(wrapRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: 1.8 }
    );
  }, [revealed]);

  // Antenna blink
  useEffect(() => {
    if (!blinkRef.current) return;
    gsap.to(blinkRef.current, {
      opacity: 0.08,
      duration: 0.55,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2.2,
    });
  }, []);

  // Beacon beam — pulses upward like a lighthouse
  useEffect(() => {
    if (!beamRef.current) return;
    gsap.fromTo(beamRef.current,
      { opacity: 0, scaleY: 0.1 },
      {
        opacity: 0.55,
        scaleY: 1,
        duration: 1.2,
        ease: 'power2.out',
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.8,
        delay: 2.5,
        transformOrigin: 'center bottom',
      }
    );
  }, []);

  // Halo pulse
  useEffect(() => {
    if (!haloRef.current) return;
    gsap.to(haloRef.current, {
      opacity: 0.35,
      duration: 2.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2,
    });
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 'clamp(72px, 12vh, 130px)',
        zIndex: 3,
        pointerEvents: 'none',
        opacity: 0,
        overflow: 'visible',
      }}
    >
      <svg
        viewBox="0 0 1000 130"
        preserveAspectRatio="xMidYMax meet"
        style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {/* Beacon beam gradient */}
          <linearGradient id="beamGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(1,100,255,0.9)" />
            <stop offset="100%" stopColor="rgba(1,100,255,0)" />
          </linearGradient>
          {/* Tower body gradient */}
          <linearGradient id="towerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(1,60,200,0.70)" />
            <stop offset="100%" stopColor="rgba(1,20,80,0.95)" />
          </linearGradient>
          {/* Ground radial glow */}
          <radialGradient id="groundGlow" cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor="rgba(1,77,248,0.30)" />
            <stop offset="100%" stopColor="rgba(1,77,248,0)" />
          </radialGradient>
        </defs>

        {/* ── Ground atmospheric glow */}
        <ellipse
          ref={haloRef}
          cx="480" cy="130" rx="120" ry="22"
          fill="rgba(1,60,220,0.20)"
          opacity="0.20"
        />

        {/* ── Left city cluster — subtle, faded */}
        <rect x="0"   y="98"  width="38"  height="32" fill="rgba(1,8,28,0.55)" rx="2"/>
        <rect x="32"  y="86"  width="26"  height="44" fill="rgba(1,8,28,0.58)" rx="2"/>
        <rect x="52"  y="93"  width="44"  height="37" fill="rgba(1,8,28,0.50)" rx="2"/>
        <rect x="90"  y="80"  width="24"  height="50" fill="rgba(1,8,28,0.58)" rx="2"/>
        <rect x="108" y="90"  width="38"  height="40" fill="rgba(1,8,28,0.50)" rx="2"/>
        <rect x="140" y="76"  width="22"  height="54" fill="rgba(1,8,28,0.55)" rx="2"/>
        <rect x="280" y="88"  width="36"  height="42" fill="rgba(1,8,28,0.45)" rx="2"/>
        <rect x="310" y="78"  width="24"  height="52" fill="rgba(1,8,28,0.50)" rx="2"/>
        <rect x="355" y="95"  width="28"  height="35" fill="rgba(1,8,28,0.40)" rx="2"/>

        {/* ── EIFFEL TOWER — hero element, centered at x=480 ── */}

        {/* Outer atmospheric glow ellipse behind tower */}
        <ellipse cx="480" cy="80" rx="42" ry="55"
          fill="rgba(1,55,200,0.06)" filter="url(#blur)"/>

        {/* Main silhouette — gradient fill */}
        <path
          d="M 450,130 L 460,108 L 463,95 L 466,80 L 469,65 L 472,48 L 475,30 L 477,16 L 479,6
             L 480,2
             L 481,6 L 483,16 L 485,30 L 488,48 L 491,65 L 494,80 L 497,95 L 500,108 L 510,130 Z"
          fill="url(#towerGrad)"
        />

        {/* Arch legs */}
        <path d="M 450,130 Q 465,116 473,108" fill="none" stroke="rgba(1,70,180,0.55)" strokeWidth="1.4"/>
        <path d="M 510,130 Q 495,116 487,108" fill="none" stroke="rgba(1,70,180,0.55)" strokeWidth="1.4"/>

        {/* Floor beams — glowing blue */}
        <rect x="458" y="104" width="44" height="4.5" fill="rgba(1,100,255,0.80)" rx="1.5"/>
        <rect x="466" y="77"  width="28" height="4"   fill="rgba(1,100,255,0.70)" rx="1.5"/>
        <rect x="472" y="60"  width="16" height="3.5" fill="rgba(1,100,255,0.60)" rx="1"/>
        <rect x="476" y="44"  width="8"  height="3"   fill="rgba(1,100,255,0.75)" rx="1"/>

        {/* Spire */}
        <line x1="480" y1="2" x2="480" y2="-22"
          stroke="rgba(1,120,255,0.90)" strokeWidth="2" strokeLinecap="round"/>

        {/* ── Beacon beam — GSAP pulse */}
        <line
          ref={beamRef}
          x1="480" y1="-22" x2="480" y2="-95"
          stroke="url(#beamGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0"
        />

        {/* Blinking antenna dot — GSAP blink */}
        <circle ref={blinkRef} cx="480" cy="-23" r="3.5"
          fill="#3b8fff"
          filter="drop-shadow(0 0 6px #014df8)"
          opacity="0.95"
        />

        {/* Tower inner glow overlay */}
        <path
          d="M 462,130 L 468,110 L 471,95 L 474,80 L 476,65 L 478,48 L 479.5,30 L 480,6
             L 480.5,30 L 482,48 L 484,65 L 486,80 L 489,95 L 492,110 L 498,130 Z"
          fill="rgba(1,77,248,0.12)"
        />

        {/* ── Right city cluster — subtle */}
        <rect x="620"  y="85"  width="32"  height="45" fill="rgba(1,8,28,0.50)" rx="2"/>
        <rect x="646"  y="93"  width="42"  height="37" fill="rgba(1,8,28,0.55)" rx="2"/>
        <rect x="682"  y="80"  width="24"  height="50" fill="rgba(1,8,28,0.60)" rx="2"/>
        <rect x="700"  y="90"  width="38"  height="40" fill="rgba(1,8,28,0.50)" rx="2"/>
        <rect x="733"  y="75"  width="22"  height="55" fill="rgba(1,8,28,0.58)" rx="2"/>
        <rect x="840"  y="88"  width="36"  height="42" fill="rgba(1,8,28,0.45)" rx="2"/>
        <rect x="870"  y="93"  width="28"  height="37" fill="rgba(1,8,28,0.42)" rx="2"/>
        <rect x="958"  y="87"  width="42"  height="43" fill="rgba(1,8,28,0.48)" rx="2"/>

        {/* ── Subtle window lights */}
        <circle cx="44"  cy="90" r="1.5" fill="rgba(1,77,248,0.45)"/>
        <circle cx="100" cy="86" r="1.5" fill="rgba(255,200,80,0.32)"/>
        <circle cx="148" cy="80" r="1.5" fill="rgba(1,77,248,0.40)"/>
        <circle cx="294" cy="93" r="1.5" fill="rgba(255,200,80,0.28)"/>
        <circle cx="635" cy="90" r="1.5" fill="rgba(1,77,248,0.45)"/>
        <circle cx="694" cy="85" r="1.5" fill="rgba(255,200,80,0.32)"/>
        <circle cx="740" cy="80" r="1"   fill="rgba(1,77,248,0.40)"/>
        <circle cx="854" cy="93" r="1.5" fill="rgba(1,77,248,0.40)"/>
        <circle cx="968" cy="91" r="1.5" fill="rgba(1,77,248,0.42)"/>

        {/* Ground line */}
        <rect x="0" y="128" width="1000" height="2" fill="rgba(1,30,90,0.45)"/>
      </svg>
    </div>
  );
}
