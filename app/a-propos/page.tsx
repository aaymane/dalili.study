import type { Metadata } from 'next';
import Link from 'next/link';
import AboutJoinForm from '@/components/AboutJoinForm';

const SITE_URL = 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Dalili — Guide de référence pour les étudiants internationaux en France | Dalili',
  description: "Dalili documente l'intégralité du parcours étudiant en France : visa, Campus France, logement CROUS, CAF, banque, sécurité sociale. Sources officielles uniquement.",
  alternates: { canonical: `${SITE_URL}/a-propos` },
  openGraph: {
    title: 'Dalili — Guide de référence pour étudiants internationaux en France',
    description: "Plateforme de référence créée en 2025, couvrant 49 démarches pour 6 pays d'origine.",
    url: `${SITE_URL}/a-propos`,
    siteName: 'Dalili',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'À propos', item: `${SITE_URL}/a-propos` },
  ],
};

const stats = [
  { value: '49', label: 'Guides & démarches' },
  { value: '14', label: 'Villes documentées' },
  { value: '6',  label: 'Pays couverts' },
];

const coverage = [
  { label: 'Visa et Campus France',      href: '/blog' },
  { label: 'Logement CROUS et privé',    href: '/blog' },
  { label: 'Budget et aides (CAF, CSS)', href: '/blog' },
  { label: 'Banque et finances',         href: '/blog' },
  { label: "Démarches à l'arrivée",      href: '/blog' },
  { label: 'Vie étudiante',              href: '/villes' },
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Responsive CSS */}
      <style>{`
        .ap-arabic {
          position: absolute;
          right: 60px;
          top: 80px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(160px, 16vw, 220px);
          font-weight: 700;
          color: rgba(1,77,248,0.35);
          line-height: 1;
          letter-spacing: -0.02em;
          user-select: none;
          pointer-events: none;
          direction: rtl;
          white-space: nowrap;
        }
        .ap-h2 {
          font-family: var(--font-montserrat);
          font-weight: 800;
          font-size: clamp(22px, 3.5vw, 32px);
          color: #ffffff;
          margin: 0 0 20px;
          line-height: 1.15;
        }
        .ap-section {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: clamp(36px, 6vw, 60px);
          margin-bottom: clamp(36px, 6vw, 60px);
        }
        .ap-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .ap-coverage-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0 32px;
        }
        @media (max-width: 600px) {
          .ap-arabic {
            right: -20px;
            top: 60px;
            font-size: 100px;
            opacity: 0.7;
          }
          .ap-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .ap-coverage-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 400px) {
          .ap-arabic {
            display: none;
          }
        }
      `}</style>

      <main style={{ background: '#010510', minHeight: '100vh' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(100px,12vw,160px) clamp(20px,5vw,80px) clamp(60px,8vw,100px)',
        }}>
          {/* Arabic watermark */}
          <div aria-hidden="true" className="ap-arabic">دليلي</div>

          <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'clamp(32px,5vw,64px)' }}>
              <Link href="/" style={{
                fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.9)', textDecoration: 'none',
              }}>
                Accueil
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.6rem' }}>›</span>
              <span style={{
                fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4d8fff',
              }}>
                À propos
              </span>
            </nav>

            {/* Main title */}
            <h1 style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 900,
              fontSize: 'clamp(48px,6vw,80px)',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
              margin: '0 0 clamp(24px,3vw,40px)',
            }}>
              DALILI<br />
              <span>MON GUIDE.</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 'clamp(15px,1.5vw,18px)',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: 500,
              lineHeight: 1.7,
              margin: 0,
            }}>
              {'En arabe, dalili (دليلي) signifie '}
              <span style={{ color: '#014DF8', fontWeight: 600 }}>mon guide</span>
              {'. Pas un guide générique.'}<br />
              <strong style={{ color: '#ffffff' }}>Le tien.</strong>
            </p>

          </div>
        </section>

        {/* ── CONTENT ───────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 clamp(20px,5vw,80px) clamp(60px,8vw,100px)' }}>

          {/* ── Section 1 — L'origine ── */}
          <div className="ap-section">
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '5px 14px',
              border: '1px solid rgba(77,143,255,0.25)',
              borderRadius: 100,
              background: 'rgba(77,143,255,0.06)',
              marginBottom: 20,
            }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4d8fff',
              }}>
                L&apos;ORIGINE
              </span>
            </div>

            <h2 className="ap-h2">Qui sommes-nous</h2>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(14px,1.2vw,16px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 16px' }}>
              {"Dalili a été créé en 2025 par des étudiants internationaux qui ont vécu les difficultés administratives du parcours étudiant en France. OFII à valider, compte bancaire sans justificatif de domicile, CROUS, CAF, Ameli — chaque démarche peut bloquer pendant des semaines si on ne sait pas exactement quoi faire, dans quel ordre, avec quels documents."}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(14px,1.2vw,16px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 16px' }}>
              {"Les ressources existantes (Campus France, Studyrama, L'Étudiant) s'adressent aux étudiants qui connaissent déjà le système. Dalili s'adresse à ceux qui arrivent de l'extérieur, avec des documents différents, des délais différents, des contraintes différentes."}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(14px,1.2vw,16px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: 0 }}>
              {"Notre mission : devenir la ressource la plus fiable, la plus complète et la plus honnête pour les étudiants internationaux en France."}
            </p>
          </div>

          {/* ── Section 2 — Notre méthode ── */}
          <div className="ap-section">
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '5px 14px',
              border: '1px solid rgba(77,143,255,0.25)',
              borderRadius: 100,
              background: 'rgba(77,143,255,0.06)',
              marginBottom: 20,
            }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4d8fff',
              }}>
                NOTRE MÉTHODE
              </span>
            </div>

            <h2 className="ap-h2">Sources officielles uniquement</h2>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(14px,1.2vw,16px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 16px' }}>
              {"Chaque information publiée sur Dalili est vérifiée sur les sources officielles avant publication. Nous citons systématiquement nos sources."}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(14px,1.2vw,16px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 16px' }}>
              {"Sources de référence : Campus France, Ministère de l'Enseignement Supérieur, Service-public.fr, CAF.fr, Ameli.fr, france-visas.gouv.fr, ANEF, CNOUS, consulats français par pays."}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(14px,1.2vw,16px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 24px' }}>
              {"Nous documentons également la réalité terrain — délais réels, difficultés pratiques, situations atypiques — en nous appuyant sur les retours d'expérience des utilisateurs Dalili."}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
              Dernière mise à jour : juin 2026
            </p>
          </div>

          {/* ── Section 3 — Chiffres clés ── */}
          <div className="ap-section">
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '5px 14px',
              border: '1px solid rgba(77,143,255,0.25)',
              borderRadius: 100,
              background: 'rgba(77,143,255,0.06)',
              marginBottom: 20,
            }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4d8fff',
              }}>
                CHIFFRES CLÉS
              </span>
            </div>

            <h2 className="ap-h2" style={{ marginBottom: 32 }}>La plateforme en chiffres</h2>

            <div className="ap-stats-grid">
              {stats.map(stat => (
                <div key={stat.value} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: 'clamp(18px,3vw,28px) clamp(16px,2.5vw,32px)',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                    fontSize: 'clamp(36px,5vw,48px)', color: '#ffffff', lineHeight: 1, marginBottom: 10,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                    fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)', lineHeight: 1.4,
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 4 — Ce que nous couvrons ── */}
          <div className="ap-section">
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '5px 14px',
              border: '1px solid rgba(77,143,255,0.25)',
              borderRadius: 100,
              background: 'rgba(77,143,255,0.06)',
              marginBottom: 20,
            }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4d8fff',
              }}>
                CE QUE NOUS COUVRONS
              </span>
            </div>

            <h2 className="ap-h2">De A à Z, le parcours étudiant</h2>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(14px,1.2vw,16px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 28px' }}>
              {"Dalili documente l'intégralité du parcours — de la préparation du dossier Campus France à la vie quotidienne en France :"}
            </p>

            <div className="ap-coverage-grid">
              {coverage.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(13px,1.1vw,15px)',
                    transition: 'color 0.2s',
                  }}
                >
                  <span style={{ color: '#014DF8', fontWeight: 700, flexShrink: 0 }}>→</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 'clamp(36px,6vw,60px)' }}>
            <div style={{
              padding: 'clamp(24px,4vw,44px)',
              background: 'linear-gradient(135deg, rgba(1,77,248,0.08) 0%, rgba(1,5,16,0.98) 60%)',
              border: '1px solid rgba(1,77,248,0.18)',
              borderRadius: 20,
              textAlign: 'center',
            }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 'clamp(16px,1.5vw,18px)', color: '#ffffff', margin: '0 0 8px' }}>
                Restez informé
              </p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: '0 0 24px' }}>
                {"Laissez votre email — on vous prévient dès qu'un nouveau guide sort."}
              </p>
              <AboutJoinForm />
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
