import { randomUUID } from "node:crypto";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { connections, customers, products, purchases, reviewRequests, widgets } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { countDashboardFigures } from "./count-dashboard-figures";
import { listLatestActivity } from "./list-latest-activity";
import { readSetupSteps } from "./read-setup-steps";

let database: Database;
let spaceId: string;
let productId: string;

const NOW = new Date("2026-09-30T10:00:00Z");

const insertSale = async (options: {
  firstName: string | null;
  purchasedAt: Date;
  sentAt?: Date | null;
  reminderSentAt?: Date | null;
  connectionId?: string | null;
}) => {
  const [customer] = await database
    .insert(customers)
    .values({ spaceId, email: `${randomUUID()}@exemple.fr`, firstName: options.firstName, lastName: "Martin" })
    .returning({ id: customers.id });
  const [purchase] = await database
    .insert(purchases)
    .values({
      spaceId,
      customerId: customer.id,
      productId,
      connectionId: options.connectionId ?? null,
      source: options.connectionId ? "connector" : "manual",
      purchasedAt: options.purchasedAt,
    })
    .returning({ id: purchases.id });
  await database.insert(reviewRequests).values({
    purchaseId: purchase.id,
    token: randomUUID(),
    scheduledAt: options.purchasedAt,
    sentAt: options.sentAt ?? null,
    reminderSentAt: options.reminderSentAt ?? null,
    status: options.sentAt ? "sent" : "scheduled",
  });
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  const [product] = await database
    .insert(products)
    .values({ spaceId, name: "Programme 30 jours", slug: "programme-30-jours" })
    .returning({ id: products.id });
  productId = product.id;
});

describe("countDashboardFigures", () => {
  it("counts validated and pending testimonials, and averages the validated ones", async () => {
    await insertTestTestimonial(database, { spaceId, status: "approved", rating: 5 });
    await insertTestTestimonial(database, { spaceId, status: "approved", rating: 4 });
    await insertTestTestimonial(database, { spaceId, status: "approved", rating: 5 });
    await insertTestTestimonial(database, { spaceId, status: "pending", rating: 1 });
    await insertTestTestimonial(database, { spaceId, status: "hidden", rating: 1 });

    expect(await countDashboardFigures(database, spaceId, NOW)).toEqual({
      approved: 3,
      pending: 1,
      averageRating: 14 / 3,
      requestsSentThisMonth: 0,
    });
  });

  it("counts the requests sent since the first of the month in Paris", async () => {
    await insertSale({ firstName: "Août", purchasedAt: new Date("2026-08-10T10:00:00Z"), sentAt: new Date("2026-08-31T21:59:00Z") });
    await insertSale({ firstName: "Début", purchasedAt: new Date("2026-08-20T10:00:00Z"), sentAt: new Date("2026-08-31T22:01:00Z") });
    await insertSale({ firstName: "Milieu", purchasedAt: new Date("2026-09-01T10:00:00Z"), sentAt: new Date("2026-09-15T08:00:00Z") });
    await insertSale({ firstName: "Prévue", purchasedAt: new Date("2026-09-25T10:00:00Z") });

    expect(await countDashboardFigures(database, spaceId, NOW)).toEqual({
      approved: 0,
      pending: 0,
      averageRating: null,
      requestsSentThisMonth: 2,
    });
  });
});

describe("listLatestActivity", () => {
  it("merges testimonials, sales, requests and reminders, newest first", async () => {
    const [connection] = await database
      .insert(connections)
      .values({ spaceId, connector: "systeme", webhookToken: randomUUID(), status: "active" })
      .returning({ id: connections.id });
    await insertSale({
      firstName: "Camille",
      purchasedAt: new Date("2026-09-01T09:00:00Z"),
      sentAt: new Date("2026-09-15T09:00:00Z"),
      reminderSentAt: new Date("2026-09-22T09:00:00Z"),
      connectionId: connection.id,
    });
    const testimonialId = await insertTestTestimonial(database, {
      spaceId,
      productId,
      authorName: "Camille M.",
      rating: 5,
      status: "pending",
      createdAt: new Date("2026-09-23T09:00:00Z"),
    });

    expect(await listLatestActivity(database, spaceId)).toEqual([
      {
        kind: "testimonial",
        at: new Date("2026-09-23T09:00:00Z"),
        testimonialId,
        authorName: "Camille M.",
        rating: 5,
        status: "pending",
        productName: "Programme 30 jours",
      },
      {
        kind: "reminder-sent",
        at: new Date("2026-09-22T09:00:00Z"),
        customerName: "Camille M.",
        productName: "Programme 30 jours",
      },
      {
        kind: "request-sent",
        at: new Date("2026-09-15T09:00:00Z"),
        customerName: "Camille M.",
        productName: "Programme 30 jours",
      },
      {
        kind: "sale",
        at: new Date("2026-09-01T09:00:00Z"),
        customerName: "Camille M.",
        productName: "Programme 30 jours",
        connector: "systeme",
      },
    ]);
  });

  it("keeps only the latest items", async () => {
    for (let day = 1; day <= 8; day += 1) {
      await insertTestTestimonial(database, { spaceId, createdAt: new Date(Date.UTC(2026, 8, day)) });
    }

    const activity = await listLatestActivity(database, spaceId, 3);
    expect(activity.map((item) => item.at.getUTCDate())).toEqual([8, 7, 6]);
  });
});

describe("readSetupSteps", () => {
  it("has nothing done on a new space", async () => {
    await database.insert(widgets).values({ spaceId, type: "wall" });

    expect(await readSetupSteps(database, spaceId)).toEqual({ systeme: "none", isWidgetPasted: false });
  });

  it("sees Systeme.io connected and the widget shown on a page", async () => {
    await database.insert(connections).values([
      { spaceId, connector: "systeme", webhookToken: randomUUID(), status: "error" },
      { spaceId, connector: "systeme", webhookToken: randomUUID(), status: "active" },
    ]);
    await database.insert(widgets).values({ spaceId, type: "wall", firstLoadedAt: NOW });

    expect(await readSetupSteps(database, spaceId)).toEqual({ systeme: "active", isWidgetPasted: true });
  });

  it("waits for the first sale of a Systeme.io connection", async () => {
    await database.insert(connections).values({ spaceId, connector: "systeme", webhookToken: randomUUID() });

    expect(await readSetupSteps(database, spaceId)).toMatchObject({ systeme: "pending" });
  });
});
