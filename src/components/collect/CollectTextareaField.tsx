import type { ComponentPropsWithoutRef, Ref } from "react";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES, TEXTAREA_CLASSES } from "@/components/ui/field-styles";
import { cn } from "@/lib/cn";

type CollectTextareaFieldProps = Omit<ComponentPropsWithoutRef<"textarea">, "id" | "className"> & {
  id: string;
  label: string;
  focusHint: string;
  error?: string;
  textareaRef?: Ref<HTMLTextAreaElement>;
};

export const CollectTextareaField = ({
  id,
  label,
  focusHint,
  error,
  textareaRef,
  ...textareaProps
}: CollectTextareaFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className={FIELD_LABEL_CLASSES}>
      {label}
    </label>
    <textarea
      ref={textareaRef}
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : `${id}-hint`}
      className={cn(TEXTAREA_CLASSES, "peer resize-none")}
      {...textareaProps}
    />
    <p id={`${id}-hint`} className={cn(FIELD_HINT_CLASSES, "hidden peer-focus:block")}>
      {focusHint}
    </p>
    {error ? <FieldError id={`${id}-error`} message={error} /> : null}
  </div>
);
