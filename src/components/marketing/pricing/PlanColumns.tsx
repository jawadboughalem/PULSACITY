import Link from "next/link";
import { CheckList } from "@/components/marketing/CheckList";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { PlanPrice } from "@/components/marketing/PlanPrice";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import type { PlanId } from "@/config/plans";
import {
  type BillingPeriod,
  PLAN_PRESENTATIONS,
  describeLaunchPrice,
  describePricePeriod,
  readPlanPrice,
} from "@/content/plan-offer";
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

/** Charte v2, Colonnes de prix: « Recommandé » 15/20 700, its 20 px kept above every name on a computer. */
const RecommendedLabel = ({ className }: { className?: string }) => (
  <p className={cn("text-small leading-[20px] font-bold", className)}>Recommandé</p>
);

/**
 * Maquette 8 with the charter v2's « Colonnes de prix »: three panels, Essentiel on Ciel with the main button, the
 * others on Nuage. Stacked on a phone, the list before the button. On a computer, each column's five parts share the
 * rows of the others: the line of the launch price, under the paid plans only, keeps the buttons and the lists aligned.
 */
export const PlanColumns = () => (
  <ul className="grid gap-5 desktop:grid-cols-3">
    {PLAN_PRESENTATIONS.map((plan) => (
      <li
        key={plan.id}
        className={cn(
          "flex flex-col gap-4 rounded-panel px-7 py-8 desktop:row-span-5 desktop:grid desktop:grid-rows-subgrid desktop:gap-6",
          plan.isRecommended ? "bg-sky" : "bg-cloud",
        )}
      >
        <div className="flex flex-col gap-1">
          {plan.isRecommended ? (
            <RecommendedLabel className="hidden desktop:block" />
          ) : (
            <span aria-hidden="true" className="hidden h-[20px] desktop:block" />
          )}
          <div className="flex items-baseline justify-between gap-4 desktop:mt-4">
            <h2 className="font-display text-h2">{plan.name}</h2>
            {plan.isRecommended ? <RecommendedLabel className="desktop:hidden" /> : null}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {(["monthly", "yearly"] as const).map((period) => {
            const launchPrice = describeLaunchPrice(plan.id, period);
            return (
              <div key={period} className={PERIOD_VISIBILITY[period]}>
                <PlanPrice amountCents={readPlanPrice(plan.id, period)} />
                <p className="text-small text-gray">{describePricePeriod(plan.id, period)}</p>
                {launchPrice ? <p className="mt-2 text-small text-gray">{launchPrice}</p> : null}
              </div>
            );
          })}
        </div>
        <p className="text-body">{plan.tagline}</p>
        <Link
          href={MARKETING_PATHS.signUp}
          className={cn(
            plan.isRecommended ? PRIMARY_BUTTON_CLASSES : SECONDARY_BUTTON_CLASSES,
            "order-last w-full desktop:order-none desktop:mt-6 desktop:self-center",
          )}
        >
          {CALLS_TO_ACTION[plan.id]}
        </Link>
        <CheckList items={plan.highlights} />
      </li>
    ))}
  </ul>
);
