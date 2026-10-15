import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type CheckListProps = {
  items: string[];
  /** « compact »: 16/24, 8 between items, the lists of « Changer de plan » (maquettes 8.3). */
  size?: "body" | "compact";
  className?: string;
};

/** The advantages of a plan (m7, m8), what a connection will do (m21): each behind a tick in Pousse (charte v2). */
export const CheckList = ({ items, size = "body", className }: CheckListProps) => (
  <ul className={cn("flex flex-col", size === "compact" ? "gap-2" : "gap-3", className)}>
    {items.map((item) => (
      <li
        key={item}
        className={cn("flex items-start gap-3", size === "compact" ? "text-[16px] leading-[24px]" : "text-body")}
      >
        <Icon name="check" size={20} className={cn("text-success", size === "compact" ? "mt-[2px]" : "mt-[3px]")} />
        {item}
      </li>
    ))}
  </ul>
);
