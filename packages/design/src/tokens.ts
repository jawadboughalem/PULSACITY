/**
 * The brand colours, in code.
 *
 * `tokens.css` is the source for anything rendered by a browser. This module exists for
 * everything that cannot read a CSS variable — `next/og` images, generated SVG files,
 * rasterised app icons — and it declares the *same* OKLCH values, converted on demand.
 *
 * One source, two consumers. A colour written by hand anywhere else is a bug.
 *
 * Only the base palette lives here. The values `.surface-inverted` redeclares are a
 * rendering context, not a second palette: nothing outside a browser draws on ink.
 */

/** An OKLCH colour: lightness 0–1, chroma, hue in degrees. */
export type Oklch = readonly [lightness: number, chroma: number, hue: number];

export const OKLCH = {
  ground: [0.985, 0.004, 85],
  surface: [0.995, 0.002, 85],
  surfaceSunken: [0.965, 0.006, 85],
  surfaceInverted: [0.22, 0.012, 55],
  ink: [0.19, 0.008, 60],
  inkMuted: [0.48, 0.008, 60],
  inkFaint: [0.55, 0.008, 60],
  line: [0.91, 0.005, 70],
  lineStrong: [0.635, 0.008, 70],
  accent: [0.58, 0.19, 32],
  accentHover: [0.52, 0.19, 32],
  accentInk: [0.42, 0.14, 32],
  accentSoft: [0.96, 0.02, 40],
  accentForeground: [0.99, 0, 0],
  danger: [0.51, 0.18, 27],
  success: [0.52, 0.11, 155],
} as const satisfies Record<string, Oklch>;

export type TokenName = keyof typeof OKLCH;

/** sRGB gamma encoding, then a byte. Out-of-gamut channels are clipped, not scaled. */
function encodeChannel(linear: number): number {
  const gamma =
    linear <= 0.0031308 ? 12.92 * linear : 1.055 * Math.abs(linear) ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, gamma)) * 255);
}

/** OKLCH to a `#rrggbb` string, through OKLab and linear sRGB. */
export function oklchToHex([lightness, chroma, hue]: Oklch): string {
  const radians = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(radians);
  const b = chroma * Math.sin(radians);

  const long = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const medium = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const short = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const channels = [
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  ];

  return `#${channels
    .map(encodeChannel)
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Every token as `#rrggbb`. Derived, never typed by hand. */
export const HEX = Object.fromEntries(
  Object.entries(OKLCH).map(([name, value]) => [name, oklchToHex(value)]),
) as Record<TokenName, string>;

/** The CSS form, for a place that wants the exact declaration. */
export function oklchToCss([lightness, chroma, hue]: Oklch): string {
  return `oklch(${lightness} ${chroma} ${hue})`;
}
