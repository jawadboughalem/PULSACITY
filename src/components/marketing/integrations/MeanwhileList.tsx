import { Icon } from "@/components/ui/Icon";
import type { MeanwhileItem } from "@/content/integrations";
import { cn } from "@/lib/cn";

type MeanwhileListProps = {
  items: MeanwhileItem[];
  /** Three columns under their icon on /integrations; one row each on the page of a connector to come (m21). */
  layout: "columns" | "rows";
};

/** What works with any tool, under rules of Encre, like « Comment ça marche » of m7 without numbers. */
export const MeanwhileList = ({ items, layout }: MeanwhileListProps) => (
  <ul
    className={cn(
      layout === "columns"
        ? "grid gap-6 desktop:grid-cols-3 desktop:gap-7"
        : "flex flex-col border-t border-ink-900",
    )}
  >
    {items.map((item) => (
      <li
        key={item.title}
        className={cn(
          "flex flex-col",
          layout === "columns" ? "gap-3 border-t border-ink-900 pt-5" : "gap-2 border-b border-hairline-200 py-5 desktop:py-6",
        )}
      >
        {item.icon ? <Icon name={item.icon} size={20} className="mb-1" /> : null}
        <h3 className="font-serif text-quote font-medium">{item.title}</h3>
        <p className="max-w-text text-body text-slate-600">{item.text}</p>
      </li>
    ))}
  </ul>
);
