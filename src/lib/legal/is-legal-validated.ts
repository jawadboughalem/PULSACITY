/** LEGAL_VALIDATED=true once the founder validates the legal texts: until then, they show as drafts and stay out of search. */
export const isLegalValidated = (): boolean => process.env.LEGAL_VALIDATED === "true";
