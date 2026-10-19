export const NO_BREAK_SPACE = " ";

export const quoteInFrench = (text: string): string => `«${NO_BREAK_SPACE}${text}${NO_BREAK_SPACE}»`;

/** A sentence that ends on « sept. » or « Élodie V. » takes no second full stop. */
export const endSentence = (text: string): string => (text.endsWith(".") ? text : `${text}.`);

/** « Clara T. » on one line: the initial never goes alone to the next line. */
export const keepInitialAttached = (name: string): string => name.replace(/ (\p{Lu}\.)$/u, `${NO_BREAK_SPACE}$1`);
