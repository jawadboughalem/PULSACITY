"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { type SendWidgetCodeResult, sendWidgetCodeByEmail } from "@/app/app/(espace)/widget-code-actions";
import { useCopyLink } from "@/components/space/useCopyLink";
import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const LINK_CLASSES =
  "font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

export const COPIED_BUTTON_CLASSES =
  "inline-flex h-[48px] items-center justify-center gap-2 rounded-sm border-2 border-success bg-success-surface px-5 text-body font-semibold text-success";

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
    <section aria-labelledby="install-widget" className="flex flex-col gap-4 border-t border-ink-900 pt-5">
      <h2 id="install-widget" className="font-serif text-quote font-medium">
        Installer le widget
      </h2>
      <div aria-live="polite">
        {result?.ok ? (
          <div className="flex flex-col items-start gap-2 bg-success-surface p-4">
            <p className="flex items-start gap-2 text-body font-semibold text-success">
              <Icon name="valid" size={20} className="mt-[2px] shrink-0" />
              {`Code envoyé à ${result.data.email}.`}
            </p>
            <p className="pl-7 text-small">Ouvrez l&apos;e-mail sur votre ordinateur : le code et le guide y sont.</p>
            <button type="button" onClick={send} disabled={isSending} className={cn(DISCREET_BUTTON_CLASSES, "ml-6")}>
              {isSending ? "Envoi…" : "Renvoyer l'e-mail"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 bg-paper-100 p-4">
            <p className="text-body font-semibold">Plus simple depuis un ordinateur</p>
            <p className="text-small">
              Le code se colle dans l&apos;éditeur de Systeme.io, plus confortable sur grand écran. Recevez-le par e-mail et
              ouvrez-le sur votre ordinateur.
            </p>
            <button type="button" onClick={send} disabled={isSending} className={cn(PRIMARY_BUTTON_CLASSES, "w-full")}>
              <Icon name="mail" size={20} />
              {isSending ? "Envoi…" : "M'envoyer le code"}
            </button>
            {error ? <FieldError id="widget-code-error" message={error} /> : null}
            <p className="text-small text-slate-600">{`Il part à ${email}, avec le guide.`}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-small font-semibold">Ou copiez-le depuis ce téléphone</p>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(isCopied ? COPIED_BUTTON_CLASSES : SECONDARY_BUTTON_CLASSES, "w-full")}
        >
          <Icon name={isCopied ? "valid" : "copy"} size={20} />
          {isCopied ? "Code copié" : "Copier le code"}
        </button>
        <p aria-live="polite" className="text-small text-slate-600">
          {isCopied
            ? "Collez-le dans Systeme.io, dans un élément Code HTML. Le guide vous montre où."
            : "Un seul code pour ce widget : vos réglages s'appliquent même après l'avoir collé."}
        </p>
        <Link href={guideHref} className={cn(LINK_CLASSES, "self-start text-body")}>
          Voir le guide « Coller dans Systeme.io »
        </Link>
      </div>
    </section>
  );
};
