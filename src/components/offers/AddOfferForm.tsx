"use client";

import { useActionState } from "react";
import { type AddOfferResult, addOffer } from "@/app/app/(espace)/offres/offer-actions";
import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_CLASSES, FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";
import { cn } from "@/lib/cn";
import { MAX_PRODUCT_NAME_LENGTH } from "@/lib/spaces/product-rules";

const ERRORS = {
  "invalid-name": "Indiquez le nom de l'offre, en 2 caractères au moins.",
  "space-not-found": "Votre espace est introuvable. Rechargez la page, puis réessayez.",
} as const;

type AddOfferFormProps = {
  onDone: () => void;
};

/** The « Nouvelle offre » panel: a name, and the offer gets its collection link at once. */
export const AddOfferForm = ({ onDone }: AddOfferFormProps) => {
  const [result, submitAction, isPending] = useActionState(
    async (previous: AddOfferResult | null, formData: FormData) => {
      const added = await addOffer(previous, formData);
      if (added.ok) onDone();
      return added;
    },
    null,
  );
  const error = result?.ok === false ? ERRORS[result.error] : undefined;

  return (
    <form action={submitAction} noValidate className="flex flex-col gap-4 rounded-panel bg-sky p-6 desktop:p-8">
      <h2 className="font-display text-h3">Nouvelle offre</h2>
      <div className="flex flex-col gap-2">
        <label htmlFor="offer-name" className={FIELD_LABEL_CLASSES}>
          Nom de l&apos;offre
        </label>
        <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-4">
          <input
            id="offer-name"
            name="name"
            autoFocus
            required
            maxLength={MAX_PRODUCT_NAME_LENGTH}
            placeholder="Par exemple : Programme 30 jours"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "offer-name-error" : "offer-name-hint"}
            className={cn(FIELD_CLASSES, "desktop:max-w-[400px]")}
          />
          <button type="submit" disabled={isPending} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
            {isPending ? "Ajout…" : "Ajouter l'offre"}
          </button>
          <button type="button" onClick={onDone} className={cn(DISCREET_BUTTON_CLASSES, "self-start desktop:self-auto")}>
            Annuler
          </button>
        </div>
        {error ? (
          <FieldError id="offer-name-error" message={error} />
        ) : (
          <p id="offer-name-hint" className={FIELD_HINT_CLASSES}>
            Elle reçoit tout de suite son lien de collecte. Vous réglerez ensuite la demande d&apos;avis.
          </p>
        )}
      </div>
    </form>
  );
};
