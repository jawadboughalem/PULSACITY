import { type StarFill, StarIcon } from "@/components/collect/StarIcon";
import { RATINGS } from "@/lib/testimonials/testimonial-form-schema";

type RatingStarsProps = {
  /** A whole rating, or an average: it is shown to the nearest half star. */
  rating: number;
  size: 16 | 20;
  label?: string;
};

const NUMBER_FORMAT = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

const fillFor = (star: number, rounded: number): StarFill => {
  if (star <= rounded) return "full";
  return star - 0.5 === rounded ? "half" : "empty";
};

export const RatingStars = ({ rating, size, label }: RatingStarsProps) => {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span
      role="img"
      aria-label={label ?? `${NUMBER_FORMAT.format(rating)} sur ${RATINGS.length}`}
      className="inline-flex shrink-0 items-center"
    >
      {RATINGS.map((star) => (
        <StarIcon key={star} size={size} fill={fillFor(star, rounded)} />
      ))}
    </span>
  );
};
