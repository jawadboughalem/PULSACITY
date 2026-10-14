import { splitPrice } from "@/content/plan-offer";
import { cn } from "@/lib/cn";

type PlanPriceProps = {
  amountCents: number;
  className?: string;
};

/** « 9,99 € »: charte v2, chiffre 60/60 (40/44 on a phone); the cents and « € » at the same size, after a no-break space. */
export const PlanPrice = ({ amountCents, className }: PlanPriceProps) => {
  const { whole, rest } = splitPrice(amountCents);
  return <span className={cn("font-display text-figure whitespace-nowrap", className)}>{`${whole}${rest}`}</span>;
};
