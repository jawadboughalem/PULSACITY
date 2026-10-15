import { eq } from "drizzle-orm";
import { openBillingPortalAction } from "@/app/app/(espace)/facturation/billing-actions";
import { SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { PLANS, isPaidPlan } from "@/config/plans";
import { getDb } from "@/db";
import { subscriptions } from "@/db/schema";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

/**
 * Charte v2, Bandeau: « Le bandeau de paiement échoué s'affiche en haut de chaque page de l'espace » (maquette 8.3,
 * accueil). Stripe retries the payment meanwhile; the plan stays until the last try.
 */
export const PaymentProblemBanner = async () => {
  const { space } = await getCurrentSpace();
  if (space.stripeSubscriptionId === null) return null;
  const [subscription] = await getDb()
    .select({ status: subscriptions.status, plan: subscriptions.plan })
    .from(subscriptions)
    .where(eq(subscriptions.id, space.stripeSubscriptionId));
  if (subscription === undefined || subscription.status !== "past_due" || !isPaidPlan(subscription.plan)) return null;
  return (
    <StatusBanner tone="error" title="Votre dernier paiement a échoué.">
      <p>{`Mettez à jour votre carte pour garder le plan ${PLANS[subscription.plan].name}.`}</p>
      <form action={openBillingPortalAction.bind(null, "payment-method")} className="mt-3">
        <button type="submit" className={SECONDARY_COMPACT_BUTTON_CLASSES}>
          Mettre à jour ma carte
        </button>
      </form>
    </StatusBanner>
  );
};
