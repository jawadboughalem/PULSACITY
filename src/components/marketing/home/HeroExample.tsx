import { RatingStars } from "@/components/testimonials/RatingStars";
import { EXAMPLE_AVERAGE_LABEL, EXAMPLE_REVIEWS } from "@/content/home-examples";
import { quoteInFrench } from "@/lib/french/typography";
import { EXAMPLE_MENTION } from "../ExampleMention";

const [FIRST_REVIEW] = EXAMPLE_REVIEWS;

/**
 * Maquettes 3.5, Accueil, en-tête (positionnement.md, section 1): the badge « 4,7/5 · 23 avis » and a testimonial card
 * on a Soleil block, marked as an example. Nothing in it is a real review.
 */
export const HeroExample = () => (
  <figure className="flex flex-col items-start gap-5 rounded-block bg-sun p-5 desktop:p-10">
    <div className="flex h-[48px] items-center gap-3 rounded-full bg-white px-5 shadow-float">
      <RatingStars rating={5} size={16} label={`Note d'exemple : ${EXAMPLE_AVERAGE_LABEL}`} />
      <span className="text-body font-bold">{EXAMPLE_AVERAGE_LABEL}</span>
    </div>
    <blockquote className="flex w-full flex-col gap-4 rounded-card bg-white p-6 shadow-float desktop:p-7">
      <RatingStars rating={FIRST_REVIEW.rating} size={20} />
      <p className="max-w-quote text-lead">{quoteInFrench(FIRST_REVIEW.text)}</p>
      <footer className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-sky text-small font-bold"
        >
          {FIRST_REVIEW.name.charAt(0)}
        </span>
        <span className="flex flex-col">
          <span className="text-body font-bold">{FIRST_REVIEW.name}</span>
          <span className="text-small text-gray">{FIRST_REVIEW.offer}</span>
        </span>
      </footer>
    </blockquote>
    <figcaption className="text-legal font-semibold text-ink">{EXAMPLE_MENTION}</figcaption>
  </figure>
);
