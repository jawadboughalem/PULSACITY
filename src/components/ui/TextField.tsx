import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { FieldError } from "./FieldError";
import { FIELD_CLASSES, FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES } from "./field-styles";

type TextFieldProps = Omit<ComponentPropsWithoutRef<"input">, "id" | "className"> & {
  id: string;
  label: ReactNode;
  hint?: string;
  error?: string;
};

/** Charte v2, Champ de texte: the label 8 px above, the help or the error below, tied by aria-describedby. */
export const TextField = ({ id, label, hint, error, ...inputProps }: TextFieldProps) => {
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
      {hint ? (
        <p id={hintId} className={FIELD_HINT_CLASSES}>
          {hint}
        </p>
      ) : null}
      {error ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
};
