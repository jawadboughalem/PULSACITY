import Link from "next/link";
import { CheckList } from "@/components/marketing/CheckList";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { PlanPrice } from "@/components/marketing/PlanPrice";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import type { PlanId } from "@/config/plans";
import { type BillingPeriod, PLAN_PRESENTATIONS, describePricePeriod, readPlanPrice } from "@/content/plan-offer";
import { cn } from "@/lib/cn";

/** Inside the billing scope (group/billing): the monthly prices, or the yearly ones once « Annuel » is chosen. */
const PERIOD_VISIBILITY: Record<BillingPeriod, string> = {
  monthly: "group-data-[choice=yearly]/billing:hidden",
  yearly: "hidden group-data-[choice=yearly]/billing:block",
};

/**
 * Until Stripe (lot Stripe), every plan starts with the creation of the space; the paid plan is chosen from it.
 * The labels are those of m8.
 */
const CALLS_TO_ACTION: Record<PlanId, string> = {
  free: "Créer mon espace gratuit",
  essentiel: "Choisir Essentiel",
  pro: "Choisir Pro",
};

const RecommendedLabel = ({ className }: { className?: string }) => (
  <p className={cn("text-small font-semibold", className)}>Recommandé</p>
);

/** Maquette 8: three columns under a rule of Encre, Essentiel on Papier. Stacked on a phone, the list before the button. */
export const PlanColumns = () => (
  <ul className="grid gap-6 desktop:grid-cols-3 desktop:gap-[0] desktop:border-t desktop:border-ink-900">
    {PLAN_PRESENTATIONS.map((plan) => (
      <li
        key={plan.id}
        className={cn(
          "flex flex-col gap-4 border-t border-ink-900 px-5 pt-5 pb-6 desktop:gap-5 desktop:border-t-[0] desktop:px-6 desktop:pt-6",
          plan.isRecommended && "border-t-2 bg-paper-100 desktop:-mt-px desktop:border-t-2",
        )}
      >
        <div className="flex flex-col gap-1">
          {plan.isRecommended ? (
            <RecommendedLabel className="hidden desktop:block" />
          ) : (
            <span aria-hidden="true" className="hidden h-[20px] desktop:block" />
          )}
          <div className="flex items-baseline justify-between gap-4 desktop:mt-4">
            <h2 className="font-serif text-h2 font-medium">{plan.name}</h2>
            {plan.isRecommended ? <RecommendedLabel className="desktop:hidden" /> : null}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {(["monthly", "yearly"] as const).map((period) => (
            <div key={period} className={PERIOD_VISIBILITY[period]}>
              <PlanPrice amountCents={readPlanPrice(plan.id, period)} size="large" />
              <p className="text-small text-slate-600">{describePricePeriod(plan.id, period)}</p>
            </div>
          ))}
        </div>
        <p className="text-body">{plan.tagline}</p>
        <Link
          href={MARKETING_PATHS.signUp}
          className={cn(
            plan.isRecommended ? PRIMARY_BUTTON_CLASSES : SECONDARY_BUTTON_CLASSES,
            "order-last w-full desktop:order-none desktop:mt-5",
          )}
        >
          {CALLS_TO_ACTION[plan.id]}
        </Link>
        <CheckList items={plan.highlights} className="desktop:border-t desktop:border-hairline-200 desktop:pt-5" />
      </li>
    ))}
  </ul>
);
