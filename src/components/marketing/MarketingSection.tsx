import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarketingSectionProps = {
  id?: string;
  labelledBy?: string;
  /** Papier for the sections that stand apart (m7: the example widget, the questions). */
  tone?: "white" | "paper";
  /** A hairline above, between two white sections (m7). */
  hasTopRule?: boolean;
  className?: string;
  children: ReactNode;
};

/** A band of the public site: the full width for its colour, the content in the 1440 px of the maquettes. */
export const MarketingSection = ({
  id,
  labelledBy,
  tone = "white",
  hasTopRule = false,
  className,
  children,
}: MarketingSectionProps) => (
  <section
    id={id}
    aria-labelledby={labelledBy}
    className={cn("scroll-mt-6", tone === "paper" ? "bg-sky" : "bg-white", hasTopRule && "border-t border-hairline-200")}
  >
    <div className={cn("mx-auto max-w-[1440px] px-page-gutter py-12 desktop:py-14", className)}>{children}</div>
  </section>
);

type SectionTitleProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

/** Section titles of m7 and m8: Newsreader 500, h1 of the charter (36 on a computer, 28 on a phone). */
export const SectionTitle = ({ id, children, className }: SectionTitleProps) => (
  <h2 id={id} className={cn("font-display text-h1 font-semibold", className)}>
    {children}
  </h2>
);
