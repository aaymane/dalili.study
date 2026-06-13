'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const RATIO = 607 / 280; // iPhone height/width ratio

// ── Proportionally-scaled iPhone chassis ─────────────────────────────────────
function PhoneShell({ width, src, alt }) {
  const h   = Math.round(width * RATIO);
  const pad = Math.round(12  * width / 280);
  const rS  = Math.round(55  * width / 280);
  const rSc = Math.round(44  * width / 280);
  const rB  = Math.round(51  * width / 280);
  const isW = Math.round(110 * width / 280);
  const isH = Math.round(34  * h     / 607);
  const hmW = Math.round(120 * width / 280);
  const bw  = 3;

  const muteT = Math.round(130 * h / 607);
  const vupT  = Math.round(172 * h / 607);
  const vdnT  = Math.round(240 * h / 607);
  const pwrT  = Math.round(190 * h / 607);

  const btn = (s) => (
    <div aria-hidden="true" style={{ position: 'absolute', background: '#2a2a2a', ...s }} />
  );

  return (
    <div style={{
      width, height: h,
      borderRadius: rS,
      padding: pad,
      background: 'linear-gradient(145deg, #3a3a3a 0%, #1a1a1a 40%, #0d0d0d 70%, #2a2a2a 100%)',
      boxShadow: [
        '0 0 0 1px rgba(255,255,255,0.12)',
        '0 40px 100px rgba(0,0,0,0.8)',
        'inset 0 1px 0 rgba(255,255,255,0.15)',
      ].join(', '),
      position: 'relative', boxSizing: 'border-box', userSelect: 'none',
    }}>
      <div style={{
        position: 'absolute', inset: Math.round(pad * 0.42),
        borderRadius: rB, background: 'linear-gradient(160deg, #181818, #080808)', zIndex: 0,
      }} />
      {btn({ left: -bw, top: muteT, width: bw, height: Math.round(28*h/607), borderRadius: '2px 0 0 2px' })}
      {btn({ left: -bw, top: vupT,  width: bw, height: Math.round(56*h/607), borderRadius: '2px 0 0 2px' })}
      {btn({ left: -bw, top: vdnT,  width: bw, height: Math.round(56*h/607), borderRadius: '2px 0 0 2px' })}
      {btn({ right: -bw, top: pwrT, width: bw, height: Math.round(84*h/607), borderRadius: '0 2px 2px 0' })}
      <div style={{
        width: '100%', height: '100%',
        borderRadius: rSc, overflow: 'hidden',
        background: '#000', position: 'relative', zIndex: 1,
      }}>
        <img src={src} alt={alt} draggable={false} style={{
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'top center',
          display: 'block', opacity: 1, filter: 'none', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', top: Math.round(12*h/607), left: '50%',
          transform: 'translateX(-50%)', width: isW, height: isH,
          background: '#000', borderRadius: 20, zIndex: 10,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 8, left: '50%',
          transform: 'translateX(-50%)', width: hmW, height: 5,
          background: 'rgba(255,255,255,0.35)', borderRadius: 100, zIndex: 10,
        }} />
      </div>
    </div>
  );
}

// ── Phone data ────────────────────────────────────────────────────────────────
const PHONES = [
  { id: 'home',   src: '/images/dalili-home.jpg',   alt: "Dalili — écran d'accueil"    },
  { id: 'splash', src: '/images/dalili-splash.jpg', alt: 'Dalili — écran de lancement' },
];

// Stacked layout helpers (tablet + desktop)
function frontPos(w)  { return { left: `calc(95% - ${w}px)`, top: 0,  zIndex: 2 }; }
function backPos()    { return { left: '5%',                  top: 40, zIndex: 1 }; }
const FRONT_STY = { transform: 'scale(1) rotate(2deg)',     opacity: 1   };
const BACK_STY  = { transform: 'scale(0.88) rotate(-4deg)', opacity: 0.5 };
const SWAP_TR   = 'transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s cubic-bezier(0.4,0,0.2,1)';
const POS_TR    = 'left 0.6s cubic-bezier(0.4,0,0.2,1), top 0.6s cubic-bezier(0.4,0,0.2,1)';

