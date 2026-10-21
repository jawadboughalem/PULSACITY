/**
 * The person who sells PULSACITY and publishes the site, as the law asks a private seller to show it (lot 4.9): their
 * name, postal address and mobile number. Personal: they come from Vercel variables the founder types in, never from
 * this public repository. A preview without them shows what is missing.
 */
export const LEGAL_PUBLISHER_FIELDS = {
  name: "LEGAL_PUBLISHER_NAME",
  address: "LEGAL_PUBLISHER_ADDRESS",
  phone: "LEGAL_PUBLISHER_PHONE",
} as const;

export type LegalPublisherField = keyof typeof LEGAL_PUBLISHER_FIELDS;

export type LegalPublisher = Record<LegalPublisherField, string | null>;

/** What each placeholder says on a preview, until its variable is filled in. */
export const LEGAL_PUBLISHER_PLACEHOLDERS: Record<LegalPublisherField, string> = {
  name: "prénom et nom de l'exploitant",
  address: "adresse de l'exploitant",
  phone: "numéro de mobile de l'exploitant",
};

/** One line, spaces gathered: a value typed in Vercel can carry a line break or a trailing space. */
const readValue = (name: string): string | null => {
  const value = process.env[name]?.replace(/\s+/g, " ").trim();
  return value ? value : null;
};

export const readLegalPublisher = (): LegalPublisher => ({
  name: readValue(LEGAL_PUBLISHER_FIELDS.name),
  address: readValue(LEGAL_PUBLISHER_FIELDS.address),
  phone: readValue(LEGAL_PUBLISHER_FIELDS.phone),
});

export const isLegalPublisherComplete = (publisher: LegalPublisher = readLegalPublisher()): boolean =>
  Object.values(publisher).every((value) => value !== null);

/** « Julie Martin · 12 rue des Lilas, 69003 Lyon »: the sender under « PULSACITY » in its e-mails, or null. */
export const formatPublisherPostalLine = (publisher: LegalPublisher = readLegalPublisher()): string | null =>
  publisher.name && publisher.address ? `${publisher.name} · ${publisher.address}` : null;
