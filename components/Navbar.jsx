'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FileText } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Universités', href: '/universites' },
  { label: 'Villes',      href: '/villes' },
  { label: 'Blog',        href: '/blog' },
  { label: 'À propos',   href: '/a-propos' },
];

const CHECKLIST_LINK = { label: 'Checklist PDF', href: '/checklist' };

export default function Navbar() {
  const navRef  = useRef(null);
  const router  = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Scroll-based backdrop
  useEffect(() => {
    function onScroll() {
      if (!navRef.current) return;
      if (window.scrollY > 50) {
        navRef.current.style.backdropFilter    = 'blur(20px)';
        navRef.current.style.webkitBackdropFilter = 'blur(20px)';
        navRef.current.style.background        = 'rgba(1,5,16,0.92)';
        navRef.current.style.borderBottom      = '1px solid rgba(255,255,255,0.07)';
      } else {
        navRef.current.style.backdropFilter    = 'none';
        navRef.current.style.webkitBackdropFilter = 'none';
        navRef.current.style.background        = 'transparent';
        navRef.current.style.borderBottom      = '1px solid transparent';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLogoClick() {
    sessionStorage.setItem('skipIntro', 'true');
    router.push('/');
  }

  const isHome  = pathname === '/';
  const ctaHref = isHome ? '#waitlist' : '/#waitlist';

  return (
    <>
      <nav
        ref={navRef}
        className="dalili-navbar"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(20px, 4vw, 40px)',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease',
          background: 'transparent',
          borderBottom: '1px solid transparent',
        }}
      >
        {/* ── Logo ── */}
        <div
          onClick={handleLogoClick}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', zIndex: 1001, flexShrink: 0 }}
        >
          <Image src="/images/logo-dalili.svg" alt="DALILI" data-navbar-logo="true" width={32} height={32} style={{ width: 32, height: 32 }} />
          <span style={{
            fontFamily: 'var(--font-montserrat)', fontWeight: 900,
            fontSize: '0.95rem', color: '#fff', letterSpacing: '0.15em',
          }}>DALILI</span>
        </div>

        {/* ── Desktop nav links ── */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px,2.5vw,32px)' }}>
          {NAV_LINKS.map(link => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-montserrat)', fontWeight: 600,
                  fontSize: '0.67rem', letterSpacing: '0.13em', textTransform: 'uppercase',
                  color: active ? '#4d8fff' : 'rgba(255,255,255,0.52)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.52)'; }}
              >
                {link.label}
                {active && (
                  <span style={{
                    position: 'absolute', bottom: -4, left: 0, right: 0, height: 1,
                    background: 'rgba(77,143,255,0.6)', borderRadius: 1,
                  }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right side: Checklist pill + CTA + Hamburger ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <Link
            href={CHECKLIST_LINK.href}
            className="nav-checklist-desktop"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 15px',
              border: '1px solid rgba(1,77,248,0.45)',
              background: 'rgba(1,77,248,0.1)',
              color: 'rgba(77,143,255,0.9)',
              borderRadius: 100,
              fontFamily: 'var(--font-montserrat)', fontWeight: 700,
              fontSize: '0.63rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s, border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(1,77,248,0.2)';
              e.currentTarget.style.borderColor = 'rgba(1,77,248,0.8)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(1,77,248,0.1)';
              e.currentTarget.style.borderColor = 'rgba(1,77,248,0.45)';
              e.currentTarget.style.color = 'rgba(77,143,255,0.9)';
            }}
          >
            <FileText size={13} strokeWidth={2} />
            Checklist PDF
          </Link>

          <a
            href={ctaHref}
            className="nav-cta-desktop"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '9px 22px',
              background: '#014df8', color: '#fff',
              borderRadius: 100,
              fontFamily: 'var(--font-montserrat)', fontWeight: 700,
              fontSize: '0.67rem', letterSpacing: '0.08em',
              textDecoration: 'none',
              transition: 'opacity 0.2s, transform 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.82'; e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Rejoindre
          </a>

          {/* Hamburger — mobile only (shown via CSS) */}
          <button
            onClick={() => setIsOpen(o => !o)}
            className="nav-hamburger"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 8, zIndex: 1001,
              display: 'none', // overridden in mobile CSS
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 22, height: 2,
                background: '#fff', borderRadius: 2,
                transition: 'transform 0.28s ease, opacity 0.2s ease',
                transform: isOpen
                  ? i === 0 ? 'translateY(7px) rotate(45deg)'
                  : i === 2 ? 'translateY(-7px) rotate(-45deg)'
                  : 'scaleX(0)'
                  : 'none',
                opacity: (isOpen && i === 1) ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* ── Mobile full-screen menu overlay ── */}
      <div
        className="nav-mobile-menu"
        aria-hidden={!isOpen}
        style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
          zIndex: 998,
          background: 'rgba(1,4,14,0.98)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          display: 'flex', flexDirection: 'column',
          padding: 'clamp(32px,6vw,52px) clamp(24px,6vw,48px)',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.28s ease, transform 0.28s ease',
          overflowY: 'auto',
        }}
      >
        {/* Accueil */}
        <div
          onClick={handleLogoClick}
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(1.5rem,5vw,1.9rem)', letterSpacing: '0.08em',
            color: pathname === '/' ? '#4d8fff' : 'rgba(255,255,255,0.88)',
            cursor: 'pointer', paddingBottom: 16,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            marginBottom: 16, lineHeight: 1,
          }}
        >
          Accueil
        </div>

        {NAV_LINKS.map(link => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(1.5rem,5vw,1.9rem)', letterSpacing: '0.08em',
                color: active ? '#4d8fff' : 'rgba(255,255,255,0.88)',
                textDecoration: 'none', lineHeight: 1,
                paddingBottom: 16,
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                marginBottom: 16, display: 'block',
              }}
            >
              {link.label}
            </Link>
          );
        })}

        {/* Checklist mobile link */}
        <Link
          href={CHECKLIST_LINK.href}
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(1.5rem,5vw,1.9rem)', letterSpacing: '0.08em',
            color: pathname === CHECKLIST_LINK.href ? '#4d8fff' : 'rgba(77,143,255,0.75)',
            textDecoration: 'none', lineHeight: 1,
            paddingBottom: 16,
            borderBottom: '1px solid rgba(1,77,248,0.15)',
            marginBottom: 16, display: 'block',
          }}
        >
          Checklist PDF
        </Link>

        <div style={{ marginTop: 'auto', paddingTop: 32 }}>
          <a
            href={ctaHref}
            onClick={() => setIsOpen(false)}
            style={{
              display: 'block', textAlign: 'center',
              padding: '16px 32px',
              background: '#014df8', color: '#fff',
              borderRadius: 100,
              fontFamily: 'var(--font-montserrat)', fontWeight: 700,
              fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Rejoindre la liste d&apos;attente
          </a>
        </div>
      </div>
    </>
  );
}
