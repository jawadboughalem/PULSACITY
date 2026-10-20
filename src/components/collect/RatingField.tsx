import type { Ref } from "react";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";
import { cn } from "@/lib/cn";
import { RATINGS } from "@/lib/testimonials/ratings";
import { StarIcon } from "./StarIcon";

const MISSING_RATING_MESSAGE = "Choisissez une note, de 1 à 5 étoiles.";

type RatingFieldProps = {
  rating: number;
  /** The chosen stars all in the creator's accent, or Encre; null: Soleil with its outline. */
  starColor: string | null;
  hasError: boolean;
  firstStarRef: Ref<HTMLInputElement>;
  onChange: (rating: number) => void;
};

const labelRating = (rating: number) => `${rating} ${rating === 1 ? "étoile" : "étoiles"} sur ${RATINGS.length}`;

/** Charte v2, ajouts 3.6: stars of 46 (42 on a phone) in targets of 56, in a field-like box. */
export const RatingField = ({ rating, starColor, hasError, firstStarRef, onChange }: RatingFieldProps) => (
  <fieldset className="min-w-[0]" aria-describedby={hasError ? "rating-error" : "rating-hint"}>
    <legend className={cn(FIELD_LABEL_CLASSES, "mb-2")}>Votre note</legend>
    <div
      className={cn(
        "pz-couleur flex justify-between rounded-field border-2 bg-white px-1 py-[2px] desktop:px-4",
        hasError ? "border-error" : "border-gray hover:border-ink",
      )}
    >
      {RATINGS.map((value) => (
        <label
          key={value}
          className={cn(
            "pz-note-etoile flex size-[56px] cursor-pointer items-center justify-center rounded-full has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ink",
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
          <StarIcon
            size={46}
            isFilled={value <= rating}
            solidColor={starColor}
            className="size-[42px] desktop:size-[46px]"
          />
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
