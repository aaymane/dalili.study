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
  { label: 'Visa et Campus France',       href: '/blog' },
  { label: 'Logement CROUS et privé',     href: '/blog' },
  { label: 'Budget et aides (CAF, CSS)',  href: '/blog' },
  { label: 'Banque et finances',          href: '/blog' },
  { label: 'Démarches à l\'arrivée',      href: '/blog' },
  { label: 'Vie étudiante',               href: '/villes' },
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ background: '#010510', minHeight: '100vh' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(100px,12vw,160px) clamp(20px,5vw,80px) clamp(80px,10vw,120px)',
        }}>
          {/* Arabic watermark */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: 60,
              top: 80,
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 'clamp(120px,14vw,200px)',
              fontWeight: 700,
              color: 'rgba(1,77,248,0.12)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              userSelect: 'none',
              pointerEvents: 'none',
              direction: 'rtl',
              whiteSpace: 'nowrap',
            }}
          >
            دليلي
          </div>

          <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 64 }}>
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
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#4d8fff',
              }}>
                À propos
              </span>
            </nav>

            {/* Main title */}
            <h1 style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 900,
              fontSize: 'clamp(64px,10vw,120px)',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
              margin: '0 0 40px',
            }}>
              DALILI<br />
              <span>MON GUIDE.</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 18,
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
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 clamp(20px,5vw,80px) clamp(80px,10vw,120px)' }}>

          {/* ── Section 1 — L'origine ── */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 60, marginBottom: 60 }}>
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

            <h2 style={{
              fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32,
              color: '#ffffff', margin: '0 0 20px', lineHeight: 1.15,
            }}>
              Qui sommes-nous
            </h2>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 16px', maxWidth: 720 }}>
              {"Dalili a été créé en 2025 par des étudiants internationaux qui ont vécu les difficultés administratives du parcours étudiant en France. OFII à valider, compte bancaire sans justificatif de domicile, CROUS, CAF, Ameli — chaque démarche peut bloquer pendant des semaines si on ne sait pas exactement quoi faire, dans quel ordre, avec quels documents."}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 16px', maxWidth: 720 }}>
              {"Les ressources existantes (Campus France, Studyrama, L'Étudiant) s'adressent aux étudiants qui connaissent déjà le système. Dalili s'adresse à ceux qui arrivent de l'extérieur, avec des documents différents, des délais différents, des contraintes différentes."}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: 0, maxWidth: 720 }}>
              {"Notre mission : devenir la ressource la plus fiable, la plus complète et la plus honnête pour les étudiants internationaux en France."}
            </p>
          </div>

          {/* ── Section 2 — Notre méthode ── */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 60, marginBottom: 60 }}>
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

            <h2 style={{
              fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32,
              color: '#ffffff', margin: '0 0 20px', lineHeight: 1.15,
            }}>
              Sources officielles uniquement
            </h2>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 16px', maxWidth: 720 }}>
              {"Chaque information publiée sur Dalili est vérifiée sur les sources officielles avant publication. Nous citons systématiquement nos sources."}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 16px', maxWidth: 720 }}>
              {"Sources de référence utilisées : Campus France (campusfrance.org), Ministère de l'Enseignement Supérieur, Service-public.fr, CAF.fr, Ameli.fr, france-visas.gouv.fr, ANEF (anef.interieur.gouv.fr), CNOUS, consulats français par pays."}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 24px', maxWidth: 720 }}>
              {"Nous documentons également la réalité terrain — délais réels, difficultés pratiques, situations atypiques — en nous appuyant sur les retours d'expérience des utilisateurs Dalili."}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
              Dernière mise à jour : juin 2026
            </p>
          </div>

          {/* ── Section 3 — Chiffres clés ── */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 60, marginBottom: 60 }}>
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

            <h2 style={{
              fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32,
              color: '#ffffff', margin: '0 0 32px', lineHeight: 1.15,
            }}>
              La plateforme en chiffres
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {stats.map(stat => (
                <div key={stat.value} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '28px 32px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                    fontSize: 48, color: '#ffffff', lineHeight: 1, marginBottom: 10,
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
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 60, marginBottom: 60 }}>
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

            <h2 style={{
              fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 32,
              color: '#ffffff', margin: '0 0 20px', lineHeight: 1.15,
            }}>
              De A à Z, le parcours étudiant
            </h2>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 28px', maxWidth: 720 }}>
              {"Dalili documente l'intégralité du parcours — de la préparation du dossier Campus France à la vie quotidienne en France :"}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 32px' }}>
              {coverage.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-dm-sans)', fontSize: 15,
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
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 60 }}>
            <div style={{
              padding: 'clamp(28px,4vw,44px)',
              background: 'linear-gradient(135deg, rgba(1,77,248,0.08) 0%, rgba(1,5,16,0.98) 60%)',
              border: '1px solid rgba(1,77,248,0.18)',
              borderRadius: 20,
              textAlign: 'center',
            }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 18, color: '#ffffff', margin: '0 0 8px' }}>
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
