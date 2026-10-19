import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { testimonialCorrections, testimonials } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { maskPassage, splitMaskedPassages } from "./mask-passage";

const NOW = new Date("2026-10-19T09:00:00Z");
const BODY = "Merci Julie ! Écrivez-moi à emma.s@exemple.fr, ma fille Léna en redemande.";

let database: Database;
let userId: string;
let spaceId: string;

const findTestimonial = async (id: string) => {
  const [testimonial] = await database.select().from(testimonials).where(eq(testimonials.id, id));
  return testimonial;
};

/** The selection of a passage, as the fiche sends it. */
const select = (text: string, passage: string) => {
  const start = text.indexOf(passage);
  return { text, start, end: start + passage.length };
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
});

describe("maskPassage", () => {
  it("replaces a name or a coordinate in the displayed text only, the original kept as written", async () => {
    const id = await insertTestTestimonial(database, { spaceId, body: BODY });

    expect(await maskPassage(database, userId, id, { ...select(BODY, " Léna "), kind: "name" }, NOW)).toEqual({
      status: "masked",
    });
    const masked = "Merci Julie ! Écrivez-moi à emma.s@exemple.fr, ma fille [nom masqué] en redemande.";
    expect(await findTestimonial(id)).toMatchObject({ body: BODY, displayBody: masked, displayEditedAt: NOW });

    await maskPassage(database, userId, id, { ...select(masked, "emma.s@exemple.fr"), kind: "contact" }, NOW);
    expect(await findTestimonial(id)).toMatchObject({
      body: BODY,
      displayBody: "Merci Julie ! Écrivez-moi à [coordonnée masquée], ma fille [nom masqué] en redemande.",
    });
  });

  it("refuses a selection made on a text changed since", async () => {
    const id = await insertTestTestimonial(database, { spaceId, body: BODY, displayBody: "Un autre texte, Léna." });

    expect(await maskPassage(database, userId, id, { ...select(BODY, "Léna"), kind: "name" }, NOW)).toEqual({
      status: "text-changed",
    });
  });

  it("masks a name or a coordinate, never a sentence: an empty, masked or long passage is refused", async () => {
    const long = `Merci ${"beaucoup ".repeat(15)}Julie.`;
    const id = await insertTestTestimonial(database, { spaceId, body: long });

    expect(await maskPassage(database, userId, id, { text: long, start: 5, end: 6, kind: "name" }, NOW)).toEqual({
      status: "empty-passage",
    });
    expect(await maskPassage(database, userId, id, { ...select(long, long.slice(6, 120)), kind: "name" }, NOW)).toEqual(
      { status: "passage-too-long" },
    );

    const withMask = "Merci [nom masqué] !";
    await database.update(testimonials).set({ displayBody: withMask }).where(eq(testimonials.id, id));
    expect(await maskPassage(database, userId, id, { ...select(withMask, "[nom masqué]"), kind: "name" }, NOW)).toEqual(
      { status: "empty-passage" },
    );
  });

  it("waits while a correction waits for the author: their answer would bring the passage back", async () => {
    const id = await insertTestTestimonial(database, { spaceId, body: BODY });
    await database
      .insert(testimonialCorrections)
      .values({ testimonialId: id, fromBody: BODY, body: `${BODY} Merci.`, token: "jeton" });

    expect(await maskPassage(database, userId, id, { ...select(BODY, "Léna"), kind: "name" }, NOW)).toEqual({
      status: "correction-waiting",
    });
    expect(await findTestimonial(id)).toMatchObject({ displayBody: null });
  });

  it("refuses to touch the testimonial of another creator", async () => {
    const id = await insertTestTestimonial(database, { spaceId, body: BODY });
    const otherUserId = await insertTestUser(database, "marc@exemple.fr");

    expect(await maskPassage(database, otherUserId, id, { ...select(BODY, "Léna"), kind: "name" }, NOW)).toEqual({
      status: "testimonial-not-found",
    });
  });
});

describe("splitMaskedPassages", () => {
  it("cuts the displayed text around the masked passages, for the fiche to show them as pills", () => {
    expect(splitMaskedPassages("Ma fille [nom masqué] en redemande, [coordonnée masquée]")).toEqual([
      { text: "Ma fille ", isMasked: false },
      { text: "nom masqué", isMasked: true },
      { text: " en redemande, ", isMasked: false },
      { text: "coordonnée masquée", isMasked: true },
    ]);
    expect(splitMaskedPassages("Rien de masqué [ici].")).toEqual([{ text: "Rien de masqué [ici].", isMasked: false }]);
  });
});
