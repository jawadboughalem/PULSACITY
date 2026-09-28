import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FieldError } from "./FieldError";

type TextFieldProps = Omit<ComponentPropsWithoutRef<"input">, "id" | "className"> & {
  id: string;
  label: ReactNode;
  hint?: string;
  error?: string;
};

export const TextField = ({ id, label, hint, error, ...inputProps }: TextFieldProps) => {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          "h-[48px] w-full rounded-sm border border-gray-400 bg-white px-4 text-body text-ink-900 placeholder:text-slate-600",
          "focus:border-2 focus:border-ink-900 focus:px-[15px] focus:outline-none",
          error && "border-2 border-error px-[15px]",
        )}
        {...inputProps}
      />
      {hint ? (
        <p id={hintId} className="text-small text-slate-600">
          {hint}
        </p>
      ) : null}
      {error ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
};
