import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales de dalili.study',
  robots: { index: false, follow: false },
};

const styles = {
  page: {
    background: '#010510',
    minHeight: '100vh',
    padding: '80px 24px',
  } as React.CSSProperties,
  inner: {
    maxWidth: 800,
    margin: '0 auto',
  } as React.CSSProperties,
  h1: {
    fontFamily: 'var(--font-bebas)',
    fontWeight: 400,
    fontSize: 'clamp(2.4rem,5vw,3rem)',
    letterSpacing: '0.04em',
    color: '#ffffff',
    margin: '0 0 8px',
  } as React.CSSProperties,
  subtitle: {
    fontFamily: 'var(--font-dm-sans)',
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 56,
    lineHeight: 1.6,
  } as React.CSSProperties,
  h2: {
    fontFamily: 'var(--font-montserrat)',
    fontWeight: 700,
    fontSize: '0.72rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: '#4d8fff',
    marginTop: 48,
    marginBottom: 16,
  } as React.CSSProperties,
  p: {
    fontFamily: 'var(--font-dm-sans)',
    fontWeight: 400,
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.8,
    margin: '0 0 12px',
  } as React.CSSProperties,
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.07)',
    margin: '48px 0 0',
  } as React.CSSProperties,
  a: {
    color: '#4d8fff',
    textDecoration: 'none',
  } as React.CSSProperties,
};

export default function MentionsLegalesPage() {
  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <h1 style={styles.h1}>Mentions légales</h1>
        <p style={styles.subtitle}>{"Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique."}</p>

        <h2 style={styles.h2}>Éditeur du site</h2>
        <p style={styles.p}>
          <strong style={{ color: 'rgba(255,255,255,0.92)' }}>Nom :</strong> Aymane Amri<br />
          <strong style={{ color: 'rgba(255,255,255,0.92)' }}>Email :</strong>{' '}
          <a href="mailto:bonjour@dalili.study" style={styles.a}>bonjour@dalili.study</a><br />
          <strong style={{ color: 'rgba(255,255,255,0.92)' }}>Site :</strong>{' '}
          <a href="https://dalili.study" style={styles.a}>dalili.study</a>
        </p>

        <h2 style={styles.h2}>Hébergeur</h2>
        <p style={styles.p}>
          Vercel Inc.<br />
          340 Pine Street, Suite 1220<br />
          San Francisco, CA 94104, États-Unis<br />
          <a href="https://vercel.com" style={styles.a} target="_blank" rel="noopener noreferrer">vercel.com</a>
        </p>

        <h2 style={styles.h2}>Propriété intellectuelle</h2>
        <p style={styles.p}>
          Le contenu de dalili.study (textes, guides, outils, logos) est la propriété exclusive de DALILI.
          Toute reproduction sans autorisation écrite est interdite.
        </p>

        <h2 style={styles.h2}>Liens affiliés</h2>
        <p style={styles.p}>
          Certains liens sur ce site sont des liens partenaires. DALILI peut percevoir une commission
          si vous utilisez ces services, sans coût supplémentaire pour vous. Chaque lien affilié est
          signalé clairement.
        </p>

        <div style={styles.divider} />
      </div>
    </div>
  );
}
