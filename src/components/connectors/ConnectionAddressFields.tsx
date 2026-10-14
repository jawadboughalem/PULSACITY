"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { renewAddress } from "@/app/app/(espace)/connecteurs/connector-actions";
import { useCopyLink } from "@/components/space/useCopyLink";
import { INLINE_LINK_CLASSES, PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES, READ_ONLY_FIELD_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { quoteInFrench } from "@/lib/french/typography";

type ConnectionAddressFieldsProps = {
  connectorSlug: string;
  connectorName: string;
  connectionId: string;
  webhookUrl: string;
  signingSecret: string | null;
};

/** Step 1 of maquette 5: the address and the secret, each copied in one click. Without a key, the address alone. */
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
  const hasSecret = signingSecret !== null;

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
      <div className="flex flex-col gap-6 desktop:flex-row desktop:gap-6">
        <div className="flex min-w-[0] flex-col gap-2 desktop:flex-[3]">
          <label htmlFor="connection-address" className={FIELD_LABEL_CLASSES}>
            Adresse de connexion
          </label>
          <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-2">
            <input
              id="connection-address"
              type="text"
              readOnly
              value={webhookUrl}
              onFocus={(event) => event.target.select()}
              className={READ_ONLY_FIELD_CLASSES}
            />
            <button type="button" onClick={address.handleCopy} className={cn(PRIMARY_BUTTON_CLASSES, "w-full shrink-0 desktop:w-auto")}>
              <Icon name={address.isCopied ? "valid" : "copy"} size={20} />
              {address.isCopied ? "Copiée" : "Copier"}
            </button>
          </div>
        </div>
        {signingSecret ? (
          <div className="flex min-w-[0] flex-col gap-2 desktop:flex-[2]">
            <label htmlFor="connection-secret" className={FIELD_LABEL_CLASSES}>
              Clé secrète
            </label>
            <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-2">
              <input
                id="connection-secret"
                type="password"
                readOnly
                value={signingSecret}
                autoComplete="off"
                className={READ_ONLY_FIELD_CLASSES}
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
          <p className="text-small text-success">
            {hasSecret
              ? `Nouvelle adresse et nouvelle clé créées. Collez-les dans ${connectorName}.`
              : `Nouvelle adresse créée. Collez-la dans ${connectorName}.`}
          </p>
        ) : null}
        {hasFailed ? (
          <FieldError
            id="renew-error"
            message="L'adresse n'a pas été changée. Vérifiez votre connexion, puis réessayez."
          />
        ) : null}
      </div>
      <p className={FIELD_HINT_CLASSES}>
        Adresse partagée par erreur ?{" "}
        <button
          type="button"
          disabled={isRenewing}
          onClick={() => setIsConfirming(true)}
          className={cn(INLINE_LINK_CLASSES, "cursor-pointer disabled:cursor-not-allowed")}
        >
          {hasSecret ? "Changer d'adresse et de clé" : "Changer d'adresse"}
        </button>
      </p>
      <ConfirmDialog
        isOpen={isConfirming}
        title={hasSecret ? "Changer d'adresse et de clé ?" : "Changer d'adresse ?"}
        message={
          hasSecret
            ? [
                "Une nouvelle adresse et une nouvelle clé secrète remplacent les anciennes, qui cessent de fonctionner tout de suite.",
                `Juste après, collez-les dans ${connectorName}, dans le webhook ${quoteInFrench("PULSACITY")}. Une vente envoyée entre-temps à l'ancienne adresse ne nous parviendra pas.`,
              ]
            : [
                "Une nouvelle adresse remplace l'ancienne, qui cesse de fonctionner tout de suite.",
                `Juste après, collez-la dans ${connectorName}, à la place de l'ancienne. Une vente envoyée entre-temps à l'ancienne adresse ne nous parviendra pas.`,
              ]
        }
        confirmLabel={hasSecret ? "Changer l'adresse et la clé" : "Changer l'adresse"}
        isCancelDiscreet
        onConfirm={handleRenew}
        onCancel={() => setIsConfirming(false)}
      />
    </div>
  );
};
