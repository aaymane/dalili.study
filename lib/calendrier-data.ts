const SITE = 'https://dalili.study';

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export type Urgence = 'rouge' | 'orange' | 'vert';

export interface CalendrierStep {
  mois:       string;
  action:     string;
  description: string;
  urgence:    Urgence;
  isArrivee?: boolean;
  lien?:      { label: string; url: string };
}

export interface PaysInfo {
  label:   string;
  emoji:   string;
  flag:    string;
  cfLink:  string;
  visaLink: string;
  paysLink: string;
  tcfRequired: boolean;
}

export const PAYS_INFO: Record<string, PaysInfo> = {
  maroc: {
    label: 'Maroc', emoji: '🇲🇦', flag: 'MA',
    cfLink:   `${SITE}/blog/campusfrance-maroc-guide-complet`,
    visaLink: `${SITE}/blog/visa-etudiant-france-maroc-2026`,
    paysLink: `${SITE}/pays/etudier-en-france-depuis-le-maroc`,
    tcfRequired: true,
  },
  algerie: {
    label: 'Algérie', emoji: '🇩🇿', flag: 'DZ',
    cfLink:   `${SITE}/blog/campusfrance-algerie-guide-entretien-2026`,
    visaLink: `${SITE}/blog/visa-etudiant-france-algerie-2026`,
    paysLink: `${SITE}/pays/etudier-en-france-depuis-algerie`,
    tcfRequired: true,
  },
  tunisie: {
    label: 'Tunisie', emoji: '🇹🇳', flag: 'TN',
    cfLink:   `${SITE}/pays/etudier-en-france-depuis-tunisie`,
    visaLink: `${SITE}/blog/visa-etudiant-france-algerie-2026`,
    paysLink: `${SITE}/pays/etudier-en-france-depuis-tunisie`,
    tcfRequired: true,
  },
  senegal: {
    label: 'Sénégal', emoji: '🇸🇳', flag: 'SN',
    cfLink:   `${SITE}/blog/campusfrance-senegal-guide-inscription-dakar`,
    visaLink: `${SITE}/blog/visa-etudiant-france-senegal-2026`,
    paysLink: `${SITE}/pays/etudier-en-france-depuis-senegal`,
    tcfRequired: false,
  },
  'cote-ivoire': {
    label: "Côte d'Ivoire", emoji: '🇨🇮', flag: 'CI',
    cfLink:   `${SITE}/pays/etudier-en-france-depuis-cote-ivoire`,
    visaLink: `${SITE}/pays/etudier-en-france-depuis-cote-ivoire`,
    paysLink: `${SITE}/pays/etudier-en-france-depuis-cote-ivoire`,
    tcfRequired: false,
  },
  cameroun: {
    label: 'Cameroun', emoji: '🇨🇲', flag: 'CM',
    cfLink:   `${SITE}/pays/etudier-en-france-depuis-cameroun`,
    visaLink: `${SITE}/pays/etudier-en-france-depuis-cameroun`,
    paysLink: `${SITE}/pays/etudier-en-france-depuis-cameroun`,
    tcfRequired: false,
  },
  autre: {
    label: 'Autre pays', emoji: '🌍', flag: '',
    cfLink:   `${SITE}/blog`,
    visaLink: `${SITE}/blog`,
    paysLink: `${SITE}/blog`,
    tcfRequired: false,
  },
};

export const RENTREES: Record<string, { label: string; month: number; year: number }> = {
  'septembre-2026': { label: 'Septembre 2026', month: 8, year: 2026 },
  'janvier-2027':   { label: 'Janvier 2027',   month: 0, year: 2027 },
  'septembre-2027': { label: 'Septembre 2027', month: 8, year: 2027 },
};

function monthLabel(base: { month: number; year: number }, offset: number): string {
  let m = base.month + offset;
  let y = base.year;
  while (m < 0)  { m += 12; y--; }
  while (m >= 12){ m -= 12; y++; }
  return `${MONTHS_FR[m]} ${y}`;
}

