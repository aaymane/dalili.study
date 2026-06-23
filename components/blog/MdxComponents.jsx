// Server-safe MDX component overrides — no 'use client', no hooks
// Styles the rendered MDX prose to match the site's dark cinematic aesthetic

import RelatedArticles from './RelatedArticles';

const ACCENT = '#4d8fff';
const ACCENT_BRIGHT = '#014DF8';

export function Callout({ children, type = 'info' }) {
  const colors = {
    info:    { border: '#014DF8', bg: 'rgba(1,77,248,0.07)',   icon: '💡' },
    warning: { border: '#EFB370', bg: 'rgba(239,179,112,0.07)', icon: '⚠️' },
    success: { border: '#22C55E', bg: 'rgba(34,197,94,0.07)',   icon: '✅' },
  };
  const c = colors[type] ?? colors.info;
  return (
    <div style={{
      padding: 'clamp(14px,2vw,20px) clamp(16px,2.5vw,24px)',
      background: c.bg,
      borderLeft: `3px solid ${c.border}`,
      borderRadius: '0 10px 10px 0',
      margin: '1.8em 0',
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
      <div style={{
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '0.9rem', fontWeight: 400,
        lineHeight: 1.7, color: 'rgba(255,255,255,0.92)',
      }}>
        {children}
      </div>
    </div>
  );
}

const mdxComponents = {
  h1: ({ children, id }) => (
    <h1 id={id} style={{
      fontFamily: 'var(--font-bebas)',
      fontWeight: 400,
      fontSize: 'clamp(2.4rem,5vw,3.6rem)',
      lineHeight: 0.95, letterSpacing: '0.03em',
      color: '#fff',
      margin: '0 0 0.5em',
    }}>{children}</h1>
  ),

  h2: ({ children, id }) => (
    <h2 id={id} style={{
      fontFamily: 'var(--font-bebas)',
      fontWeight: 400,
      fontSize: 'clamp(1.7rem,3vw,2.4rem)',
      lineHeight: 1.0, letterSpacing: '0.04em',
      color: '#fff',
      margin: '2.2em 0 0.5em',
      paddingTop: '0.1em',
    }}>{children}</h2>
  ),

  h3: ({ children, id }) => (
    <h3 id={id} style={{
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 700,
      fontSize: 'clamp(0.95rem,1.5vw,1.1rem)',
      letterSpacing: '0.01em',
      color: '#ffffff',
      margin: '1.8em 0 0.4em',
    }}>{children}</h3>
  ),

  h4: ({ children, id }) => (
    <h4 id={id} style={{
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 600,
      fontSize: '0.9rem',
      letterSpacing: '0.04em', textTransform: 'uppercase',
      color: `rgba(${ACCENT},0.8)`,
      margin: '1.5em 0 0.3em',
    }}>{children}</h4>
  ),

  p: ({ children }) => (
    <p style={{
      fontFamily: 'var(--font-dm-sans)',
      fontWeight: 400,
      fontSize: 'clamp(0.9rem,1.2vw,1rem)',
      lineHeight: 1.85,
      color: 'rgba(255,255,255,0.92)',
      margin: '0 0 1.2em',
    }}>{children}</p>
  ),

  strong: ({ children }) => (
    <strong style={{
      fontWeight: 600,
      color: 'rgba(255,255,255,0.92)',
    }}>{children}</strong>
  ),

  em: ({ children }) => (
    <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>{children}</em>
  ),

  // Default values make href/children optional in the inferred parameter type,
  // satisfying AnchorHTMLAttributes where both are optional.
  a: ({ href = undefined, children = null, ...props }) => (
    <a
      href={href}
      {...props}
      style={{
        color: ACCENT,
        textDecoration: 'underline',
        textDecorationColor: 'rgba(77,143,255,0.35)',
        textUnderlineOffset: 3,
        transition: 'color 0.2s, text-decoration-color 0.2s',
      }}
    >{children}</a>
  ),

  ul: ({ children }) => (
    <ul style={{
      listStyle: 'none',
      padding: 0, margin: '0 0 1.2em',
    }}>{children}</ul>
  ),

  ol: ({ children }) => (
    <ol style={{
      listStyle: 'none',
      padding: 0, margin: '0 0 1.2em',
      counterReset: 'prose-ol',
    }}>{children}</ol>
  ),

  li: ({ children }) => (
    <li style={{
      fontFamily: 'var(--font-dm-sans)',
      fontWeight: 400,
      fontSize: 'clamp(0.88rem,1.2vw,0.98rem)',
      lineHeight: 1.75,
      color: 'rgba(255,255,255,0.92)',
      display: 'flex', gap: 10, alignItems: 'flex-start',
      marginBottom: '0.55em',
    }}>
      <span style={{
        flexShrink: 0, marginTop: '0.45em',
        width: 5, height: 5, borderRadius: '50%',
        background: ACCENT_BRIGHT,
        boxShadow: `0 0 6px rgba(1,77,248,0.6)`,
        display: 'inline-block',
      }} />
      <span>{children}</span>
    </li>
  ),

  blockquote: ({ children }) => (
    <blockquote style={{
      margin: '1.5em 0',
      padding: '16px 20px',
      borderLeft: `3px solid ${ACCENT_BRIGHT}`,
      background: 'rgba(1,77,248,0.05)',
      borderRadius: '0 10px 10px 0',
    }}>
      <div style={{
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '0.95rem', fontWeight: 400,
        lineHeight: 1.75, fontStyle: 'italic',
        color: 'rgba(255,255,255,0.92)',
      }}>{children}</div>
    </blockquote>
  ),

  code: ({ children }) => (
    <code style={{
      fontFamily: '"SF Mono", "Fira Code", monospace',
      fontSize: '0.82em',
      padding: '2px 7px',
      background: 'rgba(77,143,255,0.1)',
      border: '1px solid rgba(77,143,255,0.18)',
      borderRadius: 5,
      color: '#4d8fff',
    }}>{children}</code>
  ),

  pre: ({ children }) => (
    <pre style={{
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12,
      padding: 'clamp(16px,2vw,24px)',
      overflowX: 'auto',
      margin: '1.5em 0',
      fontFamily: '"SF Mono", "Fira Code", monospace',
      fontSize: '0.85rem',
      lineHeight: 1.7,
      color: 'rgba(255,255,255,0.75)',
    }}>{children}</pre>
  ),

  hr: () => (
    <hr style={{
      border: 'none',
      height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(1,77,248,0.3) 30%, rgba(255,255,255,0.08) 70%, transparent)',
      margin: '2.5em 0',
    }} />
  ),

  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '1.5em 0' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '0.88rem',
      }}>{children}</table>
    </div>
  ),

  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,

  th: ({ children }) => (
    <th style={{
      padding: '10px 16px', textAlign: 'left',
      fontFamily: 'var(--font-montserrat)',
      fontSize: '0.6rem', fontWeight: 700,
      letterSpacing: '0.16em', textTransform: 'uppercase',
      color: 'rgba(77,143,255,0.85)',
      borderBottom: '1px solid rgba(1,77,248,0.25)',
      background: 'rgba(1,77,248,0.05)',
    }}>{children}</th>
  ),

  td: ({ children }) => (
    <td style={{
      padding: '10px 16px',
      color: 'rgba(255,255,255,0.92)',
      fontWeight: 400,
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>{children}</td>
  ),

  // Expose Callout for use in MDX
  Callout,
  // Expose RelatedArticles for use in MDX
  RelatedArticles,
};

export default mdxComponents;
