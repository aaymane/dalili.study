import type { Metadata } from 'next';
import Link from 'next/link';

import PartnerForm from '@/components/PartnerForm';
import JourneyVisual from '@/components/partners/JourneyVisual';
import PartnerKinds from '@/components/partners/PartnerKinds';
import { getSiteStats } from '@/lib/data/site-stats';

import styles from './partenaires.module.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';
const PAGE_URL = `${SITE_URL}/partenaires`;
const { guidesCount, villesCount, paysNommesCount } = getSiteStats();

const TITLE = 'Devenir partenaire — banques, écoles, logement, assurance';
const DESCRIPTION =
  'Banque, école, assureur, bailleur, opérateur ou association : proposez un partenariat à Dalili pour aider les étudiants internationaux à réussir leur arrivée en France.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${TITLE} | Dalili`,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Dalili',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | Dalili`,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

// Les chiffres du site (calculés) et ceux de l'enquête Dalili auprès d'étudiants internationaux.
const stats = [
  { value: `${guidesCount}`, label: 'guides et démarches vérifiés' },
  { value: `${villesCount}`, label: 'villes françaises documentées' },
  { value: `${paysNommesCount}`, label: 'pays d’origine couverts' },
  { value: '82 %', label: 'jugent la préparation difficile' },
  { value: '15 %', label: 'font confiance aux infos trouvées en ligne' },
  { value: '74 %', label: 'redoutent l’isolement en arrivant' },
];

const values = [
  { title: 'Le bon moment', text: 'Votre offre apparaît à l’étape exacte où l’étudiant en a besoin : le visa, le logement, le compte, la mutuelle. Pas avant, pas au hasard.' },
  { title: 'La confiance', text: 'Les étudiants viennent chercher une information vérifiée. Être recommandé par Dalili, c’est être choisi dans un cadre qu’ils croient.' },
  { title: 'Des demandes choisies', text: 'Un étudiant vous contacte parce qu’il l’a décidé. Ses coordonnées ne sont jamais transmises sans son accord explicite.' },
];

const rules = [
  { title: 'L’étudiant d’abord', text: 'Une offre n’apparaît sur Dalili que si elle répond à un besoin réel des étudiants internationaux.' },
  { title: 'Partenariat affiché', text: 'Chaque lien partenaire est signalé comme tel. Les étudiants savent toujours à qui ils ont affaire.' },
  { title: 'Contenu indépendant', text: 'Un partenariat n’achète ni un avis ni une place dans un classement. Nos guides restent fondés sur les sources officielles.' },
  { title: 'Données protégées', text: 'Les coordonnées d’un étudiant ne sont jamais transmises à un partenaire sans son accord explicite.' },
];

const steps = [
  { title: 'Vous décrivez votre projet', time: '2 minutes', text: 'Le formulaire est court. Une idée en quelques lignes suffit.' },
  { title: 'L’équipe vous répond', time: 'Sous 48 h', text: 'Directement à l’adresse que vous indiquez, pour en parler de vive voix.' },
  { title: 'On choisit le bon format', time: 'Ensemble', text: 'Fiche dans l’application, mention dans un guide, offre réservée aux étudiants : selon ce qui leur sert vraiment.' },
];

const faq = [
  {
    q: 'Qui peut devenir partenaire de Dalili ?',
    a: 'Toute organisation dont le service aide un étudiant international à préparer ou réussir son installation en France : banques, écoles et universités, assurances et mutuelles, logement, mobilité et télécom, associations et institutions.',
  },
  {
    q: 'Un partenaire peut-il payer pour un avis ou un meilleur classement ?',
    a: 'Non. Les guides, comparatifs et classements de Dalili restent indépendants et fondés sur les sources officielles. Un partenariat ne modifie jamais leur contenu.',
  },
  {
    q: 'Les étudiants savent-ils qu’un lien est un partenariat ?',
    a: 'Oui. Chaque lien partenaire est signalé clairement sur le site, comme le précisent nos mentions légales.',
  },
  {
    q: 'Que deviennent les informations envoyées dans ce formulaire ?',
    a: 'Elles servent uniquement à vous répondre. Seule l’équipe Dalili les lit. Votre adresse IP n’est pas conservée, seulement une empreinte chiffrée qui limite les envois répétés. Vous pouvez demander leur suppression à bonjour@dalili.study.',
  },
  {
    q: 'En combien de temps répondez-vous ?',
    a: 'En général sous 48 heures. Pour une question urgente, écrivez directement à bonjour@dalili.study.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Partenaires', item: PAGE_URL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
];

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12 5 5 9-10" />
  </svg>
);
const Arrow = () => (
  <svg className={styles.btnArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

/** Devenir partenaire : la vitrine de Dalili pour les banques, écoles, assurances, logement, mobilité et associations. */
export default function PartenairesPage() {
  return (
    <main id="main-content" className={styles.root}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Héros : la promesse, et le parcours de l'étudiant où chaque partenaire a sa place ── */}
      <header className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.watermark} aria-hidden="true" lang="ar">
          شركاء
        </div>
        <div className={`${styles.wrap} ${styles.heroLayout}`}>
          <div className={styles.heroCopy}>
            <ol className={styles.crumbs} aria-label="Fil d’Ariane">
              <li>
                <Link href="/">Accueil</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Partenaires</li>
            </ol>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowDot} /> Partenariats
            </span>
            <h1 className={styles.h1}>
              Soyez là
              <span className={styles.h1Accent}>au bon moment</span>
            </h1>
            <p className={styles.lead}>
              Les étudiants du Maghreb et d’Afrique francophone préparent leur arrivée en France avec Dalili. Banque, logement, assurance, école : à chaque étape, ils
              cherchent une solution fiable. Devenez cette solution.
            </p>
            <div className={styles.ctaRow}>
              <a href="#demande" className={`${styles.btn} ${styles.btnPrimary}`}>
                Proposer un partenariat <Arrow />
              </a>
              <a href="mailto:bonjour@dalili.study?subject=Partenariat%20Dalili" className={`${styles.btn} ${styles.btnGhost}`}>
                Écrire à l’équipe
              </a>
            </div>
            <div className={styles.trust}>
              <span>
                <Check /> Partenariats toujours signalés
              </span>
              <span>
                <Check /> Données jamais revendues
              </span>
              <span>
                <Check /> Réponse sous 48 h
              </span>
            </div>
          </div>
          <JourneyVisual />
        </div>
      </header>

      {/* ── Chiffres réels ── */}
      <section className={styles.proof} aria-label="Dalili en chiffres">
        <div className={styles.wrap}>
          <div className={styles.proofGrid}>
            {stats.map(s => (
              <div key={s.label} className={styles.stat}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
          <p className={styles.proofNote}>Trois derniers chiffres : enquête Dalili auprès d’étudiants internationaux.</p>
        </div>
      </section>

      {/* ── Ce que vous y gagnez ── */}
      <section className={styles.section} aria-labelledby="pt-values">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Pourquoi Dalili</span>
            <h2 id="pt-values" className={styles.h2}>
              Une place dans leur parcours, pas une publicité
            </h2>
          </div>
          <div className={styles.values}>
            {values.map((v, i) => (
              <article key={v.title} className={styles.value}>
                <div className={styles.valueNum}>0{i + 1}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.body}>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pour qui ── */}
      <section className={styles.section} aria-labelledby="pt-kinds" style={{ paddingTop: 0 }}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Pour qui</span>
            <h2 id="pt-kinds" className={styles.h2}>
              Chaque étape a son partenaire
            </h2>
            <p className={styles.lead}>Choisissez la vôtre : le formulaire s’ouvre avec votre type d’organisation.</p>
          </div>
          <PartnerKinds />
        </div>
      </section>

      {/* ── Règles du jeu ── */}
      <section className={styles.section} aria-labelledby="pt-rules" style={{ paddingTop: 0 }}>
        <div className={`${styles.wrap} ${styles.rules}`}>
          <div>
            <span className={styles.eyebrow}>Nos règles</span>
            <h2 id="pt-rules" className={styles.h2}>
              La confiance des étudiants ne s’achète pas
            </h2>
            <p className={styles.lead}>C’est elle qui fait la valeur d’un partenariat avec Dalili. Ces règles la protègent, pour eux comme pour vous.</p>
          </div>
          <ul className={styles.ruleList}>
            {rules.map(r => (
              <li key={r.title} className={styles.rule}>
                <span className={styles.ruleIcon}>
                  <Check />
                </span>
                <div>
                  <h3 className={styles.ruleTitle}>{r.title}</h3>
                  <p className={styles.body} style={{ margin: 0 }}>
                    {r.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section className={styles.section} aria-labelledby="pt-steps" style={{ paddingTop: 0 }}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Comment ça marche</span>
            <h2 id="pt-steps" className={styles.h2}>
              Trois étapes, et c’est parti
            </h2>
          </div>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={s.title} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <div className={styles.stepTime}>{s.time}</div>
                <p className={styles.body} style={{ margin: '10px 0 0' }}>
                  {s.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Formulaire ── */}
      <section id="demande" className={styles.formSection} aria-labelledby="pt-form">
        <div className={`${styles.wrap} ${styles.formLayout}`}>
          <div className={styles.aside}>
            <span className={styles.eyebrow}>Parlons-en</span>
            <h2 id="pt-form" className={styles.h2}>
              Proposez votre partenariat
            </h2>
            <p className={styles.lead}>Quelques lignes suffisent. L’équipe lit chaque demande et vous répond personnellement.</p>
            <ol className={styles.next}>
              <li>
                <span>1</span>
                <span>Vous recevez une réponse de l’équipe, en général sous 48 h.</span>
              </li>
              <li>
                <span>2</span>
                <span>On s’appelle pour comprendre votre offre et vos objectifs.</span>
              </li>
              <li>
                <span>3</span>
                <span>On vous propose le format le plus utile aux étudiants.</span>
              </li>
            </ol>
            <a className={styles.mail} href="mailto:bonjour@dalili.study?subject=Partenariat%20Dalili">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              bonjour@dalili.study
            </a>
          </div>
          <div className={styles.card}>
            <PartnerForm />
          </div>
        </div>
      </section>

      {/* ── Questions fréquentes ── */}
      <section className={styles.section} aria-labelledby="pt-faq">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Questions</span>
            <h2 id="pt-faq" className={styles.h2}>
              Ce qu’on nous demande souvent
            </h2>
          </div>
          <div className={styles.faq}>
            {faq.map(f => (
              <details key={f.q} className={styles.faqItem}>
                <summary>
                  {f.q}
                  <span className={styles.faqPlus} aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className={styles.body}>{f.a}</p>
              </details>
            ))}
          </div>
          <p className={styles.body} style={{ marginTop: 28 }}>
            Vous êtes étudiant ou étudiante ? Les guides pratiques sont sur le <Link href="/blog">blog</Link>, et l’équipe reste joignable sur la page{' '}
            <Link href="/contact">contact</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
