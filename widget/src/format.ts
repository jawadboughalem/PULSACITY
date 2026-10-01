const NO_BREAK_SPACE = " ";

const AVERAGE_FORMAT = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const DAY_FORMAT = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** « 4,8/5 » */
export const formatAverage = (average: number): string => `${AVERAGE_FORMAT.format(average)}/5`;

/** « 12 sept. 2026 », for a day written 2026-09-12. */
export const formatDay = (isoDay: string): string => DAY_FORMAT.format(new Date(`${isoDay}T12:00:00Z`));

export const quoteInFrench = (text: string): string => `«${NO_BREAK_SPACE}${text.trim()}${NO_BREAK_SPACE}»`;

export const describeRating = (rating: number): string => `${rating} sur 5`;

export const describeSummary = (average: number | null, total: number): string =>
  average === null ? `${total} avis` : `Note moyenne ${AVERAGE_FORMAT.format(average)} sur 5, ${total} avis`;

export const summarize = (average: number | null, total: number): string =>
  average === null ? `${total} avis` : `${formatAverage(average)} · ${total} avis`;

export const describeMore = (count: number): string => (count === 1 ? "Voir l'autre avis" : `Voir les ${count} autres avis`);
