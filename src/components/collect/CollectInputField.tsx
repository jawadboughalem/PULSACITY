import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_CLASSES, FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";

type CollectInputFieldProps = Omit<ComponentPropsWithoutRef<"input">, "id" | "className"> & {
  id: string;
  label: ReactNode;
  hint?: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
};

/** Charte v2, Champ de texte: aria-invalid turns its border to Erreur. */
export const CollectInputField = ({ id, label, hint, error, inputRef, ...inputProps }: CollectInputFieldProps) => {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={FIELD_LABEL_CLASSES}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={FIELD_CLASSES}
        {...inputProps}
      />
      {hint ? (
        <p id={`${id}-hint`} className={FIELD_HINT_CLASSES}>
          {hint}
        </p>
      ) : null}
      {error ? <FieldError id={`${id}-error`} message={error} /> : null}
    </div>
  );
};
