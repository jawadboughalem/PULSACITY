import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SITE_SECTION_TITLE_CLASSES } from "./marketing-styles";

/** Charte v2, ajouts 3.5, Section de site: Blanc, Nuage or Ciel, in turn. */
export type SectionTone = "white" | "cloud" | "sky";

const TONE_CLASSES: Record<SectionTone, string> = {
  white: "bg-white",
  cloud: "bg-cloud",
  sky: "bg-sky",
};

type MarketingSectionProps = {
  id?: string;
  labelledBy?: string;
  tone?: SectionTone;
  className?: string;
  children: ReactNode;
};

/**
 * A band of the public site (charte v2, ajouts 3.5, Section de site): the full width for its colour, padding 96 80 on
 * a computer and 48 20 on a phone, the content in 1280 px. No rule between two sections: their backgrounds separate them.
 */
export const MarketingSection = ({ id, labelledBy, tone = "white", className, children }: MarketingSectionProps) => (
  <section id={id} aria-labelledby={labelledBy} className={cn("px-page-gutter", TONE_CLASSES[tone])}>
    <div className={cn("mx-auto max-w-content py-10 desktop:py-14", className)}>{children}</div>
  </section>
);

type SectionTitleProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

/**
 * Charte v2, ajouts 3.5, Titres du site: a section's title, 44/48 on a computer. Its lines stop at 800 px, as on the
 * planches of 3.5 (« 28 caractères au plus par ligne »).
 */
export const SectionTitle = ({ id, children, className }: SectionTitleProps) => (
  <h2 id={id} className={cn(SITE_SECTION_TITLE_CLASSES, "desktop:max-w-[800px]", className)}>
    {children}
  </h2>
);
