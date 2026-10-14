import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import { SELECT_CLASSES } from "./field-styles";

type SelectControlProps = ComponentPropsWithoutRef<"select">;

/**
 * Charte v2, Liste déroulante: the field's box with its chevron 20 on the right. A native select: where the browser
 * allows it (appearance: base-select), its open list takes the charter's panel, styled in globals.css.
 */
export const SelectControl = ({ className, children, ...selectProps }: SelectControlProps) => (
  <span className="relative flex w-full">
    <select className={cn(SELECT_CLASSES, className)} {...selectProps}>
      {children}
    </select>
    <Icon
      name="chevronDown"
      size={20}
      className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2 text-ink"
    />
  </span>
);
