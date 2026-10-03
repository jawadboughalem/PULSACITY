/** « 297 € », « 9,99 € »: the cents only when there are some. */
export const formatPrice = (amountCents: number, currency: string): string =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
