import { Icon } from "@/components/ui/Icon";
import type { FaqEntry } from "@/content/faq";

type FaqListProps = {
  /** Questions of the same list share it: opening one closes the other. */
  name: string;
  entries: FaqEntry[];
};

/** « Vos questions » (m7) and « Facturation » (m8): a rule of Encre above, the first answer open. Works without script. */
export const FaqList = ({ name, entries }: FaqListProps) => (
  <div className="border-t border-ink-900">
    {entries.map((entry, index) => (
      <details key={entry.question} name={name} open={index === 0} className="group border-b border-hairline-200">
        <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 [&::-webkit-details-marker]:hidden">
          <span className="font-serif text-quote">{entry.question}</span>
          <Icon name="chevronDown" size={20} className="group-open:rotate-180" />
        </summary>
        <p className="max-w-text pb-5 text-body">{entry.answer}</p>
      </details>
    ))}
  </div>
);
