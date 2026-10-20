import { z } from "zod";

/**
 * The space where PULSACITY collects its own testimonials (decisions/commercialisation.md, « Bêta »): created by the
 * founder in each environment, named to the site by PULSACITY_SPACE_ID (Vercel), never by an address someone else
 * could take. Its wall shows on the home page and its badge on Tarifs, once it has enough real testimonials.
 */
export const readPulsacitySpaceId = (): string | null => {
  const parsed = z.uuid().safeParse(process.env.PULSACITY_SPACE_ID?.trim());
  return parsed.success ? parsed.data.toLowerCase() : null;
};

/** The offer of the beta testers' testimonials, in that space. */
export const PULSACITY_BETA_OFFER_SLUG = "beta-pulsacity";

/** Under each beta tester's testimonial: the plan offered is a counterpart, said where the testimonial shows. */
export const BETA_TESTER_MENTION = "Bêta-testeur · plan Essentiel offert pendant la bêta";

/**
 * Below this many validated testimonials, pulsacity.com shows none (« seulement quand il a assez de vrais avis »):
 * five, the count past which a few reviews read as a pattern (Spiegel Research Center, 2017). To confirm by the founder.
 */
export const PULSACITY_SHOWCASE_MIN_TESTIMONIALS = 5;

/**
 * How long the beta testers have Essentiel without paying (arbitrages.md, n° 3): the months of their Stripe code, said
 * on the home page to whoever wants to test.
 */
export const BETA_OFFERED_MONTHS = 3;
