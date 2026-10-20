// Structured flags the UI uses to add the right safety net under an answer:
//   legal   → "Ce n'est pas un conseil juridique"
//   stress  → offer a mentor
//   complex → offer a mentor (the case needs a human)
//   distress → 3114 card (suicide prevention line, France)
//
// legal/stress/complex come from the model's FLAGS line, validated against a
// whitelist exactly like SOURCES_USED. distress is detected LOCALLY with a
// regex on the question, so the 3114 card never depends on the model.

export const MODEL_FLAGS = ['legal', 'stress', 'complex'] as const;
export type AssistantFlag = (typeof MODEL_FLAGS)[number] | 'distress';

const DISTRESS_RE =
  /\b(suicid\w*|me tuer|en finir|plus envie de vivre|envie de mourir|me faire du mal|kill myself|end my life|want to die)\b|انتحار|نقتل راسي|بغيت نموت|أريد أن أموت/i;

export function detectDistress(text: string): boolean {
  return DISTRESS_RE.test(text);
}

/** Reads "FLAGS: [legal, stress]" (anywhere in the tail), keeps whitelisted values only. */
export function parseModelFlags(text: string): AssistantFlag[] {
  const match = text.match(/FLAGS:\s*\[([^\]]*)\]/);
  if (!match) return [];
  const values = match[1].split(',').map(s => s.trim().toLowerCase());
  return MODEL_FLAGS.filter(f => values.includes(f));
}

/** Removes the FLAGS line so it is never shown. */
export function stripFlagsLine(text: string): string {
  return text.replace(/\n?FLAGS:\s*\[[^\]]*\]\s*(?=\n|$)/, '');
}
