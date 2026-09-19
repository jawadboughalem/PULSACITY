/**
 * `franchise` — micro-entreprise under the VAT franchise: 500 € collected, invoice
 *               footer « TVA non applicable, art. 293 B du CGI ».
 * `standard`  — VAT-registered (SASU): 20 % exclusive VAT, i.e. 600 € TTC.
 */
export type VatMode = 'franchise' | 'standard';

export const VAT_MODES: readonly VatMode[] = ['franchise', 'standard'];
