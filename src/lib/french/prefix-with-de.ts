const VOWEL_INITIAL = /^[aeiouœæ]/i;

const VOWEL_OR_H_INITIAL = /^[aeiouœæh]/i;

/** The name of a person reads « d'Hugo », « d'Hélène »: the h of a first name is mute. A brand keeps « de Happy ». */
export const prefixPersonWithDe = (name: string): string =>
  VOWEL_OR_H_INITIAL.test(name.normalize("NFD")) ? `d'${name}` : `de ${name}`;

export const prefixWithDe = (name: string): string =>
  VOWEL_INITIAL.test(name.normalize("NFD")) ? `d'${name}` : `de ${name}`;

/** « qu'Atelier Nomade publie », « que Julie Nutrition publie ». */
export const prefixWithQue = (name: string): string =>
  VOWEL_INITIAL.test(name.normalize("NFD")) ? `qu'${name}` : `que ${name}`;