export function genererCalendrier(pays: string, rentree: string): CalendrierStep[] {
  const info   = PAYS_INFO[pays] ?? PAYS_INFO.autre;
  const target = RENTREES[rentree];
  if (!target) return [];

  const ml = (offset: number) => monthLabel(target, offset);
  const isCEF = info.tcfRequired;

  const COMMUN_POST: CalendrierStep[] = [
    {
      mois: ml(0),
      action: 'Valider le visa OFII',
      description: "Sur ANEF (administration-etrangers-en-france.interieur.gouv.fr). Cette validation est OBLIGATOIRE dans les 3 mois suivant ton arrivée en France.",
      urgence: 'rouge',
      isArrivee: true,
      lien: { label: 'Guide OFII validation visa', url: `${SITE}/blog/ofii-validation-visa-etudiant-france-guide` },
    },
    {
      mois: ml(0),
      action: "S'inscrire à l'Assurance Maladie",
      description: "Sur ameli.fr dès ton arrivée. Délai pour obtenir ton numéro de sécurité sociale : 2 à 4 mois. Ne tarde pas.",
      urgence: 'rouge',
      lien: { label: 'Guide sécurité sociale étudiant', url: `${SITE}/blog/securite-sociale-complementaire-sante-solidaire-etudiant-etranger` },
    },
    {
      mois: ml(1),
      action: 'Demander la CAF',
      description: "Sur caf.fr dès le premier jour dans ton logement. L'aide est rétroactive seulement sur 3 mois — ne rate pas cette fenêtre.",
      urgence: 'orange',
      lien: { label: 'Guide CAF étudiant étranger', url: `${SITE}/blog/caf-etudiant-etranger-delais-documents-erreurs` },
    },
    {
      mois: ml(2),
      action: 'Ouvrir un compte bancaire français',
      description: "BNP, Société Générale ou Boursobank. Indispensable pour recevoir la CAF et payer ton loyer en France.",
      urgence: 'vert',
      lien: { label: 'Guide compte bancaire étudiant', url: `${SITE}/blog/ouvrir-compte-bancaire-etudiant-etranger-2026` },
    },
    {
      mois: ml(3),
      action: 'Choisir un médecin traitant',
      description: "Sur Doctolib.fr. Obligatoire pour être remboursé à 70 % par la Sécurité Sociale. Un médecin proche de ton logement est idéal.",
      urgence: 'vert',
    },
  ];

  const COMMUN_PRE_END: CalendrierStep[] = [
    {
      mois: ml(-4),
      action: 'Demander un logement CROUS',
      description: "Le DSE (Dossier Social Étudiant) ouvre en janvier et ferme en mai. Si c'est trop tard, opte pour Studapart ou HousingAnywhere.",
      urgence: 'rouge',
      lien: { label: 'Guide logement CROUS', url: `${SITE}/blog/logement-crous-etudiant-etranger-demande` },
    },
    {
      mois: ml(-3),
      action: 'Obtenir le visa + ouvrir un compte bancaire en ligne',
      description: "Ouvre Revolut ou Wise avant de partir — tu en auras besoin dès l'arrivée à l'aéroport pour tes premières dépenses.",
      urgence: 'orange',
      lien: { label: 'Guide compte bancaire', url: `${SITE}/blog/ouvrir-compte-bancaire-etudiant-etranger-2026` },
    },
    {
      mois: ml(-2),
      action: 'Préparer les documents d\'arrivée',
      description: "Rassemble : passeport, visa, lettre d'admission, justificatif de logement et assurance santé pour les 3 premiers mois.",
      urgence: 'orange',
      lien: { label: 'Checklist PDF DALILI', url: `${SITE}/checklist` },
    },
    {
      mois: ml(-1),
      action: 'Trouver un logement définitif',
      description: "Si le CROUS est refusé, cherche une colocation ou une résidence privée. Pense à VISALE pour obtenir un garant gratuitement.",
      urgence: 'vert',
      lien: { label: 'Guide garant logement VISALE', url: `${SITE}/blog/logement-crous-etudiant-etranger-demande` },
    },
  ];

  if (isCEF) {
    return [
      {
        mois: ml(-8),
        action: 'Préparer le TCF',
        description: "Inscris-toi dans un centre agréé et commence la préparation. Score B2 minimum requis pour Campus France (certains programmes exigent C1).",
        urgence: 'vert',
        lien: { label: 'Guide TCF 2026 — préparation', url: `${SITE}/blog/comment-preparer-tcf-30-jours-etudiant-maroc` },
      },
      {
        mois: ml(-7),
        action: 'Passer le TCF',
        description: "Les résultats arrivent en 2 à 4 semaines. Ton score doit être obtenu AVANT de soumettre ton dossier Campus France.",
        urgence: 'vert',
        lien: { label: 'Calendrier TCF 2026', url: `${SITE}/blog/calendrier-tcf-maroc-2026-dates-sessions` },
      },
      {
        mois: ml(-6),
        action: 'Ouvrir le dossier Campus France',
        description: `Crée ton compte sur le site Campus France de ton pays. Saisis tes formations (jusqu'à 12 choix). Sois précis dans ton projet d'études.`,
        urgence: 'orange',
        lien: { label: 'Guide Campus France', url: info.cfLink },
      },
      {
        mois: ml(-5),
        action: 'Passer l\'entretien Campus France',
        description: "Convocation dans les 2 à 6 semaines après soumission du dossier. Prépare ton projet d'études et professionnel avec précision.",
        urgence: 'orange',
        lien: { label: 'Guide entretien Campus France', url: info.cfLink },
      },
      {
        mois: ml(-4),
        action: 'Déposer le visa au consulat',
        description: "Après l'avis favorable Campus France, prends rendez-vous au consulat. Délai de traitement : 3 à 6 semaines.",
        urgence: 'rouge',
        lien: { label: 'Guide visa étudiant France', url: info.visaLink },
      },
      ...COMMUN_PRE_END,
      ...COMMUN_POST,
    ];
  }

  return [
    {
      mois: ml(-6),
      action: 'Contacter Campus France',
      description: "Prends contact avec le bureau Campus France de ton pays. Renseigne-toi sur les délais spécifiques à ta nationalité.",
      urgence: 'orange',
      lien: { label: `Guide Campus France — ${info.label}`, url: info.cfLink },
    },
    {
      mois: ml(-5),
      action: 'Constituer le dossier Campus France',
      description: "Rassemble : relevés de notes, diplômes, lettre de motivation, CV. Saisis tes vœux de formation (jusqu'à 12 choix).",
      urgence: 'orange',
      lien: { label: 'Guide Campus France', url: info.cfLink },
    },
    {
      mois: ml(-4),
      action: 'Déposer le visa au consulat',
      description: `Délai de traitement pour ${info.label} : 4 à 8 semaines. Ne tarde pas — les délais consulaires varient et peuvent être plus longs.`,
      urgence: 'rouge',
      lien: { label: `Guide visa France — ${info.label}`, url: info.visaLink },
    },
    ...COMMUN_PRE_END,
    ...COMMUN_POST,
  ];
}
