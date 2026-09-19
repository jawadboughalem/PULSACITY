/**
 * `pnpm showcase:shots` — desktop and mobile captures of the delivered sites.
 *
 * Reads `content/showcase.json` and writes WebP files to `public/showcase/`. Only real
 * client sites are ever captured: with no entry, the script has nothing to do and the
 * « Sites livrés » section disappears from the page.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';
import sharp from 'sharp';

import { ShowcaseSchema } from '../src/lib/showcase';
import { slugify } from '../src/lib/utils';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(appDir, 'public', 'showcase');

const VIEWPORTS = {
  desktop: { width: 1280, height: 800, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2 },
} as const;

/** WebP quality: small files, no visible artefact at these sizes. */
const WEBP_QUALITY = 82;

async function main(): Promise<void> {
  const raw: unknown = JSON.parse(readFileSync(join(appDir, 'content', 'showcase.json'), 'utf8'));
  const entries = ShowcaseSchema.parse(raw);

  if (entries.length === 0) {
    console.info(
      'content/showcase.json est vide : aucune capture à produire. ' +
        'Ajoutez un site livré (name, sector, city, url) puis relancez.',
    );
    return;
  }

  await mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch();

  try {
    for (const entry of entries) {
      const slug = slugify(entry.name);

      for (const [label, viewport] of Object.entries(VIEWPORTS)) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: viewport.deviceScaleFactor,
          locale: 'fr-FR',
          isMobile: label === 'mobile',
          hasTouch: label === 'mobile',
        });
        const page = await context.newPage();

        try {
          await page.goto(entry.url, { waitUntil: 'networkidle', timeout: 45_000 });
          // Let web fonts and lazy images settle before capturing.
          await page.waitForTimeout(1_500);
          const png = await page.screenshot({ type: 'png' });
          const webp = await sharp(png).webp({ quality: WEBP_QUALITY }).toBuffer();

          const target = join(outputDir, `${slug}-${label}.webp`);
          await writeFile(target, webp);
          console.info(
            `${entry.name} — ${label} : ${target} (${Math.round(webp.length / 1024)} Ko)`,
          );
        } catch (error) {
          console.error(`Capture impossible pour ${entry.name} (${label}) : ${entry.url}`, error);
          process.exitCode = 1;
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
}

await main();
