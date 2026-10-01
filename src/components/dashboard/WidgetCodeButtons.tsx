"use client";

import { useState, useTransition } from "react";
import { type SendWidgetCodeResult, sendWidgetCodeByEmail } from "@/app/app/(espace)/widget-code-actions";
import { useCopyLink } from "@/components/space/useCopyLink";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const SEND_ERRORS = {
  "widget-not-found": "Votre widget est introuvable. Rechargez la page.",
  "too-many-emails": "Vous avez déjà demandé le code plusieurs fois. Réessayez dans une heure.",
  "not-sent": "L'e-mail n'est pas parti. Réessayez dans un instant.",
} as const;

export const CopyWidgetCodeButton = ({ snippet }: { snippet: string }) => {
  const { isCopied, handleCopy } = useCopyLink(snippet);
  return (
    <>
      <button type="button" onClick={handleCopy} className={cn(SECONDARY_BUTTON_CLASSES, "self-start")}>
        {isCopied ? <Icon name="valid" size={20} /> : null}
        {isCopied ? "Code copié" : "Copier le code"}
      </button>
      <p aria-live="polite" className="sr-only">
        {isCopied ? "Le code est copié." : ""}
      </p>
    </>
  );
};

export const SendWidgetCodeButton = () => {
  const [isSending, startSending] = useTransition();
  const [result, setResult] = useState<SendWidgetCodeResult | null>(null);

  const handleSend = () => {
    startSending(async () => {
      try {
        setResult(await sendWidgetCodeByEmail());
      } catch {
        setResult({ ok: false, error: "not-sent" });
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={handleSend} disabled={isSending} className={cn(SECONDARY_BUTTON_CLASSES, "w-full px-4")}>
        {isSending ? "Envoi…" : "M'envoyer le code par e-mail"}
      </button>
      <div aria-live="polite">
        {result?.ok ? <p className="text-small text-success">{`Le code est parti vers ${result.data.email}.`}</p> : null}
        {result && !result.ok ? <FieldError id="widget-code-error" message={SEND_ERRORS[result.error]} /> : null}
      </div>
    </div>
  );
};
