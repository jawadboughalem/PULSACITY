import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import type { IconName } from "./icon-paths";

export type BadgeTone = "success" | "attention" | "neutral" | "error" | "paper" | "outline" | "dashed";

const TONE_CLASSES = {
  success: "bg-success-surface text-success",
  attention: "bg-attention-surface text-attention",
  neutral: "bg-paper-100 text-slate-600",
  error: "bg-error-surface text-error",
  /** m19: nothing has left yet. */
  paper: "bg-paper-100 text-ink-900",
  /** m19: waiting for an answer. */
  outline: "border border-ink-900 bg-white text-ink-900",
  /** m19: will never leave. */
  dashed: "border border-dashed border-gray-400 bg-white text-slate-600",
} as const satisfies Record<BadgeTone, string>;

type ToneBadgeProps = {
  tone: BadgeTone;
  label: string;
  icon?: IconName;
};

/** The charter's status badge: 28 high, its icon 8 px from the text. Without an icon, « Bientôt ». */
export const ToneBadge = ({ tone, label, icon }: ToneBadgeProps) => (
  <span
    className={cn(
      "inline-flex h-[28px] shrink-0 items-center gap-2 rounded-full text-small font-medium whitespace-nowrap",
      icon ? "pr-3 pl-2" : "px-3",
      TONE_CLASSES[tone],
    )}
  >
    {icon ? <Icon name={icon} size={16} /> : null}
    {label}
  </span>
);
