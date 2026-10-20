import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { FieldError } from "./FieldError";
import { FIELD_CLASSES, FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES } from "./field-styles";

type TextFieldProps = Omit<ComponentPropsWithoutRef<"input">, "id" | "className"> & {
  id: string;
  label: ReactNode;
  hint?: string;
  error?: string;
  /** What fixes the error in one click, right under it (« Prendre julie-nutrition-2 »). */
  errorAction?: ReactNode;
};

/**
 * Charte v2, Champ de texte: the label 8 px above; below, the error right under the field, then the help (Réglages,
 * 3.3), both tied by aria-describedby.
 */
export const TextField = ({ id, label, hint, error, errorAction, ...inputProps }: TextFieldProps) => {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={FIELD_LABEL_CLASSES}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={FIELD_CLASSES}
        {...inputProps}
      />
      {error ? <FieldError id={errorId} message={error} /> : null}
      {error ? errorAction : null}
      {hint ? (
        <p id={hintId} className={FIELD_HINT_CLASSES}>
          {hint}
        </p>
      ) : null}
    </div>
  );
};
