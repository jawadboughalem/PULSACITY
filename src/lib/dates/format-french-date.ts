const PARIS = "Europe/Paris";

const DAY_MONTH = new Intl.DateTimeFormat("fr-FR", { timeZone: PARIS, day: "numeric", month: "short" });

const DAY_MONTH_YEAR = new Intl.DateTimeFormat("fr-FR", {
  timeZone: PARIS,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const LONG_DATE = new Intl.DateTimeFormat("fr-FR", { timeZone: PARIS, day: "numeric", month: "long", year: "numeric" });

const LONG_DAY_MONTH = new Intl.DateTimeFormat("fr-FR", { timeZone: PARIS, day: "numeric", month: "long" });

const MONTH_YEAR = new Intl.DateTimeFormat("fr-FR", { timeZone: PARIS, month: "long", year: "numeric" });

const HOUR_MINUTE = new Intl.DateTimeFormat("fr-FR", { timeZone: PARIS, hour: "2-digit", minute: "2-digit" });

/** French writes the first day of a month « 1er ». */
const withFirstDay = (formatted: string): string => formatted.replace(/^1 /, "1er ");

/** « 27 sept. », « 1er oct. » */
export const formatDayMonth = (date: Date): string => withFirstDay(DAY_MONTH.format(date));

/** « 26 sept. 2026 » */
export const formatDayMonthYear = (date: Date): string => withFirstDay(DAY_MONTH_YEAR.format(date));

/** « 4 octobre 2026 », « 1er octobre 2026 »: the dates of the public site's texts (m22, m23). */
export const formatLongDate = (date: Date): string => withFirstDay(LONG_DATE.format(date));

/** « 12 novembre », « 1er janvier »: a date of the coming months, in a sentence (Abonnement et factures). */
export const formatLongDayMonth = (date: Date): string => withFirstDay(LONG_DAY_MONTH.format(date));

/** « 26 sept. 2026 à 21:47 » */
export const formatDateTime = (date: Date): string =>
  `${withFirstDay(DAY_MONTH_YEAR.format(date))} à ${HOUR_MINUTE.format(date)}`;

/** « 12 oct. 2026 à 15 h 40 » (3.3, the export of Mon compte). */
export const formatDateAtHour = (date: Date): string =>
  `${formatDayMonthYear(date)} à ${HOUR_MINUTE.format(date).replace(":", "\u00a0h\u00a0")}`;

/** « août 2026 »: the month of a purchase (« achat en août 2026 », maquettes 3.6). */
export const formatMonthYear = (date: Date): string => MONTH_YEAR.format(date);
