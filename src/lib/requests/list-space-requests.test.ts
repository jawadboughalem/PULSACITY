import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests, testimonials } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { countSpaceRequests, listSpaceRequests } from "./list-space-requests";

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-10-03T12:00:00Z");
const daysFromNow = (days: number) => new Date(NOW.getTime() + days * DAY_MS);

let database: Database;
let spaceId: string;
let productId: string;

const insertRequest = async (firstName: string, values: Partial<typeof reviewRequests.$inferInsert>): Promise<string> => {
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
  return customer.id;
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
  const leaId = await insertRequest("Léa", {
    status: "completed",
    scheduledAt: daysFromNow(-6),
    sentAt: daysFromNow(-6),
    completedAt: daysFromNow(-1),
  });
  await database.insert(testimonials).values({
    spaceId,
    productId,
    customerId: leaId,
    authorName: "Léa Martin",
    rating: 5,
    body: "Très bien.",
    status: "pending",
    source: "form",
    consentAt: daysFromNow(-1),
    consentText: "J'accepte que mon avis soit publié.",
  });
  await insertRequest("Rose", { status: "failed", scheduledAt: daysFromNow(-1) });
});

describe("listSpaceRequests", () => {
  it("puts what leaves next on top, then the latest activity", async () => {
    const { requests, total } = await listSpaceRequests(database, spaceId, { status: null, limit: 50 });

    expect(total).toBe(6);
    expect(names(requests)).toEqual(["Rose", "Camille", "Inès", "Paul", "Léa", "Noé"]);
  });

  it("shows as many requests as asked, and links the answer to its opinion", async () => {
    const { requests, total } = await listSpaceRequests(database, spaceId, { status: null, limit: 5 });
    expect(total).toBe(6);
    expect(requests).toHaveLength(5);
    expect(requests.find((request) => request.customerName === "Léa")?.testimonialId).toEqual(expect.any(String));
    expect(requests.find((request) => request.customerName === "Rose")?.testimonialId).toBeNull();
  });

  it("keeps only the requests of the chosen status", async () => {
    const completed = await listSpaceRequests(database, spaceId, { status: "completed", limit: 50 });
    expect(completed).toMatchObject({ total: 1 });
    expect(names(completed.requests)).toEqual(["Léa"]);

    const scheduled = await listSpaceRequests(database, spaceId, { status: "scheduled", limit: 50 });
    expect(names(scheduled.requests)).toEqual(["Camille", "Inès", "Paul"]);
  });
});

describe("countSpaceRequests", () => {
  it("counts each status, then the month's requests sent, reminded and answered", async () => {
    await insertRequest("Marc", {
      status: "reminded",
      scheduledAt: daysFromNow(-2),
      sentAt: daysFromNow(-2),
      reminderSentAt: daysFromNow(-1),
    });
    await insertRequest("Julia", { status: "completed", sentAt: daysFromNow(-1), completedAt: NOW });

    expect(await countSpaceRequests(database, spaceId, NOW)).toEqual({
      all: 8,
      scheduled: 3,
      sent: 1,
      reminded: 1,
      completed: 2,
      cancelled: 0,
      failed: 1,
      sentThisMonth: 2,
      remindedThisMonth: 1,
      answeredThisMonth: 1,
    });
  });
});
