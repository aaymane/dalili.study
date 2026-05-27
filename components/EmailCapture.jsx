'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailCapture() {
  const sectionRef = useRef(null);
  const cardRef    = useRef(null);
  const borderRef  = useRef(null);
  const inputRef   = useRef(null);
  const btnRef     = useRef(null);
  const [email,  setEmail]  = useState('');
  const [error,  setError]  = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success

  // Rotating border handled by CSS class .waitlist-border-anim (no JS RAF needed)

  // ── Card scroll entrance
  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from(card, {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none none' },
      });
    }, card);
    return () => ctx.revert();
  }, []);

  // ── Magnetic button effect — direct transform in event handler, no RAF loop
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || window.innerWidth < 768) return;

    const onMove = (e) => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      const d  = Math.hypot(dx, dy);
      if (d < 80) {
        btn.style.transform = `translate(${(dx * 0.35).toFixed(1)}px, ${(dy * 0.35).toFixed(1)}px)`;
      } else {
        btn.style.transform = 'translate(0px, 0px)';
      }
    };
    const onLeave = () => { btn.style.transform = 'translate(0px, 0px)'; };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // ── Input glow on focus
  const onFocus = () => {
    if (inputRef.current) {
      inputRef.current.style.borderColor = 'rgba(1,77,248,0.7)';
      inputRef.current.style.boxShadow   = '0 0 0 3px rgba(1,77,248,0.18), inset 0 0 20px rgba(1,77,248,0.06)';
    }
  };
  const onBlur = () => {
    if (inputRef.current) {
      inputRef.current.style.borderColor = 'rgba(255,255,255,0.1)';
      inputRef.current.style.boxShadow   = 'none';
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const t = email.trim();
    if (!EMAIL_RE.test(t)) { setError('Entre une adresse email valide.'); return; }
    setError('');
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: t }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('idle');
      setError('Une erreur est survenue. Réessaie dans un instant.');
    }
  }

  return (
    <section
      id="early-access"
      ref={sectionRef}
      className="email-section"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '80px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800, height: 800,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(1,77,248,0.08) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
        animation: 'glowPulse 6s ease-in-out infinite',
      }} />

      {/* Watermark */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-bebas)',
        fontSize: 'clamp(4rem, 12vw, 9rem)',
        color: 'rgba(1,77,248,0.04)',
        letterSpacing: '0.08em',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        ACCÈS ANTICIPÉ
      </div>

      {/* ── Card with animated border */}
      <div
        ref={cardRef}
        style={{ position: 'relative', zIndex: 1, width: 'min(100%, 580px)' }}
      >
        {/* Rotating gradient border layer — animated via CSS class (compositor thread) */}
        <div
          ref={borderRef}
          className="waitlist-border-anim"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 26,
            padding: 1.5,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Inner card */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          margin: '1.5px',
          padding: 'clamp(32px, 6vw, 56px) clamp(24px, 6vw, 52px)',
          background: 'rgba(4,8,28,0.96)',
          border: '1px solid rgba(1,77,248,0.14)',
          borderRadius: 24,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 0 100px rgba(1,77,248,0.06)',
          overflow: 'hidden',
        }}>
          {/* Scanline decorative accent */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(1,77,248,0.5), transparent)',
          }} />

          {status === 'success' ? (
            /* ── SUCCESS STATE */
            <div style={{
              minHeight: 260,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 20,
            }}>
              <div style={{
                fontSize: '3.5rem',
                filter: 'drop-shadow(0 0 30px rgba(1,77,248,1))',
                animation: 'popIn .6s cubic-bezier(.34,1.56,.64,1) forwards',
              }}>
                ✈️
              </div>
              <h2 style={{
                margin: 0,
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(3rem, 7vw, 5rem)',
                letterSpacing: '0.04em',
                color: '#fff',
                animation: 'fadeSlideUp .6s ease .3s both',
              }}>
                C&apos;est parti.
              </h2>
              <p style={{
                margin: 0,
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.45)',
                animation: 'fadeSlideUp .6s ease .5s both',
              }}>
                Tu es sur la liste. On te prévient en premier.
              </p>
              <div style={{
                display: 'flex',
                gap: 8,
                animation: 'fadeSlideUp .6s ease .7s both',
              }}>
                {['🇫🇷', '🎓', '🛫'].map((e, i) => (
                  <span key={i} style={{ fontSize: '1.4rem', filter: 'drop-shadow(0 0 8px rgba(1,77,248,0.6))' }}>{e}</span>
                ))}
              </div>
            </div>
          ) : (
            /* ── FORM STATE */
            <>
              <div style={{
                display: 'inline-flex',
                marginBottom: 24,
                padding: '5px 16px',
                border: '1px solid rgba(1,77,248,0.45)',
                borderRadius: 100,
                background: 'rgba(1,77,248,0.10)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: '#5a9fff',
                }}>
                  Accès Anticipé
                </span>
              </div>

              <h2 style={{
                margin: '0 0 16px',
                fontFamily: 'var(--font-bebas)',
                fontWeight: 400,
                fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                lineHeight: 0.92,
                letterSpacing: '0.04em',
                color: '#fff',
              }}>
                Rejoins<br />l&apos;avant-première
              </h2>

              <p style={{
                margin: '0 0 36px',
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.42)',
              }}>
                Sois parmi les premiers à recevoir Dalili et rejoindre notre communauté d&apos;étudiants internationaux.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="ec-email" style={{
                  position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)',
                }}>Email</label>

                <div className="email-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
                  <input
                    id="ec-email"
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder="ton@email.com"
                    aria-invalid={error ? 'true' : 'false'}
                    style={{
                      padding: '16px 20px',
                      background: 'rgba(255,255,255,0.035)',
                      border: `1px solid ${error ? 'rgba(255,80,80,0.6)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 14,
                      color: '#fff',
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'border-color .25s ease, box-shadow .25s ease',
                      minWidth: 0,
                    }}
                  />
                  <button
                    ref={btnRef}
                    type="submit"
                    aria-label="Rejoindre la liste d'attente Dalili"
                    disabled={status === 'loading'}
                    style={{
                      padding: '16px 24px',
                      background: status === 'loading'
                        ? 'rgba(1,77,248,0.6)'
                        : 'linear-gradient(135deg, #014df8 0%, #0066ff 100%)',
                      border: 'none',
                      borderRadius: 14,
                      color: '#fff',
                      fontFamily: 'var(--font-montserrat)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      letterSpacing: '0.03em',
                      cursor: status === 'loading' ? 'wait' : 'pointer',
                      whiteSpace: 'nowrap',
                      width: '100%',           // full-width when stacked on mobile
                      boxShadow: '0 8px 32px rgba(1,77,248,0.35)',
                      transition: 'filter .2s ease, box-shadow .2s ease, transform .15s ease',
                      willChange: 'transform',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.filter = 'brightness(1.15)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(1,77,248,0.55)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.filter = 'brightness(1)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(1,77,248,0.35)';
                    }}
                  >
                    {status === 'loading' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          width: 14, height: 14,
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          borderRadius: '50%',
                          display: 'inline-block',
                          animation: 'spin .7s linear infinite',
                        }} />
                        Envoi…
                      </span>
                    ) : 'Rejoindre →'}
                  </button>
                </div>

                {error && (
                  <p style={{
                    margin: '10px 0 0',
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.82rem',
                    color: 'rgba(255,90,90,0.9)',
                  }}>
                    {error}
                  </p>
                )}
              </form>

              <p style={{
                margin: '28px 0 0',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.25)',
                textAlign: 'center',
                letterSpacing: '0.02em',
              }}>
                Déjà <span style={{ color: 'rgba(77,143,255,0.7)', fontWeight: 600 }}>200+</span> étudiants sur la liste 🇫🇷
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
