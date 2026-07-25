// Language handling for the multilingual assistant. Two independent jobs:
//
//   1. detectLanguage() — a local, non-LLM heuristic used to pick the right
//      canned string for the relevance-gate fallback (route.ts), which by
//      design never calls Claude. Good enough to pick between 4 buckets for
//      a handful of canned sentences; it does not need to be a real language
//      classifier.
//
//   2. translateToFrench() — improves retrieval quality against our
//      French-only corpus. Live testing (see PROMPT below and the numbers
//      in the PR/commit) showed Voyage's cross-lingual similarity is
//      measurably weaker than same-language similarity: the same
//      compte-bloqué question that scores 0.63 in French scored 0.53 in
//      Arabic, 0.55 in English, and 0.32 in Darija — all below the 0.6
//      relevance gate, even though the answer exists in the corpus.
//      Translating to French before embedding brought English and Darija
//      above the gate (0.61, 0.62) and Arabic close to it (0.58). This is a
//      real Claude call, made before the relevance gate runs — see the note
//      in route.ts about what that does and doesn't mean for guardrail #1.

import Anthropic from '@anthropic-ai/sdk';

export type DetectedLanguage = 'fr' | 'ar' | 'darija' | 'en';

// Arabic, Arabic Supplement, Arabic Extended-A Unicode blocks.
const ARABIC_SCRIPT_RE = /[؀-ۿݐ-ݿࢠ-ࣿ]/;

// Spellings distinctive of Moroccan/Maghrebi dialectal Arabic rather than
// MSA — only used to choose which canned fallback string reads naturally.
// Retrieval-side translation treats 'ar' and 'darija' identically.
const DARIJA_MARKERS = ['شحال', 'خاصني', 'بغيت', 'واش', 'دابا', 'فين', 'كيفاش', 'علاش', 'ديال', 'ماشي', 'بزاف', 'راه', 'غادي'];

const FRENCH_ACCENT_RE = /[éèàçùâêîôûëïœ]/i;
// "visa"/"compte" deliberately excluded — shared loanwords/cognates with
// English that would otherwise flip an English question to French.
const FRENCH_WORD_RE = /\b(?:le|la|les|des|du|un|une|quel|quelle|combien|comment|où|pour|est-ce|besoin|avoir)\b/i;
const ENGLISH_WORD_RE = /\b(?:the|how|what|where|when|is|are|do|does|need|much|many|money|account|please|help)\b/i;

/** Local, non-LLM language guess — good enough to pick a fallback string, not a classifier. */
export function detectLanguage(text: string): DetectedLanguage {
  if (ARABIC_SCRIPT_RE.test(text)) {
    return DARIJA_MARKERS.some(w => text.includes(w)) ? 'darija' : 'ar';
  }
  const hasFrench = FRENCH_ACCENT_RE.test(text) || FRENCH_WORD_RE.test(text);
  const hasEnglish = ENGLISH_WORD_RE.test(text);
  return hasEnglish && !hasFrench ? 'en' : 'fr';
}

const FALLBACK_MESSAGES: Record<DetectedLanguage, string> = {
  fr: "Je n'ai pas cette information dans nos guides.",
  en: "I don't have this information in our guides.",
  ar: 'ليس لدي هذه المعلومة في أدلتنا.',
  darija: 'ما عنديش هاد المعلومة ف الأدلة ديالنا.',
};

/** The relevance-gate fallback, in the detected language — never an LLM call. */
export function fallbackMessage(lang: DetectedLanguage): string {
  return FALLBACK_MESSAGES[lang];
}

const TRANSLATE_MODEL = 'claude-haiku-4-5';

/**
 * Translates a non-French question into French purely so it embeds closer
 * to our French corpus. The ORIGINAL question — not this translation — is
 * still what goes into the generation call, so the model detects and
 * mirrors the user's real language in the final answer; this only ever
 * influences which chunks get retrieved. Falls back to the original text on
 * any failure (empty output, API error) rather than blocking the request.
 */
export async function translateToFrench(question: string, lang: DetectedLanguage): Promise<string> {
  if (lang === 'fr') return question;

  const client = new Anthropic();
  const result = await client.messages.create({
    model: TRANSLATE_MODEL,
    max_tokens: 200,
    system:
      'Traduis la question suivante en français. Réponds UNIQUEMENT avec la traduction, sans guillemets, sans préambule, sans explication.',
    messages: [{ role: 'user', content: question }],
  });

  const translated = result.content.find(b => b.type === 'text')?.text?.trim();
  return translated || question;
}
