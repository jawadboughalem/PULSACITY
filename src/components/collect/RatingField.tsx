import type { Ref } from "react";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/cn";
import { RATINGS } from "@/lib/testimonials/testimonial-form-schema";
import { StarIcon } from "./StarIcon";

const MISSING_RATING_MESSAGE = "Choisissez une note, de 1 à 5 étoiles.";

type RatingFieldProps = {
  rating: number;
  hasError: boolean;
  firstStarRef: Ref<HTMLInputElement>;
  onChange: (rating: number) => void;
};

const labelRating = (rating: number) => `${rating} ${rating === 1 ? "étoile" : "étoiles"} sur ${RATINGS.length}`;

export const RatingField = ({ rating, hasError, firstStarRef, onChange }: RatingFieldProps) => (
  <fieldset className="min-w-[0]" aria-describedby={hasError ? "rating-error" : "rating-hint"}>
    <legend className="mb-2 text-small font-bold">Votre note</legend>
    <div
      className={cn(
        "flex justify-between rounded-card border-2 bg-white px-2 py-1",
        hasError ? "border-error" : "border-ink",
      )}
    >
      {RATINGS.map((value) => (
        <label
          key={value}
          className={cn(
            "pz-note-etoile flex size-[56px] cursor-pointer items-center justify-center rounded-card has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ink",
            value === rating && "is-choisie",
          )}
        >
          <input
            ref={value === 1 ? firstStarRef : undefined}
            type="radio"
            name="rating"
            value={value}
            checked={rating === value}
            onChange={() => onChange(value)}
            aria-label={labelRating(value)}
            className="sr-only"
          />
          <StarIcon size={36} isFilled={value <= rating} />
        </label>
      ))}
    </div>
    {hasError ? (
      <div className="mt-2">
        <FieldError id="rating-error" message={MISSING_RATING_MESSAGE} />
      </div>
    ) : (
      <p
        id="rating-hint"
        aria-live="polite"
        className={cn("mt-2 text-small", rating > 0 ? "font-bold text-ink" : "text-gray")}
      >
        {rating > 0 ? `${rating} sur ${RATINGS.length}, merci.` : "Touchez une étoile."}
      </p>
    )}
  </fieldset>
);
