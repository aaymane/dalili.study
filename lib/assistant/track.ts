// GA4 events for the assistant. Client-side only (pushes to the dataLayer set
// up by <GoogleAnalytics> in app/layout.tsx). Events never carry the question
// or answer text — the question is personal data and already lives, redacted,
// in assistant_queries. Only the channel and coarse flags are sent.

import { sendGAEvent } from '@next/third-parties/google';

export type AssistantEvent = 'assistant_open' | 'assistant_question' | 'assistant_fallback';
export type AssistantChannel = 'site' | 'app';

export interface AssistantEventParams {
  channel: AssistantChannel;
  /** true when the question follows an earlier exchange (conversational memory in use). */
  follow_up?: boolean;
}

export function trackAssistant(event: AssistantEvent, params: AssistantEventParams): void {
  sendGAEvent('event', event, params);
}
