import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { rateLimits } from "@/db/schema";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { purgeEndedRateLimits } from "./purge-rate-limits";

let database: Database;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
});

const HOUR_MS = 60 * 60 * 1000;

describe("purgeEndedRateLimits", () => {
  it("deletes the counters whose longest window is over, and keeps the others", async () => {
    const now = Date.now();
    await database.insert(rateLimits).values([
      { key: "contact-day:all", hits: 3, windowStartedAt: new Date(now - 2 * HOUR_MS) },
      { key: "contact-ip:old", hits: 1, windowStartedAt: new Date(now - 25 * HOUR_MS) },
    ]);

    expect(await purgeEndedRateLimits(database)).toBe(1);
    expect((await database.select().from(rateLimits)).map((row) => row.key)).toEqual(["contact-day:all"]);
  });
});
