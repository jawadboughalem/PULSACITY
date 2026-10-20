"use client";

import { useActionState, useState } from "react";
import { suggestPublicTool } from "@/app/(marketing)/integrations/public-tool-actions";
import { HoneypotField } from "@/components/collect/HoneypotField";
import { INLINE_LINK_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";

/** The anchor of the card: the home's « Votre outil n'y est pas ? Dites-nous lequel. » leads here. */
export const SUGGEST_TOOL_ID = "dites-nous";

/**
 * Maquettes 3.5, Intégrations, « Dites-nous quel outil » and its five states (closed, open, name refused, too many
 * sendings, thanks), on a white card. The visitor names the tool where they sell; only the name is kept.
 */
export const PublicSuggestTool = () => {
  const [result, submitAction, isPending] = useActionState(suggestPublicTool, null);
  const [isOpen, setIsOpen] = useState(false);
  // Kept by React state: a form action empties the fields it does not control, even when the name is refused.
  const [toolName, setToolName] = useState("");
  const [honeypot, setHoneypot] = useState("");

  return (
    <section id={SUGGEST_TOOL_ID} aria-label="Dites-nous quel outil" className="flex flex-col gap-4 rounded-card bg-white p-5 desktop:p-8">
      <p className="max-w-text text-body">
        Vous vendez ailleurs ?{" "}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls="suggested-tool-form"
          className={cn(INLINE_LINK_CLASSES, "cursor-pointer font-bold")}
        >
          Dites-nous quel outil
        </button>
        {" : c'est ainsi que nous choisissons les prochains."}
      </p>
      {result?.ok ? (
        <p role="status" className="flex items-center gap-2 text-body font-bold text-success">
          <Icon name="valid" size={20} />
          Merci, c&apos;est noté.
        </p>
      ) : null}
      {isOpen && !result?.ok ? (
        <form id="suggested-tool-form" action={submitAction} noValidate className="flex max-w-[520px] flex-col gap-4">
          {result?.ok === false && result.error === "too-many-requests" ? (
            <StatusBanner tone="error" title="Plusieurs envois sont partis en peu de temps.">
              Patientez quelques minutes, puis réessayez.
            </StatusBanner>
          ) : null}
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
            error={
              result?.ok === false && result.error === "invalid-name"
                ? "Indiquez le nom de l'outil, en 2 caractères au moins."
                : undefined
            }
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
    </section>
  );
};
