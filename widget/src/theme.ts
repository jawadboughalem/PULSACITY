import { type Rgba, contrast, luminance, parseColor, toCss } from "./colors";
import type { PageContext, Tone } from "./page";
import type { WidgetTheme } from "./payload";

const INK = "#16213E";
const SUN = "#FFBE3B";
const DARK_TEXT = "#EDEEF0";

/** Charte v2, Widget: the neutrals of the cards, in each theme. No border, no shadow. */
const CARD_COLORS = {
  light: { background: "#F2F4F8", muted: "#565B6B", avatar: "#DCEBFF", skeleton: "#DCEBFF" },
  dark: { background: "#22262D", muted: "#A4A8B1", avatar: "#2F343D", skeleton: "#2F343D" },
} as const;

/** On a page already tinted, light cards turn white so that they stand out (charte v2, ajouts 3.6). */
const WHITE_CARD = "#FFFFFF";
const TINTED_PAGE_LUMINANCE_GAP = 0.06;

/** Around the cards (summary, arrows, points, mentions), the widget sits on the page and follows it. */
const PAGE_COLORS = {
  light: { muted: "#565B6B", hover: "rgba(22, 33, 62, 0.06)" },
  dark: { muted: "#A4A8B1", hover: "rgba(237, 238, 240, 0.1)" },
} as const;

const STAR_EMPTY = "#7E8390";

const TEXT_CONTRAST = 4.5;

/** The charter asks 3:1 of the accent on what it sits on. */
const ACCENT_CONTRAST = 3;

/** An accent too pale: stars in Encre on light cards, in Soleil on dark ones (maquettes 3.6, « Thèmes »). */
const FALLBACK_ACCENT: Record<Tone, string> = { light: INK, dark: SUN };

const FALLBACK_TEXT: Record<Tone, string> = { light: INK, dark: DARK_TEXT };

const readableOn = (color: Rgba | null, background: string | Rgba, ratio: number): color is Rgba => {
  const surface = typeof background === "string" ? parseColor(background) : background;
  return color !== null && surface !== null && contrast(color, surface) >= ratio;
};

export const resolveCardTone = (theme: WidgetTheme, page: PageContext): Tone => (theme === "auto" ? page.tone : theme);

const readCardBackground = (tone: Tone, page: PageContext): string => {
  if (tone === "dark") return CARD_COLORS.dark.background;
  const lightCard = parseColor(CARD_COLORS.light.background) as Rgba;
  const isPageTinted = Math.abs(luminance(page.background) - luminance(lightCard)) < TINTED_PAGE_LUMINANCE_GAP;
  return isPageTinted ? WHITE_CARD : CARD_COLORS.light.background;
};

/**
 * Inside the cards, the widget follows its theme. Around them (summary, arrows, points, « Propulsé par »),
 * it sits on the page itself, so it follows the page.
 */
export const buildColorVariables = (
  theme: WidgetTheme,
  accentColor: string | null,
  linkColor: string | null,
  page: PageContext,
): Record<string, string> => {
  const cardTone = resolveCardTone(theme, page);
  const card = CARD_COLORS[cardTone];
  const cardBackground = readCardBackground(cardTone, page);
  const around = PAGE_COLORS[page.tone];
  const accent = parseColor(accentColor) ?? parseColor(linkColor);
  const cardText =
    cardTone === "dark" ? DARK_TEXT : readableOn(page.text, cardBackground, TEXT_CONTRAST) ? toCss(page.text) : INK;
  const pageText = readableOn(page.text, page.background, TEXT_CONTRAST) ? toCss(page.text) : FALLBACK_TEXT[page.tone];

  return {
    "--card-bg": cardBackground,
    "--card-text": cardText,
    "--card-muted": card.muted,
    "--card-avatar": card.avatar,
    "--card-skeleton": card.skeleton,
    "--card-accent": readableOn(accent, cardBackground, ACCENT_CONTRAST) ? toCss(accent) : FALLBACK_ACCENT[cardTone],
    "--star-empty": STAR_EMPTY,
    "--page-text": pageText,
    "--page-muted": around.muted,
    "--page-accent": readableOn(accent, page.background, ACCENT_CONTRAST) ? toCss(accent) : FALLBACK_ACCENT[page.tone],
    "--hover": around.hover,
  };
};
