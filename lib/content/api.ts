// Builders for the mobile app's content API (/api/content/v1/*). Every
// payload is computed at build time from the same sources as the pages, so
// a guide or figure edited on the site reaches the app with the next deploy.

import { CITIES as CITY_PAGES } from '@/lib/cities';
import { PAYS_INFO } from '@/lib/calendrier-data';
import {
  PENDING_FIGURES,
  REGULATORY_FIGURES,
  formatTierValue,
  getTierAt,
  type RegulatoryFigure,
} from '@/lib/data/regulatory-figures';
import { CAF_ELIGIBLE_BOURSE, CAF_ESTIMATE, CITIES as BUDGET_CITIES, FIXED_MONTHLY, SAVINGS, TUITION_ANNUAL, CVEC_ANNUAL, computeBudget, type Housing, type Situation } from '@/lib/tools/budget';
import { GLOSSARY } from '@/lib/content/glossary';
import { JOURNEY, JOURNEY_VERSION, SAFETY } from '@/lib/content/journey';
import { ALL_COUNTRIES, listGuides, type CountryCode } from '@/lib/content/guides';

export const CONTENT_API_VERSION = 1;

/** JSON response for the app: cacheable by the CDN, never indexed by search engines. */
export function contentResponse(data: unknown): Response {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex, nofollow',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export function buildManifest() {
  const guides = listGuides();
  return {
    version: CONTENT_API_VERSION,
    generatedAt: new Date().toISOString(),
    journeyVersion: JOURNEY_VERSION,
    counts: { guides: guides.length, cities: Object.keys(CITY_PAGES).length, countries: ALL_COUNTRIES.length },
    guides,
  };
}

export function buildJourney() {
  return { version: JOURNEY_VERSION, steps: JOURNEY, safety: SAFETY };
}

function figurePayload(f: RegulatoryFigure) {
  const current = getTierAt(f);
  return { id: f.id, label: f.label, status: 'verified' as const, current, display: formatTierValue(current), tiers: f.tiers };
}

export function buildFigures() {
  const verified = Object.fromEntries(
    Object.entries(REGULATORY_FIGURES).map(([key, f]) => [key, figurePayload(f as RegulatoryFigure)]),
  );
  const pending = Object.fromEntries(
    Object.entries(PENDING_FIGURES).map(([key, f]) => [key, { ...f, status: 'to_verify' as const }]),
  );
  return { generatedAt: new Date().toISOString(), verified, pending };
}

const COUNTRY_SLUG: Record<CountryCode, string> = {
  MA: 'maroc',
  DZ: 'algerie',
  TN: 'tunisie',
  SN: 'senegal',
  LB: 'liban',
  CI: 'cote-ivoire',
  CM: 'cameroun',
};

const COUNTRY_CAPITAL: Record<CountryCode, string> = {
  MA: 'Casablanca',
  DZ: 'Alger',
  TN: 'Tunis',
  SN: 'Dakar',
  LB: 'Beyrouth',
  CI: 'Abidjan',
  CM: 'Douala',
};

export function buildCountries() {
  const guides = listGuides();
  return ALL_COUNTRIES.map(code => {
    const info = PAYS_INFO[COUNTRY_SLUG[code]];
    return {
      code,
      slug: COUNTRY_SLUG[code],
      label: info.label,
      flag: info.emoji,
      defaultCity: COUNTRY_CAPITAL[code],
      countryPage: info.paysLink,
      tcfRequired: info.tcfRequired,
      specificGuides: guides.filter(g => g.countries.length === 1 && g.countries[0] === code).length,
    };
  });
}

export function buildCities() {
  return Object.values(CITY_PAGES).map(c => {
    const budget = BUDGET_CITIES.find(b => b.slug === c.slug);
    return {
      slug: c.slug,
      id: c.slug.replace(/^etudier-a-/, ''),
      name: c.name,
      region: c.region,
      tagline: c.tagline,
      students: c.students,
      monthlyBudget: { min: c.monthlyBudgetMin, max: c.monthlyBudgetMax },
      /** Fourchettes de loyer du simulateur (null si la ville n'y est pas encore). */
      rent: budget ? { crous: budget.crous, coloc: budget.coloc, studio: budget.studio, habitant: budget.habitant } : null,
      transport: budget?.transport ?? null,
      food: budget?.food ?? null,
      links: { crous: c.crousUrl, prefecture: c.prefectureUrl, transport: c.transportUrl, caf: c.cafUrl },
      url: `https://dalili.study/villes/${c.slug}`,
    };
  });
}

const HOUSINGS: Housing[] = ['crous', 'coloc', 'studio', 'habitant'];
const SITUATIONS: Situation[] = ['bcs', 'alternance', 'salarie', 'autre_bourse', 'aucune'];

export function buildTools() {
  // Cas de test de référence : l'app recalcule ces budgets avec sa copie de la
  // formule et doit trouver exactement les mêmes nombres.
  const cases = BUDGET_CITIES.slice(0, 4).flatMap(city =>
    HOUSINGS.slice(0, 2).flatMap(housing =>
      (['aucune', 'bcs'] as Situation[]).map(situation => {
        const input = { city: city.slug, housing, level: 'licence' as const, monthlyTuition: false, situation };
        return { input, expected: computeBudget(input) };
      }),
    ),
  );
  return {
    budget: {
      cities: BUDGET_CITIES,
      aplEstimate: CAF_ESTIMATE,
      aplEligible: Array.from(CAF_ELIGIBLE_BOURSE),
      situations: SITUATIONS,
      fixedMonthly: FIXED_MONTHLY,
      savings: SAVINGS,
      tuitionAnnual: TUITION_ANNUAL,
      cvec: CVEC_ANNUAL,
      cases,
    },
  };
}

export function buildGlossary() {
  return GLOSSARY;
}
