// Score data for each city — all scores out of 5 (increments of 0.5)

export interface CityScores {
  budget:     number; // inversely proportional to monthlyBudgetMin
  emploi:     number; // job market richness & internship opportunities
  communaute: number; // Maghrebi/African community size & integration
  meteo:      number; // climate quality & outdoor life
  transport:  number; // public transit network density
}

export const CITY_SCORES: Record<string, CityScores> = {
  'etudier-a-clermont-ferrand': { budget: 5,   emploi: 3,   communaute: 2,   meteo: 3,   transport: 2.5 },
  'etudier-a-dijon':            { budget: 4.5, emploi: 2,   communaute: 2,   meteo: 2.5, transport: 3   },
  'etudier-a-nantes':           { budget: 4.5, emploi: 3.5, communaute: 2.5, meteo: 2.5, transport: 4   },
  'etudier-a-rennes':           { budget: 4.5, emploi: 3.5, communaute: 2,   meteo: 2,   transport: 4   },
  'etudier-a-lille':            { budget: 4.5, emploi: 3.5, communaute: 4,   meteo: 1.5, transport: 4   },
  'etudier-a-grenoble':         { budget: 4,   emploi: 4.5, communaute: 2.5, meteo: 3.5, transport: 4   },
  'etudier-a-bordeaux':         { budget: 4,   emploi: 4,   communaute: 3,   meteo: 4.5, transport: 4   },
  'etudier-a-toulouse':         { budget: 4,   emploi: 5,   communaute: 5,   meteo: 4.5, transport: 3.5 },
  'etudier-a-montpellier':      { budget: 4,   emploi: 3,   communaute: 4.5, meteo: 5,   transport: 4   },
  'etudier-a-strasbourg':       { budget: 4,   emploi: 4,   communaute: 3.5, meteo: 2.5, transport: 4   },
  'etudier-a-marseille':        { budget: 4,   emploi: 3.5, communaute: 5,   meteo: 5,   transport: 3   },
  'etudier-a-lyon':             { budget: 3.5, emploi: 5,   communaute: 3,   meteo: 3.5, transport: 4.5 },
  'etudier-a-nice':             { budget: 3,   emploi: 3,   communaute: 3,   meteo: 5,   transport: 3   },
  'etudier-a-paris':            { budget: 1.5, emploi: 5,   communaute: 4.5, meteo: 2.5, transport: 5   },
};

export function totalScore(scores: CityScores): number {
  return scores.budget + scores.emploi + scores.communaute + scores.meteo + scores.transport;
}

export function getScores(slug: string): CityScores {
  return CITY_SCORES[slug] ?? { budget: 3, emploi: 3, communaute: 3, meteo: 3, transport: 3 };
}

// Recommendation logic — returns best city slug from a selection
export function recommander(selectedSlugs: string[]): string {
  if (selectedSlugs.length === 0) return '';
  return selectedSlugs.reduce((best, slug) => {
    return totalScore(getScores(slug)) > totalScore(getScores(best)) ? slug : best;
  }, selectedSlugs[0]);
}
