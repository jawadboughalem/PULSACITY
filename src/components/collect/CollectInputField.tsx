import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/cn";
import { COLLECT_FIELD_BORDER, COLLECT_FIELD_CLASSES } from "./collect-field-styles";

type CollectInputFieldProps = Omit<ComponentPropsWithoutRef<"input">, "id" | "className"> & {
  id: string;
  label: ReactNode;
  hint?: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
};

export const CollectInputField = ({ id, label, hint, error, inputRef, ...inputProps }: CollectInputFieldProps) => {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-semibold">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(COLLECT_FIELD_CLASSES, "h-[48px] px-4", error ? COLLECT_FIELD_BORDER.error : COLLECT_FIELD_BORDER.normal)}
        {...inputProps}
      />
      {hint ? (
        <p id={`${id}-hint`} className="text-small text-slate-600">
          {hint}
        </p>
      ) : null}
      {error ? <FieldError id={`${id}-error`} message={error} /> : null}
    </div>
  );
};
