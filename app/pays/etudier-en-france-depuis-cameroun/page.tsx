import type { Metadata } from 'next';
import Link from 'next/link';
import RelatedArticles from '@/components/blog/RelatedArticles';
import { MapPin, FileText } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Étudier en France depuis le Cameroun : guide complet 2026 | Dalili',
  description: 'Tout savoir pour venir étudier en France depuis le Cameroun : Campus France Yaoundé et Douala, visa, équivalences GCE et démarches.',
  alternates: { canonical: `${SITE_URL}/pays/etudier-en-france-depuis-cameroun` },
  openGraph: {
    title: 'Étudier en France depuis le Cameroun 2026 | Dalili',
    description: 'Guide complet Campus France Cameroun (Yaoundé + Douala), visa étudiant, équivalences GCE A-Level et délais réels.',
    url: `${SITE_URL}/pays/etudier-en-france-depuis-cameroun`,
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
    { '@type': 'ListItem', position: 3, name: 'Cameroun', item: `${SITE_URL}/pays/etudier-en-france-depuis-cameroun` },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment s\'inscrire à Campus France depuis le Cameroun ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pour s\'inscrire à Campus France depuis le Cameroun, rendez-vous sur cameroun.campusfrance.org. La procédure CEF est obligatoire avec deux bureaux : Yaoundé et Douala. Les étudiants anglophones avec un GCE A-Level doivent faire évaluer leurs équivalences dans le dossier CEF.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels documents faut-il pour le visa étudiant depuis le Cameroun ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pour le visa étudiant France depuis le Cameroun, il faut : un passeport valide, l\'attestation Campus France Cameroun favorable, le BAC camerounais ou GCE A-Level, les relevés de notes, une lettre d\'admission française, des justificatifs de ressources et les frais de visa (50 €). Les documents en anglais doivent être traduits pour les étudiants anglophones.',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps dure la procédure Campus France Cameroun ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La procédure Campus France Cameroun dure en général 6 à 12 semaines : 3 à 6 semaines pour le dossier CEF et l\'entretien à Yaoundé ou Douala, puis 3 à 6 semaines pour l\'instruction consulaire. Les étudiants anglophones doivent prévoir un délai supplémentaire pour la traduction des documents.',
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

export default function CamerounPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Pays', href: null }, { label: 'Cameroun', href: null }].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '5px 16px', border: '1px solid rgba(1,77,248,0.28)', borderRadius: 100, background: 'rgba(1,77,248,0.06)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.85)', display: 'inline-flex', alignItems: 'center', gap: 6 }}><MapPin size={11} strokeWidth={2.5} /> Depuis le Cameroun</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3rem,8vw,6.5rem)', lineHeight: 0.9, letterSpacing: '0.03em', color: '#fff', margin: '0 0 16px' }}>
              Étudier en France<br /><span style={{ color: 'rgba(255,255,255,0.65)' }}>depuis le Cameroun.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, margin: 0, maxWidth: 580 }}>
              Le Cameroun est bilingue — deux systèmes de baccalauréat, deux bureaux Campus France (Yaoundé et Douala). La procédure CEF est obligatoire pour tous.
            </p>
          </div>

          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Deux bureaux Campus France</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="Campus France Yaoundé" value="IFC, 140 avenue Ahmadou Ahidjo — campusfrance.yde@ifcameroun.com" />
                <Row label="Campus France Douala" value="IFC, 61 bis bd de la Liberté, Akwa — campusfrance.dla@ifcameroun.com" />
                <Row label="Frais dossier CEF" value="85 000 FCFA + 16 000 TLS = 101 000 FCFA (~155 €)" />
                <Row label="Site officiel Campus France Cameroun" value="cameroun.campusfrance.org" />
                <Row label="Ambassade de France à Yaoundé" value="Rue Joseph Essono Balla — cm.ambafrance.org" />
              </tbody>
            </table>
          </section>

          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Spécificité bilingue</span>
            </div>
            <div style={{ padding: 24, background: 'rgba(77,143,255,0.04)', border: '1px solid rgba(77,143,255,0.15)', borderRadius: 16, marginBottom: 16 }}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: '#4d8fff' }}>Étudiants anglophones (GCE A-Level) :</strong> le TCF-DAP est obligatoire pour accéder aux Licences 1 françaises. Prévois 4 à 6 semaines supplémentaires pour le test. Les étudiants francophones (BAC) suivent la procédure standard CEF sans test de français supplémentaire.
              </p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="BAC francophone → France" value="Procédure CEF standard — délai moyen 4 mois" />
                <Row label="GCE A-Level → France" value="CEF + TCF-DAP obligatoire — délai moyen 5 mois" />
                <Row label="Licence camerounaise → Master France" value="Dossier direct à l'université + Campus France" />
              </tbody>
            </table>
          </section>

          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Documents requis</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'BAC camerounais ou GCE A-Level (relevé de notes + attestation)',
                'Relevés de notes post-bac (toutes les années)',
                'Acte de naissance',
                'Casier judiciaire récent',
                'Passeport valide',
                'TCF-DAP si candidat anglophone en Licence 1',
                'Lettre d\'admission de l\'établissement français',
                'Justificatifs de ressources (615 €/mois minimum)',
                'Assurance santé pour les 3 premiers mois',
              ].map((doc, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#4d8fff', flexShrink: 0, fontWeight: 700 }}>→</span>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)' }}>{doc}</span>
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
                { label: 'Campus France Cameroun', url: 'https://cameroun.campusfrance.org' },
                { label: 'France-Visas — demande de visa en ligne', url: 'https://france-visas.gouv.fr' },
                { label: 'ANEF — validation VLS-TS à l\'arrivée', url: 'https://administration-etrangers-en-france.interieur.gouv.fr' },
                { label: 'Bourse Eiffel — Campus France', url: 'https://www.campusfrance.org/fr/eiffel' },
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
            { slug: 'etudier-en-france-depuis-cameroun', title: 'Étudier en France depuis le Cameroun : guide complet 2026' },
            { slug: 'bourses-etudes-etudiants-etrangers-france-2026', title: 'Bourses études étudiants étrangers France 2026' },
            { slug: 'droits-etudiant-etranger-france-guide-complet', title: 'Droits étudiant étranger en France' },
          ]} />
        </div>
      </main>
    </>
  );
}
