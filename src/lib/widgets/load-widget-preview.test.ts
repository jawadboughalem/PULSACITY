import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { products } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { loadWidgetPreview } from "./load-widget-preview";

let database: Database;
let spaceId: string;
let otherSpaceId: string;
let programmeId: string;
let suiviId: string;

const daysAgo = (days: number) => new Date(Date.parse("2026-09-30T10:00:00Z") - days * 24 * 60 * 60 * 1000);

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  spaceId = await insertTestSpace(database, await insertTestUser(database, "julie@exemple.fr"), "julie-nutrition");
  otherSpaceId = await insertTestSpace(database, await insertTestUser(database, "marc@exemple.fr"), "marc-coaching");
  const [programme, suivi] = await database
    .insert(products)
    .values([
      { spaceId, name: "Programme 30 jours", slug: "programme-30-jours" },
      { spaceId, name: "Suivi individuel 3 mois", slug: "suivi-individuel-3-mois" },
    ])
    .returning({ id: products.id });
  programmeId = programme.id;
  suiviId = suivi.id;
});

describe("loadWidgetPreview", () => {
  it("holds the validated testimonials of the space as a widget shows them, with the count and average of each offer", async () => {
    await insertTestTestimonial(database, {
      spaceId,
      productId: programmeId,
      authorName: "Thomas L.",
      authorTitle: "Développeur",
      rating: 5,
      body: "Les recettes sont rapides.",
      displayBody: "Les recettes sont rapides et le groupe motive vraiment.",
      status: "approved",
      createdAt: daysAgo(10),
    });
    await insertTestTestimonial(database, {
      spaceId,
      productId: suiviId,
      authorName: "Inès V.",
      rating: 4,
      status: "approved",
      createdAt: daysAgo(2),
    });
    await insertTestTestimonial(database, {
      spaceId,
      productId: programmeId,
      authorName: "Camille R.",
      rating: 3,
      status: "approved",
      featured: true,
      createdAt: daysAgo(30),
    });
    await insertTestTestimonial(database, { spaceId, authorName: "Sophie D.", status: "pending", createdAt: daysAgo(1) });
    await insertTestTestimonial(database, { spaceId, authorName: "Arthur B.", status: "hidden", createdAt: daysAgo(1) });
    await insertTestTestimonial(database, { spaceId: otherSpaceId, authorName: "Paul G.", status: "approved" });

    const preview = await loadWidgetPreview(database, spaceId);

    expect(preview.testimonials.map((testimonial) => testimonial.authorName)).toEqual([
      "Camille R.",
      "Inès V.",
      "Thomas L.",
    ]);
    expect(preview.testimonials[2]).toEqual({
      authorName: "Thomas L.",
      authorTitle: "Développeur",
      authorPhotoUrl: null,
      rating: 5,
      text: "Les recettes sont rapides et le groupe motive vraiment.",
      receivedOn: "2026-09-20",
      productId: programmeId,
    });
    expect(preview.summaries).toEqual({
      all: { total: 3, averageRating: 4 },
      byOffer: {
        [programmeId]: { total: 2, averageRating: 4 },
        [suiviId]: { total: 1, averageRating: 4 },
      },
    });
  });

  it("keeps enough testimonials for each offer, even past the first fifty of the space", async () => {
    for (let index = 0; index < 51; index += 1) {
      await insertTestTestimonial(database, {
        spaceId,
        productId: suiviId,
        authorName: `Client ${index}`,
        status: "approved",
        createdAt: daysAgo(index),
      });
    }
    await insertTestTestimonial(database, {
      spaceId,
      productId: programmeId,
      authorName: "Camille R.",
      status: "approved",
      createdAt: daysAgo(90),
    });

    const preview = await loadWidgetPreview(database, spaceId);

    expect(preview.testimonials).toHaveLength(51);
    expect(preview.testimonials.filter((testimonial) => testimonial.productId === suiviId)).toHaveLength(50);
    expect(preview.testimonials.at(-1)?.authorName).toBe("Camille R.");
    expect(preview.summaries.all.total).toBe(52);
  });
});
