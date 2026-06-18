import type { Metadata } from 'next';
import Link from 'next/link';
import RelatedArticles from '@/components/blog/RelatedArticles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Étudier en France depuis l\'Algérie : guide complet 2026 | Dalili',
  description: 'Guide complet pour étudier en France depuis l\'Algérie : Campus France Algérie, visa étudiant, délais réels, Accords de 1968, documents requis et démarches.',
  alternates: { canonical: `${SITE_URL}/pays/etudier-en-france-depuis-algerie` },
  openGraph: {
    title: 'Étudier en France depuis l\'Algérie 2026 | Dalili',
    description: 'Campus France Algérie, visa, délais réels et démarches pour les étudiants algériens en France.',
    url: `${SITE_URL}/pays/etudier-en-france-depuis-algerie`,
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
    { '@type': 'ListItem', position: 3, name: 'Algérie', item: `${SITE_URL}/pays/etudier-en-france-depuis-algerie` },
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

export default function AlgeriePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Pays', href: null }, { label: 'Algérie', href: null }].map((item, i, arr) => (
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
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.85)' }}>🇩🇿 Depuis l&apos;Algérie</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3rem,8vw,6.5rem)', lineHeight: 0.9, letterSpacing: '0.03em', color: '#fff', margin: '0 0 16px' }}>
              Étudier en France<br /><span style={{ color: 'rgba(255,255,255,0.35)' }}>depuis l&apos;Algérie.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: 0, maxWidth: 580 }}>
              L&apos;Algérie envoie chaque année des dizaines de milliers d&apos;étudiants en France. La procédure est spécifique aux ressortissants algériens — les Accords de 1968 changent plusieurs règles. Voici ce que vous devez vraiment savoir.
            </p>
          </div>

          {/* Accords 1968 — bloc spécifique */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ padding: 24, background: 'rgba(77,143,255,0.06)', border: '1px solid rgba(77,143,255,0.2)', borderRadius: 16 }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4d8fff', marginBottom: 8 }}>Accords franco-algériens de 1968</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, margin: 0 }}>
                Les ressortissants algériens ne sont pas soumis au droit commun des étrangers en France. Ils bénéficient du régime des Accords de 1968 pour le titre de séjour : le document qui vous sera délivré après un VLS-TS étudiant est un <strong style={{ color: '#fff' }}>certificat de résidence</strong> (et non un titre de séjour classique). Les démarches OFII restent obligatoires à l&apos;arrivée.
              </p>
            </div>
          </section>

          {/* Contacts essentiels */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Campus France Algérie</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="Alger (siège)" value="7 bis, rue Abou Nouas, Hydra, Alger — 023 48 64 64" />
                <Row label="Oran (antenne)" value="Campus France Oran, Résidence Les Andalous, Oran — 041 41 68 00" />
                <Row label="Constantine (antenne)" value="Contact via le siège d'Alger pour Constantine" />
                <Row label="Ambassade de France à Alger" value="25, chemin Abdelkader Gadouche, Hydra, Alger — 023 98 96 00" />
                <Row label="VFS Global (biométrie visa)" value="Alger, Oran, Constantine, Annaba, Sidi Bel Abbès, Tizi Ouzou, Ouargla" />
                <Row label="Site Campus France Algérie" value="algerie.campusfrance.org" />
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
                <strong style={{ color: '#F59E0B' }}>⚠️ Délais terrain :</strong> La prise de rendez-vous VFS Global en Algérie est souvent saturée — les étudiants Dalili rapportent des attentes de <strong style={{ color: '#fff' }}>4 à 8 semaines rien que pour le RDV biométrie</strong>, avant même l&apos;instruction du dossier. Commencez très tôt : idéalement dès mars pour une rentrée en septembre.
              </p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="Création dossier Campus France + entretien" value="3–6 semaines" />
                <Row label="Prise de RDV VFS Global (biométrie)" value="2–6 semaines selon la ville" />
                <Row label="Instruction consulaire après dépôt" value="2–4 semaines" />
                <Row label="Total estimé (hors été)" value="8–14 semaines" />
                <Row label="Total estimé (juin–août, période critique)" value="12–20 semaines" />
                <Row label="Validation OFII à l'arrivée en France" value="Dans les 3 mois (en ligne : administration-etrangers-en-france.interieur.gouv.fr)" />
              </tbody>
            </table>
          </section>

          {/* Documents */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Documents requis</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Passeport valide (minimum 18 mois restants recommandés)',
                'Baccalauréat algérien (relevé de notes officiel + attestation)',
                'Relevés de notes de toutes les années post-bac',
                'Dossier Campus France complété et validé (Algérie = pays CEF obligatoire)',
                'Attestation d\'admission ou d\'inscription dans un établissement français',
                'Justificatif de ressources : 615 €/mois minimum (relevés bancaires ou attestation de prise en charge)',
                'Justificatif de logement (CROUS, bail, attestation d\'hébergement)',
                'Assurance voyage (minimum 30 000 €, durée du séjour)',
                'Formulaire France-Visas (rempli en ligne avant le RDV VFS)',
                'Reçu de paiement des frais de visa (50 €) + frais VFS (~30 €)',
                'Photos d\'identité biométriques (normes françaises)',
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
                { mois: 'Novembre', action: 'Créer compte Campus France Algérie, commencer le dossier CEF' },
                { mois: 'Décembre–Janvier', action: 'Compléter le dossier, candidatures aux établissements français' },
                { mois: 'Janvier–Février', action: 'Entretien Campus France (préparation essentielle), suivi des candidatures' },
                { mois: 'Mars', action: 'Admission définitive, prendre le plus tôt possible un RDV VFS Global' },
                { mois: 'Avril–Mai', action: 'RDV VFS Global (biométrie + dépôt dossier visa)' },
                { mois: 'Mai–Juin', action: 'Instruction consulaire, obtention visa VLS-TS' },
                { mois: 'Juillet–Août', action: 'Recherche logement (CROUS, Studapart), ouverture compte bancaire en ligne' },
                { mois: 'Septembre', action: 'Arrivée en France, valider le VLS-TS sur ANEF dans les 3 mois' },
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
                { label: 'Campus France Algérie', url: 'https://algerie.campusfrance.org' },
                { label: 'France-Visas — demande de visa en ligne', url: 'https://france-visas.gouv.fr' },
                { label: 'VFS Global Algérie — prise de RDV biométrie', url: 'https://www.vfsglobal.com/France/Algeria' },
                { label: 'ANEF — validation VLS-TS et titre de séjour', url: 'https://administration-etrangers-en-france.interieur.gouv.fr' },
                { label: 'Service-Public.fr — toutes les démarches', url: 'https://www.service-public.fr' },
                { label: 'CROUS — logement étudiant en France', url: 'https://www.crous.fr' },
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
