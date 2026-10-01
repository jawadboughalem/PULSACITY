import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { markSpaceMilestone } from "./mark-space-milestone";

let database: Database;
let userId: string;
let spaceId: string;

const findSpace = async () => (await database.select().from(spaces).where(eq(spaces.id, spaceId)))[0];

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
});

describe("markSpaceMilestone", () => {
  it("keeps the date of the first time only", async () => {
    await markSpaceMilestone(database, userId, "first-day-celebrated", new Date("2026-09-30T10:00:00Z"));
    await markSpaceMilestone(database, userId, "first-day-celebrated", new Date("2026-10-01T10:00:00Z"));
    await markSpaceMilestone(database, userId, "collection-link-shared", new Date("2026-10-02T10:00:00Z"));

    expect(await findSpace()).toMatchObject({
      firstDayCelebratedAt: new Date("2026-09-30T10:00:00Z"),
      collectionLinkSharedAt: new Date("2026-10-02T10:00:00Z"),
      firstApprovalCelebratedAt: null,
    });
  });

  it("only touches the space of the user", async () => {
    const otherUserId = await insertTestUser(database, "marc@exemple.fr");

    await markSpaceMilestone(database, otherUserId, "collection-link-shared");

    expect(await findSpace()).toMatchObject({ collectionLinkSharedAt: null });
  });
});
