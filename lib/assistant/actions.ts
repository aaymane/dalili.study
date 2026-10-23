// Deterministic actions under an answer (docs/VISION.md §1.2, point 5).
// The model never proposes an action: the server maps the guides it actually
// cited (already validated by extractAndValidateSources) to the journey steps
// that point to those guides, using the same step → guides table the app reads.

import { JOURNEY } from '@/lib/content/journey';
import type { CountryCode } from '@/lib/content/guides';

export type AssistantAction = { type: 'step'; stepId: string; title: string };

const MAX_ACTIONS = 2;

/** Guides a step shows for this country (its own list, or the default one). */
function guidesFor(step: (typeof JOURNEY)[number], country?: CountryCode | null): string[] {
  const own = country ? step.guides[country] : undefined;
  return [...(own ?? []), ...step.guides.default];
}

/**
 * Cited guide slugs (best first) → « Ouvrir l'étape … » actions, at most two.
 * A step reserved to other countries is never proposed.
 */
export function actionsFromSources(slugs: string[], country?: CountryCode | null): AssistantAction[] {
  const out: AssistantAction[] = [];
  for (const slug of slugs) {
    for (const step of JOURNEY) {
      if (out.length >= MAX_ACTIONS) return out;
      if (out.some(a => a.stepId === step.id)) continue;
      if (country && step.countries && !step.countries.includes(country)) continue;
      if (guidesFor(step, country).includes(slug)) out.push({ type: 'step', stepId: step.id, title: step.title });
    }
  }
  return out;
}
