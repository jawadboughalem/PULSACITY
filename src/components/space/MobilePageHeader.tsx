import type { ReactNode } from "react";

type MobilePageHeaderProps = {
  title: string;
  action?: ReactNode;
};

/** On mobile, a page of the space below the home names itself in place of the logo: a white header of 64, no rule. */
export const MobilePageHeader = ({ title, action }: MobilePageHeaderProps) => (
  <header className="flex h-[64px] shrink-0 items-center justify-between gap-4 bg-white px-5 desktop:hidden">
    <p className="truncate font-display text-h3">{title}</p>
    {action}
  </header>
);
