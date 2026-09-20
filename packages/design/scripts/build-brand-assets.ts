/**
 * `pnpm brand:assets` — writes every logo file from the geometry and the tokens.
 *
 * No brand file is edited by hand. Change `src/logo.ts` or `src/tokens.ts`, run this,
 * commit what it produces. `src/brand-assets.test.ts` fails when what is committed no
 * longer matches what this script would write, so the two cannot drift.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import sharp from 'sharp';

import { appIconSvg, PNG_ASSETS, REPO_ROOT, SVG_ASSETS } from '../src/brand-assets';

function relative(path: string): string {
  return path.replace(`${REPO_ROOT}/`, '');
}

async function main(): Promise<void> {
  await mkdir(join(dirname(SVG_ASSETS[0]!.path)), { recursive: true });

  for (const asset of SVG_ASSETS) {
    await writeFile(asset.path, asset.contents, 'utf8');
    console.info(`écrit ${relative(asset.path)}`);
  }

  for (const asset of PNG_ASSETS) {
    // A high density makes the rasteriser resolve the rounded corners cleanly.
    const png = await sharp(Buffer.from(appIconSvg(asset.size)), { density: 384 })
      .resize(asset.size, asset.size)
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(asset.path, png);
    console.info(`écrit ${relative(asset.path)}`);
  }
}

await main();
