/** What processing an event led to. Received but not yet processed: no outcome and no error. */
export const WEBHOOK_EVENT_OUTCOMES = [
  "request-scheduled",
  "request-exists",
  "unsubscribed",
  "requests-disabled",
  "awaiting-product",
  "duplicate",
  "unsupported",
] as const;

export type WebhookEventOutcome = (typeof WEBHOOK_EVENT_OUTCOMES)[number];

/** Why an event was put aside: « Rejouer » processes it again. */
export const WEBHOOK_EVENT_ERRORS = ["invalid-signature", "invalid-payload", "processing-failed"] as const;

export type WebhookEventError = (typeof WEBHOOK_EVENT_ERRORS)[number];
