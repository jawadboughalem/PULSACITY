/**
 * The PULSACITY mark.
 *
 * Four blocks of unequal size, and one of them — larger, coral, stepping above the
 * others — is the one that beats. A regular grid would be a windowpane; unequal blocks
 * are a plan. The mark carries the pulse, so the wordmark drops its dot beside it.
 *
 * The geometry lives here once. React renders it with token classes, the asset script
 * writes it out as SVG, and `next/og` draws it from the same numbers. Nothing redraws
 * it by hand.
 */
import { HEX } from './tokens';

/** Every coordinate below is on this square grid, with an 8-unit safe margin. */
export const MARK_VIEWBOX = 64;
export const MARK_SAFE_MARGIN = 8;

export type BlockRole = 'ink' | 'accent';

export interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  role: BlockRole;
}

/** The mark. Four blocks; the coral one steps two units above the safe margin. */
export const MARK: readonly Block[] = [
  { x: 8, y: 8, width: 18, height: 26, radius: 4, role: 'ink' },
  { x: 8, y: 38, width: 18, height: 18, radius: 4, role: 'ink' },
  { x: 30, y: 38, width: 26, height: 18, radius: 4, role: 'ink' },
  { x: 30, y: 6, width: 26, height: 26, radius: 6, role: 'accent' },
];

/**
 * The mark below 24 px. Three blocks instead of four, each one heavier: at that size
 * the gutters of the standard mark close up and the whole thing turns to porridge.
 */
export const MARK_COMPACT: readonly Block[] = [
  { x: 6, y: 8, width: 20, height: 48, radius: 5, role: 'ink' },
  { x: 30, y: 34, width: 26, height: 22, radius: 5, role: 'ink' },
  { x: 30, y: 4, width: 26, height: 26, radius: 6, role: 'accent' },
];

export interface MarkSvgOptions {
  blocks?: readonly Block[];
  /** Colour of the plain blocks. Defaults to the ink token. */
  ink?: string;
  /** Colour of the block that beats. Defaults to the accent token. */
  accent?: string;
  /** Painted behind the mark. Omitted for a transparent asset. */
  background?: string;
  /** Rasterisers need a pixel size; a document embedding the file does not. */
  size?: number;
  /** Read by assistive technology when the file is used on its own. */
  title?: string;
}

/** The mark as a standalone SVG document. */
export function markSvg(options: MarkSvgOptions = {}): string {
  const {
    blocks = MARK,
    ink = HEX.ink,
    accent = HEX.accent,
    background,
    size,
    title = 'PULSACITY',
  } = options;

  const dimensions = size === undefined ? '' : ` width="${size}" height="${size}"`;
  const ground =
    background === undefined
      ? ''
      : `\n  <rect width="${MARK_VIEWBOX}" height="${MARK_VIEWBOX}" fill="${background}" />`;

  const rects = blocks
    .map(
      (block) =>
        `  <rect x="${block.x}" y="${block.y}" width="${block.width}" height="${block.height}" ` +
        `rx="${block.radius}" fill="${block.role === 'accent' ? accent : ink}" />`,
    )
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_VIEWBOX} ${MARK_VIEWBOX}"${dimensions} role="img" aria-label="${title}">${ground}
${rects}
</svg>
`;
}
