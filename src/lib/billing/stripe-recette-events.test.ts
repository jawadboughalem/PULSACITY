import { readFileSync } from "node:fs";
import { asc, eq } from "drizzle-orm";
import type Stripe from "stripe";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { billingPayments, spaces, subscriptions } from "@/db/schema";
import { insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { countFounderSeats } from "./founder-seats";
import {
  findEventSubscription,
  processStripeEvent,
  recordStripeEvent,
} from "./stripe-events";

vi.mock("@/lib/email/send-email", () => ({ sendAccountEmail: vi.fn() }));

/**
 * The events Stripe sent to the preview during the recette of October 16, 2026 (prompt 8 of
 * docs-internes/recette/lot-4-5-abonnement.md), addresses, Stripe ids and space anonymised
 * (docs-internes/connectors/stripe-billing.md). The test clock of the recette froze both invoices at 12:36:11.
 */
const readEvent = (name: string): Stripe.Event =>
  JSON.parse(
    readFileSync(
      new URL(`./__fixtures__/${name}.json`, import.meta.url),
      "utf8",
    ),
  ) as Stripe.Event;

const objectOf = <T>(name: string): T => readEvent(name).data.object as T;

const SPACE_ID = "00000000-0000-4000-8000-000000000001";
const SUBSCRIPTION_ID = "sub_recette1";
const CUSTOMER_ID = "cus_recette1";
const STARTED_AT = new Date("2026-10-16T12:36:11Z");
const PERIOD_END = new Date("2026-11-16T12:36:11Z");
const NOW = new Date("2026-10-16T12:51:00Z");

const paymentMethod = objectOf<Stripe.PaymentMethod>("payment-method-attached");

/** The prices the recette's subscriptions carried, to expand the phases of a schedule as a retrieve does. */
const prices = new Map(
  ["customer-subscription-created", "customer-subscription-updated-pro"].map(
    (name) => {
      const { price } = objectOf<Stripe.Subscription>(name).items.data[0];
      return [price.id, price] as const;
    },
  ),
);

/** The subscription of an event as PULSACITY retrieves it (SUBSCRIPTION_EXPANSIONS): its card, and its schedule. */
const retrieved = (
  name: string,
  scheduleName?: string,
): Stripe.Subscription => {
  const subscription = objectOf<Stripe.Subscription>(name);
  const schedule =
    scheduleName === undefined
      ? null
      : objectOf<Stripe.SubscriptionSchedule>(scheduleName);
  return {
    ...subscription,
    default_payment_method: paymentMethod,
    schedule:
      schedule === null
        ? subscription.schedule
        : {
            ...schedule,
            phases: schedule.phases.map((phase) => ({
              ...phase,
              items: phase.items.map((item) => ({
                ...item,
                price: prices.get(item.price as string) ?? item.price,
              })),
            })),
          },
  } as Stripe.Subscription;
};

let database: Database;

/** Records the event, then processes it while Stripe answers with `state` for the subscription. */
const receive = async (name: string, state: Stripe.Subscription) => {
  const event = readEvent(name);
  await recordStripeEvent(database, event);
  const retrieve = vi.fn().mockResolvedValue(state);
  const outcome = await processStripeEvent(
    database,
    { subscriptions: { retrieve } } as unknown as Stripe,
    event.id,
    NOW,
  );
  return { outcome, retrieve };
};

const readSubscriptionRow = async () => {
  const [row] = await database
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, SUBSCRIPTION_ID));
  return row;
};

const readSpace = async () => {
  const [space] = await database
    .select()
    .from(spaces)
    .where(eq(spaces.id, SPACE_ID));
  return space;
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@example.com");
  await database.insert(spaces).values({
    id: SPACE_ID,
    userId,
    name: "Julie Nutrition",
    slug: "julie-nutrition",
    replyToEmail: "julie@example.com",
    plan: "free",
    referralCode: "recette1",
  });
});

