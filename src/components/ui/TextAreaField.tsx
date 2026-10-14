import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FieldError } from "./FieldError";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES, TEXTAREA_CLASSES } from "./field-styles";

type TextAreaFieldProps = Omit<ComponentPropsWithoutRef<"textarea">, "id" | "className"> & {
  id: string;
  label: ReactNode;
  hint?: string;
  error?: string;
  /** Taller than the 160 of the charter, when the screen draws it so. */
  className?: string;
};

/** Charte v2, Zone de texte: the field of TextField, 160 high at least; the error under it, then the help. */
export const TextAreaField = ({ id, label, hint, error, className, ...textAreaProps }: TextAreaFieldProps) => {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={FIELD_LABEL_CLASSES}>
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(TEXTAREA_CLASSES, className)}
        {...textAreaProps}
      />
      {error ? <FieldError id={errorId} message={error} /> : null}
      {hint ? (
        <p id={hintId} className={FIELD_HINT_CLASSES}>
          {hint}
        </p>
      ) : null}
    </div>
  );
};
