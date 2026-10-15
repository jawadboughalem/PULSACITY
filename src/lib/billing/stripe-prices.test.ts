import type Stripe from "stripe";
import { describe, expect, it, vi } from "vitest";
import { buildStripePrice } from "./stripe-fixtures";
import { StripePriceMismatchError, findPriceMismatch, findStripePrice } from "./stripe-prices";

const KEY = { plan: "pro", period: "yearly", priceList: "public" } as const;

const fakeStripe = (prices: Stripe.Price[]) => {
  const list = vi.fn().mockResolvedValue({ data: prices });
  return { stripe: { prices: { list } } as unknown as Stripe, list };
};

describe("findPriceMismatch", () => {
  it("accepts a price that says what plans.ts says", () => {
    expect(findPriceMismatch(buildStripePrice(KEY), KEY)).toBeNull();
  });

  it("refuses a wrong amount, currency, period, tax behaviour, or an archived price", () => {
    expect(findPriceMismatch(buildStripePrice(KEY, { unit_amount: 24800 }), KEY)).toBe("amount 24800");
    expect(findPriceMismatch(buildStripePrice(KEY, { currency: "usd" }), KEY)).toBe("currency usd");
    expect(
      findPriceMismatch(
        buildStripePrice(KEY, { recurring: { interval: "month", interval_count: 1 } as Stripe.Price.Recurring }),
        KEY,
      ),
    ).toBe("interval month");
    expect(findPriceMismatch(buildStripePrice(KEY, { tax_behavior: "exclusive" }), KEY)).toBe("tax behavior exclusive");
    expect(findPriceMismatch(buildStripePrice(KEY, { tax_behavior: "unspecified" }), KEY)).toBe(
      "tax behavior unspecified",
    );
    expect(findPriceMismatch(buildStripePrice(KEY, { active: false }), KEY)).toBe("inactive");
  });
});

describe("findStripePrice", () => {
  it("finds the price by its lookup key", async () => {
    const { stripe, list } = fakeStripe([buildStripePrice(KEY)]);
    await expect(findStripePrice(stripe, KEY)).resolves.toMatchObject({ id: "price_pro_yearly_public" });
    expect(list).toHaveBeenCalledWith({ lookup_keys: ["pro_yearly_public"], active: true, limit: 1 });
  });

  it("opens no payment for a missing price, or one that differs from plans.ts", async () => {
    await expect(findStripePrice(fakeStripe([]).stripe, KEY)).rejects.toBeInstanceOf(StripePriceMismatchError);
    await expect(
      findStripePrice(fakeStripe([buildStripePrice(KEY, { unit_amount: 100 })]).stripe, KEY),
    ).rejects.toThrow("Stripe price pro_yearly_public: amount 100");
  });
});
