import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SpacePageProps = {
  children: ReactNode;
  className?: string;
};

/** The content column of the space: clear of the mobile tab bar, 64 px from the edges on desktop. */
export const SpacePage = ({ children, className }: SpacePageProps) => (
  <main className={cn("flex flex-col gap-5 px-5 pt-6 pb-[108px] desktop:gap-7 desktop:px-8 desktop:py-7", className)}>
    {children}
  </main>
);
