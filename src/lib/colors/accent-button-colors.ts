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

/** Charte v2, ajouts 3.6, Page de collecte: the creator's identity on a tint of their accent, the accent at 9 % on Blanc. */
const TINT_STRENGTH = 0.09;

export const readAccentTint = (accentColor: string | null): string | null => {
  if (!accentColor || !HEX_COLOR_PATTERN.test(accentColor)) return null;
  return `#${[1, 3, 5]
    .map((start) => Math.round(255 - (255 - Number.parseInt(accentColor.slice(start, start + 2), 16)) * TINT_STRENGTH))
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
};

/** Charte v2, ajouts 3.6, Page de collecte: the stars take the accent if it reaches 3:1 on Blanc, otherwise Encre. */
const MIN_STAR_CONTRAST_RATIO = 3;

/**
 * The colour of the chosen stars of the collect page, fill and outline. Null without an accent: Soleil with its Encre
 * outline, like everywhere else.
 */
export const readAccentStarColor = (accentColor: string | null): string | null => {
  if (!accentColor || !HEX_COLOR_PATTERN.test(accentColor)) return null;
  return calculateContrastRatio(accentColor, WHITE) >= MIN_STAR_CONTRAST_RATIO ? accentColor.toUpperCase() : INK;
};
