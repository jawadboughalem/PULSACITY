import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { products, testimonials } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { deleteTestimonial } from "./delete-testimonial";
import { getDisplayedBody } from "./displayed-body";
import { editTestimonialDisplay, restoreTestimonialOriginal } from "./edit-testimonial-display";
import { countTestimonialsByStatus, listSpaceTestimonials } from "./list-space-testimonials";
import { setTestimonialFeatured } from "./set-testimonial-featured";
import { setTestimonialStatus } from "./set-testimonial-status";
import { NO_TESTIMONIAL_FILTER, WITHOUT_PRODUCT } from "./testimonial-filters";

let database: Database;
let userId: string;
let spaceId: string;
let otherUserId: string;

const findTestimonial = async (id: string) => {
  const [testimonial] = await database.select().from(testimonials).where(eq(testimonials.id, id));
  return testimonial;
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  otherUserId = await insertTestUser(database, "marc@exemple.fr");
  await insertTestSpace(database, otherUserId, "marc-coaching");
});

describe("listSpaceTestimonials", () => {
  it("filters by status, formation and rating, newest first", async () => {
    const [programme] = await database
      .insert(products)
      .values({ spaceId, name: "Programme 30 jours", slug: "programme-30-jours" })
      .returning({ id: products.id });
    const older = await insertTestTestimonial(database, {
      spaceId,
      productId: programme.id,
      status: "approved",
      createdAt: new Date("2026-09-01T10:00:00Z"),
    });
    const newer = await insertTestTestimonial(database, {
      spaceId,
      productId: programme.id,
      status: "approved",
      rating: 4,
      createdAt: new Date("2026-09-20T10:00:00Z"),
    });
    const pending = await insertTestTestimonial(database, { spaceId, status: "pending", rating: 4 });

    const approved = await listSpaceTestimonials(database, spaceId, { ...NO_TESTIMONIAL_FILTER, status: "approved" });
    expect(approved.testimonials.map((testimonial) => testimonial.id)).toEqual([newer, older]);
    expect(approved.testimonials[0]).toMatchObject({ productName: "Programme 30 jours" });

    const withoutFormation = await listSpaceTestimonials(database, spaceId, {
      ...NO_TESTIMONIAL_FILTER,
      productId: WITHOUT_PRODUCT,
    });
    expect(withoutFormation.testimonials.map((testimonial) => testimonial.id)).toEqual([pending]);

    const fourStars = await listSpaceTestimonials(database, spaceId, {
      status: null,
      productId: programme.id,
      rating: 4,
    });
    expect(fourStars).toMatchObject({ total: 1, pageCount: 1 });
    expect(fourStars.testimonials.map((testimonial) => testimonial.id)).toEqual([newer]);
  });

  it("never lists the testimonials of another space", async () => {
    const otherSpaceId = await insertTestSpace(database, otherUserId, "marc-second");
    await insertTestTestimonial(database, { spaceId: otherSpaceId });

    expect(await listSpaceTestimonials(database, spaceId, NO_TESTIMONIAL_FILTER)).toEqual({
      testimonials: [],
      total: 0,
      pageCount: 1,
    });
  });
});

describe("countTestimonialsByStatus", () => {
  it("counts each status of the space", async () => {
    await insertTestTestimonial(database, { spaceId, status: "pending" });
    await insertTestTestimonial(database, { spaceId, status: "pending" });
    await insertTestTestimonial(database, { spaceId, status: "approved" });
    await insertTestTestimonial(database, { spaceId, status: "hidden" });

    expect(await countTestimonialsByStatus(database, spaceId)).toEqual({ all: 4, pending: 2, approved: 1, hidden: 1 });
  });
});

describe("quick actions", () => {
  it("approves, hides and features a testimonial of the space", async () => {
    const id = await insertTestTestimonial(database, { spaceId, status: "pending" });

    expect(await setTestimonialStatus(database, userId, id, "approved")).toEqual({ status: "updated" });
    expect(await findTestimonial(id)).toMatchObject({ status: "approved" });

    await setTestimonialFeatured(database, userId, id, true);
    expect(await findTestimonial(id)).toMatchObject({ featured: true });

    await setTestimonialStatus(database, userId, id, "hidden");
    expect(await findTestimonial(id)).toMatchObject({ status: "hidden", featured: true });
  });

  it("refuses to touch the testimonial of another creator", async () => {
    const id = await insertTestTestimonial(database, { spaceId, status: "pending" });

    expect(await setTestimonialStatus(database, otherUserId, id, "approved")).toEqual({
      status: "testimonial-not-found",
    });
    expect(await setTestimonialFeatured(database, otherUserId, id, true)).toEqual({ status: "testimonial-not-found" });
    expect(await editTestimonialDisplay(database, otherUserId, id, "Autre texte")).toEqual({
      status: "testimonial-not-found",
    });
    expect(await deleteTestimonial(database, otherUserId, id)).toEqual({ status: "testimonial-not-found" });
    expect(await findTestimonial(id)).toMatchObject({ status: "pending", featured: false, displayBody: null });
  });
});

describe("editTestimonialDisplay", () => {
  it("changes the displayed text and keeps the original intact", async () => {
    const original = "Super formation, j'ai apris plein de choses. Le groupe WhatsApp aussi était top.";
    const id = await insertTestTestimonial(database, { spaceId, body: original });

    await editTestimonialDisplay(database, userId, id, "  Super formation, j'ai appris plein de choses.  ");

    const edited = await findTestimonial(id);
    expect(edited).toMatchObject({ body: original, displayBody: "Super formation, j'ai appris plein de choses." });
    expect(edited.displayEditedAt).toBeInstanceOf(Date);
    expect(getDisplayedBody(edited)).toBe("Super formation, j'ai appris plein de choses.");
  });

  it("goes back to the original, by request or when the text matches it again", async () => {
    const id = await insertTestTestimonial(database, { spaceId, body: "Texte d'origine." });

    await editTestimonialDisplay(database, userId, id, "Texte corrigé.");
    await restoreTestimonialOriginal(database, userId, id);
    expect(await findTestimonial(id)).toMatchObject({ displayBody: null, displayEditedAt: null });

    await editTestimonialDisplay(database, userId, id, "Texte corrigé.");
    await editTestimonialDisplay(database, userId, id, "Texte d'origine.\r\n");
    const restored = await findTestimonial(id);
    expect(restored).toMatchObject({ body: "Texte d'origine.", displayBody: null, displayEditedAt: null });
    expect(getDisplayedBody(restored)).toBe("Texte d'origine.");
  });
});

describe("deleteTestimonial", () => {
  it("deletes the testimonial for good and hands back its photo", async () => {
    const id = await insertTestTestimonial(database, {
      spaceId,
      authorPhotoUrl: "https://photos.pulsacity.com/testimonial-photos/space/photo.jpg",
    });

    expect(await deleteTestimonial(database, userId, id)).toEqual({
      status: "deleted",
      authorPhotoUrl: "https://photos.pulsacity.com/testimonial-photos/space/photo.jpg",
    });
    expect(await findTestimonial(id)).toBeUndefined();
  });
});
