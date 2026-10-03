"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/cn";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "./button-styles";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  /** « Annuler » unless the confirmation itself cancels something. */
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = "Annuler",
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
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      className="m-auto w-[calc(100%-48px)] max-w-[480px] border border-hairline-200 bg-white p-5 text-ink-900 shadow-float backdrop:bg-[rgba(22,33,62,0.12)]"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 id={titleId} className="text-body font-semibold">
            {title}
          </h2>
          <p id={messageId} className="text-small text-slate-600">
            {message}
          </p>
        </div>
        <div className="flex flex-col-reverse gap-3 desktop:flex-row desktop:justify-end">
          <button type="button" onClick={onCancel} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
};
