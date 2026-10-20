// Simulateur de budget : données et formule partagées par la page /simulateur,
// l'API de contenu (/api/content/v1/tools.json) et l'app mobile.
// Une seule formule : si tu modifies un chiffre ici, la page et l'app suivent.
// Les montants réglementaires viennent de lib/data/regulatory-figures.ts.

import { REGULATORY_FIGURES, getTierAt } from '@/lib/data/regulatory-figures';

export type CityData = {
  slug: string; name: string;
  crous: [number, number]; coloc: [number, number];
  studio: [number, number]; habitant: [number, number];
  transport: number; food: number;
};

export const CITIES: CityData[] = [
  { slug: 'etudier-a-bordeaux',         name: 'Bordeaux',         crous: [180,380], coloc: [350,520], studio: [490,750],  habitant: [290,430], transport: 25, food: 260 },
  { slug: 'etudier-a-paris',            name: 'Paris',            crous: [280,500], coloc: [600,950], studio: [950,1500], habitant: [500,750], transport: 29, food: 350 },
  { slug: 'etudier-a-nantes',           name: 'Nantes',           crous: [180,350], coloc: [320,490], studio: [440,680],  habitant: [270,400], transport: 22, food: 220 },
  { slug: 'etudier-a-lyon',             name: 'Lyon',             crous: [200,400], coloc: [380,560], studio: [520,800],  habitant: [320,480], transport: 30, food: 260 },
  { slug: 'etudier-a-toulouse',         name: 'Toulouse',         crous: [200,400], coloc: [350,520], studio: [480,700],  habitant: [300,450], transport: 28, food: 230 },
  { slug: 'etudier-a-marseille',        name: 'Marseille',        crous: [180,380], coloc: [350,520], studio: [480,700],  habitant: [290,440], transport: 30, food: 250 },
  { slug: 'etudier-a-nice',             name: 'Nice',             crous: [200,420], coloc: [450,650], studio: [600,900],  habitant: [390,580], transport: 30, food: 290 },
  { slug: 'etudier-a-rennes',           name: 'Rennes',           crous: [180,370], coloc: [320,470], studio: [430,620],  habitant: [270,400], transport: 26, food: 210 },
  { slug: 'etudier-a-grenoble',         name: 'Grenoble',         crous: [180,380], coloc: [330,500], studio: [450,650],  habitant: [280,420], transport: 28, food: 220 },
  { slug: 'etudier-a-clermont-ferrand', name: 'Clermont-Ferrand', crous: [150,320], coloc: [270,400], studio: [350,520],  habitant: [220,340], transport: 22, food: 200 },
  { slug: 'etudier-a-montpellier',      name: 'Montpellier',      crous: [180,380], coloc: [360,530], studio: [500,720],  habitant: [300,450], transport: 26, food: 240 },
  { slug: 'etudier-a-strasbourg',       name: 'Strasbourg',       crous: [190,380], coloc: [340,500], studio: [480,680],  habitant: [290,430], transport: 29, food: 240 },
  { slug: 'etudier-a-lille',            name: 'Lille',            crous: [170,360], coloc: [310,460], studio: [420,620],  habitant: [260,390], transport: 27, food: 210 },
  { slug: 'etudier-a-dijon',            name: 'Dijon',            crous: [170,340], coloc: [290,430], studio: [380,550],  habitant: [240,360], transport: 24, food: 200 },
];

export const mid = (range: [number, number]) => Math.round((range[0] + range[1]) / 2);

// Sourced from lib/data/regulatory-figures.ts — the single source of truth for
// these amounts. `new Date()` is evaluated client-side at render (this file is
// 'use client'), so a future tier (e.g. a new CVEC amount) takes effect for
// visitors automatically once its validFrom date is reached, no redeploy needed.
export const tuitionFigures = {
  licence:  getTierAt(REGULATORY_FIGURES.fraisScolariteLicence),
  master:   getTierAt(REGULATORY_FIGURES.fraisScolariteMaster),
  doctorat: getTierAt(REGULATORY_FIGURES.fraisScolariteDoctorat),
};
export const TUITION_ANNUAL: Record<string, number> = {
  licence:  tuitionFigures.licence.value,
  master:   tuitionFigures.master.value,
  doctorat: tuitionFigures.doctorat.value,
};
export const cvecTier = getTierAt(REGULATORY_FIGURES.cvec);
export const CVEC_ANNUAL = cvecTier.value;
export const TUITION_MONTHLY_12: Record<string, number> = {
  licence:  Math.round(tuitionFigures.licence.value / 12),
  master:   Math.round(tuitionFigures.master.value / 12),
  doctorat: Math.round(tuitionFigures.doctorat.value / 12),
};

