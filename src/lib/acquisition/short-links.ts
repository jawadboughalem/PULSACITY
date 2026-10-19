import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { type SignupSource, withSignupSource } from "./signup-source";

type ShortLink = { source: string; medium: string; path?: string };

/**
 * The short links /go/… (decisions/commercialisation.md, « Attribution »): one per channel of the plan, easy to read
 * aloud or to type, each giving the visit its UTM words. Any other word works too: /go/marie-coach counts as a
 * « lien-court » visit of the campaign « marie-coach », with no new delivery.
 */
export const SHORT_LINKS: Record<string, ShortLink> = {
  facebook: { source: "facebook", medium: "groupe" },
  communaute: { source: "communaute", medium: "groupe" },
  linkedin: { source: "linkedin", medium: "social" },
  instagram: { source: "instagram", medium: "social" },
  youtube: { source: "youtube", medium: "video" },
  webinaire: { source: "webinaire", medium: "partenaire" },
  tarifs: { source: "lien-court", medium: "lien", path: MARKETING_PATHS.pricing },
};

/** The campaign of an unknown short link is its word: lowercase letters, digits and dashes, 40 at most. */
const SHORT_LINK_WORD = /^[a-z0-9][a-z0-9-]{0,39}$/;

/** Where a short link leads, with its source in the address; the home page for a word that cannot be one. */
export const resolveShortLink = (word: string): string => {
  const slug = word.toLowerCase();
  const known = Object.hasOwn(SHORT_LINKS, slug) ? SHORT_LINKS[slug] : undefined;
  if (known !== undefined) {
    const source: SignupSource = { utm_source: known.source, utm_medium: known.medium, utm_campaign: slug };
    return withSignupSource(known.path ?? MARKETING_PATHS.home, source);
  }
  if (!SHORT_LINK_WORD.test(slug)) return MARKETING_PATHS.home;
  return withSignupSource(MARKETING_PATHS.home, { utm_source: "lien-court", utm_medium: "lien", utm_campaign: slug });
};
