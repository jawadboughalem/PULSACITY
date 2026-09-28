import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { spaces, widgets } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { type NewSpace, createSpace } from "./create-space";

const JULIE_NUTRITION: NewSpace = {
  name: "Julie Nutrition",
  slug: "julie-nutrition",
  replyToEmail: "julie@exemple.fr",
  accentColor: "#A3243B",
  logoUrl: null,
};

let database: Database;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
});

describe("createSpace", () => {
  it("creates the space on the free plan, with a referral code and a default wall widget", async () => {
    const userId = await insertTestUser(database, "julie@exemple.fr");

    const result = await createSpace(database, userId, JULIE_NUTRITION);

    expect(result).toMatchObject({ status: "created", space: { slug: "julie-nutrition" } });
    const [space] = await database.select().from(spaces).where(eq(spaces.userId, userId));
    expect(space).toMatchObject({ ...JULIE_NUTRITION, plan: "free" });
    expect(space.referralCode).toMatch(/^[a-z2-9]{8}$/);
    expect(await database.select().from(widgets).where(eq(widgets.spaceId, space.id))).toEqual([
      expect.objectContaining({ type: "wall", productId: null, settings: {} }),
    ]);
  });

  it("refuses an address already taken and suggests the next free one", async () => {
    const otherUserId = await insertTestUser(database, "autre@exemple.fr");
    await insertTestSpace(database, otherUserId, "julie-nutrition");
    await insertTestSpace(database, otherUserId, "julie-nutrition-2");
    const userId = await insertTestUser(database, "julie@exemple.fr");

    expect(await createSpace(database, userId, JULIE_NUTRITION)).toEqual({
      status: "slug-taken",
      suggestedSlug: "julie-nutrition-3",
    });
    expect(await database.select().from(spaces).where(eq(spaces.userId, userId))).toEqual([]);
  });

  it("creates one space per creator, even when the form is sent twice at once", async () => {
    const userId = await insertTestUser(database, "julie@exemple.fr");

    const results = await Promise.all([
      createSpace(database, userId, JULIE_NUTRITION),
      createSpace(database, userId, { ...JULIE_NUTRITION, slug: "julie-bis" }),
    ]);

    expect(results.map((result) => result.status).sort()).toEqual(["already-has-space", "created"]);
    expect(await database.select().from(spaces).where(eq(spaces.userId, userId))).toHaveLength(1);
  });
});
