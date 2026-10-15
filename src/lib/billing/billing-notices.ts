import { PAID_PLAN_IDS, type PaidPlanId } from "@/config/plans";
import { BILLING_PATH } from "./billing-paths";

/** What went wrong on the way to Stripe: the payment, its page of management, or a change of plan. */
export type BillingErrorKind = "checkout" | "portal" | "change";

const ERROR_WORDS: Record<BillingErrorKind, string> = { checkout: "paiement", portal: "portail", change: "changement" };

/** « Abonnement et factures » with its error banner. */
export const describeBillingError = (kind: BillingErrorKind): string => `${BILLING_PATH}?erreur=${ERROR_WORDS[kind]}`;

export const parseBillingError = (value: unknown): BillingErrorKind | null =>
  (Object.keys(ERROR_WORDS) as BillingErrorKind[]).find((kind) => ERROR_WORDS[kind] === value) ?? null;

/** After a higher plan taken at once: « Bienvenue dans Pro. » */
export const describePlanWelcome = (plan: PaidPlanId): string => `${BILLING_PATH}?bienvenue=${plan}`;

export const parsePlanWelcome = (value: unknown): PaidPlanId | null =>
  PAID_PLAN_IDS.find((plan) => plan === value) ?? null;

/** The value Stripe Checkout puts in the address on its way back (`?paiement={CHECKOUT_SESSION_ID}`). */
export const parseCheckoutSessionId = (value: unknown): string | null =>
  typeof value === "string" && /^cs_(test|live)_[A-Za-z0-9]+$/.test(value) ? value : null;

export const ABANDONED_PAYMENT = "abandonne";
