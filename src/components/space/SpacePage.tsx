import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SpacePageProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Charte v2, the page of the space: padding 48 × 56 on a computer; on a phone, the page's gutter, and room under the
 * content for the tab bar (84) and 24 more.
 */
export const SpacePage = ({ children, className }: SpacePageProps) => (
  <main
    className={cn(
      "flex flex-col gap-6 px-page-gutter pt-6 pb-[108px] desktop:gap-10 desktop:px-11 desktop:py-10",
      className,
    )}
  >
    {children}
  </main>
);
