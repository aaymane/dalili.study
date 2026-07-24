import type { Metadata } from 'next';
import { REGULATORY_FIGURES, getTierAt, formatTierValue, describeAdjacentTier } from '@/lib/data/regulatory-figures';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

const compteBloqueNow      = getTierAt(REGULATORY_FIGURES.compteBloqueMensuel);
const compteBloqueAdjacent = describeAdjacentTier(REGULATORY_FIGURES.compteBloqueMensuel);
const cvecNow      = getTierAt(REGULATORY_FIGURES.cvec);
const licenceNow   = getTierAt(REGULATORY_FIGURES.fraisScolariteLicence);
const masterNow    = getTierAt(REGULATORY_FIGURES.fraisScolariteMaster);
const doctoratNow  = getTierAt(REGULATORY_FIGURES.fraisScolariteDoctorat);

export const metadata: Metadata = {
  title: 'Statistiques — Études en France pour étudiants étrangers 2026 | Dalili',
  description: 'Chiffres vérifiés et sourcés : visa étudiant France délais, budget 877,50€/mois dès août 2026, frais de scolarité, logement CROUS, CAF — données officielles 2025-2026.',
  alternates: { canonical: `${SITE_URL}/stats` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Statistiques études en France — étudiants étrangers 2026',
    description: 'Toutes les données officielles : 358 000 étudiants étrangers, 877,50 €/mois exigés dès août 2026 (615 € avant), frais de scolarité, loyers par ville.',
    url: `${SITE_URL}/stats`,
    siteName: 'Dalili',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Statistiques études en France pour étudiants étrangers 2026',
  description: 'Données vérifiées sur le visa étudiant, le budget, le logement et les frais de scolarité pour les étudiants étrangers en France',
  url: `${SITE_URL}/stats`,
  creator: { '@type': 'Organization', name: 'Dalili', url: SITE_URL },
  dateModified: '2026-06-24',
  keywords: [
    'visa étudiant France statistiques',
    'budget étudiant étranger France',
    'frais scolarité université France',
    'logement étudiant France prix',
  ],
};

// Budget BRUT = loyer CROUS + nourriture + transport + téléphone + santé (sans aides) + divers
// Budget NET  = BRUT - CAF/APL - économie RU (repas 1€) - économie transport étudiant - CSS (santé = 0€)
const CITY_BUDGET = [
  { city: 'Paris',       brut: 950,  net: 650,  caf: 200, students: '700 000', unis: 17 },
  { city: 'Lyon',        brut: 730,  net: 470,  caf: 160, students: '180 000', unis: 4  },
  { city: 'Bordeaux',    brut: 680,  net: 420,  caf: 130, students: '100 000', unis: 3  },
  { city: 'Toulouse',    brut: 670,  net: 410,  caf: 130, students: '130 000', unis: 3  },
  { city: 'Marseille',   brut: 670,  net: 420,  caf: 120, students: '80 000',  unis: 1  },
  { city: 'Montpellier', brut: 680,  net: 420,  caf: 130, students: '75 000',  unis: 2  },
  { city: 'Strasbourg',  brut: 670,  net: 420,  caf: 120, students: '55 000',  unis: 1  },
  { city: 'Lille',       brut: 650,  net: 400,  caf: 120, students: '120 000', unis: 3  },
  { city: 'Nantes',      brut: 660,  net: 410,  caf: 120, students: '65 000',  unis: 1  },
  { city: 'Nice',        brut: 780,  net: 510,  caf: 150, students: '30 000',  unis: 1  },
  { city: 'Rennes',      brut: 640,  net: 400,  caf: 110, students: '70 000',  unis: 2  },
  { city: 'Grenoble',    brut: 650,  net: 410,  caf: 110, students: '60 000',  unis: 2  },
  { city: 'Clermont-Fd', brut: 580,  net: 370,  caf: 100, students: '40 000',  unis: 1  },
  { city: 'Dijon',       brut: 600,  net: 380,  caf: 100, students: '35 000',  unis: 1  },
];

const BORDEAUX_BREAKDOWN = [
  { poste: 'Loyer CROUS',         brut: '280 €',  net: '280 €'   },
  { poste: 'CAF / APL',           brut: '—',       net: '−130 €', netColor: '#22c55e' },
  { poste: 'Nourriture (RU + courses)', brut: '200 €', net: '120 €' },
  { poste: 'Transport',           brut: '50 €',   net: '25 €'    },
  { poste: 'Téléphone',           brut: '15 €',   net: '15 €'    },
  { poste: 'Santé',               brut: '40 €',   net: '0 € (CSS)' },
  { poste: 'Divers',              brut: '60 €',   net: '60 €'    },
];

const s = {
  page:        { background: '#010510', minHeight: '100vh', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,64px)' } as React.CSSProperties,
  inner:       { maxWidth: 900, margin: '0 auto' } as React.CSSProperties,
  eyebrow:     { fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(77,143,255,0.75)', marginBottom: 14 } as React.CSSProperties,
  h1:          { fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(24px,4vw,44px)', color: '#ffffff', margin: '0 0 14px', lineHeight: 1.1, letterSpacing: '-0.01em' } as React.CSSProperties,
  lead:        { fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, margin: '0 0 64px', maxWidth: 600 } as React.CSSProperties,
  sectionTitle:{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#4d8fff', margin: '56px 0 20px' } as React.CSSProperties,
  statGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px,100%),1fr))', gap: 14, marginBottom: 8 } as React.CSSProperties,
  statCard:    { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 22px' } as React.CSSProperties,
  statVal:     { fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#ffffff', lineHeight: 1, marginBottom: 6 } as React.CSSProperties,
  statLabel:   { fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, margin: 0 } as React.CSSProperties,
  statSource:  { fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 8 } as React.CSSProperties,
  table:       { width: '100%', borderCollapse: 'collapse' as const, marginTop: 4 } as React.CSSProperties,
  th:          { fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', padding: '10px 14px', textAlign: 'left' as const, borderBottom: '1px solid rgba(255,255,255,0.07)' } as React.CSSProperties,
  thNet:       { fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(34,197,94,0.7)', padding: '10px 14px', textAlign: 'left' as const, borderBottom: '1px solid rgba(255,255,255,0.07)' } as React.CSSProperties,
  td:          { fontFamily: 'var(--font-dm-sans)', fontSize: 14, color: 'rgba(255,255,255,0.75)', padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' } as React.CSSProperties,
  tdNet:       { fontFamily: 'var(--font-dm-sans)', fontSize: 14, fontWeight: 700, color: '#22c55e', padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' } as React.CSSProperties,
  note:        { fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12 } as React.CSSProperties,
};

export default function StatsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <div style={s.page}>
        <div style={s.inner}>
          <p style={s.eyebrow}>Données officielles · Mise à jour juin 2026</p>
          <h1 style={s.h1}>Statistiques — Études en France pour étudiants étrangers 2026</h1>
          <p style={s.lead}>
            Tous les chiffres vérifiés sur le visa, le budget, le logement et les frais de scolarité pour les étudiants internationaux en France. Sources officielles uniquement.
          </p>

          {/* ── Campus France & Visa */}
          <p style={s.sectionTitle}>Campus France & Visa</p>
          <div style={s.statGrid}>
            {[
              { val: '358 000', label: "Étudiants étrangers en France (2023-2024)", source: 'MESR' },
              { val: '1er', label: "Pays d'accueil francophone mondial", source: 'Campus France' },
              { val: 'Top 5', label: "Mondial pour l'accueil d'étudiants étrangers", source: 'UNESCO' },
              { val: '30', label: "Pays soumis à la procédure CEF obligatoire", source: 'campusfrance.org' },
              { val: '8-14 sem.', label: "Délai visa depuis le Maroc (été)", source: 'Consulat France Maroc 2025-2026' },
              { val: '6-10 sem.', label: "Délai visa depuis l'Algérie", source: 'Consulat France Algérie 2025-2026' },
              { val: '3-6 sem.', label: "Délai visa depuis le Sénégal", source: 'Consulat France Dakar 2025-2026' },
              { val: '~85 %', label: "Taux d'avis favorable Campus France Maroc", source: 'Estimation Dalili 2025' },
            ].map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={s.statVal}>{stat.val}</div>
                <p style={s.statLabel}>{stat.label}</p>
                <p style={s.statSource}>{stat.source}</p>
              </div>
            ))}
          </div>

          {/* ── Budget & Logement */}
          <p style={s.sectionTitle}>Budget & Logement</p>
          <div style={s.statGrid}>
            {[
              { val: formatTierValue(compteBloqueNow), label: `Ressources minimales exigées par le consulat${compteBloqueAdjacent ? ` (${compteBloqueAdjacent})` : ''}`, source: compteBloqueNow.sourceLabel },
              { val: `≈ ${Math.round(compteBloqueNow.value * 12).toLocaleString('fr-FR')} €`, label: 'Minimum pour 12 mois de séjour', source: 'Service-public.fr' },
              { val: '120-450 €', label: 'Prix CROUS mensuel selon ville et type', source: 'CROUS 2025-2026' },
              { val: '80-220 €', label: 'CAF/APL mensuelle si éligible (hors UE : boursier crit. sociaux, apprenti, pro. ou salarié depuis juillet 2026)', source: 'CAF.fr, Légifrance' },
              { val: '< 9 720 €/an', label: 'Plafond de revenus pour CSS gratuite', source: 'Ameli.fr 2025' },
              { val: formatTierValue(cvecNow), label: 'CVEC 2025-2026 (paiement unique annuel)', source: cvecNow.sourceLabel },
            ].map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={s.statVal}>{stat.val}</div>
                <p style={s.statLabel}>{stat.label}</p>
                <p style={s.statSource}>{stat.source}</p>
              </div>
            ))}
          </div>

          {/* ── Frais de scolarité */}
          <p style={s.sectionTitle}>Frais de scolarité (hors UE)</p>
          <div style={s.statGrid}>
            {[
              { val: formatTierValue(licenceNow), label: 'Licence (droits différenciés hors UE)', source: licenceNow.sourceLabel },
              { val: formatTierValue(masterNow), label: 'Master (droits différenciés hors UE)', source: masterNow.sourceLabel },
              { val: formatTierValue(doctoratNow), label: 'Doctorat (tarif unique)', source: doctoratNow.sourceLabel },
              { val: '> 50 %', label: "Universités accordant des exonérations hors UE", source: 'Campus France 2025' },
            ].map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={s.statVal}>{stat.val}</div>
                <p style={s.statLabel}>{stat.label}</p>
                <p style={s.statSource}>{stat.source}</p>
              </div>
            ))}
          </div>

          {/* ── Travail étudiant */}
          <p style={s.sectionTitle}>Travail étudiant</p>
          <div style={s.statGrid}>
            {[
              { val: '964 h/an', label: 'Maximum travail autorisé (hors UE)', source: 'Service-public.fr' },
              { val: '803 h/an', label: "Maximum Algérie (accord franco-algérien 1968)", source: 'Accord 1968' },
              { val: '11,88 €/h', label: 'SMIC horaire brut 2026', source: 'Service-public.fr 2026' },
              { val: '~4,35 €/h', label: 'Gratification stage obligatoire (> 2 mois)', source: 'Service-public.fr 2026' },
            ].map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={s.statVal}>{stat.val}</div>
                <p style={s.statLabel}>{stat.label}</p>
                <p style={s.statSource}>{stat.source}</p>
              </div>
            ))}
          </div>

          {/* ── Exemple Bordeaux détaillé */}
          <p style={s.sectionTitle}>Exemple — Bordeaux en résidence CROUS</p>
          <p style={{ ...s.note, marginTop: 0, marginBottom: 16, fontSize: 13, color: 'rgba(255,255,255,0.82)' }}>
            Décomposition poste par poste pour un étudiant en CROUS avec les aides étudiantes, en supposant l&apos;éligibilité à la CAF (boursier sur critères sociaux, apprenti, en professionnalisation ou salarié depuis le 1er juillet 2026 — <a href="/blog/reforme-apl-etudiant-etranger-2026" style={{ color: 'inherit', textDecoration: 'underline' }}>détail</a>).
          </p>
          <div style={{ overflowX: 'auto', marginBottom: 8 }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Poste</th>
                  <th style={s.th}>Budget BRUT</th>
                  <th style={s.thNet}>Budget NET ✓</th>
                </tr>
              </thead>
              <tbody>
                {BORDEAUX_BREAKDOWN.map((row, i) => (
                  <tr key={i}>
                    <td style={{ ...s.td, color: 'rgba(255,255,255,0.6)' }}>{row.poste}</td>
                    <td style={s.td}>{row.brut}</td>
                    <td style={{ ...s.td, color: row.netColor ?? 'rgba(255,255,255,0.75)' }}>{row.net}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ ...s.td, fontWeight: 700, color: '#fff', borderTop: '2px solid rgba(255,255,255,0.12)', borderBottom: 'none' }}>TOTAL</td>
                  <td style={{ ...s.td, fontFamily: 'var(--font-montserrat)', fontWeight: 800, color: '#fff', borderTop: '2px solid rgba(255,255,255,0.12)', borderBottom: 'none' }}>645 €</td>
                  <td style={{ ...s.tdNet, fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 16, borderTop: '2px solid rgba(34,197,94,0.3)', borderBottom: 'none' }}>370 €</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '14px 18px', marginTop: 16 }}>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'rgba(255,255,255,0.72)', margin: 0, lineHeight: 1.7 }}>
              <strong style={{ color: '#f59e0b' }}>⚠️ Important :</strong> Le consulat exige <strong style={{ color: '#fff' }}>{formatTierValue(compteBloqueNow)} de ressources prouvables</strong>{compteBloqueAdjacent ? ` (${compteBloqueAdjacent})` : ''} — pas ce montant de dépenses.
              Avec les aides, tu peux vivre avec 370–450 €/mois réellement, <strong>mais tu dois justifier le montant légal disponible sur ton compte</strong> pour obtenir le visa.
            </p>
          </div>

          {/* ── Tableau villes BRUT / NET */}
          <p style={s.sectionTitle}>Budget mensuel CROUS — {CITY_BUDGET.length} villes (brut et net)</p>
          <p style={{ ...s.note, marginTop: 0, marginBottom: 16, fontSize: 13, color: 'rgba(255,255,255,0.82)' }}>
            Budget BRUT = avant aides. Budget NET = après CAF (si éligible — voir condition ci-dessous), repas RU à 3,30 €, transport étudiant réduit, CSS (santé gratuite).
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Ville</th>
                  <th style={s.th}>Budget BRUT</th>
                  <th style={s.thNet}>Budget NET si éligible CAF ✓</th>
                  <th style={{ ...s.th, color: 'rgba(34,197,94,0.5)' }}>CAF estimée</th>
                  <th style={s.th}>Étudiants</th>
                </tr>
              </thead>
              <tbody>
                {CITY_BUDGET.map((row, i) => (
                  <tr key={i}>
                    <td style={{ ...s.td, color: '#ffffff', fontWeight: 600 }}>{row.city}</td>
                    <td style={s.td}>{row.brut} €</td>
                    <td style={s.tdNet}>{row.net} €</td>
                    <td style={{ ...s.td, color: '#22c55e' }}>−{row.caf} €</td>
                    <td style={s.td}>{row.students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={s.note}>
            * Budget NET calculé en CROUS avec CAF, repas RU étudiant (3,30 €) et abonnement transport réduit.
            Depuis le 1er juillet 2026, la CAF/APL n&apos;est plus accessible de droit commun aux étudiants hors UE/EEE/Suisse : elle est réservée aux boursiers sur critères sociaux, apprentis, en professionnalisation ou salariés (<a href="/blog/reforme-apl-etudiant-etranger-2026" style={{ color: 'inherit', textDecoration: 'underline' }}>détail</a>). Si non éligible, le budget réel est le montant BRUT. Montant réel calculé sur caf.fr.
            <br />
            ** Ces montants sont des estimations. Le consulat exige {formatTierValue(compteBloqueNow)} prouvables{compteBloqueAdjacent ? ` (${compteBloqueAdjacent})` : ''}, indépendamment de vos aides.
            <br />
            Sources : CROUS, CAF.fr, Légifrance, observatoires des loyers, OVE 2025-2026.
          </p>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '64px 0 0' }} />
        </div>
      </div>
    </>
  );
}
