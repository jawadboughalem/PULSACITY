import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { connections, customers, products, reviewRequests } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import type { NormalizedPurchase } from "@/lib/connectors/types";
import { recordPurchase } from "@/lib/purchases/record-purchase";
import { computeRequestDate } from "./schedule-review-request";

const DAY_MS = 24 * 60 * 60 * 1000;

let database: Database;
let spaceId: string;
let connectionId: string;
let programmeId: string;
let atelierId: string;

const sale = (change: Partial<NormalizedPurchase> = {}): NormalizedPurchase => ({
  eventType: "sale",
  externalRef: `vente-${Math.random()}`,
  email: "camille@exemple.fr",
  firstName: "Camille",
  lastName: "Roux",
  productRef: "price-plan:1",
  productName: "Programme 30 jours",
  productPrice: null,
  occurredAt: new Date("2026-10-01T09:12:00Z"),
  ...change,
});

const record = (purchase: NormalizedPurchase, productId = programmeId) =>
  recordPurchase(database, { spaceId, connectionId, productId, purchase });

const listRequests = () =>
  database.select({ scheduledAt: reviewRequests.scheduledAt, status: reviewRequests.status }).from(reviewRequests);

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  const [connection] = await database
    .insert(connections)
    .values({ spaceId, connector: "systeme", webhookToken: "jeton-0123456789abcdefghij" })
    .returning({ id: connections.id });
  connectionId = connection.id;
  const inserted = await database
    .insert(products)
    .values([
      { spaceId, name: "Programme 30 jours", slug: "programme-30-jours" },
      { spaceId, name: "Atelier cuisine", slug: "atelier-cuisine", requestDelayDays: 3 },
    ])
    .returning({ id: products.id });
  [programmeId, atelierId] = inserted.map((product) => product.id);
});

describe("computeRequestDate", () => {
  it("adds the offer's delay to the moment of the sale", () => {
    const soldAt = new Date("2026-10-01T09:12:00Z");
    expect(computeRequestDate(soldAt, 14)).toEqual(new Date("2026-10-15T09:12:00Z"));
    expect(computeRequestDate(soldAt, 0)).toEqual(soldAt);
  });
});

describe("recordPurchase", () => {
  it("plans the request at the sale plus the offer's delay", async () => {
    expect(await record(sale(), atelierId)).toMatchObject({ outcome: "request-scheduled" });
    expect(await listRequests()).toEqual([
      { scheduledAt: new Date(Date.parse("2026-10-01T09:12:00Z") + 3 * DAY_MS), status: "scheduled" },
    ]);
  });

  it("plans a request due at once with a delay of 0 days", async () => {
    await database.update(products).set({ requestDelayDays: 0 }).where(eq(products.id, programmeId));
    await record(sale());
    expect(await listRequests()).toEqual([{ scheduledAt: new Date("2026-10-01T09:12:00Z"), status: "scheduled" }]);
  });

  it("asks a customer once per offer, whatever the number of sales", async () => {
    expect(await record(sale())).toMatchObject({ outcome: "request-scheduled" });
    expect(await record(sale({ eventType: "enrollment", email: "  CAMILLE@exemple.fr" }))).toMatchObject({
      outcome: "request-exists",
    });
    expect(await listRequests()).toHaveLength(1);

    expect(await record(sale(), atelierId)).toMatchObject({ outcome: "request-scheduled" });
    expect(await listRequests()).toHaveLength(2);
  });

  it("asks once even when the request was cancelled", async () => {
    await record(sale());
    await database.update(reviewRequests).set({ status: "cancelled" });
    expect(await record(sale())).toMatchObject({ outcome: "request-exists" });
  });

  it("sends nothing to an unsubscribed customer", async () => {
    await database
      .insert(customers)
      .values({ spaceId, email: "camille@exemple.fr", unsubscribedAt: new Date("2026-09-01T00:00:00Z") });
    expect(await record(sale())).toMatchObject({ outcome: "unsubscribed" });
    expect(await listRequests()).toEqual([]);
  });

  it("sends nothing for an offer whose requests are turned off", async () => {
    await database.update(products).set({ requestsEnabled: false }).where(eq(products.id, programmeId));
    expect(await record(sale())).toMatchObject({ outcome: "requests-disabled" });
    expect(await listRequests()).toEqual([]);
  });

  it("records the same sale once", async () => {
    const first = await record(sale({ externalRef: "order-item:1" }));
    const again = await record(sale({ externalRef: "order-item:1" }));
    expect(again).toEqual({ purchaseId: first.purchaseId, outcome: "duplicate" });
  });

  it("completes the customer's name with a later sale, and never erases it", async () => {
    await record(sale({ firstName: null, lastName: null }));
    await record(sale({ lastName: "Roux-Martin" }), atelierId);
    await record(sale({ firstName: null, lastName: null }), atelierId);
    expect(await database.select({ firstName: customers.firstName, lastName: customers.lastName }).from(customers)).toEqual([
      { firstName: "Camille", lastName: "Roux-Martin" },
    ]);
  });
});
