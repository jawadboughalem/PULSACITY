import type Stripe from "stripe";
import {
  type StripePriceKey,
  parseStripeLookupKey,
  readStripeLookupKey,
  readStripePriceAmount,
} from "@/config/plans";

/**
 * A Stripe price that does not say what plans.ts says (amount, euros, period, no tax added on top): the payment is not
 * opened, rather than charging a wrong amount. Fixed in Stripe, never in the code.
 */
export class StripePriceMismatchError extends Error {
  constructor(lookupKey: string, problem: string) {
    super(`Stripe price ${lookupKey}: ${problem}`);
    this.name = "StripePriceMismatchError";
  }
}

const STRIPE_INTERVALS = { monthly: "month", yearly: "year" } as const;

/** Why a Stripe price does not match plans.ts, or null when it does. */
export const findPriceMismatch = (
  price: Stripe.Price,
  key: StripePriceKey,
): string | null => {
  if (!price.active) return "inactive";
  if (price.currency !== "eur") return `currency ${price.currency}`;
  if (price.unit_amount !== readStripePriceAmount(key))
    return `amount ${price.unit_amount}`;
  if (
    price.recurring?.interval !== STRIPE_INTERVALS[key.period] ||
    price.recurring.interval_count !== 1
  ) {
    return `interval ${price.recurring?.interval ?? "none"}`;
  }
  // Without Stripe Tax, the Dashboard creates prices with no tax behaviour: nothing is added. « exclusive » would add a
  // tax on top of the price the day Stripe Tax computed one, and PULSACITY's prices are final.
  if (price.tax_behavior === "exclusive") return "tax behavior exclusive";
  return null;
};

/** The Stripe price of a plan, period and price list, found by its lookup key and checked against plans.ts. */
export const findStripePrice = async (
  stripe: Stripe,
  key: StripePriceKey,
): Promise<Stripe.Price> => {
  const lookupKey = readStripeLookupKey(key);
  const { data } = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
  });
  const [price] = data;
  if (!price) throw new StripePriceMismatchError(lookupKey, "not found");
  const mismatch = findPriceMismatch(price, key);
  if (mismatch !== null)
    throw new StripePriceMismatchError(lookupKey, mismatch);
  return price;
};

/** The plan, period and price list of a price PULSACITY sells, read from its lookup key; null otherwise. */
export const readStripePriceKey = (
  price: Pick<Stripe.Price, "lookup_key"> | null | undefined,
): StripePriceKey | null => parseStripeLookupKey(price?.lookup_key);
