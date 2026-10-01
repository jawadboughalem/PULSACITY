import { StarIcon } from "@/components/collect/StarIcon";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/cn";
import { RATINGS } from "@/lib/testimonials/testimonial-form-schema";

type RatingInputProps = {
  rating: number;
  error?: string;
  onChange: (rating: number) => void;
};

const labelRating = (rating: number) => `${rating} ${rating === 1 ? "étoile" : "étoiles"} sur ${RATINGS.length}`;

export const RatingInput = ({ rating, error, onChange }: RatingInputProps) => (
  <fieldset className="flex min-w-[0] flex-col gap-2" aria-describedby={error ? "rating-error" : undefined}>
    <legend className="mb-2 text-small font-semibold">Note</legend>
    <div className="flex items-center gap-3">
      <div className="-ml-3 flex">
        {RATINGS.map((value) => (
          <label
            key={value}
            className="flex size-[44px] cursor-pointer items-center justify-center rounded-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink-900"
          >
            <input
              type="radio"
              name="rating"
              value={value}
              checked={rating === value}
              onChange={() => onChange(value)}
              aria-label={labelRating(value)}
              className="sr-only"
            />
            <StarIcon size={20} isFilled={value <= rating} />
          </label>
        ))}
      </div>
      <span className={cn("text-small", rating > 0 ? "text-ink-900" : "text-slate-600")}>
        {rating > 0 ? `${rating} sur ${RATINGS.length}` : "Choisissez la note reçue."}
      </span>
    </div>
    {error ? <FieldError id="rating-error" message={error} /> : null}
  </fieldset>
);
