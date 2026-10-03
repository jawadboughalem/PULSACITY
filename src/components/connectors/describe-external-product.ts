import type { ExternalProductRow } from "@/lib/connectors/load-connection-overview";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { formatSince } from "@/lib/dates/format-relative-time";
import { formatPrice } from "@/lib/french/format-price";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

/**
 * « 297 € · première vente le 28 août 2026 », « 590 € · première vente hier à 18:42 ». A formation joined without a
 * sale: « première inscription le … ».
 */
export const describeExternalProduct = (
  product: Pick<ExternalProductRow, "priceCents" | "currency" | "firstSeenAt" | "eventType">,
  now: Date,
): string => {
  const firstSale =
    now.getTime() - product.firstSeenAt.getTime() < TWO_DAYS_MS
      ? formatSince(product.firstSeenAt, now)
      : `le ${formatDayMonthYear(product.firstSeenAt)}`;
  const price =
    product.priceCents !== null && product.currency ? formatPrice(product.priceCents, product.currency) : null;
  const first = product.eventType === "enrollment" ? "première inscription" : "première vente";
  return [price, `${first} ${firstSale}`].filter(Boolean).join(" · ");
};
