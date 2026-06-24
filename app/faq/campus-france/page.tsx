import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Campus France : guide complet procédure CEF 2026 | Dalili',
  description: "Tout comprendre sur la procédure Campus France CEF 2026 : dossier EduFrance, entretien, avis favorable/défavorable, recours, pays concernés. Sources officielles.",
  alternates: { canonical: `${SITE_URL}/faq/campus-france` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Campus France : guide complet procédure CEF 2026',
    description: "Procédure CEF, entretien, avis favorable, recours — 20 questions pour maîtriser Campus France et maximiser vos chances d'avis favorable.",
    url: `${SITE_URL}/faq/campus-france`,
    siteName: 'Dalili',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    q: "Qu'est-ce que Campus France et pourquoi faut-il passer par là ?",
    a: "Campus France est l'agence nationale qui gère la procédure de candidature pour les étudiants étrangers voulant faire leurs études en France. La procédure CEF (Campus France Électronique) est obligatoire pour les ressortissants de 30 pays. Elle permet de centraliser les candidatures, vérifier la cohérence du projet et réaliser un entretien de motivation avant le visa consulaire.",
    source: "campusfrance.org",
  },
  {
    q: "Comment créer son dossier sur la plateforme EduFrance ?",
    a: "Étapes : 1) Créer un compte sur la plateforme EduFrance (pastel.diplomatie.gouv.fr) via l'espace Campus France de votre pays. 2) Compléter le profil académique (notes, diplômes, relevés). 3) Sélectionner les formations (max 12). 4) Payer les frais CEF. 5) Prendre rendez-vous pour l'entretien. Délai total avant l'entretien : 3 à 6 semaines.",
    source: "campusfrance.org",
  },
  {
    q: "Combien de formations peut-on choisir sur Campus France ?",
    a: "Maximum 12 formations par dossier. Recommandations : choisir des formations cohérentes avec le parcours académique et le projet professionnel. Varier les niveaux de sélectivité (établissements très sélectifs + établissements plus accessibles). Les IUT, BTS et Licence Pro comptent comme des formations distinctes.",
    source: "campusfrance.org",
  },
  {
    q: "Comment se déroule l'entretien Campus France ?",
    a: "L'entretien dure environ 20-30 minutes. Il est mené par un agent Campus France dans un des centres locaux. L'agent vérifie : la cohérence du projet, la maîtrise du français, la motivation pour la France, la connaissance des formations choisies et la capacité financière à financer les études. L'entretien peut se dérouler en français.",
    source: "campusfrance.org",
  },
  {
    q: "Quelles questions sont posées à l'entretien Campus France ?",
    a: "Questions fréquentes : 1) Pourquoi la France et pas votre pays ? 2) Pourquoi cette formation ? 3) Quel est votre projet professionnel ? 4) Comment vous financez vos études ? 5) Avez-vous de la famille en France ? 6) Connaissez-vous la ville où vous allez étudier ? 7) Quels sont vos points forts/faibles ? Préparer des réponses claires et cohérentes.",
    source: "Retours d'expérience Dalili 2025-2026",
  },
  {
    q: "Que signifie un avis favorable ou défavorable Campus France ?",
    a: "Avis favorable : le dossier est transmis au consulat et vous pouvez déposer votre dossier de visa. Avis défavorable : Campus France recommande au consulat de ne pas accorder le visa. Cependant, cet avis n'est que consultatif — le consul décide souverainement. Un recours gracieux auprès de Campus France est possible.",
    source: "campusfrance.org",
  },
  {
    q: "Quel est le délai entre l'entretien et l'avis Campus France ?",
    a: "Généralement 2 à 6 semaines après l'entretien selon le volume de dossiers. En période de pointe (mars-juin), le délai peut s'allonger à 8 semaines. Campus France communique l'avis par email. Si l'avis tarde, contacter directement le bureau Campus France local.",
    source: "campusfrance.org",
  },
  {
    q: "L'avis défavorable Campus France peut-il être contesté ?",
    a: "Oui. Deux voies : 1) Recours gracieux : envoyer une lettre motivée au directeur de Campus France local dans les 2 mois. Joindre des pièces complémentaires (preuves financières, lettre d'établissement, etc.). 2) Recours au consul directement pour exposer sa situation. Le taux de révision après recours est d'environ 15-20 %.",
    source: "campusfrance.org",
  },
  {
    q: "Les notes académiques influencent-elles l'avis Campus France ?",
    a: "Oui significativement. Un dossier académique solide (mentions bien/très bien au baccalauréat, bonnes notes en licence) augmente les chances d'avis favorable. Les établissements très sélectifs (grandes écoles, médecine) exigent d'excellents résultats. Un parcours incohérent (filière qui ne correspond pas au diplôme) est un facteur de refus.",
    source: "Analyse Dalili des dossiers 2025",
  },
  {
    q: "Peut-on candidater dans des grandes écoles via Campus France ?",
    a: "Oui. Les grandes écoles (HEC, Polytechnique, CentraleSupélec, etc.) ont leurs propres procédures d'admission (concours, dossier) qui s'ajoutent à Campus France. Pour les étudiants CEF, le passage par Campus France reste obligatoire, même si l'école a directement accepté le candidat.",
    source: "campusfrance.org",
  },
  {
    q: "Campus France est-il différent selon les pays ?",
    a: "Oui. Chaque pays a son propre espace Campus France avec des spécificités locales : Maroc (Casablanca, Rabat, Marrakech), Algérie (Alger, Oran, Constantine, Annaba), Sénégal (Dakar), Côte d'Ivoire (Abidjan), Cameroun (Yaoundé, Douala). Les frais, délais et procédures peuvent légèrement varier.",
    source: "campusfrance.org par pays",
  },
  {
    q: "Faut-il des lettres de recommandation pour Campus France ?",
    a: "Non obligatoires pour Campus France en soi. Mais fortement recommandées pour certaines formations sélectives (Masters, grandes écoles). Pour le dossier Campus France, la lettre de motivation est le document le plus important. Les lettres de professeurs renforcent la crédibilité du dossier académique.",
    source: "campusfrance.org",
  },
  {
    q: "Quelle est la différence entre Parcoursup et Campus France ?",
    a: "Campus France gère les candidatures des étudiants ÉTRANGERS via la procédure CEF. Parcoursup est la plateforme pour les bacheliers français (et résidents) en Terminale et post-bac. Les étudiants étrangers en Terminale en France passent par Parcoursup comme les Français. Les étudiants depuis l'étranger passent par Campus France.",
    source: "Ministère de l'Enseignement Supérieur",
  },
  {
    q: "Campus France donne-t-il accès aux résultats des établissements ?",
    a: "Non directement. Campus France soumet les dossiers aux établissements qui communiquent leurs décisions d'admission séparément. Pour les admissions officielles, les étudiants reçoivent les réponses directement des établissements par email ou via les portails des universités (eCandidat, plateforme interne).",
    source: "campusfrance.org",
  },
  {
    q: "Peut-on modifier son dossier après l'entretien Campus France ?",
    a: "Après le dépôt et avant l'entretien : oui, modifications limitées. Après l'entretien : non, le dossier est fermé. Si une admission tardive arrive d'un établissement non inclus dans le dossier CEF, contacter immédiatement Campus France pour demander s'il est possible d'ajouter l'établissement.",
    source: "campusfrance.org",
  },
  {
    q: "Y a-t-il une limite d'âge pour Campus France ?",
    a: "Pas officiellement. Cependant, les candidatures de personnes de plus de 40 ans peuvent faire l'objet d'une analyse plus approfondie sur la cohérence du projet. La procédure CEF s'applique quel que soit l'âge. Les seniors professionnels en reprise d'études doivent particulièrement soigner la justification de leur projet.",
    source: "campusfrance.org",
  },
  {
    q: "Comment se passe l'inscription universitaire après Campus France ?",
    a: "Processus : 1) Réception avis favorable Campus France. 2) Dépôt visa au consulat. 3) Obtention visa. 4) Inscription universitaire (avant ou après visa selon l'établissement). 5) Arrivée en France. 6) Validation VLS-TS sur ANEF (dans les 3 mois). 7) Inscription administrative définitive + paiement CVEC.",
    source: "Ministère de l'Enseignement Supérieur",
  },
  {
    q: "Les étudiants en échange Erasmus doivent-ils passer par Campus France ?",
    a: "Non. Les programmes d'échange officiels (Erasmus+, conventions bilatérales entre établissements) ne passent pas par la procédure CEF individuelle. L'inscription est gérée directement entre les établissements. Les étudiants reçoivent un visa étudiant classique sur invitation de l'établissement d'accueil.",
    source: "campusfrance.org",
  },
  {
    q: "Campus France aide-t-il à trouver un logement ?",
    a: "Campus France oriente vers les CROUS et ressources officielles mais ne fournit pas directement de logement. Certains Campus France locaux organisent des sessions d'information sur le logement. Le CROUS est l'organisme compétent pour les logements universitaires. Campus France peut mettre en relation avec l'université d'accueil.",
    source: "campusfrance.org",
  },
  {
    q: "Quel niveau de français faut-il pour l'entretien Campus France ?",
    a: "L'entretien se déroule en français. Un niveau B2 minimum (CECRL) est fortement recommandé. L'agent évalue votre capacité à communiquer clairement en français sur votre projet. Un niveau insuffisant peut être un facteur d'avis défavorable, indépendamment de la qualité académique du dossier.",
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

export default function FaqCampusFrancePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div style={{ background: '#010510', minHeight: '100vh', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,64px)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)', marginBottom: 14 }}>
            FAQ — Campus France
          </p>

          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(26px,4vw,46px)', color: '#ffffff', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            Campus France : guide complet procédure CEF 2026
          </h1>

          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 56px', maxWidth: 640 }}>
            {"Procédure CEF, dossier EduFrance, entretien, avis favorable ou défavorable, recours — 20 questions pour maîtriser Campus France en 2026."}
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
                { label: 'Guides par pays — Maroc, Algérie, Tunisie, Sénégal, Côte d\'Ivoire, Cameroun', href: '/pays' },
                { label: 'FAQ Logement étudiant en France', href: '/faq/logement-etudiant-france' },
                { label: 'FAQ Budget étudiant étranger en France', href: '/faq/budget-etudiant-france' },
                { label: 'Universités françaises — guide complet', href: '/universites' },
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
