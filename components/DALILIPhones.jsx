'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const RATIO = 607 / 280; // iPhone height/width ratio

// ── Shared badge pill (same styling as heroBadgeRef in HeroSection) ──────────
function BadgePill() {
  return (
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
  );
}

// ── Dot pagination (mobile) ───────────────────────────────────────────────────
function DotsNav({ active, total, onDotClick }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20, pointerEvents: 'auto' }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          role="button"
          tabIndex={0}
          aria-label={`Écran ${i + 1}`}
          onClick={() => onDotClick(i)}
          style={{
            width: i === active ? 22 : 8,
            height: 8,
            borderRadius: 4,
            background: i === active ? '#4d8fff' : 'rgba(255,255,255,0.25)',
            boxShadow: i === active ? '0 0 8px rgba(77,143,255,0.6)' : 'none',
            transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  );
}

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
export default function DALILIPhones() {
  const [active, setActive] = useState(0);
  // 'mobile' | 'tablet' | 'desktop'
  const [bp, setBp]     = useState('desktop');
  // computed mobile phone width (min(280, 85vw) in px)
  const [mobileW, setMobileW] = useState(280);

  const containerRef = useRef(null);
  const innerRefs    = useRef([null, null]);
  const activeRef    = useRef(0);
  const touchStartX  = useRef(null);

  useEffect(() => { activeRef.current = active; }, [active]);

  // Breakpoint + mobile phone width
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp(w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop');
      setMobileW(Math.min(280, Math.floor(w * 0.85)));
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // Auto-switch every 3.8 s
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % 2), 3800);
    return () => clearInterval(id);
  }, []);

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

  // Swipe handlers (mobile)
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 40) setActive(a => (a + 1) % 2);
  }, []);

  // ── MOBILE RENDER ─────────────────────────────────────────────────────────
  if (bp === 'mobile') {
    const phoneH = Math.round(mobileW * RATIO);
    return (
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          width: '100%',
          padding: '40px 20px 0',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'auto',
        }}
      >
        {/* Phone slot — first is in-flow (sets height), second overlaid */}
        <div style={{ position: 'relative', width: mobileW, height: phoneH, flexShrink: 0 }}>
          {PHONES.map((phone, i) => (
            <div
              key={phone.id}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                top: 0, left: 0,
                opacity: i === active ? 1 : 0,
                transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: i === active ? 'auto' : 'none',
              }}
            >
              <PhoneShell width={mobileW} src={phone.src} alt={phone.alt} />
            </div>
          ))}
        </div>

        {/* Dot navigation */}
        <DotsNav active={active} total={PHONES.length} onDotClick={setActive} />

        {/* Badge — the hero-section badge is hidden on mobile via CSS,
            so we render it here to keep it in the natural document flow */}
        <div style={{ marginTop: 24 }}>
          <BadgePill />
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
