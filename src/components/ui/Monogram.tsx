import { cn } from "@/lib/cn";

const WORDS = /[^\p{L}\p{N}]+/u;

/** « Systeme.io » gives « SI », « Connecteur universel » « CU », « Cal.com » « CC », « Learnybox » « L ». */
export const readMonogramLetters = (name: string): string =>
  name
    .split(WORDS)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

/**
 * Charte v2, Monogramme: a square of 44 on Ciel, radius-field, one or two initials in Bricolage 800 (38 % of the side).
 * It stands for a third-party tool everywhere: no brand logo.
 */
export const Monogram = ({ name, className }: { name: string; className?: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "flex size-[44px] shrink-0 items-center justify-center rounded-field bg-sky font-display text-[17px] leading-[1] text-ink",
      className,
    )}
  >
    {readMonogramLetters(name)}
  </span>
);
