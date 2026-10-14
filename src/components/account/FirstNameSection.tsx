"use client";

import { useState, useTransition } from "react";
import { saveFirstName } from "@/app/app/(espace)/compte/account-actions";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { OPTIONAL_MARK_CLASSES } from "@/components/ui/field-styles";
import { Spinner } from "@/components/ui/Spinner";
import { TextField } from "@/components/ui/TextField";
import { MAX_FIRST_NAME_LENGTH } from "@/lib/auth/first-name";

const ERRORS = {
  "too-long": `Ce prénom dépasse ${MAX_FIRST_NAME_LENGTH} caractères. Raccourcissez-le.`,
  network: "Le prénom n'a pas été enregistré. Vérifiez votre connexion, puis réessayez.",
} as const;

type FirstNameSectionProps = {
  firstName: string;
  onSaved: (message: string) => void;
};

/** Mon compte, « Votre prénom » (facultatif): « Bonjour Julie » on the home of the space. */
export const FirstNameSection = ({ firstName, onSaved }: FirstNameSectionProps) => {
  const [value, setValue] = useState(firstName);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const [isSaving, startSaving] = useTransition();

  return (
    <SettingsSection id="account-first-name" title="Votre prénom">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          startSaving(async () => {
            try {
              const result = await saveFirstName(value);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setValue(result.data.firstName);
              onSaved("Prénom enregistré.");
            } catch {
              setError("network");
            }
          });
        }}
        className="flex flex-col gap-4"
      >
        <TextField
          id="first-name"
          name="firstName"
          label={
            <>
              Prénom <span className={OPTIONAL_MARK_CLASSES}>(facultatif)</span>
            </>
          }
          autoComplete="given-name"
          maxLength={MAX_FIRST_NAME_LENGTH + 10}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          hint="Pour vous dire bonjour sur l'accueil de votre espace."
          error={error ? ERRORS[error] : undefined}
        />
        <button
          type="submit"
          disabled={isSaving}
          aria-busy={isSaving || undefined}
          className={`${SECONDARY_COMPACT_BUTTON_CLASSES} self-start`}
        >
          {isSaving ? <Spinner size={18} /> : null}
          {isSaving ? "Envoi…" : "Enregistrer"}
        </button>
      </form>
    </SettingsSection>
  );
};
