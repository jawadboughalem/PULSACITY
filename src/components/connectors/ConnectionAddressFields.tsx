"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { renewAddress } from "@/app/app/(espace)/connecteurs/connector-actions";
import { useCopyLink } from "@/components/space/useCopyLink";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { quoteInFrench } from "@/lib/french/typography";

const FIELD_CLASSES =
  "h-[48px] w-full min-w-[0] rounded-sm border border-gray-400 bg-paper-100 px-4 text-body text-ink-900 focus:border-2 focus:border-ink-900 focus:px-[15px] focus:outline-none";

type ConnectionAddressFieldsProps = {
  connectorSlug: string;
  connectorName: string;
  connectionId: string;
  webhookUrl: string;
  signingSecret: string | null;
};

/** Step 1 of maquette 5: the address and the secret, each copied in one click. */
export const ConnectionAddressFields = ({
  connectorSlug,
  connectorName,
  connectionId,
  webhookUrl,
  signingSecret,
}: ConnectionAddressFieldsProps) => {
  const router = useRouter();
  const address = useCopyLink(webhookUrl);
  const secret = useCopyLink(signingSecret ?? "");
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [isRenewed, setIsRenewed] = useState(false);
  const [isRenewing, startRenewing] = useTransition();

  const handleRenew = () => {
    setIsConfirming(false);
    setHasFailed(false);
    startRenewing(async () => {
      try {
        const result = await renewAddress(connectorSlug, connectionId);
        if (!result.ok) {
          setHasFailed(true);
          return;
        }
        setIsRenewed(true);
        router.refresh();
      } catch {
        setHasFailed(true);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-5 desktop:flex-row desktop:gap-5">
        <div className="flex min-w-[0] flex-col gap-2 desktop:flex-[3]">
          <label htmlFor="connection-address" className="text-small font-semibold">
            Adresse de connexion
          </label>
          <div className="flex flex-col gap-3 desktop:flex-row desktop:gap-2">
            <input
              id="connection-address"
              type="text"
              readOnly
              value={webhookUrl}
              onFocus={(event) => event.target.select()}
              className={FIELD_CLASSES}
            />
            <button type="button" onClick={address.handleCopy} className={cn(PRIMARY_BUTTON_CLASSES, "w-full shrink-0 desktop:w-auto")}>
              <Icon name={address.isCopied ? "valid" : "copy"} size={20} />
              {address.isCopied ? "Copiée" : "Copier"}
            </button>
          </div>
        </div>
        {signingSecret ? (
          <div className="flex min-w-[0] flex-col gap-2 desktop:flex-[2]">
            <label htmlFor="connection-secret" className="text-small font-semibold">
              Clé secrète
            </label>
            <div className="flex flex-col gap-3 desktop:flex-row desktop:gap-2">
              <input
                id="connection-secret"
                type="password"
                readOnly
                value={signingSecret}
                autoComplete="off"
                className={FIELD_CLASSES}
              />
              <button
                type="button"
                onClick={secret.handleCopy}
                aria-label={secret.isCopied ? "Clé secrète copiée" : "Copier la clé secrète"}
                className={cn(SECONDARY_BUTTON_CLASSES, "w-full shrink-0 desktop:w-auto")}
              >
                {secret.isCopied ? "Copiée" : "Copier"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <p aria-live="polite" className="sr-only">
        {address.isCopied ? "L'adresse de connexion est copiée." : secret.isCopied ? "La clé secrète est copiée." : ""}
      </p>
      <div aria-live="polite" className="empty:hidden">
        {isRenewed ? (
          <p className="text-small text-success">{`Nouvelle adresse et nouvelle clé créées. Collez-les dans ${connectorName}.`}</p>
        ) : null}
        {hasFailed ? (
          <FieldError
            id="renew-error"
            message="L'adresse n'a pas été changée. Vérifiez votre connexion, puis réessayez."
          />
        ) : null}
      </div>
      <p className="text-small text-slate-600">
        Adresse partagée par erreur ?{" "}
        <button
          type="button"
          disabled={isRenewing}
          onClick={() => setIsConfirming(true)}
          className="font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 disabled:cursor-not-allowed"
        >
          Changer d&apos;adresse et de clé
        </button>
      </p>
      <ConfirmDialog
        isOpen={isConfirming}
        title="Changer d'adresse et de clé ?"
        message={[
          "Une nouvelle adresse et une nouvelle clé secrète remplacent les anciennes, qui cessent de fonctionner tout de suite.",
          `Juste après, collez-les dans ${connectorName}, dans le webhook ${quoteInFrench("PULSACITY")}. Une vente envoyée entre-temps à l'ancienne adresse ne nous parviendra pas.`,
        ]}
        confirmLabel="Changer l'adresse et la clé"
        isCancelDiscreet
        onConfirm={handleRenew}
        onCancel={() => setIsConfirming(false)}
      />
    </div>
  );
};
