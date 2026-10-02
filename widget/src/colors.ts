export type Rgba = { r: number; g: number; b: number; a: number };

const RGB_FUNCTION = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+)(%)?)?\s*\)$/i;

const HEX = /^#([\da-f]{3}|[\da-f]{6})$/i;

const fromHex = (hex: string): Rgba => {
  const digits = hex.length === 4 ? [...hex.slice(1)].map((digit) => digit + digit).join("") : hex.slice(1);
  return {
    r: Number.parseInt(digits.slice(0, 2), 16),
    g: Number.parseInt(digits.slice(2, 4), 16),
    b: Number.parseInt(digits.slice(4, 6), 16),
    a: 1,
  };
};

/** A colour no page uses: if the canvas keeps it, it could not read the value. */
const UNPARSED = "#010203";

let canvasContext: CanvasRenderingContext2D | null | undefined;

/** Any other syntax a browser computes (oklch, color(), lab…) is read back from a one-pixel canvas. */
const readThroughCanvas = (value: string): Rgba | null => {
  if (canvasContext === undefined) {
    try {
      canvasContext = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    } catch {
      canvasContext = null;
    }
  }
  if (!canvasContext) return null;
  canvasContext.fillStyle = UNPARSED;
  canvasContext.fillStyle = value;
  if (canvasContext.fillStyle === UNPARSED) return null;
  canvasContext.clearRect(0, 0, 1, 1);
  canvasContext.fillRect(0, 0, 1, 1);
  const [r, g, b, alpha] = canvasContext.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: alpha / 255 };
};

export const parseColor = (value: string | null | undefined): Rgba | null => {
  if (!value) return null;
  const color = value.trim();
  if (HEX.test(color)) return fromHex(color);
  const match = RGB_FUNCTION.exec(color);
  if (match) {
    const alpha = match[4] === undefined ? 1 : Number(match[4]) / (match[5] ? 100 : 1);
    return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), a: alpha };
  }
  if (color === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  return readThroughCanvas(color);
};

const toLinear = (channel: number) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/** WCAG 2.1 relative luminance, from 0 (black) to 1 (white). */
export const luminance = ({ r, g, b }: Rgba): number => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

export const contrast = (first: Rgba, second: Rgba): number => {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
};

export const toCss = ({ r, g, b }: Rgba): string => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
