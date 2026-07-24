import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Logement étudiant France : toutes les questions 2026 | Dalili',
  description: "CROUS, CAF, VISALE, colocation, documents de location — 20 questions répondues sur le logement étudiant en France. Sources officielles vérifiées.",
  alternates: { canonical: `${SITE_URL}/faq/logement-etudiant-france` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Logement étudiant France : toutes les questions 2026',
    description: "CROUS, CAF, VISALE, colocation, loyers par ville — tout ce que vous devez savoir pour trouver un logement étudiant en France.",
    url: `${SITE_URL}/faq/logement-etudiant-france`,
    siteName: 'Dalili',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    q: "Comment demander un logement au CROUS ?",
    a: "La demande s'effectue via la plateforme DSE (Demande de Logement en Résidence Universitaire) sur trouverunlogement.lescrous.fr. Calendrier : ouverture janvier pour la rentrée de septembre suivant. Il faut être inscrit ou pré-inscrit dans un établissement français, remplir le formulaire et attendre l'attribution. Priorité donnée selon critères sociaux (BCS).",
    source: "CROUS.fr",
  },
  {
    q: "Combien coûte un logement CROUS ?",
    a: "Prix selon le type : Studio T1 (de 9 à 25 m²) : 120 € à 450 €/mois selon la ville et le type de résidence. Résidences Cité U classiques : 120-200 €/mois. Résidences récentes (TRÈFLE) : 300-450 €/mois. Ces prix sont avant déduction éventuelle de la CAF/APL (80 à 200 €), sous condition d'éligibilité depuis le 1er juillet 2026.",
    source: "CROUS 2025-2026",
  },
  {
    q: "Tous les étudiants étrangers ont-ils encore droit à l'APL en 2026 ?",
    a: "Non. Depuis le 1er juillet 2026, un étudiant hors UE/EEE/Suisse doit être boursier sur critères sociaux (CROUS), en contrat d'apprentissage, en contrat de professionnalisation, ou salarié pour garder le droit à l'APL/ALS. Une bourse Eiffel, une BGF ou une bourse de son pays d'origine ne suffisent pas seules. Cette règle s'applique aux nouvelles demandes et aux bénéficiaires déjà en cours de versement.",
    source: "Légifrance — loi n° 2026-103 du 19 février 2026, art. 179 ; décret n° 2026-552 du 27 juin 2026",
  },
  {
    q: "Qu'est-ce que la CAF et combien peut-on recevoir ?",
    a: "La CAF (Caisse d'Allocations Familiales) verse l'APL (Aide Personnalisée au Logement) ou l'ALS (Allocation de Logement Sociale) selon votre situation. Montant pour les étudiants éligibles : 80 à 220 €/mois selon la ville, le loyer et les ressources. À Paris : 80-120 €. En province : 120-200 €. Depuis le 1er juillet 2026, un étudiant hors UE/EEE/Suisse doit en plus être boursier sur critères sociaux, apprenti, en professionnalisation ou salarié pour y avoir droit.",
    source: "CAF.fr",
  },
  {
    q: "Comment demander la CAF en tant qu'étudiant étranger ?",
    a: "Depuis le 1er juillet 2026, vérifie d'abord ton éligibilité : un étudiant hors UE/EEE/Suisse doit être boursier sur critères sociaux, apprenti, en contrat de professionnalisation ou salarié. Si c'est le cas, il faut avoir : 1) Titre de séjour valide (VLS-TS ou titre étudiant), 2) Numéro d'allocataire CAF, 3) Attestation de logement, 4) RIB français. La demande se fait en ligne sur caf.fr dans les 3 mois suivant l'emménagement. Délai de traitement : 1 à 4 mois. L'aide n'est pas rétroactive au-delà de la date de dépôt.",
    source: "CAF.fr, Légifrance (loi n° 2026-103 du 19 février 2026, art. 179)",
  },
  {
    q: "Qu'est-ce que VISALE et comment ça marche ?",
    a: "VISALE est la garantie locative gratuite proposée par Action Logement pour les étudiants sans garant. Conditions : moins de 30 ans OU première année en France. Le propriétaire est couvert en cas d'impayé de loyer (jusqu'à 36 mensualités). La demande se fait sur visale.fr avant de signer le bail. Le visa VISALE est valable 3 mois.",
    source: "visale.fr",
  },
  {
    q: "Peut-on louer un appartement en France sans garant français ?",
    a: "Oui, via plusieurs solutions : 1) VISALE : garantie État gratuite pour < 30 ans. 2) Garantie Loca-Pass (Action Logement). 3) Garant virtuel payant : Cautioneo, GarantMe, Unkle (environ 3,5 % du loyer annuel). 4) Plateformes spécialisées : Studapart, HousingAnywhere qui gèrent les résidences privées sans garant.",
    source: "Action Logement, service-public.fr",
  },
  {
    q: "Quels documents faut-il pour louer un appartement en France ?",
    a: "Pièces standard (décret Alur 2014) : passeport/CNI, titre de séjour, justificatif de revenus (ou attestation bourse/virement mensuel), 3 derniers relevés bancaires, justificatif d'inscription universitaire. Interdit légalement de demander : photo, état de santé, RIB seul, extrait de casier judiciaire.",
    source: "Décret n°2015-1437 (loi Alur)",
  },
  {
    q: "Quand commencer les recherches de logement en France ?",
    a: "Idéalement 4 à 6 mois avant la rentrée. Pour le CROUS, la demande DSE ouvre en janvier pour septembre. Pour les résidences privées, 2 à 3 mois avant suffisent généralement. En Île-de-France, commencer 6 mois à l'avance. Attention aux frais d'agence qui ne peuvent dépasser 1 mois de loyer.",
    source: "CROUS.fr, Observatoires des loyers",
  },
  {
    q: "Peut-on bénéficier de la CAF dans une résidence universitaire CROUS ?",
    a: "Le logement CROUS est conventionné et éligible à l'APL en soi. Mais depuis le 1er juillet 2026, un étudiant hors UE/EEE/Suisse doit d'abord remplir une condition d'éligibilité (bourse sur critères sociaux, apprentissage, professionnalisation ou activité pro) — sinon, même en résidence CROUS, l'aide n'est plus versée. Pour les étudiants éligibles, la CAF verse souvent directement au CROUS (tiers payant), ce qui réduit automatiquement la quittance.",
    source: "CAF.fr, CROUS",
  },
  {
    q: "Comment trouver une colocation en France depuis l'étranger ?",
    a: "Plateformes recommandées : Appartager.com, La Carte des Colocs, Leboncoin.fr, Facebook Marketplace. Pour éviter les arnaques : ne jamais envoyer d'argent sans avoir visité (ou fait visiter par un tiers) le logement. Méfiance si le propriétaire est 'à l'étranger' et demande un virement international.",
    source: "Dalili — Guide anti-arnaques",
  },
  {
    q: "Que faire si on n'a pas de logement à l'arrivée en France ?",
    a: "Solutions temporaires : 1) Auberge de jeunesse (15-40 €/nuit). 2) Résidence étudiante de courte durée (disponible sur Studapart). 3) CROUS d'urgence (contacter la résidence directement). 4) Réseaux de la diaspora. Éviter les hôtels longue durée coûteux. Prévenir l'université dès l'arrivée — certaines proposent un hébergement temporaire.",
    source: "Dalili",
  },
  {
    q: "Qu'est-ce qu'un logement 'meublé' vs 'non meublé' ?",
    a: "Meublé : équipé (lit, table, rangements, réfrigérateur, cuisson, vaisselle). Bail d'1 an renouvelable (ou 9 mois pour étudiants). Dépôt de garantie : 2 mois de loyer maximum. Non meublé : bail de 3 ans. Dépôt de garantie : 1 mois. Pour les étudiants, le meublé est généralement plus adapté.",
    source: "Service-public.fr (loi Alur)",
  },
  {
    q: "Comment fonctionne le dossier de location en ligne (DossierFacile) ?",
    a: "DossierFacile.fr est la plateforme officielle de l'État pour sécuriser et centraliser ses documents de location. Gratuit. Les propriétaires voient un dossier validé avec un label officiel. Permet d'éviter de transmettre ses documents par email non sécurisé. Recommandé pour les demandeurs sans garant.",
    source: "dossierfacile.fr",
  },
  {
    q: "Le CROUS attribue-t-il les logements aux étudiants étrangers ?",
    a: "Oui. Les étudiants internationaux accèdent aux résidences CROUS selon les mêmes critères que les étudiants français : critères sociaux (échelon BCS) et projet pédagogique. Les étudiants boursiers ont la priorité. Sans bourse, les chances d'attribution en zones tendues (Paris, Lyon, Bordeaux) sont réduites.",
    source: "CROUS.fr",
  },
  {
    q: "Peut-on louer un studio en France avant d'arriver ?",
    a: "Oui, mais attention : signer un bail à distance est risqué. Solutions sûres : résidences étudiantes privées (Nexity, Cardinal, Kley) qui proposent des réservations à distance avec contrat sécurisé. CROUS : confirmation d'attribution envoyée avant l'arrivée. Éviter les particuliers sans avoir visité.",
    source: "Dalili — Guide logement",
  },
  {
    q: "Combien de mois de caution faut-il verser en France ?",
    a: "Légalement : 1 mois de loyer hors charges pour un logement non meublé, 2 mois pour un meublé. La caution est restituée dans les 2 mois après le départ (ou 1 mois si l'état des lieux de sortie est conforme). Tout dépassement est illégal.",
    source: "Loi Alur, service-public.fr",
  },
  {
    q: "Les résidences privées CROUS-labellisées sont-elles moins chères ?",
    a: "Les résidences labellisées 'Crous' bénéficient d'un conventionnement permettant l'APL, mais ne sont pas gérées par le CROUS. Prix généralement plus élevés que les résidences universitaires publiques : 400-700 €/mois. Avantages : services (laverie, WiFi, salle commune) et proximité campus.",
    source: "Observatoires des loyers étudiants",
  },
  {
    q: "Que se passe-t-il si on quitte son logement CROUS avant la fin de l'année ?",
    a: "Le bail CROUS est généralement annuel ou de 10 mois (pour les étudiants). Un préavis d'1 mois est requis. La résiliation anticipée est possible mais peut entraîner la perte de l'APL et du dépôt de garantie selon les modalités. Informer rapidement la résidence et la CAF.",
    source: "CROUS.fr",
  },
  {
    q: "Est-ce que la garantie VISALE couvre les colocations ?",
    a: "Oui. VISALE couvre aussi les baux de colocation à condition que chaque colocataire fasse sa propre demande VISALE et que le contrat soit individuel (bail solidaire par colocataire) ou signé séparément. La couverture est de 36 mensualités par bénéficiaire.",
    source: "visale.fr",
  },
  {
    q: "Quelles villes françaises ont les loyers les plus accessibles pour étudiants ?",
    a: "Classement par budget logement moyen (studio, hors CROUS) : Clermont-Ferrand : 350-500 €. Dijon : 380-520 €. Rennes : 400-550 €. Bordeaux : 450-600 €. Lyon : 500-650 €. Paris : 700-1100 €. Pour un CROUS : 120-200 € partout. Avec CROUS + CAF : coût net souvent < 100 €/mois.",
    source: "Observatoire des loyers étudiants, CROUS 2025",
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

export default function FaqLogementPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div style={{ background: '#010510', minHeight: '100vh', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,64px)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)', marginBottom: 14 }}>
            FAQ — Logement étudiant
          </p>

          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(26px,4vw,46px)', color: '#ffffff', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            Logement étudiant France : toutes les questions 2026
          </h1>

          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 56px', maxWidth: 640 }}>
            {"CROUS, CAF, VISALE, colocation, documents de location — 20 questions répondues avec des chiffres réels et des sources officielles vérifiées."}
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
                { label: 'FAQ Visa étudiant France 2026', href: '/faq/visa-etudiant-france' },
                { label: 'FAQ Budget étudiant étranger en France', href: '/faq/budget-etudiant-france' },
                { label: 'FAQ Arrivée en France — premières démarches', href: '/faq/arrivee-france-etudiant' },
                { label: 'Guides par ville — loyers et vie étudiante', href: '/villes' },
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
