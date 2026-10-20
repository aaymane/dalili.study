// Masks personal identifiers in free text before it is logged or sent to a
// model. Used by the assistant's query log (assistant_queries) and, later,
// by the document-explanation endpoint, where it runs on the OCR'd text
// BEFORE any Claude call. Deliberately over-eager: a masked year or price is
// a small loss; a leaked passport or IBAN is not.
//
// Order matters — the most specific patterns (IBAN, French social security
// number) run before the generic long-number rule that would otherwise eat
// them with a less informative label.

const RULES: { label: string; re: RegExp }[] = [
  { label: '[email]', re: /[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/gi },
  // IBAN: 2 letters, 2 digits, then 11-30 alphanumerics, optionally grouped by spaces.
  { label: '[iban]', re: /\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]){11,30}\b/g },
  // NIR (numéro de sécurité sociale): 13 digits + optional 2-digit key, spaces allowed.
  { label: '[n° sécu]', re: /\b[12][ ]?\d{2}[ ]?\d{2}[ ]?(?:\d{2}|2[AB])[ ]?\d{3}[ ]?\d{3}(?:[ ]?\d{2})?\b/gi },
  // Phone numbers: +212 6…, 06 12 34 56 78, 0033…
  { label: '[téléphone]', re: /(?:\+|00)\d{1,3}[\s.-]?\d(?:[\s.-]?\d{2}){3,5}\b|\b0\d(?:[\s.-]?\d{2}){4}\b/g },
  // Passport / ID / allocataire / dossier numbers: letters+digits mixes of 6+ chars containing ≥ 4 digits.
  { label: '[numéro]', re: /\b(?=[A-Z0-9]*\d{4})[A-Z]{0,3}\d[A-Z0-9]{5,}\b/gi },
];

export function redactPersonalData(text: string): string {
  return RULES.reduce((acc, { label, re }) => acc.replace(re, label), text);
}
