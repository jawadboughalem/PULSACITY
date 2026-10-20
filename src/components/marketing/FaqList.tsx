import type { ReactNode } from "react";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import type { FaqEntry } from "@/content/faq";
import { cn } from "@/lib/cn";
import { SectionTitle } from "./MarketingSection";

type FaqListProps = {
  /** Questions of the same list share it: opening one closes the other. */
  name: string;
  entries: FaqEntry[];
  /** The bands of the questions: white on a Nuage section, Nuage on a white one (charte v2, ajouts 3.5, Questions). */
  surface: "white" | "cloud";
};

/**
 * Charte v2, ajouts 3.5, Questions: each question a rounded band of 56 at least, 17/26 700, its chevron turning; one
 * open at a time, the first on arrival. Works without script.
 */
export const FaqList = ({ name, entries, surface }: FaqListProps) => (
  <div className="flex flex-col gap-3">
    {entries.map((entry, index) => (
      <details
        key={entry.question}
        name={name}
        open={index === 0}
        className={cn("group rounded-card px-4 desktop:px-6", surface === "white" ? "bg-white" : "bg-cloud")}
      >
        <summary
          className={cn(
            // A question on two lines keeps its chevron by its first line (maquettes 3.5); on one, both stay centred.
            "flex min-h-[56px] cursor-pointer list-none items-start justify-between gap-4 py-[15px] text-body font-bold [&::-webkit-details-marker]:hidden",
            FOCUS_RING,
          )}
        >
          {entry.question}
          <Icon name="chevronDown" size={20} className="mt-[3px] shrink-0 group-open:rotate-180" />
        </summary>
        <p className="max-w-text pb-6 text-body">{entry.answer}</p>
      </details>
    ))}
  </div>
);

type FaqSectionContentProps = FaqListProps & {
  titleId: string;
  title: ReactNode;
};

/** A section of questions: its title on the left, on 400 px, on a computer; above them on a phone. */
export const FaqSectionContent = ({ titleId, title, ...list }: FaqSectionContentProps) => (
  <div className="grid grid-cols-[minmax(0,1fr)] gap-6 desktop:grid-cols-[400px_minmax(0,1fr)] desktop:gap-10">
    <SectionTitle id={titleId}>{title}</SectionTitle>
    <FaqList {...list} />
  </div>
);
