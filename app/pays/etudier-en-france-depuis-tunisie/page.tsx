import type { Metadata } from 'next';
import Link from 'next/link';
import RelatedArticles from '@/components/blog/RelatedArticles';
import { MapPin, FileText } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Étudier en France depuis la Tunisie : guide complet 2026 | Dalili',
  description: 'Tout savoir pour venir étudier en France depuis la Tunisie : Campus France Tunis, visa étudiant, délais réels, consulat et démarches à l\'arrivée.',
  alternates: { canonical: `${SITE_URL}/pays/etudier-en-france-depuis-tunisie` },
  openGraph: {
    title: 'Étudier en France depuis la Tunisie 2026 | Dalili',
    description: 'Guide complet Campus France Tunis, visa étudiant français, délais réels et démarches pour étudiants tunisiens.',
    url: `${SITE_URL}/pays/etudier-en-france-depuis-tunisie`,
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
    { '@type': 'ListItem', position: 3, name: 'Tunisie', item: `${SITE_URL}/pays/etudier-en-france-depuis-tunisie` },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment s\'inscrire à Campus France depuis la Tunisie ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pour s\'inscrire à Campus France depuis la Tunisie, rendez-vous sur tn.campusfrance.org. La Tunisie est soumise à la procédure CEF obligatoire. L\'entretien se déroule à Tunis ou à Sfax. Les frais de dossier CEF sont d\'environ 70 TND.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels documents faut-il pour le visa étudiant depuis la Tunisie ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pour le visa étudiant France depuis la Tunisie, il faut : un passeport valide, l\'attestation Campus France Tunis favorable, le baccalauréat tunisien, les relevés de notes, une lettre d\'admission d\'un établissement français, des justificatifs de ressources, une assurance voyage et les frais de visa (50 €).',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps dure la procédure Campus France Tunisie ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La procédure Campus France Tunisie dure en général 6 à 10 semaines : 3 à 5 semaines pour le traitement du dossier et l\'entretien CEF, puis 3 à 5 semaines pour l\'instruction consulaire à Tunis. Les délais sont plus longs de juin à septembre.',
      },
    },
  ],
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <td style={{ padding: '13px 0', fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', paddingRight: 20, width: '45%' }}>{label}</td>
      <td style={{ padding: '13px 0', fontFamily: 'var(--font-dm-sans)', fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>{value}</td>
    </tr>
  );
}

export default function TunisiePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Pays', href: null }, { label: 'Tunisie', href: null }].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '5px 16px', border: '1px solid rgba(1,77,248,0.28)', borderRadius: 100, background: 'rgba(1,77,248,0.06)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.85)', display: 'inline-flex', alignItems: 'center', gap: 6 }}><MapPin size={11} strokeWidth={2.5} /> Depuis la Tunisie</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3rem,8vw,6.5rem)', lineHeight: 0.9, letterSpacing: '0.03em', color: '#fff', margin: '0 0 16px' }}>
              Étudier en France<br /><span style={{ color: 'rgba(255,255,255,0.65)' }}>depuis la Tunisie.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, margin: 0, maxWidth: 580 }}>
              Plus de 25 000 étudiants tunisiens sont inscrits dans des universités françaises. La Tunisie est en procédure CEF — Campus France Tunis est obligatoire avant le visa.
            </p>
          </div>

          {/* Contacts essentiels */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Contacts essentiels</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="Campus France Tunis" value="20-22 avenue de Paris, 1000 Tunis — campusfrance.tunisie@institutfrancais-tunisie.com" />
                <Row label="Campus France Sfax" value="9 avenue Habib Bourguiba, 3000 Sfax — (+216) 74 224 745" />
                <Row label="Frais dossier CEF" value="400 DT (paiement en ligne uniquement depuis janv. 2025)" />
                <Row label="Site officiel Campus France Tunisie" value="tn.campusfrance.org" />
                <Row label="Visa France (TLScontact)" value="fr.tlscontact.com/tn/tun/" />
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
                <strong style={{ color: '#F59E0B' }}>⚠️ Attention :</strong> Le délai de traitement du visa étudiant depuis la Tunisie est de <strong style={{ color: '#fff' }}>15 à 45 jours via TLScontact</strong>. En période de pointe (juin–août), prévois jusqu&apos;à <strong style={{ color: '#fff' }}>9 à 19 semaines au total</strong> (CEF + visa). Commence les démarches 6 mois à l&apos;avance.
              </p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="Dossier Campus France Tunis" value="2–5 semaines (délai convocation entretien inclus)" />
                <Row label="Traitement visa TLScontact" value="15 à 45 jours" />
                <Row label="Total moyen" value="9–19 semaines (2 à 5 mois)" />
                <Row label="Validation OFII à l'arrivée" value="Dans les 3 mois (en ligne : administration-etrangers-en-france.interieur.gouv.fr)" />
              </tbody>
            </table>
          </section>

          {/* Documents requis */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Documents requis</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Baccalauréat tunisien (relevé de notes sessions 1 et 2 + attestation de réussite)',
                'Relevés de notes post-bac (toutes les années)',
                'Acte de naissance — traduit en français par traducteur assermenté',
                'Passeport valide (au moins 18 mois de validité restante)',
                'Lettre d\'admission de l\'établissement français',
                'Justificatifs de ressources (relevés bancaires 3 mois — 615 €/mois minimum)',
                'Attestation Campus France (avis favorable)',
                'Assurance voyage couvrant les 3 premiers mois',
                'Photos d\'identité biométriques récentes',
                'Formulaire de demande de visa France-Visas (en ligne)',
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
                { mois: 'Octobre–Nov.', action: 'Candidater aux masters et grandes écoles' },
                { mois: 'Déc.–Janvier', action: 'Ouvrir dossier Campus France Tunis, rassembler les documents' },
                { mois: 'Janvier', action: 'Parcoursup DAP pour Licence 1 (date limite début janvier)' },
                { mois: 'Fév.–Mars', action: 'Entretien Campus France, attendre avis' },
                { mois: 'Avril–Mai', action: 'Dépôt dossier visa TLScontact' },
                { mois: 'Juin', action: 'Obtention visa (prévoir délais majorés en été)' },
                { mois: 'Juillet–Août', action: 'Logement, compte bancaire en ligne' },
                { mois: 'Septembre', action: 'Arrivée en France, valider OFII dans les 3 mois' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.7rem', color: '#4d8fff', flexShrink: 0, width: 100 }}>{step.mois}</span>
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
                { label: 'Campus France Tunisie', url: 'https://tn.campusfrance.org' },
                { label: 'France-Visas — demande de visa en ligne', url: 'https://france-visas.gouv.fr' },
                { label: 'TLScontact Tunis — rendez-vous visa', url: 'https://fr.tlscontact.com/tn/tun/' },
                { label: 'ANEF — validation VLS-TS à l\'arrivée', url: 'https://administration-etrangers-en-france.interieur.gouv.fr' },
                { label: 'Service-Public.fr — toutes les démarches', url: 'https://www.service-public.fr' },
                { label: 'CROUS — logement étudiant', url: 'https://www.crous.fr' },
              ].map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>
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
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>28 points essentiels avant et après ton arrivée — PDF gratuit</p>
            </div>
            <Link href="/checklist" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#014DF8', borderRadius: 8, textDecoration: 'none', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Télécharger PDF →
            </Link>
          </div>

          <RelatedArticles articles={[
            { slug: 'etudier-en-france-depuis-tunisie', title: 'Étudier en France depuis la Tunisie : guide complet 2026' },
            { slug: 'visa-etudiant-france-tout-savoir-avant-partir', title: 'Visa étudiant France : tout ce qu\'il faut savoir' },
            { slug: 'ofii-validation-visa-etudiant-france-guide', title: 'OFII : validation du visa étudiant à l\'arrivée' },
          ]} />
        </div>
      </main>
    </>
  );
}
