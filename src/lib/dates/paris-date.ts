const PARIS_TIME_ZONE = "Europe/Paris";

export type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

const PARIS_PARTS_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: PARIS_TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

const readParisParts = (date: Date) => {
  const parts = Object.fromEntries(
    PARIS_PARTS_FORMAT.formatToParts(date).map((part) => [part.type, Number(part.value)] as const),
  );
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
};

const readParisOffsetMs = (date: Date): number => {
  const parts = readParisParts(date);
  const wallClock = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return wallClock - Math.floor(date.getTime() / 1000) * 1000;
};

export const readParisDate = (date: Date): CalendarDate => {
  const { year, month, day } = readParisParts(date);
  return { year, month, day };
};

/** Midnight in Paris on the first day of the month that contains `now`. Paris never changes time at midnight. */
export const startOfParisMonth = (now: Date): Date => {
  const { year, month } = readParisParts(now);
  const midnightUtc = Date.UTC(year, month - 1, 1);
  return new Date(midnightUtc - readParisOffsetMs(new Date(midnightUtc)));
};

/** Midnight in Paris on the first day of the next month: when the requests held by a plan's limit leave. */
export const startOfNextParisMonth = (now: Date): Date =>
  startOfParisMonth(new Date(startOfParisMonth(now).getTime() + 32 * 24 * 60 * 60 * 1000));

export const compareCalendarDates = (left: CalendarDate, right: CalendarDate): number =>
  left.year - right.year || left.month - right.month || left.day - right.day;

/** « 2026-09-26 » for the day `date` falls on in Paris. */
export const toParisIsoDay = (date: Date): string => {
  const { year, month, day } = readParisDate(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};
