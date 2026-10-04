import type { Guide } from "@/content/guides";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";

/** Noon in Paris, so that the day never slips across midnight, whatever the time zone of the build. */
export const readGuideDate = (day: string): Date => new Date(`${day}T12:00:00+02:00`);

/** « Mis à jour le 4 oct. 2026 · 6 minutes de lecture » */
export const formatGuideMeta = (guide: Guide): string =>
  `Mis à jour le ${formatDayMonthYear(readGuideDate(guide.updatedAt))} · ${guide.readingMinutes} minutes de lecture`;
