"use client";

import { useActionState } from "react";
import { addOffer } from "@/app/app/(espace)/offres/offer-actions";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";

const ERRORS = {
  "invalid-name": "Indiquez le nom de l'offre, en 2 caractères au moins.",
  "space-not-found": "Votre espace est introuvable. Rechargez la page, puis réessayez.",
} as const;

export const AddOfferForm = () => {
  const [result, submitAction, isPending] = useActionState(addOffer, null);

  return (
    <form
      key={result?.ok ? result.data.productId : "new-offer"}
      action={submitAction}
      noValidate
      className="flex flex-col gap-3 desktop:flex-row desktop:items-end"
    >
      <div className="flex-1">
        <TextField
          id="offer-name"
          name="name"
          label="Nouvelle offre"
          placeholder="Par exemple : Suivi individuel 3 mois"
          required
          error={result?.ok === false ? ERRORS[result.error] : undefined}
        />
      </div>
      <button type="submit" disabled={isPending} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
        Ajouter
      </button>
    </form>
  );
};
