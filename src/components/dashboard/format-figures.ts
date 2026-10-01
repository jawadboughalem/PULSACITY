import { NO_BREAK_SPACE } from "@/lib/french/typography";

const AVERAGE_FORMAT = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const NO_FIGURE = "–";

export const formatAverageRating = (averageRating: number | null): string =>
  averageRating === null ? NO_FIGURE : `${AVERAGE_FORMAT.format(averageRating)}/5`;

export const formatResponseRate = (answered: number, sent: number): string =>
  sent === 0 ? NO_FIGURE : `${Math.round((answered / sent) * 100)}${NO_BREAK_SPACE}%`;

export const pluralize = (count: number, singular: string, plural: string): string =>
  `${count} ${count > 1 ? plural : singular}`;
