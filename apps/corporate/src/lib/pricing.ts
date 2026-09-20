/**
 * Money rules that do not belong to any one offer.
 *
 * What a line costs lives in `content/lines/<slug>.json`, read server-side at
 * checkout — never sent by the browser, never an environment variable. This file
 * holds only the currency, the VAT wording and the French formatting.
 */
export const CURRENCY = 'eur' as const;

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
