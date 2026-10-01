import { cn } from "@/lib/cn";

type FeatureToggleProps = {
  isFeatured: boolean;
  authorName: string;
  onToggle: () => void;
  className?: string;
};

export const FeatureToggle = ({ isFeatured, authorName, onToggle, className }: FeatureToggleProps) => (
  <button
    type="button"
    aria-pressed={isFeatured}
    aria-label={`Mettre en avant l'avis de ${authorName}`}
    onClick={onToggle}
    className={cn(
      "relative flex size-[44px] shrink-0 items-center justify-center rounded-sm hover:bg-paper-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
      isFeatured ? "text-carmine" : "text-ink-900",
      className,
    )}
  >
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill={isFeatured ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h12v18l-6-5-6 5z" />
    </svg>
  </button>
);
