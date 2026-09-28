"use client";

import { useActionState, useState } from "react";
import { addFormation } from "@/app/app/onboarding/formations/formation-actions";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";

const INVALID_NAME_MESSAGE = "Indiquez le nom de la formation, en 2 caractères au moins.";
const MISSING_SPACE_MESSAGE = "Votre espace est introuvable. Rechargez la page, puis réessayez.";

export const AddFormationForm = () => {
  const [result, submitAction, isPending] = useActionState(addFormation, null);
  const [name, setName] = useState("");

  const error =
    result?.ok === false ? (result.error === "invalid-name" ? INVALID_NAME_MESSAGE : MISSING_SPACE_MESSAGE) : undefined;

  return (
    <form action={submitAction} noValidate className="flex flex-col gap-3">
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
      <button type="submit" disabled={isPending} className={cn(SECONDARY_BUTTON_CLASSES, "self-start")}>
        Ajouter la formation
      </button>
    </form>
  );
};
