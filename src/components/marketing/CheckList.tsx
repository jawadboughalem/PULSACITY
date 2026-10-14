import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type CheckListProps = {
  items: string[];
  className?: string;
};

/** The advantages of a plan (m7, m8), what a connection will do (m21): each behind a tick in Pousse (charte v2). */
export const CheckList = ({ items, className }: CheckListProps) => (
  <ul className={cn("flex flex-col gap-3", className)}>
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3 text-body">
        <Icon name="check" size={20} className="mt-[3px] text-success" />
        {item}
      </li>
    ))}
  </ul>
);
