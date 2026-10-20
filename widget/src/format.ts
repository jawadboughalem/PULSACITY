const NO_BREAK_SPACE = "\u00a0";

const AVERAGE_FORMAT = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const DAY_FORMAT = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const MONTH_FORMAT = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });

/** « 4,8/5 » */
export const formatAverage = (average: number): string => `${AVERAGE_FORMAT.format(average)}/5`;

/** « 12 sept. 2026 », for a day written 2026-09-12; the first of a month, « 1er juil. 2026 ». */
export const formatDay = (isoDay: string): string =>
  DAY_FORMAT.formatToParts(new Date(`${isoDay}T12:00:00Z`))
    .map((part) => (part.type === "day" && part.value === "1" ? "1er" : part.value))
    .join("");

/** « août 2026 », for a month written 2026-08. */
export const formatMonth = (isoMonth: string): string => MONTH_FORMAT.format(new Date(`${isoMonth}-15T12:00:00Z`));

const unbreakable = (text: string) => text.replace(/ /g, NO_BREAK_SPACE);

/**
 * « Avis du 12 sept. 2026, achat en août 2026 » (lot 4.13): two unbreakable pieces, cut at the comma when the line is
 * short. Without a purchase PULSACITY knows, the day of the review alone.
 */
export const describeDates = (isoDay: string, isoMonth: string | undefined): string =>
  isoMonth
    ? `${unbreakable(`Avis du ${formatDay(isoDay)}`)}, ${unbreakable(`achat en ${formatMonth(isoMonth)}`)}`
    : unbreakable(`Avis du ${formatDay(isoDay)}`);

/** Under a wall or a carousel: the selection is announced (positionnement.md, point 5). */
export const describeSelection = (space: string): string =>
  `Sélection de ${space}${NO_BREAK_SPACE}: avis mis en avant, puis les plus récents.`;

export const INCENTIVE_NOTE = "Certains clients ont reçu une contrepartie pour leur avis.";

export const ABOUT_REVIEWS = "À propos de ces avis";

export const quoteInFrench = (text: string): string => `«${NO_BREAK_SPACE}${text.trim()}${NO_BREAK_SPACE}»`;

export const describeRating = (rating: number): string => `${rating} sur 5`;

export const describeSummary = (average: number | null, total: number): string =>
  average === null ? `${total} avis` : `Note moyenne ${AVERAGE_FORMAT.format(average)} sur 5, ${total} avis`;

/** « 4,8/5 · 47 avis », which can only break after the dot when the badge is narrow. */
export const summarize = (average: number | null, total: number): string => {
  const count = `${total}${NO_BREAK_SPACE}avis`;
  return average === null ? count : `${formatAverage(average)}${NO_BREAK_SPACE}· ${count}`;
};

export const describeMore = (count: number): string => (count === 1 ? "Voir l'autre avis" : `Voir les ${count} autres avis`);
