'use client';

import { useEffect, useRef, useState } from 'react';

const SCREENS = [
  { src: '/images/dalili-splash.jpg', alt: 'Dalili — écran de lancement' },
  { src: '/images/dalili-home.jpg',   alt: "Dalili — écran d'accueil" },
];

function PhysicalButtons() {
  const s = { position: 'absolute', background: '#2a2a2a' };
  return (
    <>
      <div aria-hidden="true" style={{ ...s, left: -3.5, top: 130, width: 3.5, height: 28,  borderRadius: '2px 0 0 2px' }} />
      <div aria-hidden="true" style={{ ...s, left: -3.5, top: 172, width: 3.5, height: 56,  borderRadius: '2px 0 0 2px' }} />
      <div aria-hidden="true" style={{ ...s, left: -3.5, top: 240, width: 3.5, height: 56,  borderRadius: '2px 0 0 2px' }} />
      <div aria-hidden="true" style={{ ...s, right: -3.5, top: 190, width: 3.5, height: 84, borderRadius: '0 2px 2px 0' }} />
    </>
  );
}

export default function DALILIPhones() {
  const [active, setActive] = useState(0);
  const outerRef = useRef(null);
  const tiltRef  = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % 2), 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const tilt  = tiltRef.current;
    if (!outer || !tilt) return;

    let leaveTimer = null;

    const onMouseEnter = () => {
      clearTimeout(leaveTimer);
      tilt.style.animationPlayState = 'paused';
      tilt.style.transition = 'none';
    };

    const onMouseMove = (e) => {
      const rect = outer.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)));
      tilt.style.transform = `perspective(1000px) rotateX(${(-dy * 15).toFixed(1)}deg) rotateY(${(dx * 15).toFixed(1)}deg)`;
    };

    const onMouseLeave = () => {
      tilt.style.transition = 'transform 0.6s ease';
      tilt.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      leaveTimer = setTimeout(() => {
        tilt.style.transition = '';
        tilt.style.transform = '';
        tilt.style.animationPlayState = '';
      }, 640);
    };

    outer.addEventListener('mouseenter', onMouseEnter);
    outer.addEventListener('mousemove',  onMouseMove);
    outer.addEventListener('mouseleave', onMouseLeave);
    return () => {
      clearTimeout(leaveTimer);
      outer.removeEventListener('mouseenter', onMouseEnter);
      outer.removeEventListener('mousemove',  onMouseMove);
      outer.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      style={{ perspective: '1000px', display: 'inline-block', pointerEvents: 'auto' }}
    >
      {/* JS-tilt target + slow rotateY CSS animation */}
      <div
        ref={tiltRef}
        style={{ transformStyle: 'preserve-3d', animation: 'phonesRotateY 6s ease-in-out infinite alternate' }}
      >
        {/* Float animation layer */}
        <div style={{
          animation: 'phonesFloat 3s ease-in-out infinite alternate',
          display: 'flex',
          gap: 32,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 640,
          transformStyle: 'preserve-3d',
        }}>
          {SCREENS.map((screen, i) => {
            const isActive = active === i;
            return (
              <div
                key={i}
                style={{
                  transition: 'transform 0.5s cubic-bezier(.4,0,.2,1), opacity 0.5s cubic-bezier(.4,0,.2,1)',
                  transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(16px)',
                  opacity: isActive ? 1 : 0.45,
                  transformOrigin: 'bottom center',
                }}
              >
                {/* iPhone shell */}
                <div style={{
                  width: 280,
                  height: 607,
                  borderRadius: 55,
                  padding: 12,
                  background: 'linear-gradient(145deg, #3a3a3a 0%, #1a1a1a 40%, #0d0d0d 70%, #2a2a2a 100%)',
                  boxShadow: [
                    '0 0 0 1px rgba(255,255,255,0.12)',
                    '0 40px 100px rgba(0,0,0,0.8)',
                    'inset 0 1px 0 rgba(255,255,255,0.15)',
                  ].join(', '),
                  position: 'relative',
                  boxSizing: 'border-box',
                  userSelect: 'none',
                }}>
                  {/* Inner bezel ring */}
                  <div style={{
                    position: 'absolute',
                    inset: 5,
                    borderRadius: 51,
                    background: 'linear-gradient(160deg, #181818, #080808)',
                    zIndex: 0,
                  }} />

                  <PhysicalButtons />

                  {/* Screen */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 44,
                    overflow: 'hidden',
                    background: '#000',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <img
                      src={screen.src}
                      alt={screen.alt}
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        display: 'block',
                        opacity: 1,
                        filter: 'none',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Dynamic Island */}
                    <div aria-hidden="true" style={{
                      position: 'absolute',
                      top: 12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 110,
                      height: 34,
                      background: '#000',
                      borderRadius: 20,
                      zIndex: 10,
                    }} />

                    {/* Home indicator */}
                    <div aria-hidden="true" style={{
                      position: 'absolute',
                      bottom: 8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 120,
                      height: 5,
                      background: 'rgba(255,255,255,0.35)',
                      borderRadius: 100,
                      zIndex: 10,
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
