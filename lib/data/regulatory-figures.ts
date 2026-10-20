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
  fraisConsulairesVisaLongSejour: {
    id: 'frais-consulaires-visa-long-sejour',
    label: 'Frais consulaires du visa long séjour études (hors frais du prestataire VFS/TLS)',
    tiers: [
      {
        value: 99,
        unit: '€',
        validFrom: '2025-01-01',
        source: 'https://france-visas.gouv.fr',
        sourceLabel: 'France-Visas — page exacte à préciser par l’équipe',
      },
    ],
  },
  repasCrous: {
    id: 'repas-crous',
    label: 'Repas au restaurant universitaire CROUS (tous les étudiants)',
    tiers: [
      {
        value: 1,
        unit: '€',
        validFrom: '2026-05-04',
        source: 'https://www.etudiant.gouv.fr',
        sourceLabel: 'etudiant.gouv.fr — page exacte à préciser par l’équipe',
      },
    ],
  },
  heuresTravailEtudiant: {
    id: 'heures-travail-etudiant',
    label: 'Durée maximale de travail par an pour un étudiant étranger (hors UE)',
    tiers: [
      {
        value: 964,
        unit: 'h/an',
        validFrom: '2002-01-01',
        source: 'https://www.service-public.gouv.fr',
        sourceLabel: 'Service-public.fr — 60 % de la durée légale (1 607 h)',
      },
    ],
  },
  heuresTravailEtudiantAlgerien: {
    id: 'heures-travail-etudiant-algerien',
    label: 'Durée maximale de travail par an pour un étudiant algérien',
    tiers: [
      {
        value: 803,
        unit: 'h/an',
        validFrom: '2002-01-01',
        source: 'https://www.legifrance.gouv.fr',
        sourceLabel: 'Accord franco-algérien du 27 décembre 1968 — 50 % de la durée légale',
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

// ── Chiffres en attente de vérification ─────────────────────────────────────
// Les sources se contredisent : on ne tranche PAS. Tant qu'un chiffre est ici,
// les pages et l'app affichent « à vérifier » au lieu d'un montant, avec les
// candidats et leurs sources. Une fois confirmé par l'équipe, le déplacer dans
// REGULATORY_FIGURES ci-dessus avec sa source officielle.

export interface PendingFigure {
  id: string;
  label: string;
  /** Valeurs trouvées, chacune avec l'endroit où on l'a vue. */
  candidates: { value: number; unit: string; seenIn: string }[];
  /** Source officielle à consulter pour trancher. */
  checkAt: string;
}

export const PENDING_FIGURES = {
  tcfMaroc: {
    id: 'tcf-maroc',
    label: 'Prix du TCF (pour les études en France) au Maroc',
    candidates: [
      { value: 350, unit: 'MAD', seenIn: 'guide tcf-maroc-2026-guide-complet (KeyFacts)' },
      { value: 1900, unit: 'MAD', seenIn: 'sources externes signalées par l’équipe' },
    ],
    checkAt: 'https://www.if-maroc.org',
  },
  taxeValidationVlsTs: {
    id: 'taxe-validation-vls-ts',
    label: 'Taxe de validation du visa étudiant (VLS-TS) sur l’ANEF',
    candidates: [
      { value: 50, unit: '€', seenIn: 'app DALILI (ancienne fiche) et sources externes' },
      { value: 150, unit: '€', seenIn: 'guide ofii-validation-visa-etudiant-france-guide' },
    ],
    checkAt: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2231',
  },
  fraisCefMaroc: {
    id: 'frais-cef-maroc',
    label: 'Frais de la procédure Campus France (Études en France) au Maroc',
    candidates: [
      { value: 2200, unit: 'MAD', seenIn: 'KeyFacts des guides campusfrance-maroc et visa-maroc, FAQ visa' },
      { value: 1900, unit: 'MAD', seenIn: 'corps des guides campusfrance-maroc (en ligne + 95 MAD en agence) et visa-maroc' },
    ],
    checkAt: 'https://www.maroc.campusfrance.org',
  },
  fraisCefTunisie: {
    id: 'frais-cef-tunisie',
    label: 'Frais de la procédure Campus France (Études en France) en Tunisie',
    candidates: [
      { value: 230, unit: 'TND', seenIn: 'guide campusfrance-tunisie-guide-complet-2026' },
      { value: 400, unit: 'TND', seenIn: 'guide etudier-en-france-depuis-tunisie' },
    ],
    checkAt: 'https://www.tunisie.campusfrance.org',
  },
  smicHoraire: {
    id: 'smic-horaire',
    label: 'SMIC horaire brut 2026',
    candidates: [
      { value: 11.88, unit: '€/h', seenIn: 'FAQ budget étudiant' },
      { value: 11.91, unit: '€/h', seenIn: 'guide budget-etudiant-senegalais-france-2026' },
    ],
    checkAt: 'https://www.service-public.gouv.fr',
  },
} as const satisfies Record<string, PendingFigure>;