// ── Main component ────────────────────────────────────────────────────────────
export default function DALILIPhones({ revealed = true }) {
  const [active, setActive] = useState(0);
  const [bp, setBp] = useState('desktop');

  const containerRef   = useRef(null);
  const innerRefs      = useRef([null, null]);
  const activeRef      = useRef(0);

  // Mobile cinematic refs — outer: scroll parallax, inner: entry + float
  const phone1OuterRef = useRef(null);
  const phone2OuterRef = useRef(null);
  const phone1InnerRef = useRef(null);
  const phone2InnerRef = useRef(null);

  useEffect(() => { activeRef.current = active; }, [active]);

  // Breakpoint detection
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setBp(vw < 768 ? 'mobile' : vw < 1024 ? 'tablet' : 'desktop');
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // Auto-switch every 3.8s — tablet/desktop only (mobile shows both phones)
  useEffect(() => {
    if (bp === 'mobile') return;
    const id = setInterval(() => setActive(a => (a + 1) % 2), 3800);
    return () => clearInterval(id);
  }, [bp]);

  // Mobile entry animation — flies in once logo reveal completes
  useEffect(() => {
    if (bp !== 'mobile' || !revealed) return;
    const p1 = phone1InnerRef.current;
    const p2 = phone2InnerRef.current;
    if (!p1 || !p2) return;

    // Start off-screen
    gsap.set(p1, { x: '-120%', rotate: -15, opacity: 0 });
    gsap.set(p2, { x: '120%',  rotate: 15,  opacity: 0 });

    // Spring fly-in, then continuous float
    gsap.to(p1, {
      x: 0, rotate: -6, opacity: 1,
      duration: 0.9, ease: 'back.out(1.7)', delay: 0.1,
      onComplete: () => {
        gsap.to(p1, { y: -12, duration: 1.75, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      },
    });
    gsap.to(p2, {
      x: 0, rotate: 6, opacity: 1,
      duration: 0.9, ease: 'back.out(1.7)', delay: 0.2,
      onComplete: () => {
        gsap.to(p2, { y: -16, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 });
      },
    });

    return () => {
      gsap.killTweensOf(p1);
      gsap.killTweensOf(p2);
    };
  }, [bp, revealed]);

  // Mobile scroll parallax — phones drift up and diverge, fade as hero scrolls out
  useEffect(() => {
    if (bp !== 'mobile') return;
    const onScroll = () => {
      const p1 = phone1OuterRef.current;
      const p2 = phone2OuterRef.current;
      if (!p1 || !p2) return;
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      const yShift   = -progress * 80;
      const fade     = Math.max(0, 1 - progress * 2);
      gsap.set(p1, { y: yShift, x: -progress * 15, opacity: fade });
      gsap.set(p2, { y: yShift, x:  progress * 15, opacity: fade });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [bp]);

  // Mouse parallax — desktop only, single attachment, reads activeRef at call time
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let leaveTimer = null;

    const onMouseEnter = () => {
      if (window.innerWidth < 1024) return;
      clearTimeout(leaveTimer);
      innerRefs.current.forEach(el => { if (el) el.style.transition = 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)'; });
    };
    const onMouseMove = (e) => {
      if (window.innerWidth < 1024) return;
      const rect = container.getBoundingClientRect();
      const rx =  ((e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)) * 8;
      const ry = -((e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)) * 12;
      const fi = activeRef.current, bi = (fi + 1) % 2;
      const front = innerRefs.current[fi], back = innerRefs.current[bi];
      if (front) front.style.transform = `scale(1) rotate(2deg) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) translateY(-14px)`;
      if (back)  back.style.transform  = `scale(0.88) rotate(-4deg) rotateX(${(rx*0.6).toFixed(1)}deg) rotateY(${(ry*0.6).toFixed(1)}deg)`;
    };
    const onMouseLeave = () => {
      if (window.innerWidth < 1024) return;
      clearTimeout(leaveTimer);
      const fi = activeRef.current, bi = (fi + 1) % 2;
      [innerRefs.current[fi], innerRefs.current[bi]].forEach(el => {
        if (el) el.style.transition = 'transform 0.8s ease, opacity 0.6s cubic-bezier(0.4,0,0.2,1)';
      });
      if (innerRefs.current[fi]) innerRefs.current[fi].style.transform = FRONT_STY.transform;
      if (innerRefs.current[bi]) innerRefs.current[bi].style.transform = BACK_STY.transform;
      leaveTimer = setTimeout(() => {
        innerRefs.current.forEach(el => { if (el) el.style.transition = SWAP_TR; });
      }, 820);
    };

    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mousemove',  onMouseMove, { passive: true });
    container.addEventListener('mouseleave', onMouseLeave);
    return () => {
      clearTimeout(leaveTimer);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mousemove',  onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);


  // ── MOBILE RENDER — cinematic two-phone layout ───────────────────────────
  if (bp === 'mobile') {
    return (
      <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Phone 1 — splash screen, left side, back */}
        <div
          ref={phone1OuterRef}
          style={{ position: 'absolute', left: -10, bottom: 0, width: 180, zIndex: 1 }}
        >
          <div ref={phone1InnerRef}>
            <PhoneShell width={180} src={PHONES[1].src} alt={PHONES[1].alt} />
          </div>
        </div>

        {/* Phone 2 — home screen, right side, front */}
        <div
          ref={phone2OuterRef}
          style={{ position: 'absolute', right: -10, bottom: 0, width: 200, zIndex: 2 }}
        >
          <div ref={phone2InnerRef}>
            <PhoneShell width={200} src={PHONES[0].src} alt={PHONES[0].alt} />
          </div>
        </div>
      </div>
    );
  }

  // ── TABLET + DESKTOP RENDER ───────────────────────────────────────────────
  const isTablet   = bp === 'tablet';
  const homeW      = isTablet ? 220 : 270;
  const splashW    = isTablet ? 195 : 240;
  const containerH = isTablet ? 500 : 600;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: containerH,
        perspective: '1000px',
        pointerEvents: 'auto',
      }}
    >
      {[
        { ...PHONES[0], width: homeW   },
        { ...PHONES[1], width: splashW },
      ].map((phone, i) => {
        const isFront = i === active;
        const pos = isFront ? frontPos(phone.width) : backPos();
        const sty = isFront ? FRONT_STY : BACK_STY;
        return (
          <div
            key={phone.id}
            style={{
              position: 'absolute',
              left: pos.left, top: pos.top, zIndex: pos.zIndex,
              transition: POS_TR,
              animation: `phoneFloat 4s ease-in-out infinite ${i === 1 ? '0.8s' : '0s'}`,
            }}
          >
            <div
              ref={el => { innerRefs.current[i] = el; }}
              style={{
                transform: sty.transform, opacity: sty.opacity,
                transition: SWAP_TR,
                transformOrigin: 'bottom center',
                transformStyle: 'preserve-3d',
              }}
            >
              <PhoneShell width={phone.width} src={phone.src} alt={phone.alt} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
