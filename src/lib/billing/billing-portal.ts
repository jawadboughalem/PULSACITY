import type Stripe from "stripe";

/** « Gérer mon paiement et mes factures », « Mettre à jour ma carte » and « Passer au plan Gratuit ». */
export type PortalFlow = "home" | "payment-method" | "stop";

/**
 * Stripe's customer portal (prompt 3 of the recette): card, billing address, PDF invoices, cancellation at the end of
 * the period with its reason. Changing plan stays on PULSACITY's page. Every way out comes back to `returnUrl`.
 */
export const openBillingPortal = async (
  stripe: Stripe,
  {
    customerId,
    subscriptionId,
    flow,
    returnUrl,
  }: { customerId: string; subscriptionId: string | null; flow: PortalFlow; returnUrl: string },
): Promise<string> => {
  const afterCompletion = { type: "redirect" as const, redirect: { return_url: returnUrl } };
  const flowData: Stripe.BillingPortal.SessionCreateParams.FlowData | undefined =
    flow === "payment-method"
      ? { type: "payment_method_update", after_completion: afterCompletion }
      : flow === "stop" && subscriptionId !== null
        ? { type: "subscription_cancel", subscription_cancel: { subscription: subscriptionId }, after_completion: afterCompletion }
        : undefined;
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
    locale: "fr",
    ...(flowData !== undefined ? { flow_data: flowData } : {}),
  });
  return session.url;
};
