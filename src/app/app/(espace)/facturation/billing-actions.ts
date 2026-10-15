"use server";

import * as Sentry from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { BILLING_PERIODS, PAID_PLAN_IDS } from "@/config/plans";
import { getDb } from "@/db";
import { subscriptions } from "@/db/schema";
import { getAppUrl } from "@/lib/app-url";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { type PortalFlow, openBillingPortal } from "@/lib/billing/billing-portal";
import { BILLING_PATH } from "@/lib/billing/billing-paths";
import { describeBillingError, describePlanWelcome } from "@/lib/billing/billing-notices";
import {
  type PlanChangePreview,
  applyPlanChange,
  cancelScheduledChange,
  prepareStop,
  previewPlanChange,
  readCurrentPlan,
  resumeSubscription,
} from "@/lib/billing/plan-change";
import { revalidateShownPrices } from "@/lib/billing/revalidate-shown-prices";
import { isSubscriptionOver } from "@/lib/billing/read-subscription-snapshot";
import { getStripe, isStripeConfigured } from "@/lib/billing/stripe-client";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";

const targetSchema = z.object({ plan: z.enum(PAID_PLAN_IDS), period: z.enum(BILLING_PERIODS) });

type Target = z.infer<typeof targetSchema>;

/** The signed-in creator's space and its current subscription, while it is not over. */
const loadSubscribedSpace = async () => {
  const signedInUser = await requireSignedInUser();
  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  if (space === null) return null;
  const [subscription] =
    space.stripeSubscriptionId === null
      ? []
      : await database.select().from(subscriptions).where(eq(subscriptions.id, space.stripeSubscriptionId));
  const isLive = subscription !== undefined && !isSubscriptionOver(subscription.status);
  return {
    database,
    space,
    subscription: isLive ? subscription : null,
    current: isLive ? readCurrentPlan(subscription) : null,
  };
};

const refresh = () => revalidatePath(SPACE_HOME_PATH, "layout");

/**
 * « Gérer mon paiement et mes factures », « Mettre à jour ma carte », « Passer au plan Gratuit »: Stripe's page, which
 * brings the creator back here. A change programmed goes first before a stop, so that Stripe can stop.
 */
export const openBillingPortalAction = async (flow: PortalFlow): Promise<void> => {
  const loaded = await loadSubscribedSpace();
  if (loaded === null || loaded.space.stripeCustomerId === null || !isStripeConfigured()) redirect(BILLING_PATH);
  let url: string;
  try {
    const stripe = getStripe();
    const subscriptionId = loaded.subscription?.id ?? null;
    if (flow === "stop" && subscriptionId !== null) await prepareStop(stripe, subscriptionId);
    url = await openBillingPortal(stripe, {
      customerId: loaded.space.stripeCustomerId,
      subscriptionId,
      flow,
      returnUrl: `${getAppUrl()}${BILLING_PATH}`,
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect(describeBillingError("portal"));
  }
  redirect(url);
};

export type PreviewPlanChangeResult =
  | { ok: true; data: PlanChangePreview }
  | { ok: false; error: "invalid-input" | "not-subscribed" | "stripe-unavailable" };

/** What a change costs today, or what comes at the end of the period: the window of confirmation says it. */
export const previewPlanChangeAction = async (target: Target): Promise<PreviewPlanChangeResult> => {
  const parsed = targetSchema.safeParse(target);
  if (!parsed.success) return { ok: false, error: "invalid-input" };
  const loaded = await loadSubscribedSpace();
  if (!loaded?.subscription || !loaded.current || !isStripeConfigured()) return { ok: false, error: "not-subscribed" };
  const { subscription, current } = loaded;
  try {
    return { ok: true, data: await previewPlanChange(getStripe(), subscription.id, current, parsed.data) };
  } catch (error) {
    Sentry.captureException(error);
    return { ok: false, error: "stripe-unavailable" };
  }
};

export type ChangePlanResult =
  | { ok: true; data: { location: string } }
  | { ok: false; error: "invalid-input" | "not-subscribed" | "stripe-unavailable" };

/**
 * Changes the plan of the subscribed space: a higher plan now, prorated; the rest at the end of the period. The
 * creator goes on to Stripe when the bank asks for a confirmation, or back to the page.
 */
export const changePlanAction = async (target: Target): Promise<ChangePlanResult> => {
  const parsed = targetSchema.safeParse(target);
  if (!parsed.success) return { ok: false, error: "invalid-input" };
  const loaded = await loadSubscribedSpace();
  if (!loaded?.subscription || !loaded.current || !isStripeConfigured()) return { ok: false, error: "not-subscribed" };
  const { database, subscription, current } = loaded;
  try {
    const result = await applyPlanChange(database, getStripe(), subscription.id, current, parsed.data);
    refresh();
    if (result.status === "needs-confirmation") return { ok: true, data: { location: result.url } };
    if (result.status === "changed" && result.sync.status === "applied" && result.sync.closedFounderPrice) {
      revalidateShownPrices();
    }
    // A higher plan is taken at once (Pro is the only one above Essentiel): « Bienvenue dans Pro. »
    const isHigher = result.status === "changed" && current.plan !== "pro" && parsed.data.plan === "pro";
    return { ok: true, data: { location: isHigher ? describePlanWelcome(parsed.data.plan) : BILLING_PATH } };
  } catch (error) {
    Sentry.captureException(error);
    return { ok: false, error: "stripe-unavailable" };
  }
};

/** « Annuler ce changement ». */
export const cancelScheduledChangeAction = async (): Promise<void> => {
  const loaded = await loadSubscribedSpace();
  if (!loaded?.subscription || !isStripeConfigured()) redirect(BILLING_PATH);
  try {
    await cancelScheduledChange(loaded.database, getStripe(), loaded.subscription.id);
  } catch (error) {
    Sentry.captureException(error);
    redirect(describeBillingError("change"));
  }
  refresh();
  redirect(BILLING_PATH);
};

/** « Reprendre mon abonnement ». */
export const resumeSubscriptionAction = async (): Promise<void> => {
  const loaded = await loadSubscribedSpace();
  if (!loaded?.subscription || !isStripeConfigured()) redirect(BILLING_PATH);
  try {
    await resumeSubscription(loaded.database, getStripe(), loaded.subscription.id);
  } catch (error) {
    Sentry.captureException(error);
    redirect(describeBillingError("change"));
  }
  refresh();
  redirect(BILLING_PATH);
};
