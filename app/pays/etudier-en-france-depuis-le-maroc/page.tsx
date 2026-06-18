import type { Metadata } from 'next';
import Link from 'next/link';
import RelatedArticles from '@/components/blog/RelatedArticles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Étudier en France depuis le Maroc : guide complet 2026 | Dalili',
  description: 'Tout savoir pour venir étudier en France depuis le Maroc : Campus France Maroc, visa étudiant, délais réels, consulats, documents et démarches à l\'arrivée.',
  alternates: { canonical: `${SITE_URL}/pays/etudier-en-france-depuis-le-maroc` },
  openGraph: {
    title: 'Étudier en France depuis le Maroc 2026 | Dalili',
    description: 'Guide complet Campus France Maroc, visa étudiant français, délais réels et démarches pour étudiants marocains.',
    url: `${SITE_URL}/pays/etudier-en-france-depuis-le-maroc`,
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
    { '@type': 'ListItem', position: 3, name: 'Maroc', item: `${SITE_URL}/pays/etudier-en-france-depuis-le-maroc` },
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

export default function MarocPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Pays', href: null }, { label: 'Maroc', href: null }].map((item, i, arr) => (
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
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.85)' }}>🇲🇦 Depuis le Maroc</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3rem,8vw,6.5rem)', lineHeight: 0.9, letterSpacing: '0.03em', color: '#fff', margin: '0 0 16px' }}>
              Étudier en France<br /><span style={{ color: 'rgba(255,255,255,0.35)' }}>depuis le Maroc.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: 0, maxWidth: 580 }}>
              La France est la première destination des étudiants marocains à l&apos;international. Voici la procédure réelle — pas la version officielle, celle que vivent les étudiants.
            </p>
          </div>

          {/* Contacts essentiels */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Contacts essentiels</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="Campus France Maroc (Rabat)" value="3 bis, rue Larbi Ben Abdellah, Rabat — 05 37 73 93 73" />
                <Row label="Campus France Maroc (Casablanca)" value="Résidence Zénith 1, Bd Zerktouni, Casablanca — 05 22 47 00 35" />
                <Row label="Consulat général de France à Casablanca" value="1, Place de France, Casablanca — +212 5 22 48 92 00" />
                <Row label="Ambassade de France à Rabat" value="3, rue Sahnoun, Rabat — +212 5 37 68 97 00" />
                <Row label="Site officiel Campus France Maroc" value="maroc.campusfrance.org" />
              </tbody>
            </table>
          </section>

          {/* Délais visa réels */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Délais réels 2025–2026</span>
            </div>
            <div style={{ padding: 24, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 16, marginBottom: 16 }}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: '#F59E0B' }}>⚠️ Attention :</strong> Les délais officiels de Campus France indiquent &quot;3 à 4 semaines&quot; pour l&apos;instruction. En pratique, les étudiants Dalili rapportent des délais de <strong style={{ color: '#fff' }}>5 à 7 semaines hors période estivale, et jusqu&apos;à 10–12 semaines entre juin et août</strong>. Ne faites pas de réservations non-remboursables avant d&apos;avoir le visa en main.
              </p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="Campus France Maroc → dossier complet" value="3–6 semaines (pic: juin–août)" />
                <Row label="Instruction consulaire (Casablanca)" value="2–4 semaines supplémentaires" />
                <Row label="Total Campus France + visa" value="5–10 semaines en période normale, 10–14 semaines en été" />
                <Row label="Validation OFII à l'arrivée en France" value="Dans les 3 mois suivant l'entrée (en ligne : administration-etrangers-en-france.interieur.gouv.fr)" />
              </tbody>
            </table>
          </section>

          {/* Documents spécifiques au Maroc */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Documents requis</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Passeport valide (au moins 18 mois de validité restante recommandés)',
                'Baccalauréat marocain (relevé de notes + attestation de réussite)',
                'Relevés de notes de toutes les années post-bac (traduits en français si nécessaire)',
                'Attestation d\'inscription ou lettre d\'admission de l\'établissement français',
                'Justificatif de ressources : relevés bancaires 3 mois + attestation de prise en charge parentale',
                'Attestation de logement en France (si disponible)',
                'Assurance voyage couvrant la durée du visa (minimum 30 000 €)',
                'Photos d\'identité biométriques récentes',
                'Formulaire de demande de visa France-Visas (rempli en ligne)',
                'Reçu de paiement des frais de visa (50 €)',
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
                { mois: 'Octobre–Novembre', action: 'Candidater aux masters et grandes écoles (délais souvent en octobre-novembre)' },
                { mois: 'Décembre–Janvier', action: 'Créer compte Campus France Maroc, compléter le dossier en ligne' },
                { mois: 'Janvier–Février', action: 'Parcoursup pour Licence 1, confirmations d\'admission pour Master' },
                { mois: 'Mars–Avril', action: 'Entretien Campus France (si requis), obtention admission définitive' },
                { mois: 'Avril–Mai', action: 'Déposer le dossier visa au consulat de Casablanca' },
                { mois: 'Juin', action: 'Obtention du visa (prévoir délai majoré en été)' },
                { mois: 'Juillet–Août', action: 'Recherche de logement, ouverture de compte bancaire en ligne' },
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
                { label: 'Campus France Maroc', url: 'https://maroc.campusfrance.org' },
                { label: 'France-Visas — demande de visa en ligne', url: 'https://france-visas.gouv.fr' },
                { label: 'ANEF — validation VLS-TS et renouvellement titre de séjour', url: 'https://administration-etrangers-en-france.interieur.gouv.fr' },
                { label: 'Service-Public.fr — toutes les démarches administratives', url: 'https://www.service-public.fr' },
                { label: 'CROUS — logement étudiant en France', url: 'https://www.crous.fr' },
                { label: 'Ameli.fr — Assurance Maladie étudiante', url: 'https://www.ameli.fr' },
              ].map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="sc-link-blue"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}
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
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500, fontSize: '0.95rem', color: '#fff', margin: '0 0 4px' }}>📋 Checklist Complète Arrivée en France 2026</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>28 points essentiels avant et après ton arrivée — PDF gratuit</p>
            </div>
            <Link href="/checklist" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#014DF8', borderRadius: 8, textDecoration: 'none', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Télécharger PDF →
            </Link>
          </div>

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
