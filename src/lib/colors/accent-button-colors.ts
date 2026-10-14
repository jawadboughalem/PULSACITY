import { HEX_COLOR_PATTERN, calculateContrastRatio } from "./contrast-ratio";

/** Charte v2: the text of a button on the creator's accent is white if it reaches 4.5:1, otherwise Encre. */
const MIN_TEXT_CONTRAST_RATIO = 4.5;

const WHITE = "#FFFFFF";
const INK = "#16213E";

/** Charte v2, Bouton de la page de collecte: hovered, the accent darkened by 8 %. */
const HOVER_DARKENING = 0.08;

export type AccentButtonColors = {
  background: string;
  text: string;
  hover: string;
};

const darken = (hexColor: string, amount: number) =>
  `#${[1, 3, 5]
    .map((start) => Math.round(Number.parseInt(hexColor.slice(start, start + 2), 16) * (1 - amount)))
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;

/**
 * The colours of the collection page's button for a creator's accent. Without an accent (or an unreadable one): null,
 * the button keeps Soleil and Encre.
 */
export const readAccentButtonColors = (accentColor: string | null): AccentButtonColors | null => {
  if (!accentColor || !HEX_COLOR_PATTERN.test(accentColor)) return null;
  const background = accentColor.toUpperCase();
  return {
    background,
    text: calculateContrastRatio(background, WHITE) >= MIN_TEXT_CONTRAST_RATIO ? WHITE : INK,
    hover: darken(background, HOVER_DARKENING),
  };
};
