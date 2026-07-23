// Single source of truth for regulatory figures (visa resources, CVEC, tuition
// fees, exemption caps) that are rendered in components/tools across the site.
// Never hardcode one of these amounts directly in a component — import it
// from here so a change in the law only needs to be edited in one place.
//
// Each figure holds a chronological list of "tiers": the value in force
// during a given [validFrom, validUntil) window. `getTierAt()` resolves the
// tier that applies at a given date (defaults to now), so callers can render
// the correct amount automatically as legal thresholds change over time —
// no manual edit needed when a transition date is crossed.

export interface FigureTier {
  value: number;
  unit: string;
  /** ISO date (YYYY-MM-DD), inclusive — when this tier starts applying. */
  validFrom: string;
  /** ISO date (YYYY-MM-DD), exclusive — when this tier stops applying. Omitted = still current. */
  validUntil?: string;
  /** URL of the official source (Légifrance, service-public.fr, campusfrance.org...). */
  source: string;
  /** Human-readable citation, e.g. "Décret n° 2026-526 du 22 juin 2026". */
  sourceLabel: string;
}

export interface RegulatoryFigure {
  id: string;
  label: string;
  tiers: FigureTier[];
}

export const REGULATORY_FIGURES = {
  compteBloqueMensuel: {
    id: 'compte-bloque-mensuel',
    label: 'Ressources mensuelles exigées pour le visa/titre de séjour étudiant',
    tiers: [
      {
        value: 615,
        unit: '€/mois',
        validFrom: '2002-01-01',
        validUntil: '2026-08-01',
        source: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2231',
        sourceLabel: 'Service-public.fr',
      },
      {
        value: 877.5,
        unit: '€/mois',
        validFrom: '2026-08-01',
        source: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054300340',
        sourceLabel: 'Décret n° 2026-526 du 22 juin 2026',
      },
    ],
  },
  cvec: {
    id: 'cvec',
    label: 'CVEC — Contribution Vie Étudiante et de Campus',
    tiers: [
      {
        value: 105,
        unit: '€',
        validFrom: '2025-09-01',
        source: 'https://cvec.etudiant.gouv.fr',
        sourceLabel: 'CNOUS 2025-2026',
      },
    ],
  },
  fraisScolariteLicence: {
    id: 'frais-scolarite-licence',
    label: 'Frais de scolarité Licence (droits différenciés hors UE)',
    tiers: [
      {
        value: 2895,
        unit: '€/an',
        validFrom: '2025-09-01',
        source: 'https://www.campusfrance.org/fr/les-frais-de-scolarite',
        sourceLabel: 'MESR / Campus France 2025-2026',
      },
    ],
  },
  fraisScolariteMaster: {
    id: 'frais-scolarite-master',
    label: 'Frais de scolarité Master (droits différenciés hors UE)',
    tiers: [
      {
        value: 3941,
        unit: '€/an',
        validFrom: '2025-09-01',
        source: 'https://www.campusfrance.org/fr/les-frais-de-scolarite',
        sourceLabel: 'MESR / Campus France 2025-2026',
      },
    ],
  },
  fraisScolariteDoctorat: {
    id: 'frais-scolarite-doctorat',
    label: 'Frais de scolarité Doctorat (tarif unique)',
    tiers: [
      {
        value: 397,
        unit: '€/an',
        validFrom: '2025-09-01',
        source: 'https://www.campusfrance.org/fr/les-frais-de-scolarite',
        sourceLabel: 'MESR / Campus France 2025-2026',
      },
    ],
  },
  exonerationFraisScolaritePlafond: {
    id: 'exoneration-frais-scolarite-plafond',
    label: "Plafond d'exonération discrétionnaire des frais de scolarité (% d'étudiants hors UE par université)",
    tiers: [
      {
        value: 30,
        unit: '%',
        validFrom: '2026-09-01',
        validUntil: '2027-09-01',
        source: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054113646',
        sourceLabel: 'Décret n° 2026-385 du 19 mai 2026',
      },
      {
        value: 25,
        unit: '%',
        validFrom: '2027-09-01',
        validUntil: '2028-09-01',
        source: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054113646',
        sourceLabel: 'Décret n° 2026-385 du 19 mai 2026',
      },
      {
        value: 20,
        unit: '%',
        validFrom: '2028-09-01',
        source: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054113646',
        sourceLabel: 'Décret n° 2026-385 du 19 mai 2026',
      },
    ],
  },
} as const satisfies Record<string, RegulatoryFigure>;

export type RegulatoryFigureId = keyof typeof REGULATORY_FIGURES;

/** Resolves the tier in force at `at` (defaults to now). Falls back to the last tier if none match. */
export function getTierAt(figure: RegulatoryFigure, at: Date = new Date()): FigureTier {
  const iso = at.toISOString().slice(0, 10);
  const applicable = figure.tiers.filter(
    t => t.validFrom <= iso && (!t.validUntil || iso < t.validUntil)
  );
  if (applicable.length === 0) return figure.tiers[figure.tiers.length - 1];
  // Most recent validFrom wins if windows ever overlap.
  return applicable.reduce((latest, t) => (t.validFrom > latest.validFrom ? t : latest));
}

/** The tier that was in force immediately before the current one, if any (used for "was X, now Y" copy). */
export function getPreviousTier(figure: RegulatoryFigure, at: Date = new Date()): FigureTier | undefined {
  const current = getTierAt(figure, at);
  const earlier = figure.tiers.filter(t => t.validFrom < current.validFrom);
  if (earlier.length === 0) return undefined;
  return earlier.reduce((latest, t) => (t.validFrom > latest.validFrom ? t : latest));
}

/** The tier scheduled to take over once the current one ends, if any (used for "X now, Y from <date>" copy). */
export function getNextTier(figure: RegulatoryFigure, at: Date = new Date()): FigureTier | undefined {
  const current = getTierAt(figure, at);
  if (!current.validUntil) return undefined;
  return figure.tiers.find(t => t.validFrom === current.validUntil);
}

/** Formats a tier's value the French way: comma decimals, no trailing zeros unless the source has cents. */
export function formatTierValue(tier: FigureTier): string {
  const hasFraction = tier.value % 1 !== 0;
  const number = tier.value.toLocaleString('fr-FR', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${number} ${tier.unit}`;
}

/**
 * Parses a YYYY-MM-DD string as a local date (avoids the UTC-midnight-shifts-a-day-back
 * bug from `new Date(iso)`) and formats it the French way, with the "1er" ordinal for
 * the first of the month (`Intl`'s 'numeric' day doesn't do this on its own).
 */
export function formatIsoDateFr(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayLabel = d === 1 ? '1er' : String(d);
  const monthYear = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return `${dayLabel} ${monthYear}`;
}

/**
 * Builds a short French parenthetical describing the adjacent tier relative to `at`:
 * "877,50 €/mois à partir du 1er août 2026" while the old tier is still active, or
 * "615 €/mois avant le 1er août 2026" once the new one has kicked in.
 * Returns '' when there is no adjacent tier (single-tier figures).
 */
export function describeAdjacentTier(figure: RegulatoryFigure, at: Date = new Date()): string {
  const next = getNextTier(figure, at);
  if (next) return `${formatTierValue(next)} à partir du ${formatIsoDateFr(next.validFrom)}`;

  const current = getTierAt(figure, at);
  const prev = getPreviousTier(figure, at);
  if (prev) return `${formatTierValue(prev)} avant le ${formatIsoDateFr(current.validFrom)}`;

  return '';
}
