'use client';

import { useState } from 'react';
import { Globe, CheckCircle2, X } from 'lucide-react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistCTA() {
  const [open,   setOpen]   = useState(false);
  const [email,  setEmail]  = useState('');
  const [error,  setError]  = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  function openModal()  { setOpen(true);  document.body.style.overflow = 'hidden'; }
  function closeModal() { setOpen(false); document.body.style.overflow = ''; }

  async function handleSubmit(e: React.FormEvent) {
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
    <>
      {/* ── CTA card ── */}
      <div style={{
        padding: 'clamp(28px,5vw,48px)',
        background: 'linear-gradient(145deg, rgba(1,77,248,0.1) 0%, rgba(1,4,16,0.96) 100%)',
        borderWidth: 1, borderStyle: 'solid',
        borderColor: 'rgba(1,77,248,0.25)',
        borderRadius: 22,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 0 40px rgba(1,77,248,0.08), 0 20px 60px rgba(0,0,0,0.4)',
        position: 'relative', overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(1,77,248,0.7), rgba(77,143,255,0.9), rgba(1,77,248,0.7), transparent)',
        }} />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(1,77,248,0.12)', border: '1px solid rgba(1,77,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={22} color="#4d8fff" strokeWidth={1.5} />
          </div>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-bebas)',
          fontWeight: 400,
          fontSize: 'clamp(1.8rem,4vw,3rem)',
          lineHeight: 0.95, letterSpacing: '0.04em',
          color: '#fff', margin: '0 0 12px',
        }}>
          DALILI T&apos;ACCOMPAGNE<br />
          <span style={{ color: 'rgba(255,255,255,0.92)' }}>À CHAQUE ÉTAPE.</span>
        </h2>

        <p style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 400,
          fontSize: 'clamp(0.85rem,1.2vw,0.97rem)',
          lineHeight: 1.75, color: 'rgba(255,255,255,0.92)',
          maxWidth: 440, margin: '0 auto clamp(24px,3vw,32px)',
        }}>
          Visa, logement, banque, CAF — Dalili guide les étudiants internationaux
          pas à pas dans leurs démarches en France.
        </p>

        <button
          onClick={openModal}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: 'clamp(12px,2vw,16px) clamp(24px,4vw,36px)',
            background: '#014DF8',
            border: 'none', cursor: 'pointer',
            borderRadius: 100,
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#fff',
            boxShadow: '0 0 24px rgba(1,77,248,0.5), 0 8px 32px rgba(0,0,0,0.3)',
            transition: 'box-shadow 0.25s, transform 0.25s',
          }}
        >
          Rejoindre la waitlist Dalili →
        </button>
      </div>

      {/* ── Modal overlay ── */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Rejoindre la waitlist Dalili"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            background: 'rgba(1,4,16,0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div style={{
            width: '100%', maxWidth: 480,
            background: 'linear-gradient(160deg, rgba(1,77,248,0.12) 0%, rgba(1,4,16,0.98) 60%)',
            border: '1px solid rgba(1,77,248,0.28)',
            borderRadius: 24,
            padding: 'clamp(32px,5vw,48px)',
            position: 'relative',
            boxShadow: '0 0 60px rgba(1,77,248,0.15), 0 32px 80px rgba(0,0,0,0.6)',
          }}>
            {/* Top accent */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              borderRadius: '24px 24px 0 0',
              background: 'linear-gradient(90deg, transparent, rgba(1,77,248,0.8), rgba(77,143,255,1), rgba(1,77,248,0.8), transparent)',
            }} />

            {/* Close button */}
            <button
              onClick={closeModal}
              aria-label="Fermer"
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                color: 'rgba(255,255,255,0.92)',
                cursor: 'pointer',
              }}
            >
              <X size={15} strokeWidth={2} />
            </button>

            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <CheckCircle2 size={48} color="#22C55E" strokeWidth={1.5} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: 'clamp(1.8rem,4vw,2.4rem)',
                  letterSpacing: '0.04em', lineHeight: 0.95,
                  color: '#fff', margin: '0 0 12px',
                }}>TU ES SUR LA LISTE !</h3>
                <p style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.9rem', fontWeight: 400,
                  color: 'rgba(255,255,255,0.92)', lineHeight: 1.7,
                  margin: 0,
                }}>
                  On te contacte dès que Dalili est disponible. À très vite 🇫🇷
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', marginBottom: 16,
                    border: '1px solid rgba(1,77,248,0.3)',
                    borderRadius: 100, background: 'rgba(1,77,248,0.08)',
                  }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: '#4d8fff', boxShadow: '0 0 6px #4d8fff',
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.52rem', fontWeight: 700,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: '#4d8fff',
                    }}>Early Access</span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(1.8rem,4vw,2.4rem)',
                    letterSpacing: '0.04em', lineHeight: 0.95,
                    color: '#fff', margin: '0 0 10px',
                  }}>REJOINS LA WAITLIST</h3>

                  <p style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.875rem', fontWeight: 400,
                    color: 'rgba(255,255,255,0.92)', lineHeight: 1.7,
                    margin: 0,
                  }}>
                    Sois parmi les premiers à accéder à Dalili et à simplifier ton installation en France.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ton@email.com"
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.95rem', fontWeight: 400,
                        color: '#fff',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = 'rgba(1,77,248,0.7)';
                        e.currentTarget.style.boxShadow  = '0 0 0 3px rgba(1,77,248,0.18)';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.boxShadow  = 'none';
                      }}
                    />
                    {error && (
                      <p style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.78rem', color: '#ff6b6b',
                        margin: '6px 0 0', paddingLeft: 4,
                      }}>{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: status === 'loading' ? 'rgba(1,77,248,0.5)' : '#014DF8',
                      border: 'none', cursor: status === 'loading' ? 'default' : 'pointer',
                      borderRadius: 12,
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.68rem', fontWeight: 700,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: '#fff',
                      boxShadow: '0 0 20px rgba(1,77,248,0.4)',
                      transition: 'background 0.2s, box-shadow 0.2s',
                    }}
                  >
                    {status === 'loading' ? 'Envoi…' : "S'inscrire →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
