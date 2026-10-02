import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: { SENTRY_DSN: process.env.SENTRY_DSN ?? "" },
  headers: async () => [
    {
      // w.js loads the logotype from the creator's page: a font from another origin needs CORS.
      // The file never changes under the same name: a new version takes a new name.
      source: "/fonts/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      // Pasted once, never versioned: a new w.js reaches the pages within the hour.
      source: "/w.js",
      headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
    },
  ],
};

export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  telemetry: false,
});
