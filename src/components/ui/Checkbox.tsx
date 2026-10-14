import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { FOCUS_RING } from "./button-styles";

type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "className"> & {
  hasError?: boolean;
};

/** Charte v2, Case à cocher: 24 × 24, radius-check; once checked, Encre and a white check drawn in 240 ms. */
export const Checkbox = ({ hasError = false, ...inputProps }: CheckboxProps) => (
  <span className="relative size-[24px] shrink-0">
    <input
      type="checkbox"
      aria-invalid={hasError || undefined}
      className={cn(
        "peer pz-couleur size-[24px] cursor-pointer appearance-none rounded-check border-2 bg-white enabled:hover:border-ink checked:border-ink checked:bg-ink",
        "disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-gray-light",
        FOCUS_RING,
        hasError ? "border-error" : "border-gray",
      )}
      {...inputProps}
    />
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="pz-case-coche pointer-events-none absolute inset-[0] hidden size-[24px] fill-none stroke-white peer-checked:block"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 12.5l3.5 3.5 7.5-8" />
    </svg>
  </span>
);
