import type { Metadata } from 'next';
import Link from 'next/link';
import RelatedArticles from '@/components/blog/RelatedArticles';
import { MapPin, FileText } from 'lucide-react';

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

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment s\'inscrire à Campus France depuis l\'Algérie ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pour s\'inscrire à Campus France depuis l\'Algérie, rendez-vous sur algerie.campusfrance.org et créez votre dossier CEF en ligne. L\'entretien se déroule à Alger (25 chemin Sfindja) ou à Oran. Les frais de dossier sont d\'environ 85 €.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels documents faut-il pour le visa étudiant depuis l\'Algérie ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pour le visa étudiant France depuis l\'Algérie, il faut : un passeport valide, l\'attestation Campus France CEF favorable, le baccalauréat algérien traduit en français, les relevés de notes, une lettre d\'admission, des justificatifs de ressources et les frais de visa (50 €). Les documents en arabe doivent être traduits par un traducteur assermenté.',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps dure la procédure visa étudiant depuis l\'Algérie ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La procédure depuis l\'Algérie dure en général 8 à 14 semaines : 4 à 6 semaines pour Campus France CEF, puis 4 à 8 semaines de délai VFS Global pour le visa consulaire. En été, les délais peuvent atteindre 16 semaines. Il est recommandé de commencer en novembre pour une rentrée en septembre.',
      },
    },
  ],
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <td style={{ padding: '13px 0', fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.92)', paddingRight: 20, width: '45%' }}>{label}</td>
      <td style={{ padding: '13px 0', fontFamily: 'var(--font-dm-sans)', fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>{value}</td>
    </tr>
  );
}

export default function AlgeriePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Pays', href: null }, { label: 'Algérie', href: null }].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>{item.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '5px 16px', border: '1px solid rgba(1,77,248,0.28)', borderRadius: 100, background: 'rgba(1,77,248,0.06)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.85)', display: 'inline-flex', alignItems: 'center', gap: 6 }}><MapPin size={11} strokeWidth={2.5} /> Depuis l&apos;Algérie</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3rem,8vw,6.5rem)', lineHeight: 0.9, letterSpacing: '0.03em', color: '#fff', margin: '0 0 16px' }}>
              Étudier en France<br /><span style={{ color: 'rgba(255,255,255,0.88)' }}>depuis l&apos;Algérie.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '1rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, margin: 0, maxWidth: 580 }}>
              L&apos;Algérie envoie chaque année des dizaines de milliers d&apos;étudiants en France. La procédure est spécifique aux ressortissants algériens — les Accords de 1968 changent plusieurs règles. Voici ce que vous devez vraiment savoir.
            </p>
          </div>

          {/* Accords 1968 — bloc spécifique */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ padding: 24, background: 'rgba(77,143,255,0.06)', border: '1px solid rgba(77,143,255,0.2)', borderRadius: 16 }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4d8fff', marginBottom: 8 }}>Accords franco-algériens de 1968</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, margin: 0 }}>
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
                <Row label="Campus France Algérie (Alger)" value="25 chemin Sfindja, Alger — +213 21 92 19 07" />
                <Row label="Campus France Oran" value="Villa Saïd, Bd Colonel Lotfi, Oran" />
                <Row label="Ambassade de France à Alger" value="25 chemin Abdelkader Gadouche, Hydra, Alger" />
                <Row label="Consulat de France à Oran" value="8 rue Lotfi, Oran" />
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
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, margin: 0 }}>
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
                'Justificatif de ressources : 877,50 €/mois minimum dès le 1er août 2026, 615 €/mois avant (relevés bancaires ou attestation de prise en charge)',
                'Justificatif de logement (CROUS, bail, attestation d\'hébergement)',
                'Assurance voyage (minimum 30 000 €, durée du séjour)',
                'Formulaire France-Visas (rempli en ligne avant le RDV VFS)',
                'Reçu de paiement des frais de visa (50 €) + frais VFS (~30 €)',
                'Photos d\'identité biométriques (normes françaises)',
              ].map((doc, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#4d8fff', flexShrink: 0, fontWeight: 700 }}>→</span>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.92)' }}>{doc}</span>
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
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.6 }}>{step.action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Restriction de travail — spécifique Algérie */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 100, background: 'rgba(239,68,68,0.06)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.85)' }}>⚠️ Point important — Droit au travail</span>
            </div>
            <div style={{ padding: 24, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 16 }}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, margin: '0 0 12px' }}>
                <strong style={{ color: '#fff' }}>Les étudiants algériens ont un droit au travail limité à 50% du temps légal</strong>, contre 60% pour la plupart des autres nationalités (soit environ 774 heures par an au lieu de 964 heures).
              </p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, margin: '0 0 12px' }}>
                Cette restriction découle de la <strong style={{ color: '#4d8fff' }}>Convention bilatérale franco-algérienne de 1968</strong>, qui régit le droit au séjour et au travail des ressortissants algériens en France. Cette convention prime sur le droit commun des étrangers.
              </p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Impact budgétaire concret :</strong> si un étudiant de nationalité marocaine peut travailler jusqu&apos;à ~18h/semaine, un étudiant algérien est limité à ~15h/semaine. Prévoyez cette différence dans votre budget prévisionnel.
              </p>
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
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.92)', textDecoration: 'none' }}
                                                >
                  <span>{link.label}</span>
                  <span style={{ color: '#4d8fff', flexShrink: 0 }}>↗</span>
                </a>
              ))}
            </div>
          </section>

          {/* Checklist CTA */}
          <div style={{ margin: '0 0 40px', padding: 24, background: 'linear-gradient(135deg, rgba(1,77,248,0.12) 0%, rgba(1,4,16,0.95) 70%)', border: '1px solid rgba(1,77,248,0.25)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)', margin: '0 0 6px' }}>Ressource gratuite</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500, fontSize: '0.95rem', color: '#fff', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 7 }}><FileText size={15} strokeWidth={2} color="#4d8fff" /> Checklist Complète Arrivée en France 2026</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.92)', margin: 0 }}>32 points essentiels avant et après ton arrivée — PDF gratuit</p>
            </div>
            <Link href="/checklist" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#014DF8', borderRadius: 8, textDecoration: 'none', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Télécharger PDF →
            </Link>
          </div>

          <RelatedArticles articles={[
            { slug: 'visa-etudiant-france-algerie-2026', title: 'Visa étudiant France depuis l\'Algérie : guide complet 2026' },
            { slug: 'visa-etudiant-france-tout-savoir-avant-partir', title: 'Visa étudiant France : tout ce qu\'il faut savoir avant de partir' },
            { slug: 'trouver-logement-france-depuis-etranger', title: 'Trouver un logement en France depuis l\'étranger' },
          ]} />
        </div>
      </main>
    </>
  );
}
