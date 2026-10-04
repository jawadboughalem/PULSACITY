"use client";

import { useActionState, useState } from "react";
import { suggestPublicTool } from "@/app/(marketing)/integrations/public-tool-actions";
import { HoneypotField } from "@/components/collect/HoneypotField";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";

const ERRORS = {
  "invalid-name": "Indiquez le nom de l'outil, en 2 caractères au moins.",
  "too-many-requests": "Plusieurs envois sont partis en peu de temps. Patientez quelques minutes, puis réessayez.",
} as const;

/**
 * m21, under « Votre outil n'est pas encore là ? »: the visitor names the tool where they sell, like « Dites-nous quel
 * outil » in the space. Only the name is kept.
 */
export const PublicSuggestTool = () => {
  const [result, submitAction, isPending] = useActionState(suggestPublicTool, null);
  const [isOpen, setIsOpen] = useState(false);
  // Kept by React state: a form action empties the fields it does not control, even when the name is refused.
  const [toolName, setToolName] = useState("");
  const [honeypot, setHoneypot] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-text text-body text-slate-600">
        Vous vendez ailleurs ?{" "}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls="suggested-tool-form"
          className="font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
        >
          Dites-nous quel outil
        </button>
        {" : c'est ainsi que nous choisissons les prochains."}
      </p>
      {result?.ok ? (
        <p role="status" className="flex items-center gap-2 text-small font-medium text-success">
          <Icon name="valid" size={20} />
          Merci, c&apos;est noté.
        </p>
      ) : null}
      {isOpen && !result?.ok ? (
        <form id="suggested-tool-form" action={submitAction} noValidate className="flex max-w-[400px] flex-col gap-3">
          <HoneypotField value={honeypot} onChange={setHoneypot} />
          <TextField
            id="suggested-tool"
            name="toolName"
            label="L'outil où vous vendez"
            value={toolName}
            maxLength={80}
            autoFocus
            autoComplete="off"
            onChange={(event) => setToolName(event.target.value)}
            error={result?.ok === false ? ERRORS[result.error] : undefined}
          />
          <button
            type="submit"
            disabled={isPending}
            className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}
          >
            Envoyer
          </button>
        </form>
      ) : null}
    </div>
  );
};
