const VOWEL_INITIAL = /^[aeiouœæ]/i;

export const prefixWithDe = (name: string): string =>
  VOWEL_INITIAL.test(name.normalize("NFD")) ? `d'${name}` : `de ${name}`;
