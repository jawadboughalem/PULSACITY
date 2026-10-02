"use client";

import { useCopyLink } from "@/components/space/useCopyLink";
import { DISCREET_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { useSendWidgetCode } from "./WidgetInstallPanel";

type WidgetGuideActionsProps = { widgetId: string; snippet: string };

/** The guide's own page ends on the two ways to get the code. */
export const WidgetGuideActions = ({ widgetId, snippet }: WidgetGuideActionsProps) => {
  const { isCopied, handleCopy } = useCopyLink(snippet);
  const { isSending, result, send, error } = useSendWidgetCode(widgetId);

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={send} disabled={isSending} className={cn(SECONDARY_BUTTON_CLASSES, "w-full")}>
        <Icon name="mail" size={20} />
        {isSending ? "Envoi…" : "M'envoyer le code"}
      </button>
      <div aria-live="polite">
        {result?.ok ? <p className="text-small text-success">{`Le code est parti vers ${result.data.email}.`}</p> : null}
        {error ? <FieldError id="widget-code-error" message={error} /> : null}
      </div>
      <button type="button" onClick={handleCopy} className={cn(DISCREET_BUTTON_CLASSES, "self-start")}>
        <Icon name={isCopied ? "valid" : "copy"} size={20} />
        {isCopied ? "Code copié" : "Copier le code"}
      </button>
    </div>
  );
};
