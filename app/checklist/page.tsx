import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Checklist arrivée en France 2026 — PDF gratuit | Dalili',
  description:
    'Télécharge la checklist complète pour préparer ton arrivée en France : visa, logement, banque, CAF, sécurité sociale. PDF gratuit mis à jour 2026.',
  alternates: { canonical: `${SITE_URL}/checklist` },
  openGraph: {
    title: 'Checklist arrivée en France 2026 — PDF gratuit | Dalili',
    description:
      'Checklist complète pour étudiants internationaux : visa VLS-TS, CAF, Ameli, logement, banque. Tout ce qu\'il faut faire avant et après ton arrivée en France.',
    url: `${SITE_URL}/checklist`,
    siteName: 'Dalili',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dalilistudy',
    title: 'Checklist arrivée en France 2026 — PDF gratuit | Dalili',
    description:
      'Télécharge la checklist complète : visa, CAF, logement, Ameli. PDF gratuit mis à jour 2026.',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Checklist arrivée en France',
        item: `${SITE_URL}/checklist`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Checklist Arrivée en France 2026',
    applicationCategory: 'EducationalApplication',
    description:
      "Checklist PDF complète pour les étudiants internationaux arrivant en France : démarches avant le départ, à l'arrivée et dans les 3 premiers mois.",
    url: `${SITE_URL}/checklist`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    author: { '@type': 'Organization', name: 'Dalili', url: SITE_URL },
    dateModified: '2026-06-18',
    inLanguage: 'fr',
  },
];

const SECTIONS = [
  {
    icon: '✈️',
    title: 'Avant le départ',
    color: '77,143,255',
    items: [
      'Dossier Campus France soumis',
      'Visa VLS-TS obtenu',
      'Traductions certifiées des documents',
      'Logement réservé (CROUS, Studapart…)',
      'Compte bancaire en ligne ouvert',
      '+ 7 autres points essentiels',
    ],
  },
  {
    icon: '🏠',
    title: "À l'arrivée en France",
    color: '1,77,248',
    items: [
      'Validation VLS-TS sur ANEF (3 mois max)',
      'Inscription Assurance Maladie',
      'Paiement CVEC (103€)',
      'Demande APL/CAF dès J+1',
      'Ouverture compte bancaire traditionnel',
      '+ 5 autres points essentiels',
    ],
  },
  {
    icon: '📋',
    title: 'Dans les 3 premiers mois',
    color: '16,185,129',
    items: [
      'Numéro de sécurité sociale reçu',
      'Carte Vitale commandée',
      'Titre de séjour déposé',
      'Visite médicale OFII passée',
      'Inscription à la BU',
      '+ 4 autres points essentiels',
    ],
  },
];

