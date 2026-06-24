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

const styles = {
  page: { background: '#010510', minHeight: '100vh', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,64px)' },
  inner: { maxWidth: 860, margin: '0 auto' },
  eyebrow: { fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(77,143,255,0.75)', marginBottom: 14 },
  h1: { fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(26px,4vw,46px)', color: '#ffffff', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.01em' },
  lead: { fontFamily: 'var(--font-dm-sans)', fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 56px', maxWidth: 640 },
  h2: { fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: '20px', color: '#ffffff', margin: '48px 0 8px' },
  body: { fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, margin: '0 0 16px' },
  divider: { height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 0 40px' },
};

const stats = [
  { value: '49', label: 'guides & démarches' },
  { value: '14', label: 'villes documentées' },
  { value: '14', label: 'universités' },
  { value: '6', label: 'pays couverts' },
  { value: '3', label: 'outils pratiques' },
];

const coverage = [
  { label: 'Visa étudiant', href: '/blog' },
  { label: 'Campus France', href: '/blog' },
  { label: 'Logement CROUS & CAF', href: '/blog' },
  { label: 'Compte bancaire en France', href: '/blog' },
  { label: 'Sécurité Sociale & CSS', href: '/blog' },
  { label: 'CVEC et inscription universitaire', href: '/blog' },
  { label: 'Transport étudiant', href: '/blog' },
  { label: 'Vie étudiante par ville', href: '/villes' },
  { label: 'Universités françaises', href: '/universites' },
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={styles.page}>
        <div style={styles.inner}>

          {/* Eyebrow */}
          <p style={styles.eyebrow}>Dalili Study</p>

          {/* H1 */}
          <h1 style={styles.h1}>
            Dalili — Le guide de référence pour les étudiants internationaux en France
          </h1>

          {/* Lead */}
          <p style={styles.lead}>
            {"Dalili (دليلي — \"mon guide\" en arabe) est la plateforme de référence pour les étudiants du Maroc, d'Algérie, de Tunisie, du Sénégal, de Côte d'Ivoire et du Cameroun souhaitant étudier en France."}
          </p>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Section 1 — Qui sommes-nous */}
          <h2 style={styles.h2}>Qui sommes-nous</h2>
          <p style={styles.body}>
            {"Dalili a été créé en 2025 par des étudiants internationaux qui ont vécu les difficultés administratives du parcours étudiant en France. OFII à valider, compte bancaire sans justificatif de domicile, CROUS, CAF, Ameli — chaque démarche peut bloquer pendant des semaines si on ne sait pas exactement quoi faire, dans quel ordre, avec quels documents."}
          </p>
          <p style={styles.body}>
            {"Les ressources existantes (Campus France, Studyrama, L'Étudiant) s'adressent aux étudiants qui connaissent déjà le système. Dalili s'adresse à ceux qui arrivent de l'extérieur, avec des documents différents, des délais différents, des contraintes différentes."}
          </p>
          <p style={styles.body}>
            {"Notre mission : devenir la ressource la plus fiable, la plus complète et la plus honnête pour les étudiants internationaux en France."}
          </p>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Section 2 — Notre méthode */}
          <h2 style={styles.h2}>Notre méthode</h2>
          <p style={styles.body}>
            {"Chaque information publiée sur Dalili est vérifiée sur les sources officielles avant publication. Nous citons systématiquement nos sources."}
          </p>
          <p style={styles.body}>
            {"Sources de référence utilisées : Campus France (campusfrance.org), Ministère de l'Enseignement Supérieur, Service-public.fr, CAF.fr, Ameli.fr, france-visas.gouv.fr, ANEF (anef.interieur.gouv.fr), CNOUS, consulats français par pays."}
          </p>
          <p style={styles.body}>
            {"Nous documentons également la réalité terrain — délais réels, difficultés pratiques, situations atypiques — en nous appuyant sur les retours d'expérience des utilisateurs Dalili."}
          </p>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: '0 0 8px' }}>
            Dernière mise à jour : juin 2026
          </p>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Section 3 — Chiffres clés */}
          <h2 style={styles.h2}>Chiffres clés</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16, margin: '24px 0 40px' }}>
            {stats.map(stat => (
              <div key={stat.value} style={{
                padding: '20px 16px',
                background: 'rgba(77,143,255,0.04)',
                border: '1px solid rgba(77,143,255,0.12)',
                borderRadius: 12,
              }}>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '32px', color: '#4d8fff', lineHeight: 1, marginBottom: 6 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Section 4 — Ce que nous couvrons */}
          <h2 style={styles.h2}>Ce que nous couvrons</h2>
          <p style={styles.body}>
            {"Dalili documente l'intégralité du parcours — de la préparation du dossier Campus France à la vie quotidienne en France :"}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 48px' }}>
            {coverage.map(item => (
              <li key={item.label} style={{ marginBottom: 10 }}>
                <Link
                  href={item.href}
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '15px',
                    color: 'rgba(77,143,255,0.85)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ color: 'rgba(77,143,255,0.4)', fontSize: '12px' }}>→</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div style={styles.divider} />

          {/* CTA */}
          <div style={{
            padding: 'clamp(28px,4vw,44px)',
            background: 'linear-gradient(135deg, rgba(77,143,255,0.06) 0%, rgba(1,5,16,0.98) 60%)',
            border: '1px solid rgba(77,143,255,0.15)',
            borderRadius: 16,
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '18px', color: '#ffffff', margin: '0 0 8px' }}>
              Restez informé
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 24px' }}>
              {"Laissez votre email — on vous prévient dès qu'un nouveau guide sort."}
            </p>
            <AboutJoinForm />
          </div>

        </div>
      </div>
    </>
  );
}
