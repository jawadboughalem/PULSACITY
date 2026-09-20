/**
 * What the brand ships as files, and what each file should contain.
 *
 * Declared here rather than in the build script so the test can assert that the files
 * on disk are exactly what the script would write. Edit the geometry or the tokens,
 * run `pnpm brand:assets`, commit — never the other way round.
 */
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { MARK_COMPACT, MARK_VIEWBOX, markSvg } from './logo';
import { HEX } from './tokens';

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_ROOT = resolve(packageDir, '..', '..');

const logoDir = join(packageDir, 'src', 'logo');
const appDir = join(REPO_ROOT, 'apps', 'corporate', 'src', 'app');

export interface SvgAsset {
  path: string;
  contents: string;
}

export interface PngAsset {
  path: string;
  size: number;
}

/**
 * A square tile for a home screen: the artwork fills two thirds of it, and the ground is
 * painted, because iOS refuses transparency and rounds the corners itself.
 */
const TILE_VIEWBOX = 72;
const TILE_INSET = (TILE_VIEWBOX - MARK_VIEWBOX) / 2;

export function appIconSvg(size: number): string {
  const blocks = markSvg()
    .replace(/^<svg[^>]*>\n/, '')
    .replace(/<\/svg>\n?$/, '')
    .trimEnd();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE_VIEWBOX} ${TILE_VIEWBOX}" width="${size}" height="${size}" role="img" aria-label="PULSACITY">
  <rect width="${TILE_VIEWBOX}" height="${TILE_VIEWBOX}" fill="${HEX.ground}" />
  <g transform="translate(${TILE_INSET} ${TILE_INSET})">
${blocks}
  </g>
</svg>
`;
}

export const SVG_ASSETS: readonly SvgAsset[] = [
  { path: join(logoDir, 'mark.svg'), contents: markSvg() },
  { path: join(logoDir, 'mark-compact.svg'), contents: markSvg({ blocks: MARK_COMPACT }) },
  // One colour, for a fax header, a stamp, or anything that flattens the palette.
  { path: join(logoDir, 'mark-ink.svg'), contents: markSvg({ accent: HEX.ink }) },
  {
    path: join(logoDir, 'mark-reversed.svg'),
    contents: markSvg({ ink: HEX.ground, accent: HEX.ground }),
  },
  // The browser tab renders this at 16 px, so it gets the compact drawing.
  { path: join(appDir, 'icon.svg'), contents: markSvg({ blocks: MARK_COMPACT }) },
];

export const PNG_ASSETS: readonly PngAsset[] = [
  { path: join(appDir, 'apple-icon.png'), size: 180 },
  { path: join(logoDir, 'app-icon-512.png'), size: 512 },
];
