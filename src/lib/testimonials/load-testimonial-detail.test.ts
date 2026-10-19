import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { insertTestReviewRequest } from "@/db/review-request-fixtures";
import { connections, customers, purchases, reviewRequests, testimonialCorrections } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { loadTestimonialDetail } from "./load-testimonial-detail";

let database: Database;
let spaceId: string;

const CONSENT = { consentAt: new Date("2026-09-26T19:47:00Z"), consentText: "J'accepte." };

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
});

describe("loadTestimonialDetail", () => {
  it("tells the sale and the request a testimonial answered", async () => {
    const request = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Suivi individuel 3 mois",
      firstName: "Nadia",
      lastName: "Bensaïd",
      status: "completed",
    });
    const [connection] = await database
      .insert(connections)
      .values({ spaceId, connector: "systeme", webhookToken: randomUUID(), status: "active" })
      .returning({ id: connections.id });
    await database
      .update(purchases)
      .set({ connectionId: connection.id, purchasedAt: new Date("2026-06-24T10:00:00Z") })
      .where(eq(purchases.customerId, request.customerId));
    await database
      .update(reviewRequests)
      .set({ sentAt: new Date("2026-09-24T08:00:00Z"), completedAt: new Date("2026-09-26T19:47:00Z") })
      .where(eq(reviewRequests.token, request.token));
    const id = await insertTestTestimonial(database, {
      spaceId,
      productId: request.productId,
      customerId: request.customerId,
      source: "form",
      consentAt: new Date("2026-09-26T19:47:00Z"),
      consentText: "J'accepte que ce témoignage soit publié sur les supports de Julie Nutrition.",
      provenance: "sale",
      reviewRequestId: request.id,
      purchasedAt: new Date("2026-06-24T10:00:00Z"),
      purchaseConnector: "systeme",
    });

    expect(await loadTestimonialDetail(database, spaceId, id)).toMatchObject({
      productName: "Suivi individuel 3 mois",
      consentText: "J'accepte que ce témoignage soit publié sur les supports de Julie Nutrition.",
      provenance: "sale",
      purchasedAt: new Date("2026-06-24T10:00:00Z"),
      purchaseConnector: "systeme",
      request: {
        requestSentAt: new Date("2026-09-24T08:00:00Z"),
        answeredAt: new Date("2026-09-26T19:47:00Z"),
      },
      authorReach: "reachable",
      correction: null,
      correctionsProposed: 0,
    });
  });

  it("keeps the provenance and the purchase once the request is gone, and tells an unsubscribed author", async () => {
    const request = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Programme 30 jours",
      firstName: "Élodie",
      lastName: null,
      status: "completed",
    });
    const id = await insertTestTestimonial(database, {
      spaceId,
      productId: request.productId,
      customerId: request.customerId,
      source: "form",
      ...CONSENT,
      provenance: "request",
      reviewRequestId: request.id,
      purchasedAt: new Date("2026-09-02T10:00:00Z"),
    });
    await database.delete(reviewRequests).where(eq(reviewRequests.id, request.id));
    await database.update(customers).set({ unsubscribedAt: new Date("2026-10-01T08:00:00Z") });

    expect(await loadTestimonialDetail(database, spaceId, id)).toMatchObject({
      provenance: "request",
      purchasedAt: new Date("2026-09-02T10:00:00Z"),
      request: null,
      authorReach: "unsubscribed",
    });
  });

  it("gives the last correction proposed, and how many were", async () => {
    const id = await insertTestTestimonial(database, { spaceId, source: "form", ...CONSENT, provenance: "public-link" });
    await database.insert(testimonialCorrections).values([
      {
        testimonialId: id,
        fromBody: "A",
        body: "B",
        token: "premier",
        createdAt: new Date("2026-10-10T08:00:00Z"),
        outcome: "refused",
        answeredAt: new Date("2026-10-11T08:00:00Z"),
      },
      { testimonialId: id, fromBody: "A", body: "C", token: "second", createdAt: new Date("2026-10-12T08:00:00Z") },
    ]);

    expect(await loadTestimonialDetail(database, spaceId, id)).toMatchObject({
      correction: { body: "C", outcome: null },
      correctionsProposed: 2,
      authorReach: "no-address",
    });
  });

  it("has no request for a testimonial left on the open page, and none for another space", async () => {
    const id = await insertTestTestimonial(database, { spaceId });
    const otherUserId = await insertTestUser(database, "marc@exemple.fr");
    const otherSpaceId = await insertTestSpace(database, otherUserId, "marc-coaching");

    expect(await loadTestimonialDetail(database, spaceId, id)).toMatchObject({
      request: null,
      productName: null,
      provenance: "added",
    });
    expect(await loadTestimonialDetail(database, otherSpaceId, id)).toBeNull();
  });
});
