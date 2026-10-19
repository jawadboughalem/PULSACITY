"use client";

import { useActionState, useState } from "react";
import { addFormation } from "@/app/app/onboarding/formations/formation-actions";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";

const INVALID_NAME_MESSAGE = "Indiquez le nom de la formation, en 2 caractères au moins.";
const MISSING_SPACE_MESSAGE = "Votre espace est introuvable. Rechargez la page, puis réessayez.";

/** Maquettes 3.4, Démarrage 2: the button beside the field on a computer, under it and full width on a phone. */
export const AddFormationForm = () => {
  const [result, submitAction, isPending] = useActionState(addFormation, null);
  const [name, setName] = useState("");

  const error =
    result?.ok === false ? (result.error === "invalid-name" ? INVALID_NAME_MESSAGE : MISSING_SPACE_MESSAGE) : undefined;

  return (
    <form
      action={submitAction}
      noValidate
      className="flex flex-col gap-3 desktop:grid desktop:grid-cols-[minmax(0,1fr)_auto] desktop:items-start desktop:gap-x-4"
    >
      <TextField
        id="formation-name"
        name="name"
        label="Nom de la formation"
        placeholder="Programme 30 jours"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={error}
      />
      {/* On a computer, level with the field: under its label (22 and 8), centred on its 56. */}
      <button type="submit" disabled={isPending} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:mt-[32px] desktop:w-auto")}>
        Ajouter la formation
      </button>
    </form>
  );
};
