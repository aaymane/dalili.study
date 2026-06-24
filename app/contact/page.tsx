import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Contact | Dalili',
  description: 'Contactez l\'équipe Dalili pour toute question, suggestion ou demande de partenariat.',
  alternates: { canonical: `${SITE_URL}/contact` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contact | Dalili',
    description: 'Contactez l\'équipe Dalili.',
    url: `${SITE_URL}/contact`,
    siteName: 'Dalili',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div style={{
      background: '#010510',
      minHeight: '100vh',
      padding: '80px 24px',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex',
          marginBottom: 20,
          padding: '5px 16px',
          border: '1px solid rgba(1,77,248,0.3)',
          borderRadius: 100,
          background: 'rgba(1,77,248,0.07)',
        }}>
          <span style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(77,143,255,0.85)',
          }}>
            {"Écrire à l'équipe"}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-bebas)',
          fontWeight: 400,
          fontSize: 'clamp(2.8rem,6vw,4rem)',
          letterSpacing: '0.04em',
          color: '#ffffff',
          margin: '0 0 20px',
          lineHeight: 0.95,
        }}>
          CONTACT
        </h1>

        <p style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 400,
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.8,
          margin: '0 0 16px',
          maxWidth: 560,
        }}>
          Pour toute question, suggestion ou demande de partenariat :
        </p>

        {/* Email CTA */}
        <a
          href="mailto:bonjour@dalili.study"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 28px',
            background: 'linear-gradient(135deg, rgba(1,77,248,0.18) 0%, rgba(1,4,16,0.95) 100%)',
            border: '1px solid rgba(1,77,248,0.4)',
            borderRadius: 14,
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#4d8fff',
            textDecoration: 'none',
            margin: '24px 0 40px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          bonjour@dalili.study
        </a>

        <p style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 400,
          fontSize: '0.88rem',
          color: 'rgba(255,255,255,0.82)',
          lineHeight: 1.7,
          margin: 0,
        }}>
          Nous répondons en général sous 48h.
        </p>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'rgba(255,255,255,0.07)',
          margin: '64px 0 0',
        }} />
      </div>
    </div>
  );
}
