export interface City {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  population: number;
  students: number;
  costCrous: string;
  costStudio: string;
  costColoc: string;
  costTransport: string;
  monthlyBudgetMin: number;
  monthlyBudgetMax: number;
  universities: { name: string; slug: string }[];
  neighborhoods: { name: string; description: string }[];
  pros: string[];
  cons: string[];
  avis: string;
  crousUrl: string;
  prefectureUrl: string;
  transportUrl: string;
  transportName: string;
  cafUrl: string;
  relatedArticles: { slug: string; title: string }[];
}

export const CITIES: Record<string, City> = {
  'etudier-a-bordeaux': {
    slug: 'etudier-a-bordeaux',
    name: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    tagline: 'La ville des vins, du surf et de l\'art de vivre',
    population: 260000,
    students: 100000,
    costCrous: '180–380 €/mois',
    costStudio: '490–750 €/mois',
    costColoc: '350–520 €/mois',
    costTransport: '25 €/mois',
    monthlyBudgetMin: 650,
    monthlyBudgetMax: 1100,
    universities: [
      { name: 'Université de Bordeaux', slug: 'universite-de-bordeaux' },
      { name: 'Sciences Po Bordeaux', slug: 'sciences-po-bordeaux' },
      { name: 'KEDGE Business School', slug: 'kedge-business-school' },
    ],
    neighborhoods: [
      {
        name: 'Victoire / Saint-Michel',
        description: 'Le quartier étudiant historique. Bars, restaurants bon marché, marché du mardi et vendredi. Loyers corrects mais en hausse. Idéal pour les étudiants en droit et lettres (campus Victoire à 5 min à pied).',
      },
      {
        name: 'Talence / Pessac',
        description: 'La banlieue universitaire. Le campus principal de l\'Université de Bordeaux est ici. Loyers plus bas qu\'en centre-ville, résidences CROUS nombreuses, tramway A direct vers le centre (20 min).',
      },
      {
        name: 'Bacalan / Darwin',
        description: 'Quartier branché en pleine gentrification sur la Rive Gauche. Nombreux espaces de coworking, startup, café culturel Darwin. Loyers encore accessibles mais qui montent rapidement.',
      },
    ],
    pros: [
      'Qualité de vie exceptionnelle : océan à 45 min, campagne, gastronomie',
      'Ville à taille humaine mais avec une vraie vie culturelle',
      'Réseau de tramway (TBM) très efficace, vélos et trottinettes partout',
      'Forte économie locale : aéronautique, vins, numérique, santé',
      'Nombreuses associations et événements étudiants tout au long de l\'année',
    ],
    cons: [
      'Marché immobilier tendu : les loyers ont augmenté de 30% en 5 ans',
      'Places CROUS très demandées — délais d\'obtention parmi les plus longs',
      'Coût du logement privé s\'approche de Lyon sur certains quartiers',
    ],
    avis: "Bordeaux est la destination idéale pour les étudiants maghrébins qui veulent un cadre de vie exceptionnel sans payer le prix de Paris. La ville est jeune, ouverte, bien connectée. Pour réussir votre installation : faites le DSE CROUS en janvier, préparez DossierFacile dès votre admission et abonnez-vous au TBM avant même d'arriver.",
    crousUrl: 'https://www.crous-bordeaux.fr',
    prefectureUrl: 'https://www.gironde.gouv.fr/Prefectures-et-sous-prefectures/Prefecture',
    transportUrl: 'https://www.infotbm.com',
    transportName: 'TBM (Tramway + Bus)',
    cafUrl: 'https://www.caf.fr/allocataires/caf-de-la-gironde',
    relatedArticles: [
      { slug: 'trouver-logement-france-depuis-etranger', title: 'Trouver un logement en France depuis l\'étranger' },
      { slug: 'budget-mensuel-etudiant-etranger-france-2026', title: 'Budget mensuel étudiant étranger 2026' },
    ],
  },

  'etudier-a-paris': {
    slug: 'etudier-a-paris',
    name: 'Paris',
    region: 'Île-de-France',
    tagline: 'La capitale mondiale du savoir — et la plus chère',
    population: 2161000,
    students: 700000,
    costCrous: '280–500 €/mois',
    costStudio: '950–1500 €/mois',
    costColoc: '600–950 €/mois',
    costTransport: '29 €/mois',
    monthlyBudgetMin: 1000,
    monthlyBudgetMax: 1900,
    universities: [
      { name: 'Sorbonne Université', slug: 'sorbonne-universite' },
      { name: 'Sciences Po Paris', slug: 'sciences-po-paris' },
      { name: 'Paris Cité', slug: 'universite-paris-cite' },
    ],
    neighborhoods: [
      {
        name: '18e / 19e / 20e arrondissement',
        description: 'Les arrondissements les moins chers de Paris intramuros. Loyers 20-30% moins élevés que le centre, bonne desserte métro. Quartiers populaires mais bien reliés à tout Paris.',
      },
      {
        name: 'Banlieue proche (Ivry, Montreuil, Saint-Denis)',
        description: 'Encore 20-30% moins cher que les arrondissements périphériques. Lignes de métro directes vers le centre en 20-30 min. Option recommandée pour les étudiants à budget serré.',
      },
      {
        name: '5e / 6e arrondissement (Quartier Latin)',
        description: 'Le quartier universitaire historique (Sorbonne, ENS). Prestige maximal mais loyers très élevés. Peu accessible pour un étudiant sans bourse ou sans parents cosignataires.',
      },
    ],
    pros: [
      'Musées nationaux gratuits pour les moins de 26 ans résidant en France',
      'Concentration d\'établissements d\'excellence mondiale',
      'Vie culturelle, réseau professionnel et opportunités uniques',
      'Carte Imagine R : toute l\'Île-de-France pour ~29€/mois',
      'Réseau de transport en commun exceptionnel (métro, RER, bus, tramway)',
    ],
    cons: [
      'Logement très difficile à trouver : CROUS saturé, marché privé brutal',
      'Budget mensuel 40-70% plus élevé que la province',
      'Stress et rythme de vie épuisant pour les étudiants primo-arrivants',
      'Beaucoup d\'universités "parisiennes" ont leurs campus en banlieue (Saclay, Créteil)',
    ],
    avis: "Paris vaut le coup si votre formation l'exige : droit, finance, sciences politiques, création. Sinon, des villes comme Lyon, Bordeaux ou Lille offrent une qualité de vie supérieure pour un budget bien inférieur. Si vous choisissez Paris : logement CROUS en janvier, budget 3 mois de réserve, et prévoyez la banlieue proche pour les loyers.",
    crousUrl: 'https://www.crous-paris.fr',
    prefectureUrl: 'https://www.prefecturedepolice.interieur.gouv.fr',
    transportUrl: 'https://www.iledefrance-mobilites.fr',
    transportName: 'RATP / Île-de-France Mobilités',
    cafUrl: 'https://www.caf.fr/allocataires/caf-de-paris',
    relatedArticles: [
      { slug: 'etudier-paris-etudiant-etranger-guide', title: 'Étudier à Paris en tant qu\'étudiant étranger' },
      { slug: 'trouver-logement-france-depuis-etranger', title: 'Trouver un logement depuis l\'étranger' },
    ],
  },

  'etudier-a-nantes': {
    slug: 'etudier-a-nantes',
    name: 'Nantes',
    region: 'Pays de la Loire',
    tagline: 'La ville des arts et des ingénieurs',
    population: 320000,
    students: 65000,
    costCrous: '180–350 €/mois',
    costStudio: '440–680 €/mois',
    costColoc: '320–490 €/mois',
    costTransport: '22 €/mois',
    monthlyBudgetMin: 600,
    monthlyBudgetMax: 980,
    universities: [
      { name: 'Nantes Université', slug: 'universite-de-nantes' },
      { name: 'Audencia Business School', slug: 'audencia-nantes' },
    ],
    neighborhoods: [
      {
        name: 'Île de Nantes',
        description: 'Quartier de réhabilitation industrielle devenu culturel et innovant. Beaucoup de logements étudiants en résidence privée, accès tramway direct.',
      },
      {
        name: 'Chantenay / Bellevue',
        description: 'Quartiers résidentiels avec loyers corrects et bonne desserte BusWay. Populaire chez les étudiants cherchant du calme.',
      },
      {
        name: 'Centre-ville',
        description: 'Commercial, animé, bien connecté. Loyers plus élevés mais proximité de tout.',
      },
    ],
    pros: [
      'Coût de la vie plus bas que Bordeaux ou Lyon',
      'Tissu économique fort (aéronautique Airbus, numérique, design)',
      'Ville très verte et qualité de vie reconnue',
    ],
    cons: [
      'Moins connue à l\'international',
      'Météo pluvieuse (120 jours de pluie/an en moyenne)',
    ],
    avis: 'Nantes est une excellente option pour un budget maîtrisé et une vie de qualité. Particulièrement adaptée pour les ingénieurs, designers et économistes. La ville se développe rapidement et le marché de l\'emploi local est dynamique.',
    crousUrl: 'https://www.crous-nantes.fr',
    prefectureUrl: 'https://www.loire-atlantique.gouv.fr',
    transportUrl: 'https://www.tan.fr',
    transportName: 'TAN (Tramway, Bus, BusWay)',
    cafUrl: 'https://www.caf.fr/allocataires/caf-de-la-loire-atlantique',
    relatedArticles: [
      { slug: 'budget-mensuel-etudiant-etranger-france-2026', title: 'Budget mensuel étudiant étranger 2026' },
    ],
  },

  'etudier-a-lyon': {
    slug: 'etudier-a-lyon',
    name: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    tagline: 'La capitale de la gastronomie et de la recherche',
    population: 522000,
    students: 160000,
    costCrous: '200–400 €/mois',
    costStudio: '520–800 €/mois',
    costColoc: '380–560 €/mois',
    costTransport: '30 €/mois',
    monthlyBudgetMin: 700,
    monthlyBudgetMax: 1200,
    universities: [
      { name: 'Université Lyon 1 (Claude Bernard)', slug: 'universite-lyon-1' },
      { name: 'Université Lyon 2 (Lumière)', slug: 'universite-lyon-2' },
      { name: 'Sciences Po Lyon', slug: 'sciences-po-lyon' },
    ],
    neighborhoods: [
      {
        name: 'Part-Dieu / Guillotière',
        description: 'Centre économique et étudiant de Lyon. Transport exceptionnel, nombreux commerces. Loyers moyens mais accessibles.',
      },
      {
        name: 'Villeurbanne',
        description: 'Commune adjacente très étudiante (INSA, Université Lyon 1). Loyers 15-20% moins chers que Lyon intramuros, excellente desserte tramway.',
      },
      {
        name: 'Bron / Vaulx-en-Velin',
        description: 'Banlieue est bien desservie en métro. Loyers très accessibles, campus universitaires à proximité.',
      },
    ],
    pros: [
      'Deuxième pôle universitaire et de recherche de France après Paris',
      'Gastronomie exceptionnelle même à petit budget (bouchons lyonnais)',
      'Position géographique idéale (Paris 2h TGV, mer 1h30 en voiture)',
      'Fort tissu de grandes entreprises (Sanofi, Bosch, Renault Trucks)',
    ],
    cons: [
      'Marché locatif très tendu sur les quartiers centraux',
      'Pollution de l\'air en hiver (vallée encaissée)',
    ],
    avis: 'Lyon est la ville idéale pour les étudiants en médecine, sciences, droit ou économie qui cherchent un environnement sérieux avec une qualité de vie excellente. Moins glamour que Paris mais nettement plus praticable et moins chère.',
    crousUrl: 'https://www.crous-lyon.fr',
    prefectureUrl: 'https://www.rhone.gouv.fr',
    transportUrl: 'https://www.tcl.fr',
    transportName: 'TCL (Métro, Tram, Bus, Funiculaire)',
    cafUrl: 'https://www.caf.fr/allocataires/caf-du-rhone',
    relatedArticles: [
      { slug: 'budget-mensuel-etudiant-etranger-france-2026', title: 'Budget mensuel étudiant étranger 2026' },
      { slug: 'trouver-logement-france-depuis-etranger', title: 'Trouver un logement depuis l\'étranger' },
    ],
  },
};

export function getCity(slug: string): City | null {
  return CITIES[slug] ?? null;
}

export function getAllCitySlugs(): string[] {
  return Object.keys(CITIES);
}
