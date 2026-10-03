"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cancelRequest, sendRequestNow } from "@/app/app/(espace)/demandes/request-actions";
import { BILLING_HREF } from "@/components/space/space-sections";
import { DISCREET_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/cn";
import type { ReviewRequestStatus } from "@/lib/requests/list-space-requests";

const ERRORS = {
  "not-found": "Cette demande n'existe plus. Rechargez la page.",
  "not-cancellable": "Cette demande est déjà partie, sans relance à annuler.",
  "plan-limit": "Vous avez atteint les demandes du mois de votre plan. Elle partira le mois prochain.",
  stopped: "Elle ne partira pas : le client s'est désinscrit, ou les demandes de cette offre sont désactivées.",
  "not-sent": "L'e-mail n'est pas parti. Vérifiez l'adresse du client, puis réessayez dans quelques minutes.",
  network: "La demande n'a pas abouti. Vérifiez votre connexion, puis réessayez.",
} as const;

type RequestActionsProps = {
  requestId: string;
  status: ReviewRequestStatus;
  hasPendingReminder: boolean;
  customerName: string;
  productName: string;
};

/** « Envoyer maintenant » for a request that has not left, « Annuler » before it leaves, then its reminder. */
export const RequestActions = ({ requestId, status, hasPendingReminder, customerName, productName }: RequestActionsProps) => {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const [isWorking, startWorking] = useTransition();
  const canSend = status === "scheduled" || status === "failed";
  const canCancel = canSend || (status === "sent" && hasPendingReminder);
  if (!canSend && !canCancel) return null;

  const run = (action: () => Promise<{ ok: true } | { ok: false; error: keyof typeof ERRORS }>) => {
    setError(null);
    startWorking(async () => {
      try {
        const result = await action();
        if (result.ok) router.refresh();
        else setError(result.error);
      } catch {
        setError("network");
      }
    });
  };

  const isReminderOnly = !canSend;
  const cancelLabel = isReminderOnly ? "Annuler la relance" : "Annuler";

  return (
    <div className="flex flex-col gap-2 desktop:items-end">
      <div className="flex flex-col gap-2 desktop:flex-row desktop:items-center desktop:gap-4">
        {canSend ? (
          <button
            type="button"
            disabled={isWorking}
            onClick={() => run(() => sendRequestNow(requestId))}
            aria-label={`Envoyer maintenant la demande à ${customerName}`}
            className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
          >
            Envoyer maintenant
          </button>
        ) : null}
        <button
          type="button"
          disabled={isWorking}
          onClick={() => setIsConfirming(true)}
          aria-label={`${cancelLabel} : ${customerName}`}
          className={cn(DISCREET_BUTTON_CLASSES, "self-start desktop:self-auto")}
        >
          {cancelLabel}
        </button>
      </div>
      {error ? (
        <div className="flex flex-col gap-1">
          <FieldError id={`${requestId}-error`} message={ERRORS[error]} />
          {error === "plan-limit" ? (
            <Link href={BILLING_HREF} className={cn(DISCREET_BUTTON_CLASSES, "min-h-[44px]")}>
              Voir le plan Essentiel
            </Link>
          ) : null}
        </div>
      ) : null}
      <ConfirmDialog
        isOpen={isConfirming}
        title={isReminderOnly ? `Annuler la relance à ${customerName} ?` : `Annuler la demande à ${customerName} ?`}
        message={
          isReminderOnly
            ? "La demande déjà reçue reste valable. Aucun autre e-mail ne partira."
            : `Aucun e-mail ne partira pour ${productName}. Une nouvelle vente de cette offre n'en créera pas d'autre.`
        }
        confirmLabel={isReminderOnly ? "Annuler la relance" : "Annuler la demande"}
        cancelLabel="Garder"
        onConfirm={() => {
          setIsConfirming(false);
          run(async () => {
            const result = await cancelRequest(requestId);
            return result.ok ? { ok: true } : { ok: false, error: result.error };
          });
        }}
        onCancel={() => setIsConfirming(false)}
      />
    </div>
  );
};
