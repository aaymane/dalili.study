// Retrieval-only hints. Nothing here ever reaches the generation prompt as a
// "fact": these only change WHICH chunks are retrieved and in what order.
//
//   1. expandWithGlossary() — short, rare words ("CEF", "apostille", "Vitale")
//      embed poorly on their own. 4 of the 58 refusals in assistant_queries
//      were plain "c'est quoi X ?" questions about lexicon terms. Appending the
//      term's full name and plain definition gives the embedding something to hold on to.
//   2. rankForCountry() — app requests carry the student's country. Guides for
//      ANOTHER country are dropped (a Moroccan student must never get the
//      Tunisian visa fees), and guides for THEIR country get a small boost.

import type { CountryCode } from '@/lib/content/guides';
import { GLOSSARY } from '@/lib/content/glossary';

const COUNTRY_BOOST = 0.03;

// Slug markers of country-specific guides. Kept as slug patterns (not a read of
// content/blog) so the serverless function never depends on the filesystem.
const COUNTRY_SLUG_MARKERS: Record<CountryCode, RegExp> = {
  MA: /maroc|marocain/,
  DZ: /algeri/,
  TN: /tunisi/,
  SN: /senegal|dakar/,
  LB: /liban/,
  CI: /cote-ivoire|ivoirien/,
  CM: /cameroun/,
};

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === 'string' && Object.hasOwn(COUNTRY_SLUG_MARKERS, value);
}

export function countryOfSlug(slug: string): CountryCode | null {
  for (const [code, re] of Object.entries(COUNTRY_SLUG_MARKERS) as [CountryCode, RegExp][]) {
    if (re.test(slug)) return code;
  }
  return null;
}

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * "c quoi CEF ?" → "c quoi CEF ? (CEF : Centre pour les études en France. <définition simple>)".
 * The plain definition matters for terms without a full name: "compte bloqué" alone
 * stayed under the relevance gate although a whole guide is about it.
 */
export function expandWithGlossary(query: string): string {
  const q = ` ${normalize(query).replace(/[^a-z0-9]+/g, ' ')} `;
  const hits = GLOSSARY.filter(t => q.includes(` ${normalize(t.term).replace(/[^a-z0-9]+/g, ' ')} `)).slice(0, 2);
  if (hits.length === 0) return query;
  return `${query} (${hits.map(t => `${t.full ? `${t.term} : ${t.full}.` : `${t.term} :`} ${t.simple}`).join(' ; ')})`;
}

/** Drops other countries' guides, boosts the student's own. No country → unchanged. */
export function rankForCountry<T extends { slug: string; similarity: number }>(chunks: T[], country: CountryCode | null | undefined): T[] {
  if (!country) return chunks;
  return chunks
    .filter(c => {
      const own = countryOfSlug(c.slug);
      return own === null || own === country;
    })
    .map(c => (countryOfSlug(c.slug) === country ? { ...c, similarity: c.similarity + COUNTRY_BOOST } : c))
    .sort((a, b) => b.similarity - a.similarity);
}
