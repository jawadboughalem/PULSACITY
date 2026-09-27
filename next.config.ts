import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A Sentry DSN is public by design: the browser SDK needs it as well.
  // Empty when SENTRY_DSN is not set, which keeps Sentry off.
  env: { SENTRY_DSN: process.env.SENTRY_DSN ?? "" },
};

// Source maps are only uploaded when a Sentry auth token is configured;
// without one the build goes on without uploading anything.
export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  // Nothing leaves for Sentry at build time unless the project sets it up.
  telemetry: false,
});
