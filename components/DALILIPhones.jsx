'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

const RATIO = 607 / 280;

function PhoneShell({ width, src, alt, priority = false }) {
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
        '0 50px 120px rgba(0,0,0,0.9)',
        '0 20px 40px rgba(0,0,0,0.6)',
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
        <Image
          src={src} alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 172px, (max-width: 1024px) 270px, 270px"
          style={{ objectFit: 'cover', objectPosition: 'top center', pointerEvents: 'none' }}
          draggable={false}
        />
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

const PHONES = [
  { id: 'home',   src: '/images/dalili-home.jpg',   alt: "Dalili — écran d'accueil"    },
  { id: 'splash', src: '/images/dalili-splash.jpg', alt: 'Dalili — écran de lancement' },
];

function frontPos(w)  { return { transform: `translateX(calc(95% - ${w}px))`, zIndex: 2 }; }
function backPos()    { return { transform: 'translate(5%, 40px)',             zIndex: 1 }; }
const FRONT_STY = { transform: 'scale(1) rotate(2deg)',     opacity: 1   };
const BACK_STY  = { transform: 'scale(0.88) rotate(-4deg)', opacity: 0.5 };
const SWAP_TR   = 'transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s cubic-bezier(0.4,0,0.2,1)';
const POS_TR    = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';

// Phone sizes for mobile layout
const P1_W = 152; // left phone (splash)
const P2_W = 172; // right phone (home) — slightly larger, front
// Heights derived from RATIO
const P1_H = Math.round(P1_W * RATIO); // ~329px
const P2_H = Math.round(P2_W * RATIO); // ~373px

export default function DALILIPhones({ revealed = true }) {
  const [active, setActive] = useState(0);
  const [bp, setBp]         = useState('desktop');

  const containerRef   = useRef(null);
  const innerRefs      = useRef([null, null]);
  const activeRef      = useRef(0);

  // Mobile: outer = scroll parallax, inner = entry + float
  const phone1OuterRef = useRef(null);
  const phone2OuterRef = useRef(null);
  const phone1InnerRef = useRef(null);
  const phone2InnerRef = useRef(null);
  const glow1Ref       = useRef(null);
  const glow2Ref       = useRef(null);
  const groundGlowRef  = useRef(null);

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

  // Auto-switch — tablet/desktop only
  useEffect(() => {
    if (bp === 'mobile') return;
    const id = setInterval(() => setActive(a => (a + 1) % 2), 3800);
    return () => clearInterval(id);
  }, [bp]);

  // Mobile: cinematic entry → continuous float
  useEffect(() => {
    if (bp !== 'mobile' || !revealed) return;
    const p1 = phone1InnerRef.current;
    const p2 = phone2InnerRef.current;
    const g1 = glow1Ref.current;
    const g2 = glow2Ref.current;
    if (!p1 || !p2) return;

    // Start: blurred, scaled down, below resting pos, at their final rotations
    gsap.set(p1, { y: 90, scale: 0.80, opacity: 0, filter: 'blur(22px)', rotation: -8 });
    gsap.set(p2, { y: 100, scale: 0.80, opacity: 0, filter: 'blur(22px)', rotation: 5 });
    if (g1) gsap.set(g1, { opacity: 0, scale: 0.5 });
    if (g2) gsap.set(g2, { opacity: 0, scale: 0.5 });

    // Phone 1 — premium rise + blur clear
    gsap.to(p1, {
      y: 0, scale: 1, opacity: 1, filter: 'blur(0px)',
      duration: 1.6, ease: 'power4.out', delay: 0.08,
      onComplete: () => {
        // Breathing: y + rotation oscillation, different frequency to phone 2
        gsap.to(p1, {
          y: -15, rotation: -5.5, scale: 1.016,
          duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1,
        });
      },
    });

    // Phone 2 — staggered entry, slightly delayed
    gsap.to(p2, {
      y: 0, scale: 1, opacity: 1, filter: 'blur(0px)',
      duration: 1.6, ease: 'power4.out', delay: 0.22,
      onComplete: () => {
        gsap.to(p2, {
          y: -20, rotation: 7.5, scale: 1.014,
          duration: 4.0, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.4,
        });
      },
    });

    // Glow entries + pulse loops
    if (g1) {
      gsap.to(g1, {
        opacity: 1, scale: 1, duration: 2.2, ease: 'power2.out', delay: 0.35,
        onComplete: () => {
          gsap.to(g1, {
            opacity: 0.52, scale: 1.35,
            duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1,
          });
        },
      });
    }
    if (g2) {
      gsap.to(g2, {
        opacity: 1, scale: 1, duration: 2.2, ease: 'power2.out', delay: 0.48,
        onComplete: () => {
          gsap.to(g2, {
            opacity: 0.42, scale: 1.25,
            duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.0,
          });
        },
      });
    }

    return () => {
      gsap.killTweensOf(p1);
      gsap.killTweensOf(p2);
      if (g1) gsap.killTweensOf(g1);
      if (g2) gsap.killTweensOf(g2);
    };
  }, [bp, revealed]);

  // Mobile: scroll parallax — phones exit upward before text appears
  useEffect(() => {
    if (bp !== 'mobile') return;
    const onScroll = () => {
      const o1 = phone1OuterRef.current;
      const o2 = phone2OuterRef.current;
      const gg = groundGlowRef.current;
      if (!o1 || !o2) return;
      const scrollY = window.scrollY;
      const vh      = window.innerHeight;
      const fade    = Math.max(0, 1 - (scrollY / vh) * 2.2);
      const yShift  = -(scrollY * 0.6);
      gsap.set(o1, { y: yShift, opacity: fade });
      gsap.set(o2, { y: yShift, opacity: fade });
      if (gg) gsap.set(gg, { opacity: fade * 0.9 });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [bp]);

  // Mouse parallax — desktop only
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

  // ── MOBILE RENDER ─────────────────────────────────────────────────────────
  if (bp === 'mobile') {
    // Horizontal: pair centered at x=50%
    //   phone1 center → 50% - 90px  ∴ left = 50% - 90 - P1_W/2
    //   phone2 center → 50% + 88px  ∴ left = 50% + 88 - P2_W/2
    // Vertical: each phone independently centered, phone1 sits 18px lower
    //   phone1: top = 50% - P1_H/2 + 18
    //   phone2: top = 50% - P2_H/2
    const p1Left = `calc(50% - ${90 + Math.round(P1_W / 2)}px)`;
    const p2Left = `calc(50% + ${88 - Math.round(P2_W / 2)}px)`;
    const p1Top  = `calc(50% - ${Math.round(P1_H / 2) - 18}px)`;
    const p2Top  = `calc(50% - ${Math.round(P2_H / 2)}px)`;

    return (
      <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>

        {/* Ground reflection glow — phones float above this */}
        <div
          ref={groundGlowRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '24%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '82%',
            height: 80,
            background: 'radial-gradient(ellipse at center, rgba(1,77,248,0.22) 0%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Phone 1 — left, splash screen, back layer */}
        <div
          ref={phone1OuterRef}
          style={{
            position: 'absolute',
            left: p1Left,
            top: p1Top,
            zIndex: 2,
            willChange: 'transform, opacity',
          }}
        >
          {/* Ambient glow behind this phone */}
          <div
            ref={glow1Ref}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 240, height: 350,
              background: 'radial-gradient(ellipse at 45% 50%, rgba(1,77,248,0.28) 0%, rgba(77,143,255,0.06) 55%, transparent 72%)',
              borderRadius: '50%',
              filter: 'blur(42px)',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />
          {/* Float + rotation + blur layer */}
          <div
            ref={phone1InnerRef}
            style={{ willChange: 'transform, opacity', display: 'inline-block' }}
          >
            <PhoneShell width={P1_W} src={PHONES[1].src} alt={PHONES[1].alt} />
          </div>
        </div>

        {/* Phone 2 — right, home screen, front layer (LCP image) */}
        <div
          ref={phone2OuterRef}
          style={{
            position: 'absolute',
            left: p2Left,
            top: p2Top,
            zIndex: 3,
            willChange: 'transform, opacity',
          }}
        >
          {/* Ambient glow behind this phone */}
          <div
            ref={glow2Ref}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 270, height: 395,
              background: 'radial-gradient(ellipse at 55% 50%, rgba(77,143,255,0.22) 0%, rgba(1,77,248,0.07) 55%, transparent 72%)',
              borderRadius: '50%',
              filter: 'blur(48px)',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />
          {/* Float + rotation + blur layer */}
          <div
            ref={phone2InnerRef}
            style={{ willChange: 'transform, opacity', display: 'inline-block' }}
          >
            <PhoneShell width={P2_W} src={PHONES[0].src} alt={PHONES[0].alt} priority={true} />
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
              left: 0, top: 0,
              transform: pos.transform,
              zIndex: pos.zIndex,
              transition: POS_TR,
            }}
          >
            {/* Separate float wrapper so phoneFloat doesn't conflict with POS_TR transform */}
            <div style={{ animation: `phoneFloat 4s ease-in-out infinite ${i === 1 ? '0.8s' : '0s'}` }}>
              <div
                ref={el => { innerRefs.current[i] = el; }}
                style={{
                  transform: sty.transform, opacity: sty.opacity,
                  transition: SWAP_TR,
                  transformOrigin: 'bottom center',
                  transformStyle: 'preserve-3d',
                }}
              >
                <PhoneShell width={phone.width} src={phone.src} alt={phone.alt} priority={i === 0} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
