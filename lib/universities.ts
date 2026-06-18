export interface University {
  slug: string;
  name: string;
  city: string;
  region: string;
  type: string;
  students: number;
  internationalStudents: number;
  tuitionLicence: number;
  tuitionMaster: number;
  popularPrograms: string[];
  costCrous: string;
  costPrivate: string;
  costTransport: string;
  costFood: string;
  monthlyBudgetMin: number;
  monthlyBudgetMax: number;
  pros: string[];
  cons: string[];
  avis: string;
  websiteUrl: string;
  crousUrl: string;
  campusFranceUrl: string;
  relatedArticles: { slug: string; title: string }[];
  thumbnail: string;
}

export const UNIVERSITIES: Record<string, University> = {
  'universite-de-bordeaux': {
    slug: 'universite-de-bordeaux',
    name: 'Université de Bordeaux',
    city: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    type: 'Université publique',
    students: 54000,
    internationalStudents: 6500,
    tuitionLicence: 2770,
    tuitionMaster: 3770,
    popularPrograms: [
      'Droit et sciences politiques',
      'Sciences économiques et gestion',
      'Médecine et pharmacie',
      'Informatique et mathématiques',
      'Psychologie',
      'Sciences humaines et sociales',
    ],
    costCrous: '180–380 €/mois',
    costPrivate: '490–750 €/mois',
    costTransport: '25 €/mois (TBM)',
    costFood: '80–200 €/mois (RU à 1€)',
    monthlyBudgetMin: 650,
    monthlyBudgetMax: 1100,
    pros: [
      'Grande ville dynamique avec une vie étudiante très active',
      'Réputation internationale solide, notamment en droit et médecine',
      'Proche de l\'océan Atlantique et des plages (30 min en vélo)',
      'Réseau TBM bien développé, vélos à 25€/mois',
      'Nombreuses associations étudiantes et événements culturels',
      'Bonne liaison TGV avec Paris (2h)',
    ],
    cons: [
      'Marché locatif de plus en plus tendu — loyers en forte hausse depuis 2020',
      'Campus Victoire et Carreire éloignés du campus Pessac central',
      'Délais CROUS pour obtenir une chambre parmi les plus longs de France',
    ],
    avis: "Bordeaux est l'une des meilleures villes universitaires françaises pour les étudiants maghrébins. La ville est jeune (40% de la population a moins de 35 ans), bien connectée et moins chère que Paris. Pour le logement, commencez la demande CROUS en janvier — les places partent vite. Si vous êtes en droit ou en gestion, l'Université de Bordeaux est un choix solide avec une vraie reconnaissance internationale.",
    websiteUrl: 'https://www.u-bordeaux.fr',
    crousUrl: 'https://www.crous-bordeaux.fr',
    campusFranceUrl: 'https://www.campusfrance.org',
    relatedArticles: [
      { slug: 'trouver-logement-france-depuis-etranger', title: 'Trouver un logement en France depuis l\'étranger' },
      { slug: 'budget-mensuel-etudiant-etranger-france-2026', title: 'Budget étudiant étranger en France 2026' },
    ],
    thumbnail: '/images/universites/bordeaux.webp',
  },

  'universite-de-nantes': {
    slug: 'universite-de-nantes',
    name: 'Nantes Université',
    city: 'Nantes',
    region: 'Pays de la Loire',
    type: 'Université publique',
    students: 45000,
    internationalStudents: 4800,
    tuitionLicence: 2770,
    tuitionMaster: 3770,
    popularPrograms: [
      'Sciences de l\'ingénieur',
      'Médecine et santé',
      'Sciences économiques',
      'Droit',
      'Langues et littératures',
    ],
    costCrous: '180–350 €/mois',
    costPrivate: '440–680 €/mois',
    costTransport: '22 €/mois (TAN)',
    costFood: '80–190 €/mois',
    monthlyBudgetMin: 620,
    monthlyBudgetMax: 1000,
    pros: [
      'Ville très agréable et bien organisée',
      'Coût de la vie plus abordable qu\'à Bordeaux',
      'Tissu économique dynamique (Airbus, biotechs)',
    ],
    cons: [
      'Moins connue à l\'international que Paris ou Lyon',
      'Météo pluvieuse',
    ],
    avis: 'Nantes est une très bonne option pour un budget maîtrisé avec un niveau de vie agréable. La ville se développe rapidement et le tissu économique local ouvre de bonnes perspectives d\'alternance et d\'emploi.',
    websiteUrl: 'https://www.univ-nantes.fr',
    crousUrl: 'https://www.crous-nantes.fr',
    campusFranceUrl: 'https://www.campusfrance.org',
    relatedArticles: [
      { slug: 'budget-mensuel-etudiant-etranger-france-2026', title: 'Budget étudiant étranger en France 2026' },
    ],
    thumbnail: '/images/universites/nantes.webp',
  },

  'universite-de-lille': {
    slug: 'universite-de-lille',
    name: 'Université de Lille',
    city: 'Lille',
    region: 'Hauts-de-France',
    type: 'Université publique',
    students: 75000,
    internationalStudents: 7000,
    tuitionLicence: 2770,
    tuitionMaster: 3770,
    popularPrograms: [
      'Médecine',
      'Droit',
      'Sciences et technologies',
      'Lettres et sciences humaines',
      'Sciences économiques',
    ],
    costCrous: '160–320 €/mois',
    costPrivate: '380–600 €/mois',
    costTransport: '28 €/mois (Ilevia)',
    costFood: '80–180 €/mois',
    monthlyBudgetMin: 580,
    monthlyBudgetMax: 950,
    pros: [
      'L\'une des plus grandes universités de France',
      'Loyers parmi les plus abordables des grandes villes',
      'Excellent réseau de transport (métro automatique)',
      'Proximité avec Paris (55 min en TGV), Bruxelles et Londres',
    ],
    cons: [
      'Ville parfois sous-estimée par les étudiants étrangers',
      'Météo nordique (pluie et grisaille fréquents)',
    ],
    avis: 'Lille est la grande surprise des villes universitaires françaises. Loyers bas, métro efficace, ville étudiante animée et connections vers Paris, Bruxelles et Londres. Idéale pour les étudiants à petit budget qui veulent rester bien connectés.',
    websiteUrl: 'https://www.univ-lille.fr',
    crousUrl: 'https://www.crous-lille.fr',
    campusFranceUrl: 'https://www.campusfrance.org',
    relatedArticles: [
      { slug: 'trouver-logement-france-depuis-etranger', title: 'Trouver un logement en France depuis l\'étranger' },
    ],
    thumbnail: '/images/universites/lille.webp',
  },

  'sorbonne-universite': {
    slug: 'sorbonne-universite',
    name: 'Sorbonne Université',
    city: 'Paris',
    region: 'Île-de-France',
    type: 'Université publique',
    students: 55000,
    internationalStudents: 10000,
    tuitionLicence: 2770,
    tuitionMaster: 3770,
    popularPrograms: [
      'Lettres et sciences humaines',
      'Sciences et ingénierie (Jussieu)',
      'Médecine',
      'Histoire et géographie',
      'Philosophie',
    ],
    costCrous: '280–500 €/mois',
    costPrivate: '750–1200 €/mois',
    costTransport: '29 €/mois (Carte Imagine R)',
    costFood: '80–250 €/mois',
    monthlyBudgetMin: 900,
    monthlyBudgetMax: 1800,
    pros: [
      'Prestige international inégalé',
      'Campus en plein Quartier Latin (5e arrondissement)',
      'Accès aux ressources culturelles parisiennes (musées gratuits -26 ans)',
      'Réseau alumni mondial',
    ],
    cons: [
      'Logement extrêmement difficile à trouver — places CROUS très rares',
      'Budget mensuel parmi les plus élevés de France',
      'Certains campus (Jussieu) peu esthétiques',
    ],
    avis: 'La Sorbonne ouvre des portes inégalées — mais le coût de Paris est réel. Prévoyez 3 mois de réserve à l\'arrivée, commencez la recherche de logement 6 mois avant et considérez les arrondissements périphériques (18e, 19e, 20e) ou la banlieue proche.',
    websiteUrl: 'https://www.sorbonne-universite.fr',
    crousUrl: 'https://www.crous-paris.fr',
    campusFranceUrl: 'https://www.campusfrance.org',
    relatedArticles: [
      { slug: 'etudier-paris-etudiant-etranger-guide', title: 'Étudier à Paris en tant qu\'étudiant étranger' },
      { slug: 'budget-mensuel-etudiant-etranger-france-2026', title: 'Budget étudiant étranger en France 2026' },
    ],
    thumbnail: '/images/universites/sorbonne.webp',
  },
};

export function getUniversity(slug: string): University | null {
  return UNIVERSITIES[slug] ?? null;
}

export function getAllUniversitySlugs(): string[] {
  return Object.keys(UNIVERSITIES);
}
