import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type StatusBannerProps = {
  tone: "success" | "waiting" | "error";
  title: string;
  children?: ReactNode;
};

const TONE_CLASSES = {
  success: "bg-success-surface text-success",
  waiting: "bg-paper-100 text-ink-900",
  error: "border-2 border-error bg-error-surface text-error",
} as const;

const TONE_ICONS = { success: "valid", waiting: "clock", error: "alert" } as const;

export const StatusBanner = ({ tone, title, children }: StatusBannerProps) => (
  <div
    role={tone === "error" ? "alert" : "status"}
    className={cn("flex items-start gap-3 p-4 desktop:p-5", TONE_CLASSES[tone])}
  >
    <Icon name={TONE_ICONS[tone]} size={20} className="mt-[2px]" />
    <div className="flex flex-col gap-1">
      <p className="text-body font-semibold">{title}</p>
      {children ? <div className="text-small">{children}</div> : null}
    </div>
  </div>
);
