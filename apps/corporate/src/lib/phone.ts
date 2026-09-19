/**
 * French phone numbers, normalised to E.164.
 *
 * Leads are called back, so a number that cannot be dialled is worse than no lead:
 * anything that is not a valid French number is rejected rather than stored as-is.
 */
export interface PhoneParseResult {
  ok: boolean;
  e164?: string;
}

/** `06 12 34 56 78`, `+33 6 12 34 56 78`, `0033612345678` → `+33612345678`. */
export function parseFrenchPhone(input: string): PhoneParseResult {
  const cleaned = input.replace(/[\s.\-()\u00a0\u202f/]/g, '');

  let national: string | undefined;
  if (/^\+33[1-9]\d{8}$/.test(cleaned)) {
    national = cleaned.slice(3);
  } else if (/^0033[1-9]\d{8}$/.test(cleaned)) {
    national = cleaned.slice(4);
  } else if (/^33[1-9]\d{8}$/.test(cleaned)) {
    national = cleaned.slice(2);
  } else if (/^0[1-9]\d{8}$/.test(cleaned)) {
    national = cleaned.slice(1);
  }

  if (!national) return { ok: false };
  return { ok: true, e164: `+33${national}` };
}

/** Formats an E.164 French number for display: `+33612345678` → `06 12 34 56 78`. */
export function formatFrenchPhone(e164: string): string {
  const match = /^\+33([1-9]\d{8})$/.exec(e164);
  if (!match?.[1]) return e164;
  return `0${match[1]}`.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}
