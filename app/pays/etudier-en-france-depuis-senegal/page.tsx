import type { Metadata } from 'next';
import Link from 'next/link';
import RelatedArticles from '@/components/blog/RelatedArticles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Étudier en France depuis le Sénégal : guide complet 2026 | Dalili',
  description: 'Guide pour étudier en France depuis le Sénégal : Campus France Dakar, visa étudiant, délais réels, documents, bourses et démarches à l\'arrivée.',
  alternates: { canonical: `${SITE_URL}/pays/etudier-en-france-depuis-senegal` },
  openGraph: {
    title: 'Étudier en France depuis le Sénégal 2026 | Dalili',
    description: 'Campus France Dakar, visa, délais réels et toutes les démarches pour les étudiants sénégalais en France.',
    url: `${SITE_URL}/pays/etudier-en-france-depuis-senegal`,
    siteName: 'Dalili', type: 'article',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Pays', item: `${SITE_URL}/pays` },
    { '@type': 'ListItem', position: 3, name: 'Sénégal', item: `${SITE_URL}/pays/etudier-en-france-depuis-senegal` },
  ],
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <td style={{ padding: '13px 0', fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', paddingRight: 20, width: '45%' }}>{label}</td>
      <td style={{ padding: '13px 0', fontFamily: 'var(--font-dm-sans)', fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>{value}</td>
    </tr>
  );
}

export default function SenegalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Pays', href: null }, { label: 'Sénégal', href: null }].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{item.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '5px 16px', border: '1px solid rgba(1,77,248,0.28)', borderRadius: 100, background: 'rgba(1,77,248,0.06)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.85)' }}>🇸🇳 Depuis le Sénégal</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3rem,8vw,6.5rem)', lineHeight: 0.9, letterSpacing: '0.03em', color: '#fff', margin: '0 0 16px' }}>
              Étudier en France<br /><span style={{ color: 'rgba(255,255,255,0.35)' }}>depuis le Sénégal.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: 0, maxWidth: 580 }}>
              La France et le Sénégal partagent des liens historiques forts dans l&apos;enseignement supérieur. La procédure Campus France Dakar est bien rodée — mais les délais réels restent plus longs que l&apos;officiel. Voici ce qu&apos;il faut savoir.
            </p>
          </div>

          {/* Contacts essentiels */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Contacts essentiels</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="Campus France Sénégal (Dakar)" value="Av. Cheikh Anta Diop, Institut Français de Dakar — (221) 33 823 07 59" />
                <Row label="Consulat général de France à Dakar" value="1, rue El Hadji Amadou Assane Ndoye, Dakar — (221) 33 839 51 00" />
                <Row label="Ambassade de France à Dakar" value="1, rue El Hadji Amadou Assane Ndoye, Dakar — (221) 33 839 51 00" />
                <Row label="Site Campus France Sénégal" value="senegal.campusfrance.org" />
              </tbody>
            </table>
          </section>

          {/* Délais réels */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Délais réels 2025–2026</span>
            </div>
            <div style={{ padding: 24, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 16, marginBottom: 16 }}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: '#F59E0B' }}>⚠️ Note terrain :</strong> Les délais au Sénégal sont généralement plus courts qu&apos;au Maghreb, mais la période juin–août voit les délais exploser. Comptez <strong style={{ color: '#fff' }}>3 à 5 semaines hors été, 6 à 10 semaines entre juin et août</strong>.
              </p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="Dossier Campus France Sénégal" value="2–4 semaines" />
                <Row label="Instruction consulaire (Consulat Dakar)" value="2–4 semaines après dépôt biométrie" />
                <Row label="Total estimé (hors été)" value="3–5 semaines" />
                <Row label="Total estimé (juin–août)" value="6–10 semaines" />
                <Row label="Validation OFII à l'arrivée en France" value="Dans les 3 mois (en ligne : administration-etrangers-en-france.interieur.gouv.fr)" />
              </tbody>
            </table>
          </section>

          {/* Bourses */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Bourses spécifiques Sénégal</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Bourse Eiffel Excellence (Ministère de l\'Europe et des Affaires étrangères) — jusqu\'à 1 500 €/mois pour Master et Doctorat',
                'Bourses du gouvernement français (BGF) via l\'Ambassade de France à Dakar',
                'Bourses de l\'ANAQ-Sup (Sénégal) pour mobilité internationale',
                'Programme Major francophone (AUF) — Agence Universitaire de la Francophonie',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#4d8fff', flexShrink: 0, fontWeight: 700 }}>→</span>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Documents */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Documents requis</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Passeport valide (au moins 18 mois restants recommandés)',
                'Baccalauréat sénégalais ou équivalent (relevé de notes + attestation)',
                'Relevés de notes de toutes les années post-bac',
                'Dossier Campus France Sénégal complété (pays CEF)',
                'Attestation d\'admission dans un établissement français',
                'Justificatif de ressources suffisantes (615 €/mois minimum)',
                'Assurance voyage couvrant toute la durée du visa',
                'Formulaire France-Visas rempli en ligne',
                'Photos d\'identité biométriques récentes',
                'Reçu de paiement frais consulaires (50 €)',
              ].map((doc, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#4d8fff', flexShrink: 0, fontWeight: 700 }}>→</span>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)' }}>{doc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Calendrier */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Calendrier recommandé</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { mois: 'Novembre–Décembre', action: 'Créer le dossier Campus France Sénégal, candidatures aux établissements' },
                { mois: 'Janvier–Février', action: 'Compléter le dossier CEF, entretien Campus France si requis' },
                { mois: 'Mars–Avril', action: 'Admissions définitives, prendre RDV consulaire à Dakar' },
                { mois: 'Avril–Mai', action: 'Dépôt du dossier visa au Consulat de Dakar (biométrie incluse)' },
                { mois: 'Mai–Juin', action: 'Obtention du visa VLS-TS étudiant' },
                { mois: 'Juillet–Août', action: 'Logement (CROUS, Studapart), compte bancaire en ligne, préparation départ' },
                { mois: 'Septembre', action: 'Arrivée en France, validation OFII dans les 3 mois' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.7rem', color: '#4d8fff', flexShrink: 0, width: 130 }}>{step.mois}</span>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>{step.action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Liens officiels */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Liens officiels</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Campus France Sénégal', url: 'https://senegal.campusfrance.org' },
                { label: 'France-Visas — demande de visa étudiant', url: 'https://france-visas.gouv.fr' },
                { label: 'ANEF — validation VLS-TS à l\'arrivée en France', url: 'https://administration-etrangers-en-france.interieur.gouv.fr' },
                { label: 'Campus France — Bourses Eiffel', url: 'https://www.campusfrance.org/fr/eiffel' },
                { label: 'Service-Public.fr', url: 'https://www.service-public.fr' },
                { label: 'CROUS — logement étudiant', url: 'https://www.crous.fr' },
              ].map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}
                                                >
                  <span>{link.label}</span>
                  <span style={{ color: '#4d8fff', flexShrink: 0 }}>↗</span>
                </a>
              ))}
            </div>
          </section>

          <RelatedArticles articles={[
            { slug: 'visa-etudiant-france-tout-savoir-avant-partir', title: 'Visa étudiant France : tout ce qu\'il faut savoir avant de partir' },
            { slug: 'trouver-logement-france-depuis-etranger', title: 'Trouver un logement en France depuis l\'étranger' },
            { slug: 'budget-mensuel-etudiant-etranger-france-2026', title: 'Budget étudiant étranger en France 2026' },
          ]} />
        </div>
      </main>
    </>
  );
}
