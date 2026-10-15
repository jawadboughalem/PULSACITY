import type { BillingPeriod, PaidPlanId } from "@/config/plans";
import type { BillingOverview, CurrentSubscription } from "./billing-overview";
import type { BillingErrorKind } from "./billing-notices";
import type { PlanChoice } from "./billing-paths";
import { readCurrentPlan } from "./plan-change";

/** The one banner on top of « Abonnement et factures » (maquettes 8.3), the most pressing first. */
export type BillingBanner =
  | { kind: "error"; error: BillingErrorKind }
  | { kind: "failed"; plan: PaidPlanId }
  | { kind: "pending" }
  | { kind: "beta"; until: Date }
  | { kind: "welcome"; plan: PaidPlanId }
  | { kind: "stopping"; plan: PaidPlanId; at: Date }
  | {
      kind: "scheduled";
      from: { plan: PaidPlanId; period: BillingPeriod };
      to: { plan: PaidPlanId; period: BillingPeriod; amountCents: number };
      at: Date;
    }
  | { kind: "abandoned"; choice: PlanChoice }
  | { kind: "back-to-free"; since: Date; displayedWidget: string | null; pausedWidgets: number };

export type BillingPageContext = {
  error: BillingErrorKind | null;
  /** Back from Checkout (`?paiement=cs_…`), or a higher plan taken at once (`?bienvenue=pro`). */
  welcome: PaidPlanId | "checkout" | null;
  abandoned: PlanChoice | null;
  displayedWidget: string | null;
  now: Date;
};

/** The subscription waits for its first payment (a bank that checks, a debit on its way): « en cours de confirmation ». */
export const isPaymentPending = (subscription: CurrentSubscription | null): boolean =>
  subscription?.status === "incomplete";

export const isPaymentFailed = (subscription: CurrentSubscription | null): boolean =>
  subscription?.status === "past_due" || subscription?.status === "unpaid";

/** A beta tester in the offered months: « Offert pendant 3 mois ». */
export const isInBeta = (subscription: CurrentSubscription | null, now: Date): boolean =>
  subscription !== null && subscription.betaTester && subscription.betaUntil !== null && subscription.betaUntil > now;

export const chooseBillingBanner = (overview: BillingOverview, context: BillingPageContext): BillingBanner | null => {
  const { subscription } = overview;
  const current = subscription === null ? null : readCurrentPlan(subscription);
  if (context.error !== null) return { kind: "error", error: context.error };
  if (current !== null && isPaymentFailed(subscription)) return { kind: "failed", plan: current.plan };
  if (isPaymentPending(subscription)) return { kind: "pending" };
  if (subscription !== null && isInBeta(subscription, context.now)) {
    return { kind: "beta", until: subscription.betaUntil ?? context.now };
  }
  // Back from Checkout before Stripe could be read: the payment is still on its way.
  if (current === null && context.welcome === "checkout") return { kind: "pending" };
  if (current !== null && context.welcome !== null) {
    return { kind: "welcome", plan: context.welcome === "checkout" ? current.plan : context.welcome };
  }
  if (current !== null && subscription?.cancelAt) return { kind: "stopping", plan: current.plan, at: subscription.cancelAt };
  if (
    current !== null &&
    subscription?.scheduledPlan &&
    subscription.scheduledPlan !== "free" &&
    subscription.scheduledPeriod &&
    subscription.scheduledAt
  ) {
    return {
      kind: "scheduled",
      from: { plan: current.plan, period: current.period },
      to: {
        plan: subscription.scheduledPlan,
        period: subscription.scheduledPeriod,
        amountCents: subscription.scheduledAmountCents ?? 0,
      },
      at: subscription.scheduledAt,
    };
  }
  if (overview.plan === "free" && context.abandoned !== null) return { kind: "abandoned", choice: context.abandoned };
  if (overview.plan === "free" && overview.freeSince !== null && overview.usage.pausedWidgets > 0) {
    return {
      kind: "back-to-free",
      since: overview.freeSince,
      displayedWidget: context.displayedWidget,
      pausedWidgets: overview.usage.pausedWidgets,
    };
  }
  return null;
};
