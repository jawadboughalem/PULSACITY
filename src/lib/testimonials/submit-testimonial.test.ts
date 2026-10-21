import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { insertTestReviewRequest } from "@/db/review-request-fixtures";
import { connections, products, purchases, reviewRequests, spaces, testimonials } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { buildTestimonialPhotoKey } from "@/lib/uploads/upload-keys";
import { buildConsentText } from "./build-consent-text";
import { type TestimonialSubmission, submitTestimonial } from "./submit-testimonial";

let database: Database;
let spaceId: string;

const CAMILLE: TestimonialSubmission = {
  spaceSlug: "julie-nutrition",
  productSlug: null,
  requestToken: null,
  rating: 5,
  body: "En 30 jours j'ai arrêté de grignoter le soir.",
  authorName: "Camille R.",
  authorTitle: "Enseignante, Lyon",
  photoKey: null,
};

const findTestimonials = () => database.select().from(testimonials).where(eq(testimonials.spaceId, spaceId));

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  await database.update(spaces).set({ name: "Julie Nutrition" }).where(eq(spaces.id, spaceId));
  vi.stubEnv("R2_PUBLIC_URL", "https://photos.pulsacity.com");
});

describe("submitTestimonial", () => {
  it("keeps the testimonial, without telling the creator who turned off « Nouveau témoignage »", async () => {
    await database.update(spaces).set({ newTestimonialEmailEnabled: false }).where(eq(spaces.id, spaceId));

    expect(await submitTestimonial(database, CAMILLE)).toEqual({ status: "received", notification: null });
    expect(await findTestimonials()).toHaveLength(1);
  });

  it("keeps the testimonial pending, with the consent text and its date", async () => {
    const before = new Date();

    const result = await submitTestimonial(database, CAMILLE);

    expect(result).toMatchObject({
      status: "received",
      notification: { creatorEmail: "julie@exemple.fr", spaceName: "Julie Nutrition", isOverPlanLimit: false },
    });
    const [testimonial] = await findTestimonials();
    expect(testimonial).toMatchObject({
      status: "pending",
      source: "form",
      rating: 5,
      authorName: "Camille R.",
      authorTitle: "Enseignante, Lyon",
      consentText: buildConsentText("Julie Nutrition", "public-link"),
      productId: null,
      customerId: null,
    });
    expect(testimonial.consentAt?.getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
  });

  it("attaches the formation of the page, and the photo uploaded for this space", async () => {
    const [product] = await database
      .insert(products)
      .values({ spaceId, name: "Programme 30 jours", slug: "programme-30-jours" })
      .returning({ id: products.id });
    const photoKey = buildTestimonialPhotoKey(spaceId, "image/jpeg");

    await submitTestimonial(database, { ...CAMILLE, productSlug: "programme-30-jours", photoKey });

    expect(await findTestimonials()).toEqual([
      expect.objectContaining({ productId: product.id, authorPhotoUrl: `https://photos.pulsacity.com/${photoKey}` }),
    ]);
  });

  it("links an automatic request to its client and its formation, then closes it", async () => {
    const request = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Suivi individuel",
      firstName: "Camille",
      lastName: "Roux",
    });

    await submitTestimonial(database, { ...CAMILLE, requestToken: request.token });

    expect(await findTestimonials()).toEqual([
      expect.objectContaining({
        customerId: request.customerId,
        productId: request.productId,
        consentText: buildConsentText("Julie Nutrition", "request"),
      }),
    ]);
    const [closedRequest] = await database
      .select()
      .from(reviewRequests)
      .where(eq(reviewRequests.token, request.token));
    expect(closedRequest.status).toBe("completed");
    expect(closedRequest.completedAt).toBeInstanceOf(Date);
  });

  it("says where each review came from: a sale received, a request sent by hand, the public link", async () => {
    const [connection] = await database
      .insert(connections)
      .values({ spaceId, connector: "systeme", webhookToken: "jeton-0123456789abcdefghij" })
      .returning({ id: connections.id });
    const fromSale = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Programme 30 jours",
      firstName: "Manon",
      lastName: "Girard",
    });
    const saleDay = new Date("2026-08-31T22:30:00Z");
    await database
      .update(purchases)
      .set({ source: "connector", connectionId: connection.id, purchasedAt: saleDay })
      .where(eq(purchases.customerId, fromSale.customerId));
    const byHand = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Suivi individuel",
      firstName: "Nadia",
      lastName: "Bernard",
    });

    await submitTestimonial(database, { ...CAMILLE, authorName: "Manon G.", requestToken: fromSale.token });
    await submitTestimonial(database, { ...CAMILLE, authorName: "Nadia B.", requestToken: byHand.token });
    await submitTestimonial(database, { ...CAMILLE, authorName: "Hugo P." });

    const received = await findTestimonials();
    const byAuthor = (name: string) => received.find((testimonial) => testimonial.authorName === name);
    expect(byAuthor("Manon G.")).toMatchObject({
      provenance: "sale",
      reviewRequestId: fromSale.id,
      purchasedAt: saleDay,
      purchaseConnector: "systeme",
    });
    expect(byAuthor("Nadia B.")).toMatchObject({
      provenance: "request",
      reviewRequestId: byHand.id,
      purchasedAt: expect.any(Date),
      purchaseConnector: null,
    });
    expect(byAuthor("Hugo P.")).toMatchObject({
      provenance: "public-link",
      reviewRequestId: null,
      purchasedAt: null,
      purchaseConnector: null,
    });
  });

  it("accepts a request link only once, even when sent twice at the same time", async () => {
    const request = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Suivi individuel",
      firstName: "Camille",
      lastName: null,
    });

    const results = await Promise.all([
      submitTestimonial(database, { ...CAMILLE, requestToken: request.token }),
      submitTestimonial(database, { ...CAMILLE, requestToken: request.token }),
    ]);

    expect(results.map((result) => result.status).sort()).toEqual(["link-inactive", "received"]);
    expect(await findTestimonials()).toHaveLength(1);
  });

  it("refuses a used, cancelled or foreign request link", async () => {
    const used = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Suivi",
      firstName: "A",
      lastName: null,
      status: "completed",
    });
    const cancelled = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Suivi",
      firstName: "B",
      lastName: null,
      status: "cancelled",
    });
    const otherSpaceId = await insertTestSpace(database, await insertTestUser(database, "marc@exemple.fr"), "marc");
    const foreign = await insertTestReviewRequest(database, {
      spaceId: otherSpaceId,
      productName: "Coaching",
      firstName: "C",
      lastName: null,
    });

    for (const token of [used.token, cancelled.token, foreign.token, "unknown-token"]) {
      expect(await submitTestimonial(database, { ...CAMILLE, requestToken: token })).toEqual({
        status: "link-inactive",
      });
    }
    expect(await findTestimonials()).toEqual([]);
  });

  it("refuses a photo of another space and an unknown page", async () => {
    const foreignPhotoKey = buildTestimonialPhotoKey("another-space", "image/jpeg");

    expect(await submitTestimonial(database, { ...CAMILLE, photoKey: foreignPhotoKey })).toEqual({
      status: "invalid-photo",
    });
    expect(await submitTestimonial(database, { ...CAMILLE, spaceSlug: "inconnu" })).toEqual({
      status: "page-not-found",
    });
    expect(await submitTestimonial(database, { ...CAMILLE, productSlug: "inconnue" })).toEqual({
      status: "page-not-found",
    });
    expect(await findTestimonials()).toEqual([]);
  });

  it("never loses a testimonial beyond the free plan, and says so to the creator", async () => {
    for (let index = 0; index < 15; index += 1) {
      await submitTestimonial(database, CAMILLE);
    }
    await database.update(testimonials).set({ status: "approved" }).where(eq(testimonials.spaceId, spaceId));

    const sixteenth = await submitTestimonial(database, CAMILLE);

    expect(sixteenth).toMatchObject({
      status: "received",
      notification: { isOverPlanLimit: true, planName: "Gratuit", planTestimonialLimit: 15 },
    });
    expect(await findTestimonials()).toHaveLength(16);
  });

  it("counts only the validated testimonials against the free plan", async () => {
    for (let index = 0; index < 15; index += 1) {
      await submitTestimonial(database, CAMILLE);
    }

    expect(await submitTestimonial(database, CAMILLE)).toMatchObject({ notification: { isOverPlanLimit: false } });
  });

  it("finds no limit on a paid plan", async () => {
    await database.update(spaces).set({ plan: "essentiel" }).where(eq(spaces.id, spaceId));
    for (let index = 0; index < 15; index += 1) {
      await submitTestimonial(database, CAMILLE);
    }

    expect(await submitTestimonial(database, CAMILLE)).toMatchObject({
      notification: { isOverPlanLimit: false },
    });
  });
});
