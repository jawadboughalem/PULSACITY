import { CheckList } from "@/components/marketing/CheckList";
import { PlanPrice } from "@/components/marketing/PlanPrice";
import { PLAN_PRESENTATIONS, describePricePeriod, readPlanPrice } from "@/content/plan-offer";
import { cn } from "@/lib/cn";

/** « Tarifs » of maquette 7, in short: three columns under a rule, Essentiel recommended. Monthly prices. */
export const PlanSummary = () => (
  <ul className="grid gap-7 desktop:grid-cols-3 desktop:gap-6">
    {PLAN_PRESENTATIONS.map((plan) => (
      <li
        key={plan.id}
        className={cn("flex flex-col gap-4 pt-5", plan.isRecommended ? "border-t-2 border-ink-900" : "border-t border-ink-900")}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-h2 font-medium">{plan.name}</h3>
          {plan.isRecommended ? <span className="text-small font-semibold">Recommandé</span> : null}
        </div>
        <p className="flex items-baseline gap-1">
          <PlanPrice amountCents={readPlanPrice(plan.id, "monthly")} size="medium" />
          <span className="text-body">{describePricePeriod(plan.id, "monthly")}</span>
        </p>
        <p className="text-body text-slate-600">{plan.tagline}</p>
        <CheckList items={plan.highlights} />
      </li>
    ))}
  </ul>
);
