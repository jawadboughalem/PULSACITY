"use client";

import { useState, useTransition } from "react";
import { type RemoveFormationResult, removeFormation } from "@/app/app/onboarding/formations/formation-actions";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";

const REMOVAL_ERROR_MESSAGES = {
  "has-sales": "Cette formation a déjà des ventes : elle reste en place pour les garder.",
  "product-not-found": "Cette formation n'existe plus. Rechargez la page.",
} as const;

type FormationRowProps = {
  id: string;
  name: string;
  collectionAddress: string;
};

export const FormationRow = ({ id, name, collectionAddress }: FormationRowProps) => {
  const [isRemoving, startRemoving] = useTransition();
  const [result, setResult] = useState<RemoveFormationResult | null>(null);

  const handleRemove = () => {
    startRemoving(async () => {
      setResult(await removeFormation(id));
    });
  };

  return (
    <li className="flex flex-col gap-2 border-b border-hairline-200 py-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex min-w-[0] flex-col">
          <span className="text-body font-semibold">{name}</span>
          <span className="text-small break-all text-slate-600">{collectionAddress}</span>
        </div>
        <button type="button" onClick={handleRemove} disabled={isRemoving} className={DISCREET_BUTTON_CLASSES}>
          Retirer
        </button>
      </div>
      {result?.ok === false ? <FieldError id={`${id}-error`} message={REMOVAL_ERROR_MESSAGES[result.error]} /> : null}
    </li>
  );
};
