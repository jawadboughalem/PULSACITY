import { PlanPrice } from "@/components/marketing/PlanPrice";
import type { PriceList } from "@/config/plans";
import {
  PLAN_PRESENTATIONS,
  YEARLY_FREE_MONTHS,
  describeHomePlan,
  describeLaunchPrice,
  describePricePeriod,
  readPlanPrice,
} from "@/content/plan-offer";
import { cn } from "@/lib/cn";

/**
 * Maquettes 3.5, Accueil, section 9, with the charter v2's « Colonne de prix »: three panels on Nuage, Essentiel on
 * Ciel with « Recommandé », the others white. Monthly prices, with the line of the launch price under a founder price
 * (arbitrage n° 1), in its 44 px kept on a computer. On a computer, the parts of each column share the rows of the
 * others, so that the sentences stay aligned.
 */
export const PlanSummary = ({ priceList }: { priceList: PriceList }) => (
  <div className="flex flex-col gap-6">
    <ul className="grid gap-4 desktop:grid-cols-3">
      {PLAN_PRESENTATIONS.map((plan) => {
        const launchPrice = describeLaunchPrice(plan.id, "monthly", priceList);
        const hasLaunchLines = priceList === "founder";
        return (
          <li
            key={plan.id}
            className={cn(
              "flex flex-col gap-3 rounded-panel px-7 py-8 desktop:grid desktop:grid-rows-subgrid desktop:gap-y-3",
              hasLaunchLines ? "desktop:row-span-5" : "desktop:row-span-4",
              plan.isRecommended ? "bg-sky" : "bg-white",
            )}
          >
            <p className={cn("text-small leading-[20px] font-bold", !plan.isRecommended && "hidden desktop:block")}>
              {plan.isRecommended ? "Recommandé" : null}
            </p>
            <h3 className="font-display text-h3">{plan.name}</h3>
            <p className="flex flex-wrap items-baseline gap-x-2">
              <PlanPrice amountCents={readPlanPrice(plan.id, "monthly", priceList)} />
              <span className="text-small text-gray">{describePricePeriod(plan.id, "monthly")}</span>
            </p>
            {hasLaunchLines ? (
              <p className={cn("text-small text-gray desktop:min-h-[44px]", !launchPrice && "hidden desktop:block")}>
                {launchPrice}
              </p>
            ) : null}
            <p className="text-body">{describeHomePlan(plan.id)}</p>
          </li>
        );
      })}
    </ul>
    <p className="text-small font-bold">
      {`Annuel : ${YEARLY_FREE_MONTHS} mois offerts. Dépasser une limite ne supprime jamais rien.`}
    </p>
  </div>
);
