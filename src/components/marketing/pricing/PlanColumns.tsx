import { SignUpLink } from "@/components/acquisition/SignUpLink";
import { CheckList } from "@/components/marketing/CheckList";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { PlanPrice } from "@/components/marketing/PlanPrice";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { type PlanId, type PriceList, isPaidPlan } from "@/config/plans";
import {
  type BillingPeriod,
  PLAN_PRESENTATIONS,
  describeLaunchPrice,
  describePricePeriod,
  readPlanPrice,
} from "@/content/plan-offer";
import { buildCheckoutPath } from "@/lib/billing/billing-paths";
import { cn } from "@/lib/cn";

/** Inside the billing scope (group/billing): the monthly prices, or the yearly ones once « Annuel » is chosen. */
const PERIOD_VISIBILITY: Record<BillingPeriod, string> = {
  monthly: "flex group-data-[choice=yearly]/billing:hidden",
  yearly: "hidden group-data-[choice=yearly]/billing:flex",
};

/**
 * The labels of m8. The free plan starts with the creation of the space; a paid plan opens its payment, in the period
 * shown, after the sign-up or the sign-in when there is no session (lot 4.5).
 */
const CALLS_TO_ACTION: Record<PlanId, string> = {
  free: "Créer mon espace gratuit",
  essentiel: "Choisir Essentiel",
  pro: "Choisir Pro",
};

/** Charte v2, Colonnes de prix: « Recommandé » 15/20 700, its 20 px kept above every name on a computer. */
const RecommendedLabel = () => <p className="text-small leading-[20px] font-bold">Recommandé</p>;

/**
 * Maquettes 3.5, Tarifs (charte v2, ajouts 3.5, Colonne de prix): three panels on Nuage, Essentiel on Ciel with the
 * main button, the others white. Stacked on a phone, the list before the button. On a computer, each column's five
 * parts share the rows of the others: the line of the launch price, under the paid plans only, keeps the buttons and
 * the lists aligned.
 */
const readCallHref = (id: PlanId, period: BillingPeriod): string =>
  isPaidPlan(id) ? buildCheckoutPath({ plan: id, period }) : MARKETING_PATHS.signUp;

export const PlanColumns = ({ priceList }: { priceList: PriceList }) => (
  <ul className="grid gap-5 desktop:grid-cols-3">
    {PLAN_PRESENTATIONS.map((plan) => (
      <li
        key={plan.id}
        className={cn(
          "flex flex-col gap-4 rounded-panel px-7 py-8 desktop:row-span-5 desktop:grid desktop:grid-rows-subgrid",
          plan.isRecommended ? "bg-sky" : "bg-white",
        )}
      >
        <div className="flex flex-col gap-4">
          {plan.isRecommended ? (
            <RecommendedLabel />
          ) : (
            <span aria-hidden="true" className="hidden h-[20px] desktop:block" />
          )}
          <h2 className="font-display text-h2">{plan.name}</h2>
        </div>
        <div className="flex flex-col">
          {(["monthly", "yearly"] as const).map((period) => {
            const launchPrice = describeLaunchPrice(plan.id, period, priceList);
            return (
              <div key={period} className={cn("flex-col gap-2", PERIOD_VISIBILITY[period])}>
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <PlanPrice amountCents={readPlanPrice(plan.id, period, priceList)} />
                  <span className="text-small text-gray">{describePricePeriod(plan.id, period)}</span>
                </p>
                {launchPrice ? <p className="text-small text-gray">{launchPrice}</p> : null}
              </div>
            );
          })}
        </div>
        <p className="text-body">{plan.tagline}</p>
        <div className="order-last w-full desktop:order-none desktop:self-center">
          {(["monthly", "yearly"] as const).map((period) => (
            <div key={period} className={PERIOD_VISIBILITY[period]}>
              <SignUpLink
                href={readCallHref(plan.id, period)}
                place="tarifs"
                event={{ name: "choisir-un-plan", data: { plan: plan.id, periode: period } }}
                className={cn(plan.isRecommended ? PRIMARY_BUTTON_CLASSES : SECONDARY_BUTTON_CLASSES, "w-full")}
              >
                {CALLS_TO_ACTION[plan.id]}
              </SignUpLink>
            </div>
          ))}
        </div>
        <CheckList items={plan.highlights} />
      </li>
    ))}
  </ul>
);
