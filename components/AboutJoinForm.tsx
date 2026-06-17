'use client';

import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AboutJoinForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', letterSpacing: '0.06em', color: '#4d8fff', marginBottom: 8 }}>C&apos;est parti !</div>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          Tu es dans la liste. On te tient au courant.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="ton@email.com"
        required
        style={{
          flex: '1 1 220px',
          maxWidth: 300,
          padding: '13px 20px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 100,
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.875rem',
          color: '#fff',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          padding: '13px 28px',
          background: '#014df8',
          color: '#fff',
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          borderRadius: 100,
          border: 'none',
          cursor: status === 'loading' ? 'wait' : 'pointer',
          flexShrink: 0,
        }}
      >
        {status === 'loading' ? '...' : 'Rejoindre'}
      </button>
      {status === 'error' && (
        <p style={{ width: '100%', textAlign: 'center', fontFamily: 'var(--font-dm-sans)', fontSize: '0.8rem', color: '#F43F5E', margin: '4px 0 0' }}>
          Une erreur s&apos;est produite. Réessaie.
        </p>
      )}
    </form>
  );
}
