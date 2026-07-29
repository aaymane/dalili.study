import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confidentialité',
  description: 'Politique de confidentialité de dalili.study — RGPD',
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
  ul: {
    fontFamily: 'var(--font-dm-sans)',
    fontWeight: 400,
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.8,
    margin: '0 0 12px',
    paddingLeft: 24,
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
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 12px',
    background: 'rgba(1,77,248,0.1)',
    border: '1px solid rgba(1,77,248,0.25)',
    borderRadius: 100,
    fontFamily: 'var(--font-montserrat)',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#4d8fff',
    marginBottom: 48,
  } as React.CSSProperties,
};

export default function ConfidentialitePage() {
  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <h1 style={styles.h1}>Politique de confidentialité</h1>
        <p style={styles.subtitle}>Conforme au Règlement Général sur la Protection des Données (RGPD — UE 2016/679).</p>
        <div style={styles.badge}>RGPD CONFORME</div>

        <h2 style={styles.h2}>Données collectées</h2>
        <p style={styles.p}>DALILI collecte uniquement :</p>
        <ul style={styles.ul}>
          <li>Votre adresse email (si vous vous inscrivez sur le site)</li>
          <li>Les données de navigation anonymes via Google Analytics</li>
        </ul>

        <h2 style={styles.h2}>Utilisation des données</h2>
        <p style={styles.p}>Votre email est utilisé pour :</p>
        <ul style={styles.ul}>
          <li>Vous envoyer les ressources demandées (checklist PDF, simulateur budget)</li>
          <li>Vous informer des nouvelles fonctionnalités DALILI</li>
        </ul>
        <p style={styles.p}>Vos données ne sont jamais vendues ni partagées avec des tiers.</p>

        <h2 style={styles.h2}>Vos droits (RGPD)</h2>
        <p style={styles.p}>
          {"Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles."}
        </p>
        <p style={styles.p}>
          Contact :{' '}
          <a href="mailto:bonjour@dalili.study" style={styles.a}>bonjour@dalili.study</a><br />
          Délai de réponse : 30 jours maximum.
        </p>

        <h2 style={styles.h2}>Cookies</h2>
        <p style={styles.p}>
          {"Ce site utilise des cookies analytiques (Google Analytics) pour mesurer l'audience de façon anonyme. Vous pouvez les refuser dans les paramètres de votre navigateur."}
        </p>

        <h2 style={styles.h2}>Hébergement des données</h2>
        <p style={styles.p}>Vos données sont hébergées chez :</p>
        <ul style={styles.ul}>
          <li><strong style={{ color: 'rgba(255,255,255,0.88)' }}>Supabase</strong> (base de données) — Union Européenne</li>
          <li><strong style={{ color: 'rgba(255,255,255,0.88)' }}>Vercel</strong> (hébergement) — États-Unis</li>
          <li><strong style={{ color: 'rgba(255,255,255,0.88)' }}>Resend</strong> (emails) — États-Unis</li>
        </ul>
        <p style={styles.p}>Ces prestataires respectent le RGPD.</p>

        <h2 style={styles.h2}>Contact DPO</h2>
        <p style={styles.p}>
          Pour toute question relative à vos données personnelles :{' '}
          <a href="mailto:bonjour@dalili.study" style={styles.a}>bonjour@dalili.study</a>
        </p>

        <h2 style={styles.h2}>Mise à jour</h2>
        <p style={styles.p}>Dernière mise à jour : juin 2026</p>

        <div style={styles.divider} />
      </div>
    </div>
  );
}
