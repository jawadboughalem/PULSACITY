import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { insertTestReviewRequest } from "@/db/review-request-fixtures";
import { testimonialCorrections, testimonials } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { loadCollectionPage } from "./load-collection-page";
import { withdrawConsent } from "./withdraw-consent";

let database: Database;
let spaceId: string;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  spaceId = await insertTestSpace(database, await insertTestUser(database, "julie@exemple.fr"), "julie-nutrition");
});

/** A request answered by its link: completed, with the review it brought. */
const insertAnsweredRequest = async (authorPhotoUrl: string | null = null) => {
  const request = await insertTestReviewRequest(database, {
    spaceId,
    productName: "Programme 30 jours",
    firstName: "Camille",
    lastName: "Roux",
    status: "completed",
  });
  const testimonialId = await insertTestTestimonial(database, {
    spaceId,
    productId: request.productId,
    customerId: request.customerId,
    reviewRequestId: request.id,
    source: "form",
    provenance: "request",
    status: "approved",
    authorPhotoUrl,
    consentAt: new Date(),
    consentText: "J'accepte que Julie Nutrition publie mon avis.",
  });
  return { ...request, testimonialId };
};

describe("« Gérer mon avis »", () => {
  it("opens the link of an answered request on its review, while the review is kept", async () => {
    const request = await insertAnsweredRequest();
    expect(await loadCollectionPage(database, "julie-nutrition", null, request.token)).toMatchObject({
      status: "review-saved",
      requestToken: request.token,
    });
    expect(await loadCollectionPage(database, "julie-nutrition", request.productSlug, request.token)).toMatchObject({
      status: "review-saved",
    });
  });

  it("deletes the review and its corrections when its author withdraws the consent", async () => {
    const request = await insertAnsweredRequest("https://photos.exemple.fr/espaces/x/temoignages/camille.jpg");
    await database
      .insert(testimonialCorrections)
      .values({ testimonialId: request.testimonialId, fromBody: "Avant", body: "Après", token: "correction-camille" });

    expect(await withdrawConsent(database, "julie-nutrition", request.token)).toEqual({
      status: "withdrawn",
      authorPhotoUrl: "https://photos.exemple.fr/espaces/x/temoignages/camille.jpg",
    });
    expect(await database.select().from(testimonials).where(eq(testimonials.id, request.testimonialId))).toEqual([]);
    expect(await database.select().from(testimonialCorrections)).toEqual([]);
    expect(await loadCollectionPage(database, "julie-nutrition", null, request.token)).toMatchObject({
      status: "review-removed",
    });
  });

  it("withdraws nothing twice, nor from another space, nor by a link not yet answered", async () => {
    const request = await insertAnsweredRequest();
    const otherSpaceId = await insertTestSpace(database, await insertTestUser(database, "karim@exemple.fr"), "karim");
    expect(otherSpaceId).not.toBe(spaceId);
    expect(await withdrawConsent(database, "karim", request.token)).toEqual({ status: "not-found" });

    const open = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Suivi",
      firstName: "Léa",
      lastName: null,
    });
    expect(await withdrawConsent(database, "julie-nutrition", open.token)).toEqual({ status: "not-found" });

    expect((await withdrawConsent(database, "julie-nutrition", request.token)).status).toBe("withdrawn");
    expect(await withdrawConsent(database, "julie-nutrition", request.token)).toEqual({ status: "not-found" });
  });

  it("says a review deleted by the creator is no longer kept", async () => {
    const request = await insertAnsweredRequest();
    await database.delete(testimonials).where(eq(testimonials.id, request.testimonialId));
    expect(await loadCollectionPage(database, "julie-nutrition", null, request.token)).toMatchObject({
      status: "review-removed",
    });
  });
});
