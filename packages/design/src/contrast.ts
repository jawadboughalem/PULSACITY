/**
 * Colour maths for the token guard.
 *
 * The palette is authored in `oklch()`, but WCAG contrast is defined on sRGB, so
 * a ratio can only be checked by converting first. Doing it here means the charter
 * can be a test rather than a promise.
 */

export interface Oklch {
  l: number;
  c: number;
  h: number;
  /** 0–1. Only used to reject alpha where an opaque colour is required. */
  alpha: number;
}

const OKLCH = /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i;

const asNumber = (raw: string, percentScale: number): number =>
  raw.endsWith('%') ? Number(raw.slice(0, -1)) / 100 : Number(raw) / percentScale;

/** Returns `null` for anything that is not a plain `oklch()` colour. */
export function parseOklch(value: string): Oklch | null {
  const match = OKLCH.exec(value.trim());
  if (!match) return null;

  const [, l, c, h, alpha] = match;
  if (l === undefined || c === undefined || h === undefined) return null;

  return {
    l: asNumber(l, 1),
    c: asNumber(c, 1),
    h: Number(h),
    alpha: alpha === undefined ? 1 : asNumber(alpha, 1),
  };
}

/**
 * Oklab → linear sRGB. The result is unclamped on purpose: values outside 0–1
 * are exactly what `isInGamut` looks for.
 */
function toLinearRgb({ l, c, h }: Oklch): [number, number, number] {
  const radians = (h * Math.PI) / 180;
  const a = c * Math.cos(radians);
  const b = c * Math.sin(radians);

  const lCone = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mCone = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sCone = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * lCone - 3.3077115913 * mCone + 0.2309699292 * sCone,
    -1.2684380046 * lCone + 2.6097574011 * mCone - 0.3413193965 * sCone,
    -0.0041960863 * lCone - 0.7034186147 * mCone + 1.707614701 * sCone,
  ];
}

const encode = (channel: number): number => {
  const clamped = Math.min(1, Math.max(0, channel));
  return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
};

const decode = (channel: number): number =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

/**
 * True when the colour survives the trip to sRGB untouched. A colour outside the
 * gamut is clipped by the browser, so the value written in the file is not the
 * value on screen — and its measured contrast is not the one that was intended.
 */
export function isInGamut(colour: Oklch): boolean {
  return toLinearRgb(colour).every((channel) => channel >= -0.0005 && channel <= 1.0005);
}

/** The 8-bit sRGB triplet a browser actually paints. */
export function toSrgb(colour: Oklch): [number, number, number] {
  const [r, g, b] = toLinearRgb(colour);
  return [Math.round(encode(r) * 255), Math.round(encode(g) * 255), Math.round(encode(b) * 255)];
}

export function toHex(colour: Oklch): string {
  return `#${toSrgb(colour)
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}

/** WCAG relative luminance, computed from the clipped sRGB the screen shows. */
export function relativeLuminance(colour: Oklch): number {
  const [r, g, b] = toSrgb(colour).map((channel) => decode(channel / 255)) as [
    number,
    number,
    number,
  ];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio, from 1 to 21. Order of the arguments does not matter. */
export function contrastRatio(a: Oklch, b: Oklch): number {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Rounded down to the hundredth, so a reported ratio is never flattering. */
export function floorToHundredth(ratio: number): number {
  return Math.floor(ratio * 100) / 100;
}
