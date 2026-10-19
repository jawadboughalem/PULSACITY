import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";
import { FOCUS_RING } from "./button-styles";

type RadioButtonProps = Omit<ComponentPropsWithRef<"input">, "type" | "className"> & {
  hasError?: boolean;
};

/**
 * Charte v2, ajouts 3.4, Choix exclusif: a round of 24, its border 2 px Gris; chosen, an Encre border and an Encre dot
 * of 12; in error, an Erreur border. The whole line around it is the label, 44 high at least. The error is said by
 * the group (role="radiogroup", aria-invalid): a radio itself does not take aria-invalid.
 */
export const RadioButton = ({ hasError = false, ...inputProps }: RadioButtonProps) => (
  <span className="relative size-[24px] shrink-0">
    <input
      type="radio"
      className={cn(
        "peer pz-couleur size-[24px] cursor-pointer appearance-none rounded-full border-2 bg-white checked:border-ink",
        !hasError && "enabled:hover:border-ink",
        "disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-gray-light",
        FOCUS_RING,
        hasError ? "border-error" : "border-gray",
      )}
      {...inputProps}
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-[6px] left-[6px] hidden size-[12px] rounded-full bg-ink peer-checked:block"
    />
  </span>
);
