"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/cn";
import { DANGER_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "./button-styles";
import { DialogCloseButton } from "./DialogCloseButton";
import { Spinner } from "./Spinner";
import { DIALOG_ACTIONS_CLASSES, DIALOG_CLASSES, DIALOG_TITLE_CLASSES, isClickOnVeil } from "./dialog-styles";

/** m5: on a computer, « Annuler » becomes the charter's discreet button: no border, underlined. */
const DISCREET_ON_DESKTOP =
  "desktop:h-auto desktop:min-h-[44px] desktop:border-transparent desktop:bg-transparent desktop:px-[10px] desktop:underline desktop:decoration-2 desktop:underline-offset-4 desktop:hover:bg-transparent desktop:hover:text-ink-800 desktop:hover:decoration-[3px] desktop:active:bg-sky";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  /** One paragraph, or several. */
  message: string | string[];
  confirmLabel: string;
  /** « Annuler » unless the confirmation itself cancels something. */
  cancelLabel?: string;
  /** Something that cannot be undone: the danger button. */
  isDestructive?: boolean;
  /** m5: on a computer, « Annuler » as a discreet button beside the action; a full button on a phone. */
  isCancelDiscreet?: boolean;
  /** While the action runs (charte v2, Fenêtre de dialogue): « Envoi… », « Annuler » disabled, the veil stays. */
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Charte v2, Fenêtre de dialogue. A native modal dialog: the focus stays inside, Échap closes, the focus goes back to
 * the button that opened it. It starts on « Annuler », so that Entrée never confirms by accident.
 */
export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = "Annuler",
  isDestructive = false,
  isCancelDiscreet = false,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

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
              {title}
            </h2>
            <DialogCloseButton onClick={onCancel} isDisabled={isPending} />
          </div>
          <div id={messageId} className="flex flex-col gap-2 text-body">
            {(Array.isArray(message) ? message : [message]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className={DIALOG_ACTIONS_CLASSES}>
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            disabled={isPending}
            className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto", isCancelDiscreet && DISCREET_ON_DESKTOP)}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={isPending ? undefined : onConfirm}
            aria-busy={isPending || undefined}
            className={cn(isDestructive ? DANGER_BUTTON_CLASSES : PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
          >
            {isPending ? <Spinner size={20} /> : null}
            {isPending ? "Envoi…" : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
};
