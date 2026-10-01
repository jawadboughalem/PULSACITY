const PARIS = "Europe/Paris";

const DAY_MONTH = new Intl.DateTimeFormat("fr-FR", { timeZone: PARIS, day: "numeric", month: "short" });

const DAY_MONTH_YEAR = new Intl.DateTimeFormat("fr-FR", {
  timeZone: PARIS,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const HOUR_MINUTE = new Intl.DateTimeFormat("fr-FR", { timeZone: PARIS, hour: "2-digit", minute: "2-digit" });

/** « 27 sept. » */
export const formatDayMonth = (date: Date): string => DAY_MONTH.format(date);

/** « 26 sept. 2026 » */
export const formatDayMonthYear = (date: Date): string => DAY_MONTH_YEAR.format(date);

/** « 26 sept. 2026 à 21:47 » */
export const formatDateTime = (date: Date): string => `${DAY_MONTH_YEAR.format(date)} à ${HOUR_MINUTE.format(date)}`;
