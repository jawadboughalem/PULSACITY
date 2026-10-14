/** Every address the public site links to, so that a renamed page leaves no dead link behind. */
export const MARKETING_PATHS = {
  home: "/",
  pricing: "/tarifs",
  integrations: "/integrations",
  guides: "/guides",
  signUp: "/inscription",
  signIn: "/connexion",
  legalNotice: "/mentions-legales",
  terms: "/cgu",
  salesTerms: "/cgv",
  privacy: "/confidentialite",
  cookies: "/confidentialite#cookies",
  /** No support address yet (etat.md, « Questions ouvertes »): the publisher's contact details. */
  contact: "/mentions-legales#contact",
} as const;

/** « Écrivez-nous »: the one address (CLAUDE.md), until the form of /aide (lot 4.4). */
export const WRITE_TO_US_HREF = "mailto:contact@pulsacity.com";

export const integrationPath = (slug: string) => `${MARKETING_PATHS.integrations}/${slug}`;

export const guidePath = (slug: string) => `${MARKETING_PATHS.guides}/${slug}`;
