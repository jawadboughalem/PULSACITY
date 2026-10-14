import { cn } from "@/lib/cn";

type SpinnerProps = {
  /** 20 in a main button, 18 in a secondary one (charte v2, Composants). */
  size: 18 | 20;
  className?: string;
};

/** The arc of a button while it sends: it turns in 0.8 s, and stays still when motion is reduced. */
export const Spinner = ({ size, className }: SpinnerProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    aria-hidden="true"
    className={cn("pz-spinner shrink-0", className)}
  >
    <path d="M12 3a9 9 0 1 1-9 9" />
  </svg>
);
