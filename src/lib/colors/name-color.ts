const toHsl = (hexColor: string) => {
  const [r, g, b] = [1, 3, 5].map((start) => Number.parseInt(hexColor.slice(start, start + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return { hue: 0, saturation: 0, lightness };
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue: number;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  return { hue: (hue * 60 + 360) % 360, saturation, lightness };
};

const HUE_NAMES: Array<[upTo: number, name: string]> = [
  [15, "Rouge"],
  [42, "Orange"],
  [70, "Jaune"],
  [170, "Vert"],
  [200, "Turquoise"],
  [255, "Bleu"],
  [290, "Violet"],
  [345, "Rose"],
  [360, "Rouge"],
];

/** « Vert » for #4F6F52: the editor says « Vert de votre page » rather than a code alone. */
export const nameColor = (hexColor: string): string => {
  const { hue, saturation, lightness } = toHsl(hexColor);
  if (lightness < 0.1) return "Noir";
  if (lightness > 0.94) return "Blanc";
  if (saturation < 0.1) return "Gris";
  if (hue >= 15 && hue < 42 && lightness < 0.4) return "Brun";
  return HUE_NAMES.find(([upTo]) => hue < upTo)?.[1] ?? "Rouge";
};
