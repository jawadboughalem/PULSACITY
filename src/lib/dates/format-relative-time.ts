import { compareCalendarDates, readParisDate } from "./paris-date";

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const PARIS = "Europe/Paris";

const HOUR_MINUTE = new Intl.DateTimeFormat("fr-FR", { timeZone: PARIS, hour: "2-digit", minute: "2-digit" });

const DAY_MONTH = new Intl.DateTimeFormat("fr-FR", { timeZone: PARIS, day: "numeric", month: "short" });

type Moment = { kind: "now" } | { kind: "minutes"; minutes: number } | { kind: "day"; day: "today" | "yesterday" | "other"; date: Date };

const readDay = (date: Date, now: Date): "today" | "yesterday" | "other" => {
  const day = readParisDate(date);
  if (compareCalendarDates(day, readParisDate(now)) === 0) return "today";
  if (compareCalendarDates(day, readParisDate(new Date(now.getTime() - DAY_MS))) === 0) return "yesterday";
  return "other";
};

const readMoment = (date: Date, now: Date): Moment => {
  const elapsed = now.getTime() - date.getTime();
  if (elapsed < MINUTE_MS) return { kind: "now" };
  if (elapsed < HOUR_MS) return { kind: "minutes", minutes: Math.floor(elapsed / MINUTE_MS) };
  return { kind: "day", day: readDay(date, now), date };
};

/** In a sentence: « il y a 3 min », « aujourd'hui à 14:20 », « hier à 18:42 », « le 25 sept. à 10:05 ». */
export const formatSince = (date: Date, now: Date): string => {
  const moment = readMoment(date, now);
  if (moment.kind === "now") return "à l'instant";
  if (moment.kind === "minutes") return `il y a ${moment.minutes} min`;
  const time = HOUR_MINUTE.format(moment.date);
  if (moment.day === "today") return `aujourd'hui à ${time}`;
  if (moment.day === "yesterday") return `hier à ${time}`;
  return `le ${DAY_MONTH.format(moment.date)} à ${time}`;
};

/** After « depuis »: « aujourd'hui à 09:10 », « hier à 18:42 », « le 25 sept. à 10:05 ». */
export const formatMoment = (date: Date, now: Date): string => {
  const day = readDay(date, now);
  const time = HOUR_MINUTE.format(date);
  if (day === "today") return `aujourd'hui à ${time}`;
  if (day === "yesterday") return `hier à ${time}`;
  return `le ${DAY_MONTH.format(date)} à ${time}`;
};

/** In a list: « Il y a 3 min », « Aujourd'hui, 14:20 », « Hier, 18:42 », « 25 sept., 10:05 ». */
export const formatListTime = (date: Date, now: Date): string => {
  const moment = readMoment(date, now);
  if (moment.kind === "now") return "À l'instant";
  if (moment.kind === "minutes") return `Il y a ${moment.minutes} min`;
  const time = HOUR_MINUTE.format(moment.date);
  if (moment.day === "today") return `Aujourd'hui, ${time}`;
  if (moment.day === "yesterday") return `Hier, ${time}`;
  return `${DAY_MONTH.format(moment.date)}, ${time}`;
};
