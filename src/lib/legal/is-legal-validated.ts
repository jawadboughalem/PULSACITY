import { isLegalPublisherComplete } from "./publisher";

/**
 * LEGAL_VALIDATED=true once the founder validates the legal texts: until then, they show as drafts and stay out of
 * search. A text whose publisher is still missing (name, address, phone) stays a draft whatever the variable says.
 */
export const isLegalValidated = (): boolean => process.env.LEGAL_VALIDATED === "true" && isLegalPublisherComplete();
