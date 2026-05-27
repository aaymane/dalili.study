'use client';

import { useEffect, useRef } from 'react';

export default function Navbar() {
  const navRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      if (!navRef.current) return;
      if (window.scrollY > 50) {
        navRef.current.style.backdropFilter = 'blur(20px)';
        navRef.current.style.webkitBackdropFilter = 'blur(20px)';
        navRef.current.style.background = 'rgba(1,5,16,0.8)';
        navRef.current.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
      } else {
        navRef.current.style.backdropFilter = 'none';
        navRef.current.style.webkitBackdropFilter = 'none';
        navRef.current.style.background = 'transparent';
        navRef.current.style.borderBottom = '1px solid transparent';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease',
        background: 'transparent',
        borderBottom: '1px solid transparent',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          src="/dalili-logo.svg"
          alt="DALILI"
          data-navbar-logo="true"
          width={32}
          height={32}
          style={{ display: 'block', width: 32, height: 32 }}
        />
        <span style={{
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 900,
          fontSize: '1rem',
          color: '#fff',
          letterSpacing: '0.15em',
        }}>
          DALILI
        </span>
      </div>

      {/* CTA */}
      <a
        href="#early-access"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '10px 24px',
          background: '#014df8',
          color: '#fff',
          borderRadius: 100,
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 600,
          fontSize: '0.8rem',
          letterSpacing: '0.05em',
          textDecoration: 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          pointerEvents: 'auto',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1.03)'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        Rejoindre la liste
      </a>
    </nav>
  );
}
