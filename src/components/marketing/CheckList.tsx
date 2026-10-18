import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type CheckListProps = {
  items: string[];
  /** « compact »: 15/22, the lists of « Changer de plan » (maquettes 8.3). */
  size?: "body" | "compact";
  className?: string;
};

/** The advantages of a plan (m7, m8), what a connection will do (m21): each behind a tick in Pousse (charte v2). */
export const CheckList = ({ items, size = "body", className }: CheckListProps) => (
  <ul className={cn("flex flex-col gap-3", className)}>
    {items.map((item) => (
      <li
        key={item}
        className={cn("flex items-start gap-3", size === "compact" ? "text-small" : "text-body")}
      >
        <Icon name="check" size={20} className={cn("text-success", size === "compact" ? "mt-[1px]" : "mt-[3px]")} />
        {item}
      </li>
    ))}
  </ul>
);
