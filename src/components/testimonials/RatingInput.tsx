import { StarIcon } from "@/components/collect/StarIcon";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/cn";
import { RATINGS } from "@/lib/testimonials/testimonial-form-schema";

type RatingInputProps = {
  id: string;
  rating: number;
  error?: string;
  onChange: (rating: number) => void;
};

const labelRating = (rating: number) => `${rating} ${rating === 1 ? "étoile" : "étoiles"} sur ${RATINGS.length}`;

/** Five stars as radio buttons. `id` goes to the first star, so an error summary can lead to it. */
export const RatingInput = ({ id, rating, error, onChange }: RatingInputProps) => (
  <fieldset className="flex min-w-[0] flex-col gap-2" aria-describedby={error ? `${id}-error` : undefined}>
    <legend className="mb-2 text-small font-semibold">Note</legend>
    <div className="flex items-center gap-3">
      <div className={cn("-ml-3 flex rounded-sm", error && "border-2 border-error")}>
        {RATINGS.map((value) => (
          <label
            key={value}
            className="flex size-[44px] cursor-pointer items-center justify-center rounded-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink-900 has-disabled:cursor-not-allowed"
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
            <StarIcon size={20} isFilled={value <= rating} />
          </label>
        ))}
      </div>
      {rating > 0 ? <span className="text-small text-slate-600">{`${rating} sur ${RATINGS.length}`}</span> : null}
    </div>
    {error ? <FieldError id={`${id}-error`} message={error} /> : null}
  </fieldset>
);
