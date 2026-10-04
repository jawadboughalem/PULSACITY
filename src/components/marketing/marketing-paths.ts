/** Every address the public site links to, so that a renamed page leaves no dead link behind. */
export const MARKETING_PATHS = {
  home: "/",
  howItWorks: "/#fonctionnement",
  questions: "/#questions",
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

export const integrationPath = (slug: string) => `${MARKETING_PATHS.integrations}/${slug}`;

export const guidePath = (slug: string) => `${MARKETING_PATHS.guides}/${slug}`;
