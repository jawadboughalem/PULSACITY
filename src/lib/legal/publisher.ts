/**
 * The person who sells PULSACITY and publishes the site (lot 4.9): their first and last name, from a Vercel variable
 * the founder types in, never from this public repository. No postal address and no phone number are published
 * (founder's decision of 21 October 2026). Without the variable, the sentences that name them leave the name out.
 */
export const LEGAL_PUBLISHER_NAME_VARIABLE = "LEGAL_PUBLISHER_NAME";

/** One line, spaces gathered: a value typed in Vercel can carry a line break or a trailing space. */
export const readLegalPublisherName = (): string | null => {
  const value = process.env[LEGAL_PUBLISHER_NAME_VARIABLE]?.replace(/\s+/g, " ").trim();
  return value ? value : null;
};
