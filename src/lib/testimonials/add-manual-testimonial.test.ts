import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { products, testimonials } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { buildTestimonialPhotoKey } from "@/lib/uploads/upload-keys";
import { type ManualTestimonial, addManualTestimonial } from "./add-manual-testimonial";

let database: Database;
let userId: string;
let spaceId: string;

const NOW = new Date("2026-09-30T10:00:00Z");

const NADIA: ManualTestimonial = {
  productId: null,
  authorName: "Nadia B.",
  authorTitle: "Kinésithérapeute",
  rating: 5,
  body: "Reçu par WhatsApp : merci pour ce suivi, je me sens enfin légère.",
  receivedAt: null,
  photoKey: null,
};

const findSpaceTestimonials = () => database.select().from(testimonials).where(eq(testimonials.spaceId, spaceId));

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  vi.stubEnv("R2_PUBLIC_URL", "https://photos.pulsacity.com");
});

describe("addManualTestimonial", () => {
  it("adds a validated testimonial with source manual and the creator's consent", async () => {
    const result = await addManualTestimonial(database, userId, spaceId, NADIA, NOW);

    expect(result).toMatchObject({ status: "added", plan: null });
    expect(await findSpaceTestimonials()).toEqual([
      expect.objectContaining({
        authorName: "Nadia B.",
        authorTitle: "Kinésithérapeute",
        rating: 5,
        status: "approved",
        source: "manual",
        consentAt: NOW,
        consentText: "J'ai l'accord de cette personne pour publier son témoignage.",
        createdAt: NOW,
        customerId: null,
      }),
    ]);
  });

  it("keeps its formation, its date and its photo", async () => {
    const [product] = await database
      .insert(products)
      .values({ spaceId, name: "Suivi individuel", slug: "suivi-individuel" })
      .returning({ id: products.id });
    const photoKey = buildTestimonialPhotoKey(spaceId, "image/jpeg");
    const receivedAt = new Date("2026-06-02T12:00:00Z");

    await addManualTestimonial(database, userId, spaceId, { ...NADIA, productId: product.id, receivedAt, photoKey }, NOW);

    expect(await findSpaceTestimonials()).toEqual([
      expect.objectContaining({
        productId: product.id,
        createdAt: receivedAt,
        authorPhotoUrl: `https://photos.pulsacity.com/${photoKey}`,
      }),
    ]);
  });

  it("refuses a formation or a photo from another space, and another creator", async () => {
    const otherUserId = await insertTestUser(database, "marc@exemple.fr");
    const otherSpaceId = await insertTestSpace(database, otherUserId, "marc-coaching");
    const [otherProduct] = await database
      .insert(products)
      .values({ spaceId: otherSpaceId, name: "Coaching", slug: "coaching" })
      .returning({ id: products.id });

    expect(await addManualTestimonial(database, userId, spaceId, { ...NADIA, productId: otherProduct.id })).toEqual({
      status: "product-not-found",
    });
    expect(
      await addManualTestimonial(database, userId, spaceId, {
        ...NADIA,
        photoKey: buildTestimonialPhotoKey(otherSpaceId, "image/png"),
      }),
    ).toEqual({ status: "invalid-photo" });
    expect(await addManualTestimonial(database, otherUserId, spaceId, NADIA)).toEqual({ status: "space-not-found" });
    expect(await findSpaceTestimonials()).toHaveLength(0);
  });

  it("keeps the 16th testimonial of the free plan pending, and says why", async () => {
    for (let index = 0; index < 15; index += 1) await insertTestTestimonial(database, { spaceId, status: "approved" });

    const result = await addManualTestimonial(database, userId, spaceId, NADIA);

    expect(result).toMatchObject({ status: "added", plan: { name: "Gratuit", testimonialLimit: 15 } });
    expect(await findSpaceTestimonials()).toHaveLength(16);
    expect((await findSpaceTestimonials()).filter((testimonial) => testimonial.status === "pending")).toEqual([
      expect.objectContaining({ authorName: "Nadia B.", source: "manual" }),
    ]);
  });
});
