import { sql } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { rateLimits } from "@/db/schema";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { consumeRateLimit } from "./consume-rate-limit";

const THREE_PER_MINUTE = { name: "test-rule", limit: 3, windowSeconds: 60 };

let database: Database;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
});

const consumeTimes = async (times: number, subject: string) => {
  const results: boolean[] = [];
  for (let attempt = 0; attempt < times; attempt += 1) {
    results.push(await consumeRateLimit(database, THREE_PER_MINUTE, subject));
  }
  return results;
};

describe("consumeRateLimit", () => {
  it("allows the limit within a window, then refuses", async () => {
    expect(await consumeTimes(5, "subject-a")).toEqual([true, true, true, false, false]);
  });

  it("counts every subject and every rule on its own", async () => {
    await consumeTimes(3, "subject-a");

    expect(await consumeRateLimit(database, THREE_PER_MINUTE, "subject-b")).toBe(true);
    expect(await consumeRateLimit(database, { ...THREE_PER_MINUTE, name: "other-rule" }, "subject-a")).toBe(
      true,
    );
    expect(await consumeRateLimit(database, THREE_PER_MINUTE, "subject-a")).toBe(false);
  });

  it("starts a new window once the previous one is over", async () => {
    await consumeTimes(4, "subject-a");
    await database.update(rateLimits).set({ windowStartedAt: sql`now() - interval '61 seconds'` });

    expect(await consumeTimes(4, "subject-a")).toEqual([true, true, true, false]);
  });

  it("counts every concurrent attempt", async () => {
    const results = await Promise.all(
      Array.from({ length: 6 }, () => consumeRateLimit(database, THREE_PER_MINUTE, "subject-a")),
    );

    expect(results.filter(Boolean)).toHaveLength(3);
  });
});
