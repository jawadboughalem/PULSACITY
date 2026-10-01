import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { insertTestReviewRequest } from "@/db/review-request-fixtures";
import { connections, purchases, reviewRequests } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { loadTestimonialDetail } from "./load-testimonial-detail";

let database: Database;
let spaceId: string;

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
    });

    expect(await loadTestimonialDetail(database, spaceId, id)).toMatchObject({
      productName: "Suivi individuel 3 mois",
      consentText: "J'accepte que ce témoignage soit publié sur les supports de Julie Nutrition.",
      request: {
        connector: "systeme",
        purchasedAt: new Date("2026-06-24T10:00:00Z"),
        requestSentAt: new Date("2026-09-24T08:00:00Z"),
        answeredAt: new Date("2026-09-26T19:47:00Z"),
      },
    });
  });

  it("has no request for a testimonial left on the open page, and none for another space", async () => {
    const id = await insertTestTestimonial(database, { spaceId });
    const otherUserId = await insertTestUser(database, "marc@exemple.fr");
    const otherSpaceId = await insertTestSpace(database, otherUserId, "marc-coaching");

    expect(await loadTestimonialDetail(database, spaceId, id)).toMatchObject({ request: null, productName: null });
    expect(await loadTestimonialDetail(database, otherSpaceId, id)).toBeNull();
  });
});
