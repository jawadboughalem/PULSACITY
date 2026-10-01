import type { ReactNode } from "react";

type MobilePageHeaderProps = {
  title: string;
  action?: ReactNode;
};

/** On mobile, a page of the space below the home names itself in place of the logo. */
export const MobilePageHeader = ({ title, action }: MobilePageHeaderProps) => (
  <header className="flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-hairline-200 px-5 desktop:hidden">
    <p className="truncate font-serif text-quote font-medium">{title}</p>
    {action}
  </header>
);
