"use client";

import { useState, useTransition } from "react";
import { suggestTool } from "@/app/app/(espace)/connecteurs/connector-actions";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";

const LINK_CLASSES =
  "font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

const ERRORS = {
  "invalid-name": "Indiquez le nom de l'outil, en 2 caractères au moins.",
  "not-saved": "Votre message n'a pas été enregistré. Vérifiez votre connexion, puis réessayez.",
} as const;

/** « Dites-nous quel outil »: the creator names the tool, kept with the space for the next connectors. */
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
    <div className="flex flex-col gap-4">
      <p className="max-w-text text-body text-slate-600">
        Vous vendez ailleurs ?{" "}
        <button type="button" onClick={() => setIsOpen(true)} className={LINK_CLASSES} aria-expanded={isOpen}>
          Dites-nous quel outil
        </button>
        . En attendant, votre lien de collecte fonctionne partout.
      </p>
      {isSent ? (
        <p role="status" className="flex items-center gap-2 text-small font-medium text-success">
          <Icon name="valid" size={20} />
          Merci, c&apos;est noté. Nous vous préviendrons s&apos;il arrive.
        </p>
      ) : null}
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
          <button type="submit" disabled={isSaving} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}>
            Envoyer
          </button>
        </form>
      ) : null}
    </div>
  );
};
