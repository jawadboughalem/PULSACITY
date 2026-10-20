"use client";

import { useState, useTransition } from "react";
import { type RemoveFormationResult, removeFormation } from "@/app/app/onboarding/formations/formation-actions";
import { useCopyLink } from "@/components/space/useCopyLink";
import { DISCREET_BUTTON_CLASSES, ICON_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { prefixWithDe } from "@/lib/french/prefix-with-de";

const REMOVAL_ERROR_MESSAGES = {
  "has-sales": "Cette formation a déjà des ventes : elle reste en place pour les garder.",
  "product-not-found": "Cette formation n'existe plus. Rechargez la page.",
} as const;

type FormationRowProps = {
  id: string;
  name: string;
  collectionUrl: string;
  collectionAddress: string;
};

/** Maquettes 3.4, Démarrage 2: each formation on Nuage, its address under its name, then copy and « Retirer ». */
export const FormationRow = ({ id, name, collectionUrl, collectionAddress }: FormationRowProps) => {
  const [isRemoving, startRemoving] = useTransition();
  const [result, setResult] = useState<RemoveFormationResult | null>(null);
  const { isCopied, handleCopy } = useCopyLink(collectionUrl);

  const handleRemove = () => {
    startRemoving(async () => {
      setResult(await removeFormation(id));
    });
  };

  return (
    <li className="flex flex-col gap-2 rounded-card bg-cloud py-4 pr-3 pl-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-[0] flex-col gap-1 pt-[10px]">
          <span className="text-body font-bold">{name}</span>
          <span className="text-small text-gray wrap-anywhere">{collectionAddress}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copier le lien ${prefixWithDe(name)}`}
            className={ICON_BUTTON_CLASSES}
          >
            <Icon name={isCopied ? "check" : "copy"} size={20} />
          </button>
          <button type="button" onClick={handleRemove} disabled={isRemoving} className={DISCREET_BUTTON_CLASSES}>
            Retirer
          </button>
        </div>
      </div>
      {/* The check on the button says it on the spot; a line of text here would push the next formations down. */}
      <span aria-live="polite" className="sr-only">
        {isCopied ? "Le lien est copié." : ""}
      </span>
      {result?.ok === false ? <FieldError id={`${id}-error`} message={REMOVAL_ERROR_MESSAGES[result.error]} /> : null}
    </li>
  );
};
