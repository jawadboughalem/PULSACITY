import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { spaces, stripeEvents } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { buildEvent, buildSubscription } from "@/lib/billing/stripe-fixtures";
import { POST } from "./route";

type TestContext = { database: Database | null; scheduled: Array<() => Promise<void>>; stripe: Stripe | null };

const testContext = vi.hoisted((): TestContext => ({ database: null, scheduled: [], stripe: null }));

vi.mock("@/db", () => ({ getDb: () => testContext.database }));
vi.mock("next/server", () => ({ after: (task: () => Promise<void>) => testContext.scheduled.push(task) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));
vi.mock("@/lib/billing/stripe-client", () => ({ getStripe: () => testContext.stripe }));

const SECRET = "whsec_test_secret";

let database: Database;
let spaceId: string;

const deliver = (payload: string, signature: string | null) =>
  POST(
    new Request("https://pulsacity.com/api/stripe/webhook", {
      method: "POST",
      body: payload,
      headers: signature === null ? {} : { "stripe-signature": signature },
    }),
  );

const sign = (payload: string, secret = SECRET) => Stripe.webhooks.generateTestHeaderString({ payload, secret });

beforeAll(async () => {
  testContext.database = await createTestDatabase();
  database = testContext.database;
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  testContext.scheduled = [];
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", SECRET);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  const stripe = new Stripe("sk_test_fake");
  stripe.subscriptions.retrieve = vi.fn().mockResolvedValue(buildSubscription({ spaceId })) as never;
  testContext.stripe = stripe;
});

describe("POST /api/stripe/webhook", () => {
  it("keeps a signed event whole, answers at once, then applies the subscription", async () => {
    const payload = JSON.stringify(buildEvent("customer.subscription.created", buildSubscription({ spaceId })));
    const response = await deliver(payload, sign(payload));
    expect(response.status).toBe(200);
    const [kept] = await database.select().from(stripeEvents);
    expect(kept).toMatchObject({ id: "evt_customer_subscription_created", type: "customer.subscription.created", processedAt: null });
    expect(kept.payload).toEqual(JSON.parse(payload));

    expect(testContext.scheduled).toHaveLength(1);
    await testContext.scheduled[0]();
    const [space] = await database.select().from(spaces).where(eq(spaces.id, spaceId));
    expect(space.plan).toBe("essentiel");
  });

  it("refuses an event without a signature, or signed with another secret, and keeps nothing", async () => {
    const payload = JSON.stringify(buildEvent("customer.subscription.created", buildSubscription({ spaceId })));
    expect((await deliver(payload, null)).status).toBe(400);
    expect((await deliver(payload, sign(payload, "whsec_other"))).status).toBe(400);
    expect((await deliver(`${payload} `, sign(payload))).status).toBe(400);
    expect(await database.select().from(stripeEvents)).toEqual([]);
  });

  it("answers an event sent twice, and processes it once", async () => {
    const payload = JSON.stringify(buildEvent("customer.subscription.updated", buildSubscription({ spaceId })));
    await deliver(payload, sign(payload));
    await deliver(payload, sign(payload));
    for (const task of testContext.scheduled) await task();
    expect(testContext.stripe?.subscriptions.retrieve).toHaveBeenCalledOnce();
    expect(await database.select().from(stripeEvents)).toHaveLength(1);
  });
});
