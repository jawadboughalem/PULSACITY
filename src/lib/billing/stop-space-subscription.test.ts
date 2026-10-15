import type Stripe from "stripe";
import { describe, expect, it, vi } from "vitest";
import { SubscriptionNotStoppedError, stopSubscriptionWith } from "./stop-space-subscription";

const SPACE = { id: "space", stripeCustomerId: "cus_test", stripeSubscriptionId: "sub_test" };

const fakeStripe = (status: string, cancel = vi.fn().mockResolvedValue({})) =>
  ({
    subscriptions: { retrieve: vi.fn().mockResolvedValue({ id: "sub_test", status, schedule: null }), cancel },
    subscriptionSchedules: { retrieve: vi.fn(), release: vi.fn() },
  }) as unknown as Stripe;

describe("stopSubscriptionWith", () => {
  it("has nothing to stop without a subscription", async () => {
    const stripe = vi.fn();
    await stopSubscriptionWith(stripe)({ ...SPACE, stripeSubscriptionId: null });
    expect(stripe).not.toHaveBeenCalled();
  });

  it("stops the subscription at once, without an invoice or a refund", async () => {
    const cancel = vi.fn().mockResolvedValue({});
    await stopSubscriptionWith(() => fakeStripe("active", cancel))(SPACE);
    expect(cancel).toHaveBeenCalledWith("sub_test", { invoice_now: false, prorate: false });
  });

  it("leaves alone a subscription already over", async () => {
    const cancel = vi.fn();
    await stopSubscriptionWith(() => fakeStripe("canceled", cancel))(SPACE);
    expect(cancel).not.toHaveBeenCalled();
  });

  it("refuses to let the space be deleted when Stripe cannot stop it", async () => {
    const failing = () =>
      fakeStripe("active", vi.fn().mockRejectedValue(Object.assign(new Error("Stripe down"), { code: "api_error" })));
    await expect(stopSubscriptionWith(failing)(SPACE)).rejects.toBeInstanceOf(SubscriptionNotStoppedError);
    const unconfigured = () => {
      throw new Error("STRIPE_SECRET_KEY is missing");
    };
    await expect(stopSubscriptionWith(unconfigured)(SPACE)).rejects.toBeInstanceOf(SubscriptionNotStoppedError);
  });
});
