import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import type { BillingPeriod, PaidPlanId } from "@/config/plans";
import type { Database } from "@/db/database";
import { subscriptions } from "@/db/schema";
import { type ApplySubscriptionResult, syncSubscription } from "./apply-subscription";
import { type BillingSpace, ensureStripeCustomer } from "./billing-customer";
import { BILLING_PATH, describeReturnToBilling } from "./billing-paths";
import { readCurrentPriceList } from "./founder-seats";
import { isSubscriptionOver } from "./read-subscription-snapshot";
import { findStripePrice } from "./stripe-prices";

export type CheckoutSpace = BillingSpace & { stripeSubscriptionId: string | null };

export type StartCheckoutResult = { status: "opened"; url: string } | { status: "already-subscribed" };

/** The beta testers' code only works on Essentiel, monthly: on a yearly price, three free months would be a free year. */
export const acceptsPromotionCodes = (plan: PaidPlanId, period: BillingPeriod): boolean =>
  plan === "essentiel" && period === "monthly";

/** A space already subscribed changes plan from its page, never with a second subscription. */
const hasLiveSubscription = async (database: Database, space: CheckoutSpace): Promise<boolean> => {
  if (space.stripeSubscriptionId === null) return false;
  const [current] = await database
    .select({ status: subscriptions.status })
    .from(subscriptions)
    .where(eq(subscriptions.id, space.stripeSubscriptionId));
  return current !== undefined && !isSubscriptionOver(current.status);
};

/**
 * Opens Stripe Checkout for a free space: the founder price while it is open, the card asked even when the beta code
 * makes the first months free, the CGV accepted on the page. Stripe sends the creator back to « Abonnement et factures ».
 */
export const startCheckout = async (
  database: Database,
  stripe: Stripe,
  {
    space,
    email,
    plan,
    period,
    appUrl,
    withTestClock,
  }: {
    space: CheckoutSpace;
    email: string;
    plan: PaidPlanId;
    period: BillingPeriod;
    appUrl: string;
    withTestClock: boolean;
  },
): Promise<StartCheckoutResult> => {
  if (await hasLiveSubscription(database, space)) return { status: "already-subscribed" };
  const priceList = await readCurrentPriceList(database);
  const price = await findStripePrice(stripe, { plan, period, priceList });
  const customer = await ensureStripeCustomer(database, stripe, space, email, { withTestClock });
  const salesTermsUrl = `${appUrl}${MARKETING_PATHS.salesTerms}`;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer,
    client_reference_id: space.id,
    line_items: [{ price: price.id, quantity: 1 }],
    subscription_data: { metadata: { space_id: space.id } },
    metadata: { space_id: space.id },
    ...(acceptsPromotionCodes(plan, period) ? { allow_promotion_codes: true } : {}),
    locale: "fr",
    billing_address_collection: "auto",
    consent_collection: { terms_of_service: "required" },
    custom_text: {
      terms_of_service_acceptance: {
        message: `J'accepte les [conditions générales de vente](${salesTermsUrl}) de PULSACITY.`,
      },
    },
    success_url: `${appUrl}${BILLING_PATH}?paiement={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}${describeReturnToBilling({ abandoned: { plan, period } })}`,
  });
  if (session.url === null) throw new Error(`Checkout session ${session.id} has no url`);
  return { status: "opened", url: session.url };
};

/**
 * Back from Checkout (`?paiement={CHECKOUT_SESSION_ID}`): the subscription is read at once, without waiting for the
 * event, so that « Bienvenue dans Essentiel » shows on arrival. A session of another space is ignored.
 */
export const syncReturnFromCheckout = async (
  database: Database,
  stripe: Stripe,
  spaceId: string,
  sessionId: string,
): Promise<ApplySubscriptionResult | null> => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.client_reference_id !== spaceId || session.mode !== "subscription") return null;
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  return subscriptionId === undefined ? null : syncSubscription(database, stripe, subscriptionId);
};
