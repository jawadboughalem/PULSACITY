import Link from "next/link";
import { TEXT_LINK_CLASSES } from "@/components/marketing/marketing-styles";
import { Icon } from "@/components/ui/Icon";
import type { MeanwhileItem } from "@/content/integrations";
import { cn } from "@/lib/cn";

type MeanwhileListProps = {
  items: MeanwhileItem[];
  /** Three columns under their icon on /integrations; one row each on the page of a connector to come (m21). */
  layout: "columns" | "rows";
};

/** What works with any tool, like « Comment ça marche » of m7 without numbers; spaced, without rules (charte v2). */
export const MeanwhileList = ({ items, layout }: MeanwhileListProps) => (
  <ul
    className={cn(
      layout === "columns"
        ? "grid gap-8 desktop:grid-cols-3 desktop:gap-10"
        : "flex flex-col gap-10 desktop:gap-12",
    )}
  >
    {items.map((item) => (
      <li
        key={item.title}
        className={cn(
          "flex flex-col",
          layout === "columns" ? "gap-3" : "gap-2",
        )}
      >
        {item.icon ? <Icon name={item.icon} size={20} className="mb-1" /> : null}
        <h3 className="font-display text-h3">{item.title}</h3>
        <p className="max-w-text text-body text-gray">{item.text}</p>
        {item.link ? (
          <Link href={item.link.href} className={cn(TEXT_LINK_CLASSES, "self-start")}>
            {item.link.label}
          </Link>
        ) : null}
      </li>
    ))}
  </ul>
);
