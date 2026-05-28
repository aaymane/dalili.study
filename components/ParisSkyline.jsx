'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/** Cinematic Paris skyline — fades in after plane entrance (~1.8s after revealed) */
export default function ParisSkyline({ revealed = false }) {
  const wrapRef  = useRef(null);
  const blinkRef = useRef(null);

  // Entrance: delayed to sync with plane landing completion
  useEffect(() => {
    if (!revealed || !wrapRef.current) return;
    gsap.fromTo(wrapRef.current,
      { opacity: 0, y: 22 },
      // delay 1.8s = plane entrance duration (1.7s) + small buffer
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 1.8 }
    );
  }, [revealed]);

  // Blinking antenna light
  useEffect(() => {
    if (!blinkRef.current) return;
    gsap.to(blinkRef.current, {
      opacity: 0.1, duration: 0.6, ease: 'power2.inOut',
      yoyo: true, repeat: -1, delay: 2,
    });
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'clamp(70px, 11vh, 120px)',
        zIndex: 3,
        pointerEvents: 'none',
        opacity: 0,
        overflow: 'hidden',
        /* Gradient mask: top 45% fades to transparent so tower doesn't bleed into text */
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 45%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 45%)',
      }}
    >
      {/* Ground atmospheric glow */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '70%', height: 40,
        background: 'radial-gradient(ellipse at center bottom, rgba(1,60,200,0.14) 0%, transparent 70%)',
      }} />

      <svg
        viewBox="0 0 1000 110"
        preserveAspectRatio="xMidYMax meet"
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        {/* ── Left city cluster ── */}
        <rect x="0"   y="78" width="38" height="32" fill="rgba(1,8,28,0.75)" rx="2"/>
        <rect x="32"  y="65" width="26" height="45" fill="rgba(1,8,28,0.80)" rx="2"/>
        <rect x="52"  y="73" width="45" height="37" fill="rgba(1,8,28,0.70)" rx="2"/>
        <rect x="90"  y="60" width="24" height="50" fill="rgba(1,8,28,0.80)" rx="2"/>
        <rect x="108" y="70" width="38" height="40" fill="rgba(1,8,28,0.70)" rx="2"/>
        <rect x="140" y="56" width="22" height="54" fill="rgba(1,8,28,0.80)" rx="2"/>
        <rect x="155" y="74" width="32" height="36" fill="rgba(1,8,28,0.65)" rx="2"/>
        <rect x="280" y="68" width="36" height="42" fill="rgba(1,8,28,0.60)" rx="2"/>
        <rect x="310" y="58" width="24" height="52" fill="rgba(1,8,28,0.65)" rx="2"/>
        <rect x="328" y="72" width="40" height="38" fill="rgba(1,8,28,0.60)" rx="2"/>
        <rect x="360" y="78" width="28" height="32" fill="rgba(1,8,28,0.55)" rx="2"/>

        {/* ── EIFFEL TOWER — centered at x=500 ── */}
        {/* Main silhouette */}
        <path
          d="M 450,110 L 460,88 L 463,75 L 466,62 L 469,48 L 472,32 L 475,18 L 477,8 L 479,2
             L 480,0
             L 481,2 L 483,8 L 485,18 L 488,32 L 491,48 L 494,62 L 497,75 L 500,88 L 510,110 Z"
          fill="rgba(1,35,100,0.82)"
        />
        {/* Arch legs left */}
        <path d="M 450,110 Q 465,98 473,88" fill="none" stroke="rgba(1,50,140,0.6)" strokeWidth="1.2"/>
        {/* Arch legs right */}
        <path d="M 510,110 Q 495,98 487,88" fill="none" stroke="rgba(1,50,140,0.6)" strokeWidth="1.2"/>
        {/* First floor beam */}
        <rect x="458" y="85" width="44" height="4"   fill="rgba(1,77,248,0.75)" rx="1.5"/>
        {/* Second floor beam */}
        <rect x="466" y="59" width="28" height="3.5" fill="rgba(1,77,248,0.65)" rx="1.5"/>
        {/* Third floor beam */}
        <rect x="472" y="44" width="16" height="3"   fill="rgba(1,77,248,0.55)" rx="1"/>
        {/* Observation deck */}
        <rect x="476" y="30" width="8"  height="3"   fill="rgba(1,77,248,0.70)" rx="1"/>
        {/* Spire */}
        <line x1="480" y1="0" x2="480" y2="-14" stroke="rgba(1,77,248,0.85)" strokeWidth="1.8"/>
        {/* Blinking antenna light */}
        <circle ref={blinkRef} cx="480" cy="-15" r="2.8" fill="#014df8" opacity="0.95"/>

        {/* Tower glow */}
        <ellipse cx="480" cy="110" rx="55" ry="9" fill="rgba(1,60,220,0.12)"/>

        {/* ── Right city cluster ── */}
        <rect x="620"  y="65" width="32" height="45" fill="rgba(1,8,28,0.65)" rx="2"/>
        <rect x="646"  y="74" width="42" height="36" fill="rgba(1,8,28,0.70)" rx="2"/>
        <rect x="682"  y="60" width="24" height="50" fill="rgba(1,8,28,0.80)" rx="2"/>
        <rect x="700"  y="72" width="38" height="38" fill="rgba(1,8,28,0.70)" rx="2"/>
        <rect x="733"  y="56" width="22" height="54" fill="rgba(1,8,28,0.80)" rx="2"/>
        <rect x="748"  y="78" width="35" height="32" fill="rgba(1,8,28,0.65)" rx="2"/>
        <rect x="840"  y="68" width="36" height="42" fill="rgba(1,8,28,0.60)" rx="2"/>
        <rect x="870"  y="74" width="28" height="36" fill="rgba(1,8,28,0.55)" rx="2"/>
        <rect x="892"  y="62" width="42" height="48" fill="rgba(1,8,28,0.65)" rx="2"/>
        <rect x="928"  y="75" width="32" height="35" fill="rgba(1,8,28,0.60)" rx="2"/>
        <rect x="958"  y="68" width="42" height="42" fill="rgba(1,8,28,0.65)" rx="2"/>

        {/* ── Window lights (subtle warm + blue dots) ── */}
        <circle cx="44"  cy="70" r="1.5" fill="rgba(1,77,248,0.55)"/>
        <circle cx="100" cy="66" r="1.5" fill="rgba(255,200,80,0.40)"/>
        <circle cx="148" cy="60" r="1.5" fill="rgba(1,77,248,0.50)"/>
        <circle cx="294" cy="73" r="1.5" fill="rgba(255,200,80,0.35)"/>
        <circle cx="316" cy="63" r="1"   fill="rgba(1,77,248,0.45)"/>
        <circle cx="635" cy="70" r="1.5" fill="rgba(1,77,248,0.55)"/>
        <circle cx="694" cy="65" r="1.5" fill="rgba(255,200,80,0.40)"/>
        <circle cx="740" cy="61" r="1"   fill="rgba(1,77,248,0.50)"/>
        <circle cx="755" cy="82" r="1.5" fill="rgba(255,200,80,0.35)"/>
        <circle cx="854" cy="73" r="1.5" fill="rgba(1,77,248,0.50)"/>
        <circle cx="900" cy="67" r="1.5" fill="rgba(255,200,80,0.40)"/>
        <circle cx="968" cy="72" r="1.5" fill="rgba(1,77,248,0.50)"/>

        {/* Ground line */}
        <rect x="0" y="108" width="1000" height="2" fill="rgba(1,30,80,0.5)"/>
      </svg>
    </div>
  );
}
