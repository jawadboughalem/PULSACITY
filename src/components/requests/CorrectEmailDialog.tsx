"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { correctRequestEmail } from "@/app/app/(espace)/demandes/request-actions";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";

const ERRORS = {
  "invalid-email": "Cette adresse e-mail n'est pas valide. Vérifiez-la, puis réessayez.",
  "email-taken": "Un autre client de votre espace a déjà cette adresse. Vérifiez-la, puis réessayez.",
  "not-failed": "Cette demande est déjà repartie. Rechargez la page.",
  "not-found": "Cette demande n'existe plus. Rechargez la page.",
  network: "L'adresse n'a pas été enregistrée. Vérifiez votre connexion, puis réessayez.",
} as const;

type CorrectEmailDialogProps = {
  isOpen: boolean;
  requestId: string;
  customerName: string;
  customerEmail: string;
  onCorrected: () => void;
  onClose: () => void;
};

/** « Corriger l'adresse »: the request that could not leave goes again, to the address the creator types. */
export const CorrectEmailDialog = ({
  isOpen,
  requestId,
  customerName,
  customerEmail,
  onCorrected,
  onClose,
}: CorrectEmailDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const messageId = useId();
  const fieldId = useId();
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const [isSaving, startSaving] = useTransition();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const close = () => {
    setError(null);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      className="m-auto w-[calc(100%-48px)] max-w-[480px] border border-hairline-200 bg-white p-5 text-ink-900 shadow-float backdrop:bg-[rgba(22,33,62,0.12)]"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const email = new FormData(event.currentTarget).get("email");
          setError(null);
          startSaving(async () => {
            try {
              const result = await correctRequestEmail(requestId, typeof email === "string" ? email : "");
              if (result.ok) onCorrected();
              else setError(result.error);
            } catch {
              setError("network");
            }
          });
        }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <h2 id={titleId} className="text-body font-semibold">
            {`Corriger l'adresse de ${customerName}`}
          </h2>
          <p id={messageId} className="text-small text-slate-600">
            La demande repartira au prochain envoi, à cette adresse.
          </p>
        </div>
        <TextField
          id={fieldId}
          name="email"
          type="email"
          label="Adresse e-mail"
          defaultValue={customerEmail}
          autoComplete="off"
          required
          error={error ? ERRORS[error] : undefined}
        />
        <div className="flex flex-col-reverse gap-3 desktop:flex-row desktop:justify-end">
          <button type="button" onClick={close} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
            Annuler
          </button>
          <button type="submit" disabled={isSaving} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
            Enregistrer l&apos;adresse
          </button>
        </div>
      </form>
    </dialog>
  );
};
