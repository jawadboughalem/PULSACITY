import * as Sentry from "@sentry/nextjs";

// Server and edge runtimes. Without SENTRY_DSN the SDK stays off.
export function register() {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

export const onRequestError = Sentry.captureRequestError;