describe("the Stripe events of the recette, October 16, 2026", () => {
  it("each names the subscription to read again, a released schedule included", async () => {
    await database
      .update(spaces)
      .set({
        stripeCustomerId: CUSTOMER_ID,
        stripeSubscriptionId: SUBSCRIPTION_ID,
      })
      .where(eq(spaces.id, SPACE_ID));
    const names = [
      "checkout-session-completed",
      "customer-subscription-created",
      "customer-subscription-updated-schedule-attached",
      "subscription-schedule-updated-period-change",
      "subscription-schedule-released",
      "invoice-paid-subscription-create",
      "invoice-paid-subscription-update",
      "customer-updated",
      "payment-method-attached",
    ];
    for (const name of names)
      expect(await findEventSubscription(database, readEvent(name)), name).toBe(
        SUBSCRIPTION_ID,
      );
  });

  it("the payment from Checkout gives Essentiel at the founder price, until November 16, card included", async () => {
    const { outcome, retrieve } = await receive(
      "checkout-session-completed",
      retrieved("customer-subscription-created"),
    );
    expect(retrieve).toHaveBeenCalledWith(
      SUBSCRIPTION_ID,
      expect.objectContaining({ expand: expect.any(Array) }),
    );
    expect(outcome).toMatchObject({
      status: "processed",
      subscription: { status: "applied", plan: "essentiel" },
    });
    expect(await readSpace()).toMatchObject({
      plan: "essentiel",
      stripeCustomerId: CUSTOMER_ID,
      stripeSubscriptionId: SUBSCRIPTION_ID,
    });
    expect(await readSubscriptionRow()).toMatchObject({
      status: "active",
      plan: "essentiel",
      period: "monthly",
      priceList: "founder",
      amountCents: 999,
      currentPeriodEnd: PERIOD_END,
      cancelAt: null,
      scheduledPlan: null,
      betaTester: false,
      cardBrand: "visa",
      cardLast4: "4242",
    });
    expect(await countFounderSeats(database)).toBe(1);
  });

  it("keeps both paid invoices for the threshold: 9,99 €, then the 10 € of the upgrade to Pro", async () => {
    await receive(
      "invoice-paid-subscription-create",
      retrieved("customer-subscription-created"),
    );
    await receive(
      "invoice-paid-subscription-update",
      retrieved("customer-subscription-updated-pro"),
    );
    const payments = await database
      .select()
      .from(billingPayments)
      .orderBy(asc(billingPayments.amountCents));
    expect(payments).toEqual([
      {
        id: objectOf<Stripe.Invoice>("invoice-paid-subscription-create").id,
        spaceId: SPACE_ID,
        subscriptionId: SUBSCRIPTION_ID,
        amountCents: 999,
        currency: "eur",
        paidAt: STARTED_AT,
      },
      {
        id: objectOf<Stripe.Invoice>("invoice-paid-subscription-update").id,
        spaceId: SPACE_ID,
        subscriptionId: SUBSCRIPTION_ID,
        amountCents: 1000,
        currency: "eur",
        paidAt: STARTED_AT,
      },
    ]);
    expect((await readSpace()).plan).toBe("pro");
  });

  it("Pro, then Essentiel programmed for November 16 at the founder price", async () => {
    await receive(
      "customer-subscription-updated-pro-schedule-attached",
      retrieved(
        "customer-subscription-updated-pro-schedule-attached",
        "subscription-schedule-updated-downgrade",
      ),
    );
    expect(await readSubscriptionRow()).toMatchObject({
      plan: "pro",
      amountCents: 1999,
      currentPeriodEnd: PERIOD_END,
      scheduledPlan: "essentiel",
      scheduledPeriod: "monthly",
      scheduledPriceList: "founder",
      scheduledAmountCents: 999,
      scheduledAt: PERIOD_END,
    });
    expect((await readSpace()).plan).toBe("pro");
  });

  it("the stop from Stripe's page sets the end on November 16, the resume clears it, the plan stays", async () => {
    await receive(
      "customer-subscription-updated-cancel-at",
      retrieved("customer-subscription-updated-cancel-at"),
    );
    expect(await readSubscriptionRow()).toMatchObject({
      plan: "pro",
      cancelAt: PERIOD_END,
    });
    await receive(
      "customer-subscription-updated-resumed",
      retrieved("customer-subscription-updated-resumed"),
    );
    expect(await readSubscriptionRow()).toMatchObject({
      plan: "pro",
      cancelAt: null,
    });
    expect((await readSpace()).plan).toBe("pro");
  });

  it("keeps an event sent twice once, and processes it once", async () => {
    const event = readEvent("invoice-paid-subscription-create");
    expect(await recordStripeEvent(database, event)).toBe("new");
    expect(await recordStripeEvent(database, event)).toBe("duplicate");
    const stripe = {
      subscriptions: {
        retrieve: vi
          .fn()
          .mockResolvedValue(retrieved("customer-subscription-created")),
      },
    } as unknown as Stripe;
    expect(
      (await processStripeEvent(database, stripe, event.id, NOW)).status,
    ).toBe("processed");
    expect(await processStripeEvent(database, stripe, event.id, NOW)).toEqual({
      status: "already-processed",
    });
    expect(await database.select().from(billingPayments)).toHaveLength(1);
  });
});
