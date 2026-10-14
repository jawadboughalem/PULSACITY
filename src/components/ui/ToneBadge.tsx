import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import type { IconName } from "./icon-paths";

export type BadgeTone = "success" | "waiting" | "neutral" | "error" | "soon" | "paper" | "outline" | "dashed";

/** Charte v2, Badge de statut. The colour is never alone: the icon and the word carry the state. */
const TONE_CLASSES = {
  /** Validé, Connecté, Disponible. */
  success: "bg-success-surface text-success",
  /** En attente, À associer. */
  waiting: "bg-waiting-surface text-waiting",
  /** Masqué, and what simply happened. */
  neutral: "bg-gray-light text-gray",
  /** Problème. */
  error: "bg-error-surface text-error",
  /** Bientôt, without a date. */
  soon: "bg-sky text-ink",
  /** m19, not yet in the charter v2: nothing has left yet. */
  paper: "bg-sky text-ink",
  /** m19: waiting for an answer. */
  outline: "border-2 border-ink bg-white text-ink",
  /** m19: will never leave. */
  dashed: "border-2 border-dashed border-gray bg-white text-gray",
} as const satisfies Record<BadgeTone, string>;

type ToneBadgeProps = {
  tone: BadgeTone;
  label: string;
  icon?: IconName;
};

/** 32 high, a pill, 14/20 700, its icon 16 at 6 px from the word. */
export const ToneBadge = ({ tone, label, icon }: ToneBadgeProps) => (
  <span
    className={cn(
      "inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full px-3 text-badge font-bold whitespace-nowrap",
      TONE_CLASSES[tone],
    )}
  >
    {icon ? <Icon name={icon} size={16} /> : null}
    {label}
  </span>
);
