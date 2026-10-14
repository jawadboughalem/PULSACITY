import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarketingSectionProps = {
  id?: string;
  labelledBy?: string;
  /** Ciel for the sections that stand apart (m7: the example widget, the questions). */
  tone?: "white" | "paper";
  className?: string;
  children: ReactNode;
};

/**
 * A band of the public site: the full width for its colour, the content in the 1280 px of the charter between the page
 * margins. No rule between two sections (charte v2): their spacing and their backgrounds separate them.
 */
export const MarketingSection = ({ id, labelledBy, tone = "white", className, children }: MarketingSectionProps) => (
  <section
    id={id}
    aria-labelledby={labelledBy}
    className={cn("scroll-mt-6 px-page-gutter", tone === "paper" ? "bg-sky" : "bg-white")}
  >
    <div className={cn("mx-auto max-w-content py-12 desktop:py-14", className)}>{children}</div>
  </section>
);

type SectionTitleProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

/** Section titles of m7 and m8: charte v2, h2. */
export const SectionTitle = ({ id, children, className }: SectionTitleProps) => (
  <h2 id={id} className={cn("font-display text-h2", className)}>
    {children}
  </h2>
);
