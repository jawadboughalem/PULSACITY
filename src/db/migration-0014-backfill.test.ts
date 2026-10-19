import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { eq, sql } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { insertTestReviewRequest } from "@/db/review-request-fixtures";
import type { Database } from "@/db/database";
import { connections, purchases, reviewRequests, testimonials } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";

/** The statements of migration 0014 that fill the provenance of the testimonials received before it. */
const BACKFILL = readFileSync(fileURLToPath(new URL("./migrations/0014_reviews_online.sql", import.meta.url)), "utf8")
  .split("--> statement-breakpoint")
  .map((statement) => statement.trim())
  .filter((statement) => statement.startsWith("UPDATE"));

const CONSENT = {
  consentAt: new Date("2026-09-01T10:00:00Z"),
  consentText: "J'accepte que ce témoignage soit publié.",
};

let database: Database;
let spaceId: string;

const findTestimonial = async (id: string) => {
  const [testimonial] = await database.select().from(testimonials).where(eq(testimonials.id, id));
  return testimonial;
};

/** A review answering a request, as the form recorded it before lot 4.13: its client and offer, nothing more. */
const insertAnswer = async (request: Awaited<ReturnType<typeof insertTestReviewRequest>>) => {
  await database
    .update(reviewRequests)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(reviewRequests.id, request.id));
  return insertTestTestimonial(database, {
    spaceId,
    source: "form",
    customerId: request.customerId,
    productId: request.productId,
    ...CONSENT,
  });
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
});

describe("migration 0014, the provenance of the testimonials already received", () => {
  it("finds the sale or the request each review answered, and the others by their source", async () => {
    const [connection] = await database
      .insert(connections)
      .values({
        spaceId,
        connector: "systeme",
        webhookToken: "jeton-0123456789abcdefghij",
      })
      .returning({ id: connections.id });
    const saleRequest = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Programme 30 jours",
      firstName: "Manon",
      lastName: "Girard",
    });
    const saleDay = new Date("2026-08-10T10:00:00Z");
    await database
      .update(purchases)
      .set({
        source: "connector",
        connectionId: connection.id,
        purchasedAt: saleDay,
      })
      .where(eq(purchases.customerId, saleRequest.customerId));
    const handRequest = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Suivi individuel",
      firstName: "Nadia",
      lastName: "Bernard",
    });
    const fromSale = await insertAnswer(saleRequest);
    const fromHand = await insertAnswer(handRequest);
    const publicLink = await insertTestTestimonial(database, {
      spaceId,
      source: "form",
      ...CONSENT,
    });
    const added = await insertTestTestimonial(database, {
      spaceId,
      source: "manual",
    });
    const imported = await insertTestTestimonial(database, {
      spaceId,
      source: "csv",
    });

    for (const statement of BACKFILL) await database.execute(sql.raw(statement));

    expect(await findTestimonial(fromSale)).toMatchObject({
      provenance: "sale",
      reviewRequestId: saleRequest.id,
      purchasedAt: saleDay,
      purchaseConnector: "systeme",
    });
    expect(await findTestimonial(fromHand)).toMatchObject({
      provenance: "request",
      reviewRequestId: handRequest.id,
      purchaseConnector: null,
    });
    expect(await findTestimonial(publicLink)).toMatchObject({
      provenance: "public-link",
      reviewRequestId: null,
    });
    expect(await findTestimonial(added)).toMatchObject({ provenance: "added" });
    expect(await findTestimonial(imported)).toMatchObject({
      provenance: "import",
    });
  });

  it("leaves a review from the public link as it is, when its client was asked but never answered the request", async () => {
    const request = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Programme 30 jours",
      firstName: "Hugo",
      lastName: "Petit",
    });
    const id = await insertTestTestimonial(database, {
      spaceId,
      source: "form",
      customerId: request.customerId,
      productId: request.productId,
      ...CONSENT,
    });

    for (const statement of BACKFILL) await database.execute(sql.raw(statement));

    expect(await findTestimonial(id)).toMatchObject({
      provenance: "public-link",
      reviewRequestId: null,
    });
  });
});
