import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import type { IconName } from "./icon-paths";

export type BadgeTone = "success" | "attention" | "neutral" | "error";

const TONE_CLASSES = {
  success: "bg-success-surface text-success",
  attention: "bg-attention-surface text-attention",
  neutral: "bg-paper-100 text-slate-600",
  error: "bg-error-surface text-error",
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
