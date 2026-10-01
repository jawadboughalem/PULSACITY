import { type Rgba, contrast, parseColor, toCss } from "./colors";
import type { PageContext, Tone } from "./page";
import type { WidgetTheme } from "./payload";

const INK = "#16213E";
const CARMINE_LIGHT = "#F08A9A";
const DARK_TEXT = "#EDEEF0";

/** The charter's neutrals of the widget, in each theme. */
const CARD_COLORS = {
  light: { background: "#FFFFFF", line: "#D8D9DD", muted: "#5A5F6E", avatar: "#F3F3F0", skeleton: "#F3F3F0" },
  dark: { background: "#22262D", line: "#2F343D", muted: "#A4A8B1", avatar: "#2F343D", skeleton: "#2F343D" },
} as const;

const PAGE_COLORS = {
  light: { muted: "#5A5F6E", control: "#FFFFFF", hover: "#F3F3F0" },
  dark: { muted: "#A4A8B1", control: "transparent", hover: "#2F343D" },
} as const;

const STAR_EMPTY = "#7E8390";

const TEXT_CONTRAST = 4.5;

/** The charter asks 3:1 of the accent on what it sits on. */
const ACCENT_CONTRAST = 3;

const FALLBACK_ACCENT: Record<Tone, string> = { light: INK, dark: CARMINE_LIGHT };

const FALLBACK_TEXT: Record<Tone, string> = { light: INK, dark: DARK_TEXT };

const readableOn = (color: Rgba | null, background: string | Rgba, ratio: number): color is Rgba => {
  const surface = typeof background === "string" ? parseColor(background) : background;
  return color !== null && surface !== null && contrast(color, surface) >= ratio;
};

export const resolveCardTone = (theme: WidgetTheme, page: PageContext): Tone => (theme === "auto" ? page.tone : theme);

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
  const around = PAGE_COLORS[page.tone];
  const accent = parseColor(accentColor) ?? parseColor(linkColor);
  const cardText =
    cardTone === "dark" ? DARK_TEXT : readableOn(page.text, card.background, TEXT_CONTRAST) ? toCss(page.text) : INK;
  const pageText = readableOn(page.text, page.background, TEXT_CONTRAST) ? toCss(page.text) : FALLBACK_TEXT[page.tone];

  return {
    "--card-bg": card.background,
    "--card-line": card.line,
    "--card-text": cardText,
    "--card-muted": card.muted,
    "--card-avatar": card.avatar,
    "--card-skeleton": card.skeleton,
    "--card-accent": readableOn(accent, card.background, ACCENT_CONTRAST) ? toCss(accent) : FALLBACK_ACCENT[cardTone],
    "--star-empty": STAR_EMPTY,
    "--page-text": pageText,
    "--page-muted": around.muted,
    "--page-accent": readableOn(accent, page.background, ACCENT_CONTRAST) ? toCss(accent) : FALLBACK_ACCENT[page.tone],
    "--control-bg": around.control,
    "--hover": around.hover,
  };
};
