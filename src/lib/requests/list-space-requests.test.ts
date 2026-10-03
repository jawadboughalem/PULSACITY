import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { countSpaceRequests, listSpaceRequests } from "./list-space-requests";

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-10-03T12:00:00Z");
const daysFromNow = (days: number) => new Date(NOW.getTime() + days * DAY_MS);

let database: Database;
let spaceId: string;
let productId: string;

const insertRequest = async (firstName: string, values: Partial<typeof reviewRequests.$inferInsert>) => {
  const [customer] = await database
    .insert(customers)
    .values({ spaceId, email: `${firstName.toLowerCase()}@exemple.fr`, firstName })
    .returning({ id: customers.id });
  const [purchase] = await database
    .insert(purchases)
    .values({ spaceId, customerId: customer.id, productId, source: "manual", purchasedAt: NOW })
    .returning({ id: purchases.id });
  await database
    .insert(reviewRequests)
    .values({ purchaseId: purchase.id, token: `jeton-${firstName}`, scheduledAt: NOW, ...values });
};

const names = (requests: { customerName: string }[]) => requests.map((request) => request.customerName);

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  const [product] = await database
    .insert(products)
    .values({ spaceId, name: "Atelier cuisine", slug: "atelier-cuisine" })
    .returning({ id: products.id });
  productId = product.id;

  await insertRequest("Paul", { status: "scheduled", scheduledAt: daysFromNow(14) });
  await insertRequest("Camille", { status: "scheduled", scheduledAt: NOW });
  await insertRequest("Inès", { status: "scheduled", scheduledAt: daysFromNow(2) });
  await insertRequest("Noé", { status: "sent", scheduledAt: daysFromNow(-3), sentAt: daysFromNow(-3) });
  await insertRequest("Léa", { status: "completed", scheduledAt: daysFromNow(-6), sentAt: daysFromNow(-6), completedAt: daysFromNow(-1) });
  await insertRequest("Rose", { status: "failed", scheduledAt: daysFromNow(-1) });
});

describe("listSpaceRequests", () => {
  it("puts what leaves next on top, then the latest activity", async () => {
    const { requests, total } = await listSpaceRequests(database, spaceId, { status: null, page: 1 });

    expect(total).toBe(6);
    expect(names(requests)).toEqual(["Rose", "Camille", "Inès", "Paul", "Léa", "Noé"]);
  });

  it("keeps only the requests of the chosen status", async () => {
    const completed = await listSpaceRequests(database, spaceId, { status: "completed", page: 1 });
    expect(completed).toMatchObject({ total: 1 });
    expect(names(completed.requests)).toEqual(["Léa"]);

    const scheduled = await listSpaceRequests(database, spaceId, { status: "scheduled", page: 1 });
    expect(names(scheduled.requests)).toEqual(["Camille", "Inès", "Paul"]);
  });
});

describe("countSpaceRequests", () => {
  it("counts each status, and the answers among the requests sent", async () => {
    expect(await countSpaceRequests(database, spaceId)).toMatchObject({
      all: 6,
      scheduled: 3,
      sent: 2,
      answered: 1,
      completed: 1,
      failed: 1,
      remindersSent: 0,
    });
  });
});
