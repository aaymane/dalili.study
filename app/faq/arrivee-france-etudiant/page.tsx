import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://dalili.study';

export const metadata: Metadata = {
  title: "Arrivée en France étudiant étranger : checklist et démarches 2026 | Dalili",
  description: "ANEF, Sécurité Sociale, CAF, CVEC, compte bancaire — les premières démarches à faire en arrivant en France en tant qu'étudiant étranger. Guide 2026 avec sources officielles.",
  alternates: { canonical: `${SITE_URL}/faq/arrivee-france-etudiant` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Arrivée en France étudiant étranger : checklist et démarches 2026",
    description: "ANEF (validation VLS-TS), Sécurité Sociale, CAF, CVEC, compte bancaire — tout ce qu'il faut faire dans les 3 premiers mois après l'arrivée en France.",
    url: `${SITE_URL}/faq/arrivee-france-etudiant`,
    siteName: 'Dalili',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    q: "Quelle est la première chose à faire en arrivant en France ?",
    a: "Dans les 3 mois suivant l'arrivée : valider le VLS-TS sur le portail ANEF (anef.interieur.gouv.fr). C'est la démarche la plus urgente — sans validation, le titre de séjour perd sa valeur. Les autres démarches importantes : s'inscrire à l'Assurance Maladie, ouvrir un compte bancaire, demander la CAF, payer la CVEC.",
    source: "ANEF / Ministère de l'Intérieur",
  },
  {
    q: "Comment valider son VLS-TS sur ANEF ?",
    a: "Accéder à anef.interieur.gouv.fr. Créer un compte avec l'email utilisé pour le visa. Sélectionner 'Valider mon visa'. Renseigner numéro de passeport, date d'arrivée, adresse en France. Payer les taxes OFII (58 € en 2026). Recevoir la vignette OFII par courrier dans 2-4 semaines. Cette vignette complète votre titre de séjour.",
    source: "ANEF, OFII 2026",
  },
  {
    q: "Comment s'inscrire à la Sécurité Sociale en France ?",
    a: "Depuis 2018, inscription automatique pour les étudiants inscrits dans un établissement conventionné. En pratique : lors de l'inscription universitaire, fournir passeport, titre de séjour, justificatif de domicile. La CPAM envoie la carte Vitale provisoire puis définitive. Numéro provisoire obtenu en 2-4 semaines, définitif en 3-6 mois.",
    source: "Ameli.fr",
  },
  {
    q: "Comment demander un numéro de Sécurité Sociale ?",
    a: "Le numéro provisoire est attribué automatiquement à l'inscription universitaire. Pour le numéro définitif : la CPAM demande l'acte de naissance traduit et apostillé (traducteur assermenté). L'apostille est délivrée par les autorités du pays d'origine. Délai : 3 à 6 mois pour le numéro définitif.",
    source: "Ameli.fr",
  },
  {
    q: "Comment demander la CAF dès l'arrivée ?",
    a: "Étapes : 1) Avoir un logement confirmé (bail signé ou attestation d'hébergement). 2) Avoir un RIB français. 3) Créer un compte sur caf.fr. 4) Soumettre le dossier avec : bail, justificatif d'identité, titre de séjour, RIB, justificatif de situation (étudiant). 5) La CAF verse rétroactivement jusqu'à 3 mois après la date d'emménagement.",
    source: "CAF.fr",
  },
  {
    q: "Qu'est-ce que la CVEC et comment la payer ?",
    a: "La CVEC (Contribution Vie Étudiante et de Campus) est de 105 € pour 2025-2026. Elle se paie sur messervices.etudiant.gouv.fr avec une carte bancaire. L'attestation de paiement est obligatoire pour finaliser l'inscription universitaire. Exonérés : boursiers du gouvernement français, réfugiés, bénéficiaires de protection subsidiaire.",
    source: "CNOUS 2025-2026",
  },
  {
    q: "Comment choisir son médecin traitant en France ?",
    a: "Depuis 2004, tout assuré doit désigner un médecin traitant pour être remboursé normalement. Procédure : consulter n'importe quel médecin généraliste qui accepte de nouveaux patients (chercher sur ameli.fr → 'Trouver un médecin'). Lui demander de signer la déclaration de médecin traitant. Sans médecin traitant : remboursement réduit de 70 % à 30 %.",
    source: "Ameli.fr",
  },
  {
    q: "Comment ouvrir un compte bancaire en France sans adresse fixe ?",
    a: "Plusieurs options pour commencer : 1) Banques 100 % en ligne : N26, Wise, Revolut — ouverture avec passeport et selfie uniquement. 2) La Banque Postale : ouverture sur présentation du visa étudiant. 3) BNP Paribas, Société Générale : offres étudiantes avec justificatif d'inscription. Pour le justificatif d'adresse : attestation d'hébergement CROUS ou chez un tiers.",
    source: "Dalili — Guide banque",
  },
  {
    q: "Quel opérateur téléphonique choisir en France ?",
    a: "Forfaits recommandés pour étudiants avec budget serré : Free Mobile 2 €/mois (appels France + 50 Mo). Forfaits 10-20 €/mois : illimitées + 50-100 Go 4G/5G (SFR, Orange, Bouygues version low-cost). Sans engagement = plus flexible. Numéro français indispensable pour la CAF et l'ANEF.",
    source: "Comparateurs de forfaits 2026",
  },
  {
    q: "Comment s'inscrire à l'université une fois en France ?",
    a: "Si pré-inscrit depuis l'étranger : finaliser l'inscription administrative (apporter passeport, visa/VLS-TS, photos, CVEC payée, parfois droits d'inscription). Si pas encore d'admission : contacter les universités directement pour les candidatures tardives (pas toutes acceptées). L'inscription pédagogique (choix des cours) suit l'inscription administrative.",
    source: "Ministère de l'Enseignement Supérieur",
  },
  {
    q: "Comment trouver un médecin qui parle arabe ou wolof ?",
    a: "Ameli.fr propose un annuaire avec les langues parlées par les médecins. Les associations étudiantes de votre pays d'origine en France (AMFE pour Maroc, AECF pour Algérie) tiennent souvent des listes de praticiens. Les hôpitaux universitaires proposent des interprètes pour les consultations importantes.",
    source: "Ameli.fr, associations étudiantes",
  },
  {
    q: "Comment se déplacer en France sans carte bancaire française ?",
    a: "Avant d'avoir une carte française : carte de débit internationale (Visa/Mastercard) du pays d'origine fonctionne généralement. Prepaid Wise, Revolut ou N26 (compte en ligne) ouvrable en quelques jours. Certains distributeurs facturent des frais de change — Wise et Revolut offrent les meilleurs taux.",
    source: "Dalili — Guide banque",
  },
  {
    q: "Doit-on se déclarer à la mairie ou à la préfecture à l'arrivée ?",
    a: "Pas de déclaration obligatoire à la mairie. Démarche obligatoire : validation VLS-TS sur ANEF (dans les 3 mois). Pour le renouvellement de titre de séjour l'année suivante : prendre rendez-vous en préfecture ou sur ANEF 2 mois avant l'expiration du titre. Une déclaration de changement d'adresse est recommandée auprès de la CAF et de la CPAM.",
    source: "Service-public.fr",
  },
  {
    q: "Peut-on conduire en France avec son permis étranger ?",
    a: "Oui, pour 1 an à compter de la date d'acquisition de la résidence habituelle en France. Après 1 an, échange du permis requis pour les pays ayant une convention d'échange avec la France. Maroc : échange possible sans repasser le permis. Algérie : échange possible. Tunisie : échange possible. Sénégal : échange possible. Contrôler auprès de la préfecture selon le pays.",
    source: "Service-public.fr",
  },
  {
    q: "Comment demander la CSS (Complémentaire Santé Solidaire) ?",
    a: "Conditions : ressources < 9 720 €/an (2025). Démarche : 1) Être déjà inscrit à l'Assurance Maladie et avoir un numéro de SS. 2) Faire la demande sur ameli.fr, à la CPAM ou via un formulaire papier Cerfa n°12621. 3) Fournir justificatifs de ressources. Délai d'attribution : 4-8 semaines. La CSS est renouvelable annuellement.",
    source: "Ameli.fr 2026",
  },
  {
    q: "Qu'est-ce que l'OFII et faut-il s'y rendre physiquement ?",
    a: "L'OFII (Office Français de l'Immigration et de l'Intégration) gère la validation des VLS-TS. Depuis 2020, la procédure est entièrement dématérialisée via ANEF — pas besoin de se rendre physiquement à l'OFII. La vignette OFII (qui complète le VLS-TS) est envoyée par courrier après paiement en ligne (58 €).",
    source: "ANEF / OFII 2026",
  },
  {
    q: "Quels documents garder toujours sur soi ?",
    a: "Documents à avoir sur soi ou facilement accessibles : Passeport original + copie. VLS-TS ou titre de séjour. Carte Vitale ou attestation de droits. Numéro de Sécurité Sociale. Justificatif de domicile récent. Carte bancaire. En cas de contrôle d'identité : passeport + titre de séjour suffisent. Garder des copies numériques sur téléphone.",
    source: "Service-public.fr",
  },
  {
    q: "Comment renouveler son titre de séjour étudiant ?",
    a: "2 à 3 mois avant l'expiration : 1) Accéder à ANEF (anef.interieur.gouv.fr). 2) Soumettre dossier de renouvellement : justificatif d'inscription, relevés de notes, justificatifs financiers, justificatif de domicile, photos. 3) Payer les taxes (225 € environ). Le récépissé délivré par ANEF autorise à rester en France pendant l'instruction.",
    source: "ANEF / Ministère de l'Intérieur",
  },
  {
    q: "Comment accéder aux aides d'urgence si on se retrouve sans ressources ?",
    a: "Dispositifs d'urgence : 1) FSDIE (Fonds de Solidarité et de Développement des Initiatives Étudiantes) dans chaque université. 2) CROUS : aides d'urgence ponctuelles sur demande au bureau de l'aide sociale. 3) Aide alimentaire : épiceries sociales, Restos du Cœur (pas de critère de nationalité). 4) Permanences sociales en CPAM pour les soins urgents.",
    source: "CROUS.fr, service-public.fr",
  },
  {
    q: "Quelles associations aident les étudiants étrangers en France ?",
    a: "Principales associations par origine : Maroc : AMFE (Association Marocaine des Femmes Entrepreneures), AMF (Association des Marocains en France). Algérie : AECF (Algériens en France). Sénégal : AEFS. Plus généralement : Campus France propose des alumni networks. L'USEM (Unions Régionales des MDE) oriente sur les aides locales.",
    source: "Dalili — Annuaire associations",
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

export default function FaqArriveeFrancePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div style={{ background: '#010510', minHeight: '100vh', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,64px)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)', marginBottom: 14 }}>
            FAQ — Arrivée en France
          </p>

          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(26px,4vw,46px)', color: '#ffffff', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            {"Arrivée en France étudiant étranger : checklist et démarches 2026"}
          </h1>

          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 56px', maxWidth: 640 }}>
            {"ANEF (validation VLS-TS obligatoire dans les 3 mois), Sécurité Sociale, CAF, CVEC, compte bancaire — tout ce qu'il faut faire en priorité après votre arrivée en France."}
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
                { label: 'FAQ Logement étudiant en France', href: '/faq/logement-etudiant-france' },
                { label: 'FAQ Budget étudiant étranger en France', href: '/faq/budget-etudiant-france' },
                { label: 'FAQ Campus France — procédure CEF complète', href: '/faq/campus-france' },
                { label: 'Guides par ville — vie étudiante', href: '/villes' },
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
