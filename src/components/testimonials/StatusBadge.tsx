import { ICON_PATHS } from "@/components/ui/icon-paths";
import { cn } from "@/lib/cn";
import type { TestimonialStatus } from "@/lib/testimonials/testimonial-filters";

export const STATUS_LABELS = {
  pending: "En attente",
  approved: "Validé",
  hidden: "Masqué",
} as const satisfies Record<TestimonialStatus, string>;

const STATUS_STYLES = {
  pending: { icon: "clock", classes: "bg-attention-surface text-attention" },
  approved: { icon: "valid", classes: "bg-success-surface text-success" },
  hidden: { icon: "hidden", classes: "bg-paper-100 text-slate-600" },
} as const satisfies Record<TestimonialStatus, { icon: keyof typeof ICON_PATHS; classes: string }>;

type StatusBadgeProps = {
  status: TestimonialStatus;
  /** Plays the validated check once, right after a click on « Valider ». */
  isJustApproved?: boolean;
};

export const StatusBadge = ({ status, isJustApproved = false }: StatusBadgeProps) => {
  const { icon, classes } = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "pz-badge inline-flex h-[28px] shrink-0 items-center gap-2 rounded-full pr-3 pl-2 text-small font-medium whitespace-nowrap",
        classes,
        isJustApproved && status === "approved" && "pz-badge-valide",
      )}
    >
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        {ICON_PATHS[icon].map((path, index) => (
          <path key={path} d={path} className={status === "approved" && index === 1 ? "pz-coche" : undefined} />
        ))}
      </svg>
      {STATUS_LABELS[status]}
    </span>
  );
};
