"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { type SendWidgetCodeResult, sendWidgetCodeByEmail } from "@/app/app/(espace)/widget-code-actions";
import { useCopyLink } from "@/components/space/useCopyLink";
import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";

const SEND_ERRORS: Record<Exclude<SendWidgetCodeResult, { ok: true }>["error"], string> = {
  "widget-not-found": "Votre widget est introuvable. Rechargez la page.",
  "too-many-emails": "Vous avez déjà demandé le code plusieurs fois. Réessayez dans une heure.",
  "not-sent": "L'e-mail n'est pas parti. Réessayez dans un instant.",
};

/** Sends the code with the guide to the creator's own address, to paste it from a computer. */
export const useSendWidgetCode = (widgetId: string) => {
  const [isSending, startSending] = useTransition();
  const [result, setResult] = useState<SendWidgetCodeResult | null>(null);
  const send = () => {
    startSending(async () => {
      try {
        setResult(await sendWidgetCodeByEmail(widgetId));
      } catch {
        setResult({ ok: false, error: "not-sent" });
      }
    });
  };
  return { isSending, result, send, error: result && !result.ok ? SEND_ERRORS[result.error] : null };
};

type WidgetInstallPanelProps = {
  widgetId: string;
  snippet: string;
  email: string;
  guideHref: string;
};

/**
 * Maquette 6 on a phone, « Installer le widget »: the code by e-mail first, since it is pasted from a computer, then
 * copied from the phone.
 */
export const WidgetInstallPanel = ({ widgetId, snippet, email, guideHref }: WidgetInstallPanelProps) => {
  const { isCopied, handleCopy } = useCopyLink(snippet);
  const { isSending, result, send, error } = useSendWidgetCode(widgetId);

  return (
    <section aria-labelledby="install-widget" className="flex flex-col gap-4 pt-6">
      <h2 id="install-widget" className="font-display text-h3">
        Installer le widget
      </h2>
      <div aria-live="polite">
        {result?.ok ? (
          <div className="flex items-start gap-[14px] rounded-card bg-success-surface px-5 py-4 text-ink">
            <Icon name="valid" size={24} className="mt-[1px] shrink-0 text-success" />
            <div className="flex min-w-[0] flex-col items-start gap-1 break-words">
              <p className="text-body font-bold">{`Code envoyé à ${result.data.email}.`}</p>
              <p className="text-small">Ouvrez l&apos;e-mail sur votre ordinateur : le code et le guide y sont.</p>
              <button type="button" onClick={send} disabled={isSending} className={DISCREET_BUTTON_CLASSES}>
                {isSending ? "Envoi…" : "Renvoyer l'e-mail"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 rounded-panel bg-sky p-4">
            <p className="text-body font-bold">Plus simple depuis un ordinateur</p>
            <p className="text-small">
              Le code se colle dans l&apos;éditeur de votre page, plus confortable sur grand écran. Recevez-le par
              e-mail et ouvrez-le sur votre ordinateur.
            </p>
            <button
              type="button"
              onClick={send}
              disabled={isSending}
              aria-busy={isSending || undefined}
              className={cn(PRIMARY_BUTTON_CLASSES, "w-full")}
            >
              {isSending ? <Spinner size={20} /> : <Icon name="mail" size={20} />}
              {isSending ? "Envoi…" : "M'envoyer le code"}
            </button>
            {error ? <FieldError id="widget-code-error" message={error} /> : null}
            <p className="text-small text-gray">{`Il part à ${email}, avec le guide.`}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-small font-bold">Ou copiez-le depuis ce téléphone</p>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(SECONDARY_BUTTON_CLASSES, "w-full")}
        >
          <Icon name={isCopied ? "valid" : "copy"} size={20} />
          {isCopied ? "Code copié" : "Copier le code"}
        </button>
        <p aria-live="polite" className="text-small text-gray">
          {isCopied
            ? "Collez-le dans votre page, dans un bloc de code HTML. Le guide Systeme.io vous montre où."
            : "Un seul code pour ce widget : vos réglages s'appliquent même après l'avoir collé."}
        </p>
        <Link href={guideHref} className={cn(DISCREET_BUTTON_CLASSES, "self-start")}>
          Voir le guide « Coller dans Systeme.io »
        </Link>
      </div>
    </section>
  );
};
