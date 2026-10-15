import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { FOUNDER_PRICE_SEATS } from "@/config/plans";
import type { Database } from "@/db/database";
import { founderSeats, spaces, subscriptions } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { type CheckoutSpace, startCheckout } from "./checkout";
import { buildStripePrice } from "./stripe-fixtures";

let database: Database;
let space: CheckoutSpace;

const APP_URL = "https://pulsacity.com";

const fakeStripe = () => {
  const list = vi.fn(async ({ lookup_keys }: { lookup_keys: string[] }) => {
    const [plan, period, priceList] = lookup_keys[0].split("_") as ["essentiel" | "pro", "monthly" | "yearly", "founder" | "public"];
    return { data: [buildStripePrice({ plan, period, priceList })] };
  });
  const createCustomer = vi.fn().mockResolvedValue({ id: "cus_new" });
  const createClock = vi.fn().mockResolvedValue({ id: "clock_test" });
  const createSession = vi.fn().mockResolvedValue({ id: "cs_test_1", url: "https://checkout.stripe.com/c/pay/cs_test_1" });
  const stripe = {
    prices: { list },
    customers: { create: createCustomer },
    testHelpers: { testClocks: { create: createClock } },
    checkout: { sessions: { create: createSession } },
  } as unknown as Stripe;
  return { stripe, list, createCustomer, createClock, createSession };
};

const open = (stripe: Stripe, plan: "essentiel" | "pro", period: "monthly" | "yearly", withTestClock = false) =>
  startCheckout(database, stripe, { space, email: "julie@exemple.fr", plan, period, appUrl: APP_URL, withTestClock });

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  const spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  space = { id: spaceId, name: "Julie Nutrition", slug: "julie-nutrition", stripeCustomerId: null, stripeSubscriptionId: null };
});

describe("startCheckout", () => {
  it("opens Stripe Checkout at the founder price, the CGV accepted, back on « Abonnement et factures »", async () => {
    const { stripe, createSession, createCustomer } = fakeStripe();
    await expect(open(stripe, "essentiel", "monthly")).resolves.toEqual({
      status: "opened",
      url: "https://checkout.stripe.com/c/pay/cs_test_1",
    });
    expect(createCustomer).toHaveBeenCalledWith(
      { email: "julie@exemple.fr", name: "Julie Nutrition", preferred_locales: ["fr"], metadata: { space_id: space.id } },
      { idempotencyKey: `customer-${space.id}` },
    );
    expect(createSession.mock.calls[0][0]).toMatchObject({
      mode: "subscription",
      customer: "cus_new",
      client_reference_id: space.id,
      line_items: [{ price: "price_essentiel_monthly_founder", quantity: 1 }],
      subscription_data: { metadata: { space_id: space.id } },
      allow_promotion_codes: true,
      locale: "fr",
      consent_collection: { terms_of_service: "required" },
      success_url: `${APP_URL}/app/facturation?paiement={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/app/facturation?paiement=abandonne&plan=essentiel&periode=mensuel`,
    });
    const [saved] = await database.select({ id: spaces.stripeCustomerId }).from(spaces).where(eq(spaces.id, space.id));
    expect(saved.id).toBe("cus_new");
  });

  it("takes the beta testers' code on Essentiel monthly only, never on a yearly price nor on Pro", async () => {
    const { stripe, createSession } = fakeStripe();
    await open(stripe, "essentiel", "yearly");
    await open(stripe, "pro", "monthly");
    for (const [params] of createSession.mock.calls) expect(params).not.toHaveProperty("allow_promotion_codes");
  });

  it("charges the public price once the hundredth founder seat is taken", async () => {
    await database.insert(founderSeats).values(Array.from({ length: FOUNDER_PRICE_SEATS }, () => ({ spaceId: null })));
    const { stripe, createSession } = fakeStripe();
    await open(stripe, "pro", "yearly");
    expect(createSession.mock.calls[0][0].line_items).toEqual([{ price: "price_pro_yearly_public", quantity: 1 }]);
  });

  it("puts a new customer on its own test clock in the recette, and keeps the customer of the space", async () => {
    const { stripe, createClock, createCustomer } = fakeStripe();
    await open(stripe, "essentiel", "monthly", true);
    expect(createClock).toHaveBeenCalledOnce();
    expect(createCustomer.mock.calls[0][0]).toMatchObject({ test_clock: "clock_test" });

    space = { ...space, stripeCustomerId: "cus_new" };
    await open(stripe, "essentiel", "monthly", true);
    expect(createCustomer).toHaveBeenCalledOnce();
  });

  it("never opens a second subscription for a subscribed space", async () => {
    await database.insert(subscriptions).values({
      id: "sub_live",
      spaceId: space.id,
      status: "active",
      plan: "essentiel",
      period: "monthly",
      priceList: "founder",
      amountCents: 999,
    });
    const { stripe, createSession } = fakeStripe();
    space = { ...space, stripeSubscriptionId: "sub_live" };
    await expect(open(stripe, "pro", "monthly")).resolves.toEqual({ status: "already-subscribed" });
    expect(createSession).not.toHaveBeenCalled();
  });
});