export const CAF_ESTIMATE: Record<string, { min: number; max: number }> = {
  crous:    { min: 150, max: 200 },
  coloc:    { min: 100, max: 180 },
  studio:   { min: 80,  max: 200 },
  habitant: { min: 0,   max: 80  },
};

// Depuis le 1er juillet 2026, l'APL/ALS n'est plus accessible de droit commun aux
// étudiants hors UE/EEE/Suisse — seuls bcs/alternance/salarie ouvrent ce droit
// (loi n° 2026-103 du 19 février 2026, art. 179). Eiffel/BGF/bourse pays d'origine
// ne suffisent pas seules : voir /blog/reforme-apl-etudiant-etranger-2026.
export const CAF_ELIGIBLE_BOURSE = new Set(['bcs', 'alternance', 'salarie']);

/** Postes fixes mensuels : téléphone 30 € + loisirs, divers et santé 100 €. */
export const FIXED_MONTHLY = { phone: 30, misc: 100 } as const;

/** Économies mensuelles moyennes comptées dans le budget « net ». */
export const SAVINGS = {
  /** Repas RU à 1 € depuis le 4 mai 2026 : 30 repas, contre ~99 € à 3,30 €. */
  ruMeals: 70,
  /** Abonnement transport étudiant : environ −50 %. */
  transportRate: 0.5,
  /** CSS (complémentaire santé solidaire) : sous conditions de ressources. */
  css: 40,
} as const;

export type Housing = 'crous' | 'coloc' | 'studio' | 'habitant';
export type Level = 'licence' | 'master' | 'doctorat';
/** Situation déclarée : seules bcs, alternance et salarie ouvrent l'APL hors UE depuis le 1/07/2026. */
export type Situation = 'bcs' | 'alternance' | 'salarie' | 'autre_bourse' | 'aucune';

export interface BudgetInput {
  city: string;
  housing: Housing;
  level: Level;
  monthlyTuition: boolean;
  situation: Situation;
}

export interface BudgetResult {
  housing: number;
  food: number;
  transport: number;
  fixed: number;
  tuitionMonthly: number;
  tuitionAnnual: number;
  cvec: number;
  /** Total mensuel brut (sans aucune aide). */
  gross: number;
  aplEligible: boolean;
  aplMin: number;
  aplMax: number;
  aplMid: number;
  /** Brut − APL estimée (0 si non éligible). */
  afterApl: number;
  /** Brut − APL − repas RU − transport réduit − CSS. */
  net: number;
}

/** Formule de référence : même calcul que la page /simulateur. */
export function computeBudget(input: BudgetInput): BudgetResult | null {
  const city = CITIES.find(c => c.slug === input.city);
  if (!city) return null;
  const housing = mid(city[input.housing]);
  const fixed = FIXED_MONTHLY.phone + FIXED_MONTHLY.misc;
  const tuitionAnnual = TUITION_ANNUAL[input.level] ?? 0;
  const tuitionMonthly = input.monthlyTuition ? TUITION_MONTHLY_12[input.level] ?? 0 : 0;
  const gross = housing + city.transport + city.food + fixed + tuitionMonthly;
  const aplEligible = CAF_ELIGIBLE_BOURSE.has(input.situation);
  const aplMin = aplEligible ? CAF_ESTIMATE[input.housing]?.min ?? 0 : 0;
  const aplMax = aplEligible ? CAF_ESTIMATE[input.housing]?.max ?? 0 : 0;
  const aplMid = Math.round((aplMin + aplMax) / 2);
  const savings = aplMid + SAVINGS.ruMeals + Math.round(city.transport * SAVINGS.transportRate) + SAVINGS.css;
  return {
    housing,
    food: city.food,
    transport: city.transport,
    fixed,
    tuitionMonthly,
    tuitionAnnual,
    cvec: CVEC_ANNUAL,
    gross,
    aplEligible,
    aplMin,
    aplMax,
    aplMid,
    afterApl: Math.max(0, gross - aplMid),
    net: Math.max(0, gross - savings),
  };
}
