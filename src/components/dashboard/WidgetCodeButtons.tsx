"use client";

import { useState, useTransition } from "react";
import { type SendWidgetCodeResult, sendWidgetCodeByEmail } from "@/app/app/(espace)/widget-code-actions";
import { useCopyLink } from "@/components/space/useCopyLink";
import { ActionDoneMessage } from "@/components/ui/ActionDoneMessage";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { KeepHyphenatedWords } from "@/components/ui/KeepHyphenatedWords";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";

const SEND_ERRORS = {
  "widget-not-found": "Votre widget est introuvable. Rechargez la page.",
  "too-many-emails": "Vous avez déjà demandé le code plusieurs fois. Réessayez dans une heure.",
  "not-sent": "L'e-mail n'est pas parti. Réessayez dans un instant.",
} as const;

export const CopyWidgetCodeButton = ({ snippet, className = "self-start" }: { snippet: string; className?: string }) => {
  const { isCopied, handleCopy } = useCopyLink(snippet);
  return (
    <>
      <button type="button" onClick={handleCopy} className={cn(SECONDARY_BUTTON_CLASSES, className)}>
        <Icon name={isCopied ? "check" : "copy"} size={20} />
        {isCopied ? "Code copié" : "Copier le code"}
      </button>
      <ActionDoneMessage message={isCopied ? "Le code est copié." : null} />
    </>
  );
};

export const SendWidgetCodeButton = ({ widgetId }: { widgetId?: string }) => {
  const [isSending, startSending] = useTransition();
  const [result, setResult] = useState<SendWidgetCodeResult | null>(null);

  const handleSend = () => {
    startSending(async () => {
      try {
        setResult(await sendWidgetCodeByEmail(widgetId));
      } catch {
        setResult({ ok: false, error: "not-sent" });
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* At 360, inside the steps panel and its card, the label goes on two lines, as in the maquette (accueil 03). */}
      <button
        type="button"
        onClick={handleSend}
        disabled={isSending}
        aria-busy={isSending}
        className={cn(SECONDARY_BUTTON_CLASSES, "h-auto min-h-[52px] w-full px-4 py-1 text-center whitespace-normal")}
      >
        {isSending ? <Spinner size={18} /> : <Icon name="mail" size={20} />}
        <span>{isSending ? "Envoi…" : <KeepHyphenatedWords text="M'envoyer le code par e-mail" />}</span>
      </button>
      <ActionDoneMessage message={result?.ok ? `Le code est parti vers ${result.data.email}.` : null} />
      <div aria-live="polite">
        {result && !result.ok ? <FieldError id="widget-code-error" message={SEND_ERRORS[result.error]} /> : null}
      </div>
    </div>
  );
};
