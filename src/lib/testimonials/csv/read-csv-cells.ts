import { type CalendarDate, compareCalendarDates } from "@/lib/dates/paris-date";

const RATING_PATTERN = /^([1-5])(?:[.,]0+)?(?:\s*\/\s*5)?$/;
const STARS_PATTERN = /^[★⭐]{1,5}$/u;
const FRENCH_DATE_PATTERN = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4}|\d{2})$/;
const ISO_DATE_PATTERN = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ][\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?$/;

export const readCsvRating = (cell: string): number | null => {
  const value = cell.trim();
  if (STARS_PATTERN.test(value)) return [...value].length;
  const match = RATING_PATTERN.exec(value);
  return match ? Number(match[1]) : null;
};

const toCalendarDate = (year: number, month: number, day: number): CalendarDate | null => {
  const date = new Date(Date.UTC(year, month - 1, day));
  const isReal = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return isReal ? { year, month, day } : null;
};

export const readCsvDate = (cell: string): CalendarDate | null => {
  const value = cell.trim();
  const french = FRENCH_DATE_PATTERN.exec(value);
  if (french) {
    const year = french[3].length === 2 ? 2000 + Number(french[3]) : Number(french[3]);
    return toCalendarDate(year, Number(french[2]), Number(french[1]));
  }
  const iso = ISO_DATE_PATTERN.exec(value);
  return iso ? toCalendarDate(Number(iso[1]), Number(iso[2]), Number(iso[3])) : null;
};

export const isAfterDay = (date: CalendarDate, today: CalendarDate): boolean => compareCalendarDates(date, today) > 0;

/** Noon UTC keeps the same calendar day from Hawaii to New Zealand. */
export const calendarDateToTimestamp = ({ year, month, day }: CalendarDate): Date =>
  new Date(Date.UTC(year, month - 1, day, 12));
