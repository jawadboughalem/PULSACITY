import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const CORPORATE_HOST = `pulsacity.localhost:${PORT}`;
const DEMO_HOST = `demo.localhost:${PORT}`;

/**
 * Smoke tests run against a production build, on `*.localhost` hosts so the
 * host-routing middleware behaves exactly as it does in production.
 *
 * Every assertion goes through the browser: Chromium is told to resolve `*.localhost`
 * itself, so the suite does not depend on the machine's DNS or on `/etc/hosts`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://${CORPORATE_HOST}`,
    trace: 'on-first-retry',
    launchOptions: {
      args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'],
      // Escape hatch for images that ship their own Chromium instead of the build
      // `pnpm exec playwright install chromium` would fetch.
      ...(process.env.CHROMIUM_EXECUTABLE_PATH
        ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH }
        : {}),
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm exec next build && pnpm exec next start --port ${PORT}`,
    // Wait on the port, not on a URL: the server answers differently per host.
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      NEXT_PUBLIC_CORPORATE_HOST: CORPORATE_HOST,
      NEXT_PUBLIC_DEMO_HOST: DEMO_HOST,
    },
  },
});
