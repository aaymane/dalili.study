import type { Metadata } from 'next';
import Link from 'next/link';
import RelatedArticles from '@/components/blog/RelatedArticles';
import { MapPin, FileText } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Étudier en France depuis la Côte d\'Ivoire : guide complet 2026 | Dalili',
  description: 'Tout savoir pour venir étudier en France depuis la Côte d\'Ivoire : Campus France Abidjan, visa étudiant, délais, bourses et démarches.',
  alternates: { canonical: `${SITE_URL}/pays/etudier-en-france-depuis-cote-ivoire` },
  openGraph: {
    title: 'Étudier en France depuis la Côte d\'Ivoire 2026 | Dalili',
    description: 'Guide complet Campus France Abidjan, visa étudiant, délais réels et bourses pour étudiants ivoiriens.',
    url: `${SITE_URL}/pays/etudier-en-france-depuis-cote-ivoire`,
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
    { '@type': 'ListItem', position: 3, name: 'Côte d\'Ivoire', item: `${SITE_URL}/pays/etudier-en-france-depuis-cote-ivoire` },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment s\'inscrire à Campus France depuis la Côte d\'Ivoire ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pour s\'inscrire à Campus France depuis la Côte d\'Ivoire, rendez-vous sur cotedivoire.campusfrance.org. La procédure CEF est obligatoire : créez votre dossier en ligne, soumettez vos documents et passez l\'entretien au bureau de Campus France Abidjan (Cocody).',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels documents faut-il pour le visa étudiant depuis la Côte d\'Ivoire ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pour le visa étudiant France depuis la Côte d\'Ivoire, il faut : un passeport valide, l\'attestation Campus France Abidjan favorable, le baccalauréat ivoirien, les relevés de notes post-bac, une lettre d\'admission française, des justificatifs de ressources financières et les frais de visa (50 €).',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps dure la procédure Campus France Côte d\'Ivoire ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La procédure Campus France Côte d\'Ivoire dure en général 6 à 12 semaines : 3 à 6 semaines pour le dossier CEF et l\'entretien à Abidjan, puis 3 à 6 semaines pour l\'instruction consulaire au Consulat général de France à Abidjan.',
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

export default function CoteIvoirePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Pays', href: null }, { label: 'Côte d\'Ivoire', href: null }].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>{item.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '5px 16px', border: '1px solid rgba(1,77,248,0.28)', borderRadius: 100, background: 'rgba(1,77,248,0.06)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.85)', display: 'inline-flex', alignItems: 'center', gap: 6 }}><MapPin size={11} strokeWidth={2.5} /> Depuis la Côte d&apos;Ivoire</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3rem,8vw,6.5rem)', lineHeight: 0.9, letterSpacing: '0.03em', color: '#fff', margin: '0 0 16px' }}>
              Étudier en France<br /><span style={{ color: 'rgba(255,255,255,0.88)' }}>depuis la Côte d&apos;Ivoire.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '1rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, margin: 0, maxWidth: 580 }}>
              La France est la première destination internationale des étudiants ivoiriens. La procédure CEF via Campus France Abidjan est obligatoire avant le visa.
            </p>
          </div>

          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Contacts essentiels</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="Campus France Abidjan" value="7 rue des Bougainvilliers, Cocody — +225 27 22 54 87 50" />
                <Row label="Email Campus France CI" value="campusfrance@institutfrancais.ci" />
                <Row label="Frais dossier CEF" value="80 000 FCFA (non remboursables)" />
                <Row label="Site officiel Campus France CI" value="cotedivoire.campusfrance.org" />
              </tbody>
            </table>
          </section>

          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Délais réels 2025–2026</span>
            </div>
            <div style={{ padding: 24, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 16, marginBottom: 16 }}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: '#F59E0B' }}>⚠️ Attention :</strong> Le délai total de la procédure depuis Abidjan est de <strong style={{ color: '#fff' }}>8 à 18 semaines</strong> selon la période. Commence les démarches <strong style={{ color: '#fff' }}>5 à 6 mois</strong> avant ta rentrée prévue.
              </p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="Dossier + entretien Campus France Abidjan" value="4–8 semaines" />
                <Row label="Rendez-vous et traitement visa consulaire" value="4–10 semaines supplémentaires" />
                <Row label="Total Campus France + visa" value="8–18 semaines" />
                <Row label="Validation OFII à l'arrivée en France" value="Dans les 3 mois (en ligne : administration-etrangers-en-france.interieur.gouv.fr)" />
              </tbody>
            </table>
          </section>

          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Documents requis</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Baccalauréat ivoirien (relevé de notes + attestation de réussite DENA ou DEANS)',
                'Relevés de notes post-bac (toutes les années universitaires)',
                'Acte de naissance (extrait ANASUR, traduit si nécessaire)',
                'Passeport valide (au moins 18 mois de validité restante recommandés)',
                'Lettre d\'admission de l\'établissement français',
                'Justificatifs de ressources (877,50 €/mois minimum dès le 1er août 2026, 615 €/mois avant)',
                'Attestation Campus France (avis favorable)',
                'Assurance santé pour les 3 premiers mois',
                'Photos d\'identité biométriques récentes',
              ].map((doc, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#4d8fff', flexShrink: 0, fontWeight: 700 }}>→</span>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.92)' }}>{doc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Liens officiels</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Campus France Côte d\'Ivoire', url: 'https://cotedivoire.campusfrance.org' },
                { label: 'France-Visas — demande de visa en ligne', url: 'https://france-visas.gouv.fr' },
                { label: 'ANEF — validation VLS-TS à l\'arrivée', url: 'https://administration-etrangers-en-france.interieur.gouv.fr' },
                { label: 'Bourse Eiffel — Campus France', url: 'https://www.campusfrance.org/fr/eiffel' },
                { label: 'CROUS — logement étudiant', url: 'https://www.crous.fr' },
              ].map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.92)', textDecoration: 'none' }}>
                  <span>{link.label}</span>
                  <span style={{ color: '#4d8fff', flexShrink: 0 }}>↗</span>
                </a>
              ))}
            </div>
          </section>

          <div style={{ margin: '0 0 40px', padding: 24, background: 'linear-gradient(135deg, rgba(1,77,248,0.12) 0%, rgba(1,4,16,0.95) 70%)', border: '1px solid rgba(1,77,248,0.25)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)', margin: '0 0 6px' }}>Ressource gratuite</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500, fontSize: '0.95rem', color: '#fff', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 7 }}><FileText size={15} strokeWidth={2} color="#4d8fff" /> Checklist Complète Arrivée en France 2026</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.92)', margin: 0 }}>28 points essentiels avant et après ton arrivée — PDF gratuit</p>
            </div>
            <Link href="/checklist" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#014DF8', borderRadius: 8, textDecoration: 'none', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Télécharger PDF →
            </Link>
          </div>

          <RelatedArticles articles={[
            { slug: 'etudier-en-france-depuis-cote-ivoire', title: 'Étudier en France depuis la Côte d\'Ivoire : guide complet 2026' },
            { slug: 'bourses-etudes-etudiants-etrangers-france-2026', title: 'Bourses études étudiants étrangers France 2026' },
            { slug: 'reforme-apl-etudiant-etranger-2026', title: 'Réforme APL 2026 : qui est concerné et comment vérifier ta situation' },
          ]} />
        </div>
      </main>
    </>
  );
}
