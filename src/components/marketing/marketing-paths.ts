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
  help: "/aide",
  /** « Écrivez-nous » of /aide, where the footer's « Contact » and every « Écrivez-nous » lead. */
  contact: "/aide#contact",
} as const;

export const integrationPath = (slug: string) => `${MARKETING_PATHS.integrations}/${slug}`;

export const guidePath = (slug: string) => `${MARKETING_PATHS.guides}/${slug}`;
