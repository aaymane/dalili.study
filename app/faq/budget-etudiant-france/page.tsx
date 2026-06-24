import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Budget étudiant étranger en France : chiffres réels 2026 | Dalili',
  description: "Combien coûte réellement la vie étudiante en France en 2026 ? 615 €/mois, CAF, CSS, droits d'inscription, CVEC, bourses — 20 questions avec chiffres vérifiés.",
  alternates: { canonical: `${SITE_URL}/faq/budget-etudiant-france` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Budget étudiant étranger en France : chiffres réels 2026',
    description: "Visa 615 €/mois, CAF, CSS gratuite, droits d'inscription, CVEC 105 €, bourses — tout ce que coûte réellement la vie étudiante en France.",
    url: `${SITE_URL}/faq/budget-etudiant-france`,
    siteName: 'Dalili',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    q: "Quel est le budget minimum pour étudier en France ?",
    a: "Selon le consulat français, l'étudiant doit justifier de 615 €/mois minimum. En pratique, le budget réel pour vivre correctement varie selon la ville : Province (hors Paris) : 700-900 €/mois. Paris : 1 000-1 400 €/mois. Ce budget comprend : loyer (après CAF), alimentation, transports, abonnements, loisirs.",
    source: "Service-public.fr, CROUS 2026",
  },
  {
    q: "Que signifie l'exigence de 615 €/mois du consulat ?",
    a: "Le consulat exige que l'étudiant justifie de ressources couvrant 615 € × nombre de mois de séjour. Pour 12 mois : 7 380 €. Ces ressources peuvent être : compte bancaire personnel, virement mensuel des parents, bourse (Campus France ou gouvernement), lettre de garant avec justificatif de revenus. La somme doit être disponible au moment de la demande de visa.",
    source: "france-visas.gouv.fr",
  },
  {
    q: "Combien coûte réellement la vie étudiante en France ?",
    a: "Budget mensuel réaliste : Loyer (CROUS après APL) : 50-200 €. Loyer (privé après APL) : 300-700 €. Alimentation : 150-250 €. Transports : 20-50 € (carte étudiant réduite). Santé : 0-20 € (CSS gratuite si revenus < 9 720 €/an). Loisirs : 50-100 €. Total avec CROUS : 450-700 €/mois en province.",
    source: "Observatoire de la vie étudiante (OVE) 2025",
  },
  {
    q: "Combien reçoit-on de la CAF en France ?",
    a: "Montants indicatifs CAF 2026 : Loyer 450 €, revenus nuls, ville province : APL ~170 €. Loyer 700 €, revenus nuls, Paris : APL ~90 €. Loyer 350 €, CROUS province : APL ~130 €. Le montant exact se calcule sur caf.fr (simulateur en ligne). Délai pour recevoir le premier versement : 2 à 4 mois.",
    source: "CAF.fr",
  },
  {
    q: "La CSS est-elle vraiment gratuite pour les étudiants ?",
    a: "Oui. La Complémentaire Santé Solidaire (CSS) est gratuite pour les personnes dont les ressources sont inférieures à 9 720 €/an (environ 810 €/mois) selon les seuils 2025. Elle couvre les consultations, médicaments, soins dentaires et optique à 100 %. La demande se fait sur ameli.fr ou en CPAM.",
    source: "Ameli.fr 2025",
  },
  {
    q: "Quels sont les frais d'inscription à l'université en France ?",
    a: "Depuis 2019, les étudiants non-européens paient des droits différenciés : Licence : 2 895 €/an. Master : 3 941 €/an. Doctorat : 397 €/an. Cependant, plus de 50 % des universités ont voté des exonérations partielles ou totales. Toujours vérifier la politique d'exonération de l'établissement visé.",
    source: "MESR, Campus France 2025",
  },
  {
    q: "Combien coûte la CVEC ?",
    a: "La CVEC (Contribution Vie Étudiante et de Campus) est de 105 € pour l'année universitaire 2025-2026. C'est un paiement unique annuel sur messervices.etudiant.gouv.fr. Exonérés : boursiers du gouvernement français. La CVEC est obligatoire pour finaliser l'inscription dans tous les établissements.",
    source: "CNOUS 2025-2026",
  },
  {
    q: "Peut-on travailler pour financer ses études en France ?",
    a: "Oui, jusqu'à 964 heures par an (hors UE). Salaire minimum 2026 : 11,88 €/h brut (SMIC). Revenus potentiels : 20h/semaine pendant 8 mois ≈ 640 h × 11,88 € = 7 603 € brut annuel. Les jobs étudiants courants : restauration, distribution, babysitting, tutorat (15-20 €/h).",
    source: "Service-public.fr, SMIC 2026",
  },
  {
    q: "Existe-t-il des bourses pour les étudiants étrangers en France ?",
    a: "Principales bourses disponibles : 1) Bourses du gouvernement français (BGF) via Campus France : exonération droits + allocation. 2) Bourses Eiffel (Excellences) : 1 181 €/mois en Master, 1 400 €/mois en Doctorat. 3) Bourses d'établissements. 4) Bourses des gouvernements d'origine. 5) Bourses ONG (IMF, Agence Française de Développement).",
    source: "Campus France, bourses.campusfrance.org",
  },
  {
    q: "Quel est le budget logement minimum en France ?",
    a: "Minimum avec CROUS : 120-200 €/mois. Après déduction APL : souvent 0-70 €/mois pour les boursiers. Sans CROUS en province : 350-500 €/mois (studio) avant CAF. Paris : 600-800 €/mois minimum. Un étudiant boursier CROUS peut vivre avec 400-500 €/mois en province (tout compris).",
    source: "CROUS.fr, CAF.fr 2026",
  },
  {
    q: "Y a-t-il des réductions transport pour les étudiants ?",
    a: "Oui : carte de transport étudiant dans la plupart des villes (50 % de réduction). À Paris : carte Imagine'R (350 €/an pour Navigo illimité, vs 900 €/an tarif normal). SNCF Carte Avantage Jeune (jusqu'à 30 % sur les trains longue distance). Vélo : Vélib', Lime, Bird souvent sans abonnement.",
    source: "Régies de transport locales 2025",
  },
  {
    q: "Comment ouvrir un compte bancaire sans adresse fixe en France ?",
    a: "Plusieurs solutions : 1) Banques en ligne sans conditions de résidence (Wise, N26, Revolut) — compte ouvert en ligne depuis l'étranger. 2) La Banque Postale : ouvre les comptes aux étudiants sur présentation du visa. 3) BNP Paribas, Société Générale : offres étudiantes avec justificatif d'inscription. 4) HelloBank, Monabanq : 100 % en ligne.",
    source: "Dalili — Guide banque",
  },
  {
    q: "Quel est le coût des repas dans les restaurants universitaires CROUS ?",
    a: "Le tarif social dans les restaurants universitaires CROUS (RU) est de 3,30 € le repas complet (entrée + plat + dessert) pour les étudiants boursiers et étudiants inscrits dans un établissement conventionné. Tarif standard non boursier : 3,30 € également depuis la mesure gouvernementale de 2022 reconduite en 2026.",
    source: "CNOUS 2026",
  },
  {
    q: "Quel est le budget alimentation moyen d'un étudiant en France ?",
    a: "Budget alimentation moyen mensuel : 150-250 €. Avec 3 repas/jour au RU CROUS (3,30 €) : 3,30 × 20 déjeuners = 66 €/mois. Courses supermarché (dîners + petit-déjeuner) : 80-130 €. Total alimentaire avec accès RU : 150-200 €/mois.",
    source: "OVE (Observatoire de la Vie Étudiante) 2025",
  },
  {
    q: "Comment minimiser les frais de transfert d'argent international ?",
    a: "Comparatif de coûts pour envoyer 500 € du Maroc : Western Union/MoneyGram : 8-15 €. Wise : 2-4 €. Transfert bancaire SWIFT : 15-30 €. Recommandation : Wise (wise.com) pour régularité et transparence. Taux de change : vérifier le cours officiel sur xe.com.",
    source: "Comparaison Dalili 2026",
  },
  {
    q: "La Sécurité Sociale est-elle gratuite pour les étudiants étrangers ?",
    a: "Oui. Tout étudiant inscrit dans un établissement français est affilié à la Sécurité Sociale étudiante gratuitement (cotisation 0 € depuis la réforme de 2018). L'inscription se fait auprès de l'Assurance Maladie après l'arrivée. Le numéro de Sécurité Sociale définitif est attribué après 3-6 mois.",
    source: "Ameli.fr",
  },
  {
    q: "Que couvre la Sécurité Sociale étudiante en France ?",
    a: "La Sécurité Sociale rembourse : 70 % des consultations médicament (avec médecin traitant). 80 % des actes chirurgicaux. 65 % des médicaments de base. 100 % des soins en ALD (maladies longue durée). La CSS (complémentaire) couvre les 30 % restants pour les étudiants éligibles (revenus < 9 720 €/an).",
    source: "Ameli.fr 2026",
  },
  {
    q: "Comment estimer son budget avant de partir ?",
    a: "Utiliser le simulateur de budget de Dalili (dalili.study/simulateur) qui calcule le budget selon la ville, le type de logement et la situation de bourse. Autre outil : le simulateur CAF en ligne. Les estimations Erasmus Student Network par ville sont également fiables pour avoir un ordre de grandeur.",
    source: "dalili.study/simulateur",
  },
  {
    q: "Quelles dépenses prévoir pour l'installation initiale ?",
    a: "Dépenses one-time à l'arrivée : CVEC : 105 €. Dépôt de garantie (caution) : 1-2 mois de loyer. Frais d'agence : 0-1 mois de loyer. Équipement logement (si non meublé) : 300-800 €. Téléphone portable avec forfait (SIM) : 10-15 €/mois. Prévoir un fonds d'urgence de 1 000-2 000 €.",
    source: "Estimations Dalili 2026",
  },
  {
    q: "Les ressources pour visa peuvent-elles inclure une bourse ?",
    a: "Oui. Les bourses officielles (Campus France, Eiffel, gouvernement français) comptent intégralement dans les ressources. Les bourses des gouvernements d'origine sont acceptées si elles sont documentées (lettre officielle d'attribution). Les prêts étudiants de banques reconnues sont aussi acceptables sous conditions.",
    source: "france-visas.gouv.fr",
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function FaqBudgetPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div style={{ background: '#010510', minHeight: '100vh', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,64px)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)', marginBottom: 14 }}>
            FAQ — Budget étudiant
          </p>

          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(26px,4vw,46px)', color: '#ffffff', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            Budget étudiant étranger en France : chiffres réels 2026
          </h1>

          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 56px', maxWidth: 640 }}>
            {"615 €/mois pour le visa, CAF, CSS, droits d'inscription, CVEC — 20 questions avec des chiffres réels et des sources officielles vérifiées pour 2026."}
          </p>

          {FAQ_ITEMS.map((item, i) => (
            <div key={i} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: i < FAQ_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '16px', color: '#ffffff', margin: '0 0 10px', lineHeight: 1.4 }}>
                {item.q}
              </h3>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, margin: '0 0 6px' }}>
                {item.a}
              </p>
              {item.source && (
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: 'rgba(255,255,255,0.68)', margin: 0 }}>
                  Source : {item.source}
                </p>
              )}
            </div>
          ))}

          {/* En savoir plus */}
          <div style={{ marginTop: 64, padding: '32px', background: 'rgba(77,143,255,0.04)', border: '1px solid rgba(77,143,255,0.12)', borderRadius: 16 }}>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '14px', color: '#ffffff', margin: '0 0 16px', letterSpacing: '0.05em' }}>
              EN SAVOIR PLUS
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'FAQ Logement étudiant en France 2026', href: '/faq/logement-etudiant-france' },
                { label: 'FAQ Visa étudiant France 2026', href: '/faq/visa-etudiant-france' },
                { label: 'FAQ Arrivée en France — CAF, ANEF, Sécurité Sociale', href: '/faq/arrivee-france-etudiant' },
                { label: 'Guides par ville — coût de la vie', href: '/villes' },
                { label: 'Tous les guides blog Dalili', href: '/blog' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', color: 'rgba(77,143,255,0.85)', textDecoration: 'none' }}>
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
