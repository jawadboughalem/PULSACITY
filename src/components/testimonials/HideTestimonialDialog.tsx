"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { DialogCloseButton } from "@/components/ui/DialogCloseButton";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES, TEXTAREA_CLASSES } from "@/components/ui/field-styles";
import { RadioButton } from "@/components/ui/RadioButton";
import { Spinner } from "@/components/ui/Spinner";
import { DIALOG_ACTIONS_CLASSES, DIALOG_CLASSES, DIALOG_TITLE_CLASSES, isClickOnVeil } from "@/components/ui/dialog-styles";
import { cn } from "@/lib/cn";
import { endSentence } from "@/lib/french/typography";
import {
  HIDDEN_REASONS,
  HIDDEN_REASON_LABELS,
  type HiddenReason,
  MAX_HIDDEN_REASON_DETAIL_LENGTH,
} from "@/lib/testimonials/hidden-reasons";
import type { HidingReason } from "@/lib/testimonials/hide-testimonial";
import type { AuthorReach } from "@/lib/testimonials/load-author-contact";

type HideTestimonialDialogProps = {
  isOpen: boolean;
  authorName: string;
  authorReach: AuthorReach;
  isPending: boolean;
  onConfirm: (hiding: HidingReason) => void;
  onCancel: () => void;
};

/** Under « Motif »: who receives it, or why nobody does. */
const describeReach = (authorName: string, reach: AuthorReach) =>
  ({
    reachable: `${authorName} le reçoit par e-⁠mail, avec votre nom.`,
    "no-address": `Il reste avec l'avis : sans adresse e-⁠mail, il ne peut pas être envoyé à ${endSentence(authorName)}`,
    unsubscribed: `Il reste avec l'avis : ${authorName} ne reçoit plus vos e-⁠mails.`,
  })[reach];

/**
 * Maquettes 3.4, fiche 04 et 05: « Masquer » asks for a reason (positionnement.md, point 6), sent to the author. Charte
 * 3.4, Choix exclusif: rounds of 24, the chosen one Encre with its dot; the error above the choices.
 */
export const HideTestimonialDialog = ({
  isOpen,
  authorName,
  authorReach,
  isPending,
  onConfirm,
  onCancel,
}: HideTestimonialDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const messageId = useId();
  const errorId = useId();
  const detailId = useId();
  const [reason, setReason] = useState<HiddenReason | null>(null);
  const [detail, setDetail] = useState("");
  const [isMissing, setIsMissing] = useState(false);
  const isDetailMissing = isMissing && reason === "other" && detail.trim() === "";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      setReason(null);
      setDetail("");
      setIsMissing(false);
      dialog.showModal();
    }
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const confirm = () => {
    if (isPending) return;
    if (reason === null || (reason === "other" && detail.trim() === "")) {
      setIsMissing(true);
      return;
    }
    onConfirm({ reason, detail: reason === "other" ? detail.trim() : null });
  };

  const missingMessage =
    authorReach === "reachable" ? `Choisissez un motif : il est envoyé à ${endSentence(authorName)}` : "Choisissez un motif.";

  return (
    <dialog
      ref={dialogRef}
      data-ouvert={isOpen}
      onCancel={(event) => {
        event.preventDefault();
        if (!isPending) onCancel();
      }}
      onClick={(event) => {
        if (isClickOnVeil(event) && !isPending) onCancel();
      }}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      className={DIALOG_CLASSES}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className={DIALOG_TITLE_CLASSES}>
              {`Masquer l'avis de ${authorName} ?`}
            </h2>
            <DialogCloseButton onClick={onCancel} isDisabled={isPending} />
          </div>
          <p id={messageId} className="text-body">
            Il n&apos;apparaîtra plus sur vos pages. Vous pourrez l&apos;afficher à nouveau à tout moment.
          </p>
        </div>
        <fieldset
          role="radiogroup"
          className="flex flex-col gap-1"
          aria-invalid={(isMissing && reason === null) || undefined}
          aria-describedby={isMissing && reason === null ? errorId : undefined}
        >
          <legend className={FIELD_LABEL_CLASSES}>Motif</legend>
          <p className={cn(FIELD_HINT_CLASSES, "mt-1 mb-2")}>{describeReach(authorName, authorReach)}</p>
          {isMissing && reason === null ? (
            <div className="mb-2">
              <FieldError id={errorId} message={missingMessage} />
            </div>
          ) : null}
          {HIDDEN_REASONS.map((choice) => (
            <label key={choice} className="flex min-h-[44px] cursor-pointer items-center gap-3 py-[6px] text-body">
              <RadioButton
                name="hidden-reason"
                value={choice}
                checked={reason === choice}
                onChange={() => {
                  setReason(choice);
                  setIsMissing(false);
                }}
                hasError={isMissing && reason === null}
              />
              {HIDDEN_REASON_LABELS[choice]}
            </label>
          ))}
          {reason === "other" ? (
            <div className="mt-2 flex flex-col gap-2">
              <label htmlFor={detailId} className={FIELD_LABEL_CLASSES}>
                Précisez le motif
              </label>
              <textarea
                id={detailId}
                value={detail}
                maxLength={MAX_HIDDEN_REASON_DETAIL_LENGTH}
                onChange={(event) => setDetail(event.target.value)}
                aria-invalid={isDetailMissing || undefined}
                aria-describedby={isDetailMissing ? `${detailId}-error` : `${detailId}-hint`}
                className={cn(TEXTAREA_CLASSES, "min-h-[96px]")}
              />
              {isDetailMissing ? (
                <FieldError id={`${detailId}-error`} message={`Écrivez le motif en quelques mots : ${authorName} le lira tel quel.`} />
              ) : (
                <p id={`${detailId}-hint`} className={FIELD_HINT_CLASSES}>
                  {`Quelques mots, envoyés tels quels. ${MAX_HIDDEN_REASON_DETAIL_LENGTH} caractères au plus.`}
                </p>
              )}
            </div>
          ) : null}
        </fieldset>
        <div className={DIALOG_ACTIONS_CLASSES}>
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            disabled={isPending}
            className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={confirm}
            aria-busy={isPending || undefined}
            className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
          >
            {isPending ? <Spinner size={20} /> : null}
            {isPending ? "Envoi…" : "Masquer l'avis"}
          </button>
        </div>
      </div>
    </dialog>
  );
};
