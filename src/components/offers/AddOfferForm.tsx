"use client";

import { useActionState } from "react";
import { type AddOfferResult, addOffer } from "@/app/app/(espace)/offres/offer-actions";
import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
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
    <form action={submitAction} noValidate className="flex flex-col gap-4 bg-paper-100 p-5 desktop:p-6">
      <h2 className="font-serif text-quote font-medium">Nouvelle offre</h2>
      <div className="flex flex-col gap-2">
        <label htmlFor="offer-name" className="text-small font-semibold">
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
            className={cn(
              "h-[48px] w-full rounded-sm border border-gray-400 bg-white px-4 text-body text-ink-900 placeholder:text-slate-600 focus:border-2 focus:border-ink-900 focus:px-[15px] focus:outline-none desktop:max-w-[400px]",
              error && "border-2 border-error px-[15px]",
            )}
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
          <p id="offer-name-hint" className="text-small text-slate-600">
            Elle reçoit tout de suite son lien de collecte. Vous réglerez ensuite la demande d&apos;avis.
          </p>
        )}
      </div>
    </form>
  );
};
