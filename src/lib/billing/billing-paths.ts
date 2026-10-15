import { type BillingPeriod, PAID_PLAN_IDS, type PaidPlanId } from "@/config/plans";

/** « Abonnement et factures » (maquettes 8.3). */
export const BILLING_PATH = "/app/facturation";

/** Opens Stripe Checkout for a plan and a period: the buttons of Tarifs and of « Changer de plan » lead here. */
export const CHECKOUT_PATH = "/app/facturation/payer";

const PERIOD_WORDS: Record<BillingPeriod, string> = { monthly: "mensuel", yearly: "annuel" };

export type PlanChoice = { plan: PaidPlanId; period: BillingPeriod };

/** « ?plan=essentiel&periode=annuel »: the words the creator may read in the address. */
export const describePlanChoice = ({ plan, period }: PlanChoice): string =>
  new URLSearchParams({ plan, periode: PERIOD_WORDS[period] }).toString();

export const buildCheckoutPath = (choice: PlanChoice): string => `${CHECKOUT_PATH}?${describePlanChoice(choice)}`;

/** The plan and period of an address, or null when one is missing or unknown. */
export const parsePlanChoice = (plan: unknown, period: unknown): PlanChoice | null => {
  const planId = PAID_PLAN_IDS.find((id) => id === plan);
  const periodId = (Object.keys(PERIOD_WORDS) as BillingPeriod[]).find((id) => PERIOD_WORDS[id] === period);
  return planId === undefined || periodId === undefined ? null : { plan: planId, period: periodId };
};

/** The cookie that keeps a plan chosen on Tarifs while the creator signs up or signs in, then opens its payment. */
export const PLAN_CHOICE_COOKIE = "pulsacity-plan-choisi";

export const encodePlanChoice = ({ plan, period }: PlanChoice): string => `${plan}.${PERIOD_WORDS[period]}`;

export const decodePlanChoice = (value: string | undefined): PlanChoice | null => {
  if (value === undefined) return null;
  const [plan, period] = value.split(".");
  return parsePlanChoice(plan, period);
};

/** Where « Abonnement et factures » reopens: after a payment abandoned on Stripe (« Reprendre le paiement »). */
export const describeReturnToBilling = ({ abandoned }: { abandoned: PlanChoice }): string =>
  `${BILLING_PATH}?paiement=abandonne&${describePlanChoice(abandoned)}`;