export default function ChecklistPage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main id="main-content" style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* ── Breadcrumb ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Checklist', href: null }].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{item.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 'clamp(40px,5vw,72px)' }}>

            {/* ── Hero ── */}
            <div>
              <div style={{ display: 'inline-flex', marginBottom: 20, padding: '5px 16px', border: '1px solid rgba(1,77,248,0.3)', borderRadius: 100, background: 'rgba(1,77,248,0.07)' }}>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.85)' }}>
                  PDF Gratuit — Mis à jour juin 2026
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3rem,8vw,7rem)', lineHeight: 0.9, letterSpacing: '0.03em', color: '#fff', margin: '0 0 clamp(16px,2vw,24px)' }}>
                CHECKLIST<br />
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>ARRIVÉE EN</span><br />
                <span style={{ color: '#014DF8' }}>FRANCE 2026</span>
              </h1>

              <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 'clamp(0.95rem,1.4vw,1.1rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 600, lineHeight: 1.75, margin: '0 0 clamp(24px,3vw,36px)' }}>
                La checklist complète pour ne rien oublier quand tu prépares ton arrivée en France.
                3 pages, 28 points essentiels — visa, logement, CAF, Assurance Maladie, titre de séjour.
                Télécharge, imprime, coche chaque étape.
              </p>

              {/* Trust signals */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 'clamp(28px,4vw,44px)', alignItems: 'center' }}>
                {[
                  { icon: '✅', text: "200+ étudiants l'ont utilisée" },
                  { icon: '🔄', text: 'Mise à jour juin 2026' },
                  { icon: '📄', text: '3 pages · 28 points' },
                  { icon: '🆓', text: '100% gratuit' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100 }}>
                    <span style={{ fontSize: 13 }}>{icon}</span>
                    <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="/api/checklist"
                download="checklist-arrivee-france-dalili-2026.pdf"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 'clamp(14px,2vw,18px) clamp(24px,3vw,36px)',
                  background: '#014DF8',
                  borderRadius: 12,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 700,
                  fontSize: 'clamp(0.8rem,1.2vw,0.95rem)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  boxShadow: '0 0 40px rgba(1,77,248,0.35)',
                  transition: 'opacity 0.2s',
                }}
              >
                <span>📥</span>
                Télécharger la checklist PDF — Gratuit
              </a>

              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: 12 }}>
                PDF · 3 pages A4 · Partage libre
              </p>
            </div>

            {/* ── Preview sections ── */}
            <div>
              <div style={{ marginBottom: 32 }}>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  Ce que contient la checklist
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px,100%),1fr))', gap: 'clamp(14px,2vw,22px)' }}>
                {SECTIONS.map(section => (
                  <div
                    key={section.title}
                    style={{
                      padding: 'clamp(20px,3vw,28px)',
                      background: `linear-gradient(160deg, rgba(${section.color},0.08) 0%, rgba(1,4,16,0.96) 60%)`,
                      border: `1px solid rgba(${section.color},0.2)`,
                      borderRadius: 18,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, rgba(${section.color},0.8), transparent)` }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                      <span style={{ fontSize: 22 }}>{section.icon}</span>
                      <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: '1.4rem', letterSpacing: '0.04em', color: '#fff', margin: 0 }}>
                        {section.title}
                      </h2>
                    </div>

                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {section.items.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{
                            width: 14,
                            height: 14,
                            borderRadius: 3,
                            border: `1.5px solid rgba(${section.color},0.6)`,
                            background: `rgba(${section.color},0.06)`,
                            flexShrink: 0,
                            marginTop: 2,
                          }} />
                          <span style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.82rem',
                            color: item.startsWith('+') ? `rgba(${section.color},0.8)` : 'rgba(255,255,255,0.55)',
                            fontWeight: item.startsWith('+') ? 600 : 400,
                            fontStyle: item.startsWith('+') ? 'italic' : 'normal',
                          }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Second CTA ── */}
            <div style={{ textAlign: 'center', padding: 'clamp(28px,4vw,48px)', background: 'rgba(1,77,248,0.06)', border: '1px solid rgba(1,77,248,0.18)', borderRadius: 20 }}>
              <p style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', letterSpacing: '0.04em', color: '#fff', margin: '0 0 16px' }}>
                Partage cette checklist —<br />
                <span style={{ color: '#014DF8' }}>aide les autres étudiants</span>
              </p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 28px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
                Tu peux partager ce PDF librement dans les groupes Facebook, WhatsApp et Discord d&apos;étudiants.
              </p>
              <a
                href="/api/checklist"
                download="checklist-arrivee-france-dalili-2026.pdf"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: '#014DF8', borderRadius: 10, textDecoration: 'none', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}
              >
                <span>📥</span>
                Télécharger gratuitement
              </a>
            </div>

            {/* ── Internal links ── */}
            <div>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  Guides complémentaires
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { href: '/blog/visa-etudiant-france-maroc-2026', label: 'Guide complet visa étudiant France depuis le Maroc 2026', icon: '🇫🇷' },
                  { href: '/pays/etudier-en-france-depuis-le-maroc', label: 'Étudier en France depuis le Maroc : démarches, délais et contacts', icon: '🇲🇦' },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, textDecoration: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 16 }}>{link.icon}</span>
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.88rem', fontWeight: 500, color: 'rgba(255,255,255,0.65)' }}>{link.label}</span>
                    </div>
                    <span style={{ color: '#4d8fff', flexShrink: 0 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
