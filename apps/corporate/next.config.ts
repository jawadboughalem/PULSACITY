import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { NextConfig } from 'next';

const appDir = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Workspace packages ship TypeScript sources; Next compiles them with the app.
  transpilePackages: ['@pulsacity/templates', '@pulsacity/db'],
  // The app lives in a pnpm workspace: trace from the repository root.
  outputFileTracingRoot: join(appDir, '..', '..'),
  // Legal pages read their Markdown at render time.
  outputFileTracingIncludes: {
    '/mentions-legales': ['./content/legal/**'],
    '/confidentialite': ['./content/legal/**'],
    '/cgv': ['./content/legal/**'],
  },
  poweredByHeader: false,
  eslint: {
    // Linting is a workspace-level gate (`pnpm lint` at the root, where the shared
    // flat config lives, Next's rules included). Running it again here would use a
    // second, partial configuration.
    ignoreDuringBuilds: true,
  },
  images: {
    // Only our own screenshots are served; no remote loader is needed.
    remotePatterns: [],
  },
};

export default nextConfig;
