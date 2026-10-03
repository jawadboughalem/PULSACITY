import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { countManualRequestsToday, requestReviewManually } from "./request-review-manually";

const NOW = new Date("2026-10-05T09:00:00Z");

let database: Database;
let spaceId: string;
let productId: string;

const ask = (email: string, change: { productId?: string; firstName?: string | null; now?: Date } = {}) =>
  requestReviewManually(
    database,
    spaceId,
    {
      firstName: change.firstName === undefined ? "Élodie" : change.firstName,
      lastName: "Vasseur",
      email,
      productId: change.productId ?? productId,
      purchasedOn: "2026-10-02",
    },
    change.now ?? NOW,
  );

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  const [product] = await database
    .insert(products)
    .values({ spaceId, name: "Suivi individuel 3 mois", slug: "suivi-individuel-3-mois", requestsEnabled: false })
    .returning({ id: products.id });
  productId = product.id;
});

describe("requestReviewManually", () => {
  it("records the customer, a manual purchase and a request that leaves at the next run", async () => {
    const result = await ask("elodie.v@example.com");
    expect(result).toEqual({ status: "scheduled", requestId: expect.any(String) });

    const [row] = await database
      .select({
        email: customers.email,
        firstName: customers.firstName,
        source: purchases.source,
        purchasedAt: purchases.purchasedAt,
        scheduledAt: reviewRequests.scheduledAt,
        status: reviewRequests.status,
      })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .innerJoin(customers, eq(customers.id, purchases.customerId));
    expect(row).toEqual({
      email: "elodie.v@example.com",
      firstName: "Élodie",
      source: "manual",
      purchasedAt: new Date("2026-10-02T12:00:00Z"),
      scheduledAt: NOW,
      status: "scheduled",
    });
  });

  it("refuses a second request for the same customer and offer, and says what became of the first", async () => {
    await ask("elodie.v@example.com");
    await database.update(reviewRequests).set({ status: "sent", sentAt: NOW });

    expect(await ask("elodie.v@example.com", { firstName: null })).toEqual({
      status: "request-exists",
      customerName: "Élodie V.",
      existing: expect.objectContaining({ status: "sent", sentAt: NOW }),
    });
    expect(await database.select().from(purchases)).toHaveLength(1);
  });

  it("writes nothing to a customer who unsubscribed", async () => {
    const unsubscribedAt = new Date("2026-09-12T08:00:00Z");
    await database.insert(customers).values({ spaceId, email: "elodie.v@example.com", firstName: "Élodie", unsubscribedAt });

    expect(await ask("elodie.v@example.com")).toEqual({ status: "unsubscribed", customerName: "Élodie V.", unsubscribedAt });
    expect(await database.select().from(reviewRequests)).toEqual([]);
  });

  it("stops at the plan's requests typed in by hand in a day, and counts again the next day", async () => {
    for (let index = 0; index < 20; index += 1) await ask(`client-${index}@example.com`);
    expect(await countManualRequestsToday(database, spaceId, NOW)).toBe(20);

    expect(await ask("vingt-et-un@example.com")).toEqual({ status: "daily-limit" });
    expect(await ask("vingt-et-un@example.com", { now: new Date("2026-10-05T22:30:00Z") })).toMatchObject({
      status: "scheduled",
    });
  });

  it("refuses an offer of another space", async () => {
    const otherUserId = await insertTestUser(database, "marc@exemple.fr");
    const otherSpaceId = await insertTestSpace(database, otherUserId, "marc-coaching");
    const [other] = await database
      .insert(products)
      .values({ spaceId: otherSpaceId, name: "Coaching", slug: "coaching" })
      .returning({ id: products.id });

    expect(await ask("elodie.v@example.com", { productId: other.id })).toEqual({ status: "offer-not-found" });
  });
});
