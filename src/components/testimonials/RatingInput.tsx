import { StarIcon } from "@/components/collect/StarIcon";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";
import { cn } from "@/lib/cn";
import { RATINGS } from "@/lib/testimonials/ratings";

type RatingInputProps = {
  id: string;
  rating: number;
  error?: string;
  onChange: (rating: number) => void;
  /** « Note » in the space; « Votre note » in the home's test review. */
  legend?: string;
  /**
   * The home's test review (maquettes 3.5): stars of 36 (drawn 30 wide) in targets of 44, without « 4 sur 5 » beside
   * them, which its narrow card cannot hold; each star still says its value to a screen reader.
   */
  isCompact?: boolean;
};

const labelRating = (rating: number) => `${rating} ${rating === 1 ? "étoile" : "étoiles"} sur ${RATINGS.length}`;

/** Five stars as radio buttons. `id` goes to the first star, so an error summary can lead to it. */
export const RatingInput = ({ id, rating, error, onChange, legend = "Note", isCompact = false }: RatingInputProps) => (
  <fieldset className="flex min-w-[0] flex-col gap-2" aria-describedby={error ? `${id}-error` : undefined}>
    <legend className={cn(FIELD_LABEL_CLASSES, "mb-2")}>{legend}</legend>
    <div className="flex items-center gap-3">
      {/* Maquettes 3.4: stars of 28 in targets of 52. */}
      <div className={cn("flex rounded-card", error && "border-2 border-error")}>
        {RATINGS.map((value) => (
          <label
            key={value}
            className={cn(
              "flex cursor-pointer items-center justify-center rounded-full has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ink has-disabled:cursor-not-allowed",
              isCompact ? "size-[44px]" : "size-[52px]",
            )}
          >
            <input
              id={value === RATINGS[0] ? id : undefined}
              type="radio"
              name="rating"
              value={value}
              checked={rating === value}
              onChange={() => onChange(value)}
              aria-label={labelRating(value)}
              className="sr-only"
            />
            <StarIcon size={isCompact ? 36 : 28} isFilled={value <= rating} />
          </label>
        ))}
      </div>
      {rating > 0 && !isCompact ? <span className={FIELD_HINT_CLASSES}>{`${rating} sur ${RATINGS.length}`}</span> : null}
    </div>
    {error ? <FieldError id={`${id}-error`} message={error} /> : null}
  </fieldset>
);
