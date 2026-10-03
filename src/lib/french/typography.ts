export const NO_BREAK_SPACE = " ";

export const quoteInFrench = (text: string): string => `«${NO_BREAK_SPACE}${text}${NO_BREAK_SPACE}»`;

/** A sentence that ends on « sept. » or « Élodie V. » takes no second full stop. */
export const endSentence = (text: string): string => (text.endsWith(".") ? text : `${text}.`);
