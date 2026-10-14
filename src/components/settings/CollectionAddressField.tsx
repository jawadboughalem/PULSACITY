"use client";

import { SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";
import { cn } from "@/lib/cn";
import { MAX_SLUG_LENGTH } from "@/lib/spaces/slugify";

type CollectionAddressFieldProps = {
  /** « pulsacity.com/t/ », written in the field before what the creator types. */
  prefix: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  suggestedSlug: string | null;
};

/**
 * Réglages, Adresse de votre page de collecte: the site's part stays in the field, in Gris, before the space's part.
 * Taken by another space: « Prendre … », a free one, beside the field (under the error on a phone).
 */
export const CollectionAddressField = ({ prefix, value, onChange, error, suggestedSlug }: CollectionAddressFieldProps) => {
  const suggestion = suggestedSlug ? (
    <button type="button" onClick={() => onChange(suggestedSlug)} className={SECONDARY_COMPACT_BUTTON_CLASSES}>
      {`Prendre ${suggestedSlug}`}
    </button>
  ) : null;

  return (
    <div className="flex min-w-[0] flex-col gap-2">
      <label htmlFor="slug" className={FIELD_LABEL_CLASSES}>
        Adresse de votre page de collecte
      </label>
      <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center">
        <div
          className={cn(
            "pz-couleur flex h-[56px] min-w-[0] shrink-0 items-center rounded-field border-2 bg-white px-4 text-body desktop:flex-1",
            "has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ink",
            error ? "border-error" : "border-gray hover:border-ink focus-within:border-ink",
          )}
        >
          <span aria-hidden="true" className="min-w-[0] max-w-[60%] shrink truncate text-gray">
            {prefix}
          </span>
          <input
            id="slug"
            name="slug"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={MAX_SLUG_LENGTH}
            required
            aria-invalid={error ? true : undefined}
            aria-describedby={cn("slug-hint", error && "slug-error")}
            className="h-full min-w-[0] flex-1 bg-transparent text-ink focus:outline-none"
          />
        </div>
        {suggestion ? <div className="max-desktop:hidden">{suggestion}</div> : null}
      </div>
      {error ? <FieldError id="slug-error" message={error} /> : null}
      {suggestion ? <div className="desktop:hidden">{suggestion}</div> : null}
      <p id="slug-hint" className={FIELD_HINT_CLASSES}>
        Si vous la changez, l&apos;ancienne adresse cesse de marcher : les liens déjà envoyés à vos clients ne mèneront plus
        nulle part.
      </p>
    </div>
  );
};
