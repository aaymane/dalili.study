import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Visa étudiant France : toutes les questions et réponses 2026 | Dalili',
  description: "Tout ce que vous devez savoir sur le visa étudiant France en 2026 : délais, documents, Campus France, 877,50 €/mois dès août 2026, VLS-TS, ANEF. Réponses vérifiées sur sources officielles.",
  alternates: { canonical: `${SITE_URL}/faq/visa-etudiant-france` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Visa étudiant France : toutes les questions et réponses 2026',
    description: "Délais, documents, Campus France, 877,50 €/mois dès août 2026 (615 € avant), VLS-TS, ANEF — 20 questions répondues avec sources officielles.",
    url: `${SITE_URL}/faq/visa-etudiant-france`,
    siteName: 'Dalili',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    q: "Combien de temps pour obtenir un visa étudiant France ?",
    a: "Entre 3 et 14 semaines selon le pays. Depuis le Maroc : 8 à 14 semaines en été, 4 à 8 semaines hors saison. Depuis l'Algérie : 6 à 10 semaines. Depuis le Sénégal : 3 à 6 semaines. Ces délais incluent la procédure Campus France et l'instruction du dossier au consulat.",
    source: "Consulats français 2025-2026",
  },
  {
    q: "Combien d'argent faut-il pour le visa étudiant France ?",
    a: "Le consulat exige 615 € par mois de ressources prouvables (7 380 € pour 12 mois) pour les dossiers déposés jusqu'au 31 juillet 2026. À partir du 1er août 2026, ce seuil passe à 877,50 €/mois (environ 10 530 € pour 12 mois), suite au décret n° 2026-526 du 22 juin 2026. Cette somme doit être disponible sur un compte bancaire au nom de l'étudiant ou d'un garant présentant un justificatif de revenu.",
    source: "Service-public.fr, légifrance.gouv.fr",
  },
  {
    q: "Campus France est-il obligatoire pour tous les pays ?",
    a: "Non. La procédure CEF (Campus France Électronique) est obligatoire pour les ressortissants de 30 pays dont : Maroc, Algérie, Tunisie, Sénégal, Cameroun, Côte d'Ivoire, Bénin, Burkina Faso, Chine, Colombie, Congo-Brazzaville, Corée du Sud, Gabon, Guinée, Inde, Japon, Madagascar, Mali, Mauritanie, Mexique, Pérou, Russie, Taiwan, Togo, Vietnam.",
    source: "campusfrance.org",
  },
  {
    q: "Peut-on travailler avec un visa étudiant en France ?",
    a: "Oui. Les étudiants non-européens peuvent travailler jusqu'à 964 heures par an (60 % du temps plein légal de 1 607 h). Exception : les étudiants algériens sont limités à 50 % (soit 803 h/an) en vertu de l'accord franco-algérien de 1968.",
    source: "Service-public.fr",
  },
  {
    q: "Que faire en cas de refus de visa étudiant ?",
    a: "Plusieurs recours : 1) Recours gracieux auprès du consulat dans les 2 mois. 2) Recours devant la Commission de Recours contre les Refus de Visa (CRRV). 3) Recours contentieux devant le tribunal administratif de Nantes (délai 2 mois). Le refus d'avis Campus France est distinct du refus de visa consulaire.",
    source: "legifrance.gouv.fr",
  },
  {
    q: "Quelle est la différence entre VLS-TS et visa de court séjour ?",
    a: "Le VLS-TS (Visa Long Séjour valant Titre de Séjour) remplace le titre de séjour la première année. Il doit être validé en ligne sur le portail ANEF dans les 3 mois suivant l'arrivée. Sans validation, il perd sa valeur de titre de séjour. Le visa de court séjour (Schengen, < 90 jours) ne permet pas d'étudier ni de travailler en France.",
    source: "Administration française (ANEF)",
  },
  {
    q: "Quels documents sont nécessaires pour le dossier visa étudiant ?",
    a: "Documents essentiels : 1) Passeport valide > 6 mois après la date de retour. 2) Lettre d'admission d'un établissement français reconnu. 3) Justificatifs financiers (877,50 €/mois dès le 1er août 2026, 615 €/mois avant). 4) Avis favorable Campus France (si pays CEF). 5) Justificatif de logement en France. 6) Photo d'identité aux normes. 7) Attestation assurance maladie (certains consulats). 8) Quittus fiscal selon le pays.",
    source: "france-visas.gouv.fr",
  },
  {
    q: "Faut-il un justificatif de logement pour le visa ?",
    a: "Oui. Une attestation d'hébergement ou une confirmation de réservation CROUS suffit pour le dossier. Si vous n'avez pas encore de logement confirmé, certains consulats acceptent une attestation de recherche active.",
    source: "france-visas.gouv.fr",
  },
  {
    q: "Comment choisir ses établissements sur Campus France ?",
    a: "La plateforme EduFrance permet de sélectionner jusqu'à 12 formations. Conseil : choisir des établissements publics reconnus par le MESR. Inclure des formations à différents niveaux de sélectivité. Renseigner ses notes et son parcours avec précision. L'entretien Campus France porte sur la cohérence du projet.",
    source: "campusfrance.org",
  },
  {
    q: "Combien coûte la procédure Campus France ?",
    a: "Les frais de la procédure CEF varient selon le pays : Maroc : 2 200 MAD (environ 200 €), Algérie : 5 000 DZD (environ 35 €), Sénégal : 60 000 FCFA (environ 90 €), Côte d'Ivoire : 60 000 FCFA (environ 90 €). Ces frais sont non remboursables en cas de refus.",
    source: "Sites Campus France par pays",
  },
  {
    q: "Quel diplôme de langue est requis pour une formation en français ?",
    a: "Pour les étudiants dont le français n'est pas la langue maternelle : DELF B2 minimum pour la Licence, TCF score ≥ 677 (niveau C1) pour certains Masters sélectifs. De nombreuses universités acceptent aussi un DALF C1. Les diplômés de lycées francophones sont souvent exemptés.",
    source: "Ministère de l'Enseignement Supérieur",
  },
  {
    q: "Peut-on renouveler son visa étudiant en restant en France ?",
    a: "Oui. Après la première année avec VLS-TS, l'étudiant demande un titre de séjour 'étudiant' renouvelable annuellement en préfecture ou sur le portail ANEF. Conditions : inscription en cours valide, progression pédagogique, ressources suffisantes. Le renouvellement doit être demandé 2 mois avant l'expiration.",
    source: "Service-public.fr",
  },
  {
    q: "Un refus Campus France empêche-t-il de demander un visa ?",
    a: "Techniquement non, mais en pratique le consulat requiert l'avis favorable Campus France pour les pays CEF. Un avis défavorable peut être contesté par voie de recours gracieux. Le refus Campus France est distinct du refus de visa ; il faut les traiter séparément.",
    source: "campusfrance.org",
  },
  {
    q: "L'Algérie a-t-elle une procédure spéciale ?",
    a: "Oui. Les ressortissants algériens sont soumis à l'Accord franco-algérien de 1968 qui régit leur séjour hors CESEDA. Conséquences pratiques : droit au travail limité à 50 % du temps légal, titre de séjour 'étudiant algérien' spécifique, et certaines aides sociales accessibles sous conditions différentes.",
    source: "Accord franco-algérien du 27 décembre 1968",
  },
  {
    q: "Le visa étudiant donne-t-il accès à toute l'Europe ?",
    a: "Non. Le VLS-TS français n'est pas un visa Schengen valide pour séjourner dans les autres pays de l'espace Schengen plus de 90 jours. Pour voyager en Europe, l'étudiant doit présenter son VLS-TS validé + son passeport. Des conditions spécifiques s'appliquent pour les séjours de courte durée dans d'autres pays Schengen.",
    source: "Ministère de l'Europe et des Affaires Étrangères",
  },
  {
    q: "Faut-il une assurance santé pour le visa ?",
    a: "Une attestation d'assurance couvrant les soins médicaux en France est recommandée pour le dossier visa. Une fois en France, les étudiants s'inscrivent à l'Assurance Maladie et bénéficient de la Sécurité Sociale Étudiante. La CSS (Complémentaire Santé Solidaire) est gratuite pour les revenus < 9 720 €/an.",
    source: "Ameli.fr",
  },
  {
    q: "Puis-je demander un visa avant d'avoir mon admission définitive ?",
    a: "Non. Le visa étudiant nécessite une lettre d'admission d'un établissement reconnu par l'État. Pour les pays CEF, l'avis favorable Campus France (qui intervient après la fin de la procédure EduFrance) est également nécessaire avant le dépôt du dossier au consulat.",
    source: "france-visas.gouv.fr",
  },
  {
    q: "Quel est le délai entre la demande et le rendez-vous consulaire ?",
    a: "Variable selon la charge du consulat et la saison. En été (juin-septembre), les délais s'allongent significativement. Depuis Casablanca : 3 à 6 semaines pour le rendez-vous. Depuis Alger : 4 à 8 semaines. Recommandation : prendre rendez-vous dès réception de l'avis favorable Campus France, sans attendre.",
    source: "Estimations Dalili basées sur retours utilisateurs 2025-2026",
  },
  {
    q: "Que se passe-t-il si on arrive en France avant la validation ANEF ?",
    a: "L'étudiant dispose de 3 mois après son arrivée pour valider son VLS-TS sur le portail ANEF (anef.interieur.gouv.fr). Passé ce délai, le VLS-TS perd sa valeur de titre de séjour et l'étudiant se retrouve en situation irrégulière. La validation est gratuite mais obligatoire.",
    source: "ANEF / Ministère de l'Intérieur",
  },
  {
    q: "Peut-on étudier en France sans passer par Campus France pour les pays CEF ?",
    a: "Non, pour les pays soumis à la procédure CEF, le passage par Campus France est obligatoire. Il n'existe pas de dérogation. En revanche, pour un programme d'échange académique officiel (Erasmus, conventions bilatérales), l'établissement d'accueil peut gérer l'admission directement, sans passer par la procédure individuelle CEF.",
    source: "campusfrance.org",
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

export default function FaqVisaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div style={{ background: '#010510', minHeight: '100vh', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,64px)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)', marginBottom: 14 }}>
            FAQ — Visa étudiant
          </p>

          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(26px,4vw,46px)', color: '#ffffff', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            Visa étudiant France : toutes les questions et réponses 2026
          </h1>

          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 56px', maxWidth: 640 }}>
            {"20 questions vérifiées sur les sources officielles (france-visas.gouv.fr, Service-public.fr, campusfrance.org, ANEF) pour obtenir votre visa étudiant France en 2026."}
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
                { label: 'Guides par pays — Maroc, Algérie, Tunisie, Sénégal, Côte d\'Ivoire, Cameroun', href: '/pays' },
                { label: 'FAQ Campus France — procédure CEF complète', href: '/faq/campus-france' },
                { label: 'FAQ Logement étudiant en France', href: '/faq/logement-etudiant-france' },
                { label: 'FAQ Budget étudiant étranger en France', href: '/faq/budget-etudiant-france' },
                { label: 'FAQ Arrivée en France — premières démarches', href: '/faq/arrivee-france-etudiant' },
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
