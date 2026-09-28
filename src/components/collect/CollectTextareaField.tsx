import type { ComponentPropsWithoutRef, Ref } from "react";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/cn";
import { COLLECT_FIELD_BORDER, COLLECT_FIELD_CLASSES } from "./collect-field-styles";

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
    <label htmlFor={id} className="text-small font-semibold">
      {label}
    </label>
    <textarea
      ref={textareaRef}
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : `${id}-hint`}
      className={cn(
        COLLECT_FIELD_CLASSES,
        "peer h-[152px] resize-none p-4",
        error ? COLLECT_FIELD_BORDER.error : COLLECT_FIELD_BORDER.normal,
      )}
      {...textareaProps}
    />
    <p id={`${id}-hint`} className="hidden text-small text-slate-600 peer-focus:block">
      {focusHint}
    </p>
    {error ? <FieldError id={`${id}-error`} message={error} /> : null}
  </div>
);
