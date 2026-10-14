import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SettingsSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
};

/** Réglages and Mon compte (3.3): one white panel per subject, on Nuage, its title in h2, padding 20 (32 on a computer). */
export const SettingsSection = ({ id, title, children, className }: SettingsSectionProps) => (
  <section
    aria-labelledby={id}
    className={cn("flex min-w-[0] flex-col gap-6 rounded-panel bg-white p-5 desktop:p-8", className)}
  >
    <h2 id={id} className="font-display text-h2">
      {title}
    </h2>
    {children}
  </section>
);

type SettingsPageHeadingProps = {
  title: string;
  lead: string;
};

/** The page's title, and on a computer the line that says what it holds. */
export const SettingsPageHeading = ({ title, lead }: SettingsPageHeadingProps) => (
  <div className="flex flex-col gap-2">
    <h1 className="font-display text-h1">{title}</h1>
    <p className="text-lead max-desktop:hidden">{lead}</p>
  </div>
);
