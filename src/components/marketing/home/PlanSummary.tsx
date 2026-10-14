import { CheckList } from "@/components/marketing/CheckList";
import { PlanPrice } from "@/components/marketing/PlanPrice";
import { PLAN_PRESENTATIONS, describeLaunchPrice, describePricePeriod, readPlanPrice } from "@/content/plan-offer";
import { cn } from "@/lib/cn";

/**
 * « Tarifs » of maquette 7, in short: three columns under a rule, Essentiel recommended. Monthly prices, with the
 * line of the launch price under a founder price (arbitrage n° 1). On a computer, the four parts of each column share
 * the rows of the others, so that the taglines and the lists stay aligned.
 */
export const PlanSummary = () => (
  <ul className="grid gap-10 desktop:grid-cols-3 desktop:gap-8">
    {PLAN_PRESENTATIONS.map((plan) => {
      const launchPrice = describeLaunchPrice(plan.id, "monthly");
      return (
        <li
          key={plan.id}
          className={cn(
            "flex flex-col gap-4 pt-6 desktop:row-span-4 desktop:grid desktop:grid-rows-subgrid",
            plan.isRecommended ? "border-t-2 border-ink" : "border-t border-ink",
          )}
        >
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-h2 font-semibold">{plan.name}</h3>
            {plan.isRecommended ? <span className="text-small font-bold">Recommandé</span> : null}
          </div>
          <div className="flex flex-col gap-2">
            <p className="flex items-baseline gap-1">
              <PlanPrice amountCents={readPlanPrice(plan.id, "monthly")} size="medium" />
              <span className="text-body">{describePricePeriod(plan.id, "monthly")}</span>
            </p>
            {launchPrice ? <p className="text-small text-gray">{launchPrice}</p> : null}
          </div>
          <p className="text-body text-gray">{plan.tagline}</p>
          <CheckList items={plan.highlights} />
        </li>
      );
    })}
  </ul>
);
