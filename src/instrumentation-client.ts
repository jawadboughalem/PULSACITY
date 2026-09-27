import * as Sentry from "@sentry/nextjs";

// Browser runtime. Without SENTRY_DSN the SDK stays off.
Sentry.init({ dsn: process.env.SENTRY_DSN });

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
