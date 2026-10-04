import { cn } from "@/lib/cn";
import { splitPrice } from "@/content/plan-offer";

type PlanPriceProps = {
  amountCents: number;
  /** "large": m8, the charter's display size. "medium": the prices in short of m7. */
  size: "large" | "medium";
  className?: string;
};

/** « 9,99 € »: the euros in large, the cents and « € » smaller, in Encre 800, on the same baseline (charte, m8). */
export const PlanPrice = ({ amountCents, size, className }: PlanPriceProps) => {
  const { whole, rest } = splitPrice(amountCents);
  return (
    <span className={cn("inline-flex items-baseline font-serif font-medium whitespace-nowrap", className)}>
      <span className={size === "large" ? "text-display" : "text-h1"}>{whole}</span>
      <span
        className={cn(
          "text-ink-800",
          size === "large" ? "text-quote desktop:text-h2" : "text-quote",
        )}
      >
        {rest}
      </span>
    </span>
  );
};
