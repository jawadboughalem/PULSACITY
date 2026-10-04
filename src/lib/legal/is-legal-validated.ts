/** LEGAL_VALIDATED=true once a lawyer has read the legal texts: until then, they show as drafts and stay out of search. */
export const isLegalValidated = (): boolean => process.env.LEGAL_VALIDATED === "true";
