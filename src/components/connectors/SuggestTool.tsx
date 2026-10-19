"use client";

import { useState, useTransition } from "react";
import { suggestTool } from "@/app/app/(espace)/connecteurs/connector-actions";
import { ActionDoneMessage } from "@/components/ui/ActionDoneMessage";
import { INLINE_LINK_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";

const ERRORS = {
  "invalid-name": "Indiquez le nom de l'outil, en 2 caractères au moins.",
  "not-saved": "Votre message n'a pas été enregistré. Vérifiez votre connexion, puis réessayez.",
} as const;

/**
 * « Dites-nous quel outil »: the creator names the tool, kept with the space for the next connectors. Maquettes 3.4:
 * on its white card, under the families.
 */
export const SuggestTool = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [toolName, setToolName] = useState("");
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [isSaving, startSaving] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    startSaving(async () => {
      try {
        const result = await suggestTool(toolName);
        if (result.ok) setIsSent(true);
        else setError(result.error === "invalid-name" ? "invalid-name" : "not-saved");
      } catch {
        setError("not-saved");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-card bg-white p-5 desktop:px-8 desktop:py-6">
      <p className="text-body">
        Vous vendez ailleurs ?{" "}
        <button type="button" onClick={() => setIsOpen(true)} className={cn(INLINE_LINK_CLASSES, "cursor-pointer")} aria-expanded={isOpen}>
          Dites-nous quel outil
        </button>
        . En attendant, votre lien de collecte fonctionne partout.
      </p>
      <ActionDoneMessage message={isSent ? "Merci, c'est noté. Nous vous préviendrons s'il arrive." : null} />
      {isOpen && !isSent ? (
        <form onSubmit={handleSubmit} className="flex max-w-[400px] flex-col gap-3">
          <TextField
            id="suggested-tool"
            label="L'outil où vous vendez"
            value={toolName}
            maxLength={80}
            autoFocus
            autoComplete="off"
            onChange={(event) => setToolName(event.target.value)}
            error={error ? ERRORS[error] : undefined}
          />
          <button
            type="submit"
            disabled={isSaving}
            className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:h-[44px] desktop:w-auto desktop:self-start desktop:px-[18px]")}
          >
            Envoyer
          </button>
        </form>
      ) : null}
    </div>
  );
};
