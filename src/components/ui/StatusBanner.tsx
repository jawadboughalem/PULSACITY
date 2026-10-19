import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type StatusBannerProps = {
  /** « neutral »: Gris clair, like the badge « Masqué » (fiche of a hidden testimonial, maquettes 3.4). */
  tone: "success" | "waiting" | "info" | "error" | "neutral";
  title: string;
  icon?: ReactNode;
  /** The detail, and for an error its action (always one, as the charter requires). */
  children?: ReactNode;
};

/** Charte v2, Bandeau: the background and the icon carry the tone, the text stays Encre. */
const TONE_CLASSES = {
  success: "bg-success-surface",
  waiting: "bg-waiting-surface",
  info: "bg-sky",
  error: "border-2 border-error bg-error-surface",
  neutral: "bg-gray-light",
} as const;

const TONE_ICONS = {
  success: { name: "valid", classes: "text-success" },
  waiting: { name: "clock", classes: "text-waiting" },
  info: { name: "info", classes: "text-ink" },
  error: { name: "alert", classes: "text-error" },
  neutral: { name: "hidden", classes: "text-ink" },
} as const;

/** radius-card, padding 20 24 (16 20 on a phone), the icon 24 at 14 px, title 17/26 700, detail 15/22. */
export const StatusBanner = ({ tone, title, icon, children }: StatusBannerProps) => (
  <div
    role={tone === "error" ? "alert" : "status"}
    className={cn("flex items-start gap-[14px] rounded-card px-5 py-4 text-ink desktop:px-6 desktop:py-5", TONE_CLASSES[tone])}
  >
    {icon ?? <Icon name={TONE_ICONS[tone].name} size={24} className={cn("mt-[1px]", TONE_ICONS[tone].classes)} />}
    {/* A long e-mail address without a break point goes to the next line instead of out of the banner. */}
    <div className="flex min-w-[0] flex-col gap-1 break-words">
      <p className="text-body font-bold">{title}</p>
      {children ? <div className="text-small">{children}</div> : null}
    </div>
  </div>
);
