import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "className"> & {
  hasError?: boolean;
};

/** The charter's box: 24 × 24, radius-s, a white check on Ink once checked. */
export const Checkbox = ({ hasError = false, ...inputProps }: CheckboxProps) => (
  <span className="relative size-[24px] shrink-0">
    <input
      type="checkbox"
      aria-invalid={hasError || undefined}
      className={cn(
        "peer size-[24px] cursor-pointer appearance-none rounded-sm border-2 bg-white checked:border-ink-900 checked:bg-ink-900",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
        hasError ? "border-error" : "border-gray-400",
      )}
      {...inputProps}
    />
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="pointer-events-none absolute inset-[0] hidden size-[24px] fill-none stroke-white peer-checked:block"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 12.5l3.5 3.5 7.5-8" />
    </svg>
  </span>
);
