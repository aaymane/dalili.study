// Cost tracking for the assistant (USD per million tokens, list prices).
// Unknown model → null: the cost column stays empty instead of lying.

import type Anthropic from '@anthropic-ai/sdk';

const PRICES: Record<string, { input: number; output: number }> = {
  'claude-haiku-4-5': { input: 1, output: 5 },
  'claude-sonnet-4-5': { input: 3, output: 15 },
};

export interface Usage {
  inputTokens: number;
  outputTokens: number;
  costUsd: number | null;
}

export const ZERO_USAGE: Usage = { inputTokens: 0, outputTokens: 0, costUsd: 0 };

/** Cache writes cost 1.25× the input price, cache reads 0.1×. */
export function usageOf(model: string, u: Anthropic.Usage | undefined | null): Usage {
  if (!u) return ZERO_USAGE;
  const cacheWrite = u.cache_creation_input_tokens ?? 0;
  const cacheRead = u.cache_read_input_tokens ?? 0;
  const inputTokens = u.input_tokens + cacheWrite + cacheRead;
  const price = PRICES[model];
  const costUsd = price
    ? (u.input_tokens * price.input + cacheWrite * price.input * 1.25 + cacheRead * price.input * 0.1 + u.output_tokens * price.output) / 1e6
    : null;
  return { inputTokens, outputTokens: u.output_tokens, costUsd };
}

export function addUsage(a: Usage, b: Usage): Usage {
  return {
    inputTokens: a.inputTokens + b.inputTokens,
    outputTokens: a.outputTokens + b.outputTokens,
    costUsd: a.costUsd === null || b.costUsd === null ? null : a.costUsd + b.costUsd,
  };
}
