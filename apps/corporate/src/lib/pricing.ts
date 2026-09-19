/**
 * The price. One product, one price, no option, no discount (CLAUDE.md rule 7).
 *
 * These are constants, never environment variables: an operator must not be able to
 * change what PULSACITY sells by editing a dashboard.
 */
export const CURRENCY = 'eur' as const;

/** 500 € HT, in cents. */
export const PRICE_HT_CENTS = 50_000;
/** Renewal from year 2, in cents. */
export const RENEWAL_HT_CENTS = 9_900;
/** One change outside the package, in cents. */
export const EXTRA_CHANGE_HT_CENTS = 4_900;

export const PRODUCT_NAME = 'Site vitrine PULSACITY — 500 € HT tout compris';

/** VAT rate applied in `standard` mode, as a percentage. */
export const STANDARD_VAT_PERCENT = 20;

/** Invoice footer required of a micro-entreprise under the VAT franchise. */
export const VAT_FRANCHISE_NOTICE = 'TVA non applicable, art. 293 B du CGI';

/** French formatting: « 500 € », « 99 € », « 12,50 € ». */
export function formatEur(cents: number): string {
  const hasCents = cents % 100 !== 0;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  })
    .format(cents / 100)
    .replace(/\u202f|\u00a0/g, '\u00a0');
}

/** « 500 € HT ». */
export function formatEurHt(cents: number): string {
  return `${formatEur(cents)}\u00a0HT`;
}
