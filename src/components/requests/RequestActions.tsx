"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cancelRequest, sendRequestNow } from "@/app/app/(espace)/demandes/request-actions";
import { BILLING_HREF } from "@/components/space/space-sections";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/cn";
import type { ReviewRequestStatus } from "@/lib/requests/list-space-requests";
import { CorrectEmailDialog } from "./CorrectEmailDialog";

const ERRORS = {
  "not-found": "Cette demande n'existe plus. Rechargez la page.",
  "not-cancellable": "Cette demande est déjà partie, sans relance à annuler.",
  "plan-limit": "Vous avez atteint les demandes du mois de votre plan. Elle partira le mois prochain.",
  stopped: "Elle ne partira pas : le client s'est désinscrit, ou les demandes de cette offre sont désactivées.",
  "not-sent": "L'e-mail n'est pas parti. Vérifiez l'adresse du client, puis réessayez dans quelques minutes.",
  network: "La demande n'a pas abouti. Vérifiez votre connexion, puis réessayez.",
} as const;

const ACTION_CLASSES = cn(DISCREET_BUTTON_CLASSES, "min-h-[44px] px-[0]");

type RequestActionsProps = {
  requestId: string;
  status: ReviewRequestStatus;
  hasPendingReminder: boolean;
  /** False once the plan's limit is reached: « Envoyer maintenant » could do nothing. */
  canSendNow: boolean;
  customerName: string;
  customerEmail: string;
  productName: string;
  /** The opinion left for this request, for « Voir l'avis ». */
  testimonialHref: string | null;
};

/**
 * m19, the links on the right of a request: « Envoyer maintenant » and « Annuler » before it leaves, « Annuler la
 * relance » while it waits for an answer, « Voir l'avis » once answered, « Corriger l'adresse » when it could not leave.
 */
export const RequestActions = ({
  requestId,
  status,
  hasPendingReminder,
  canSendNow,
  customerName,
  customerEmail,
  productName,
  testimonialHref,
}: RequestActionsProps) => {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const [isWorking, startWorking] = useTransition();

  if (status === "completed") {
    return testimonialHref ? (
      <Link href={testimonialHref} aria-label={`Voir l'avis de ${customerName}`} className={ACTION_CLASSES}>
        Voir l&apos;avis
      </Link>
    ) : null;
  }

  if (status === "failed") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsCorrecting(true)}
          aria-label={`Corriger l'adresse de ${customerName}`}
          className={ACTION_CLASSES}
        >
          Corriger l&apos;adresse
        </button>
        <CorrectEmailDialog
          isOpen={isCorrecting}
          requestId={requestId}
          customerName={customerName}
          customerEmail={customerEmail}
          onCorrected={() => {
            setIsCorrecting(false);
            router.refresh();
          }}
          onClose={() => setIsCorrecting(false)}
        />
      </>
    );
  }

  const isPlanned = status === "scheduled";
  if (!isPlanned && !(status === "sent" && hasPendingReminder)) return null;

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

  const cancelLabel = isPlanned ? "Annuler" : "Annuler la relance";

  return (
    <div className="flex flex-col gap-1 desktop:items-end">
      <div className="flex flex-wrap items-center gap-x-6">
        {isPlanned && canSendNow ? (
          <button
            type="button"
            disabled={isWorking}
            onClick={() => run(() => sendRequestNow(requestId))}
            aria-label={`Envoyer maintenant la demande à ${customerName}`}
            className={ACTION_CLASSES}
          >
            Envoyer maintenant
          </button>
        ) : null}
        <button
          type="button"
          disabled={isWorking}
          onClick={() => setIsConfirming(true)}
          aria-label={`${cancelLabel} : ${customerName}`}
          className={ACTION_CLASSES}
        >
          {cancelLabel}
        </button>
      </div>
      {error ? (
        <div className="flex flex-col gap-1">
          <FieldError id={`${requestId}-error`} message={ERRORS[error]} />
          {error === "plan-limit" ? (
            <Link href={BILLING_HREF} className={ACTION_CLASSES}>
              Voir le plan Essentiel
            </Link>
          ) : null}
        </div>
      ) : null}
      <ConfirmDialog
        isOpen={isConfirming}
        title={isPlanned ? `Annuler la demande à ${customerName} ?` : `Annuler la relance à ${customerName} ?`}
        message={
          isPlanned
            ? `Aucun e-mail ne partira pour ${productName}. Une nouvelle vente de cette offre n'en créera pas d'autre.`
            : "La demande déjà reçue reste valable. Aucun autre e-mail ne partira."
        }
        confirmLabel={isPlanned ? "Annuler la demande" : "Annuler la relance"}
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
