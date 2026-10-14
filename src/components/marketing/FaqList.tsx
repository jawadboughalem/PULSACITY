import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import type { FaqEntry } from "@/content/faq";
import { cn } from "@/lib/cn";

type FaqListProps = {
  /** Questions of the same list share it: opening one closes the other. */
  name: string;
  entries: FaqEntry[];
  /** The cards of the questions: white on a Ciel section, Nuage on a white one (charte v2, no rules between them). */
  surface: "white" | "cloud";
};

/** « Vos questions » (m7) and « Facturation » (m8): one card per question, the first answer open. Works without script. */
export const FaqList = ({ name, entries, surface }: FaqListProps) => (
  <div className="flex flex-col gap-3">
    {entries.map((entry, index) => (
      <details
        key={entry.question}
        name={name}
        open={index === 0}
        className={cn("group rounded-card px-5 desktop:px-6", surface === "white" ? "bg-white" : "bg-cloud")}
      >
        <summary
          className={cn(
            "flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden",
            FOCUS_RING,
          )}
        >
          <span className="font-display text-h3">{entry.question}</span>
          <Icon name="chevronDown" size={20} className="group-open:rotate-180" />
        </summary>
        <p className="max-w-text pb-6 text-body">{entry.answer}</p>
      </details>
    ))}
  </div>
);
