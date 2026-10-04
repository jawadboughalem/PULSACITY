import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { connectorWaitlistEmails } from "@/db/schema";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { joinPublicWaitlist, publicWaitlistSchema } from "./public-waitlist";

let database: Database;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
});

describe("publicWaitlistSchema", () => {
  it("accepts a connector to come and a complete address, written in lower case", () => {
    expect(publicWaitlistSchema.parse({ connector: "stripe", email: "  Julie@Exemple.FR " })).toEqual({
      connector: "stripe",
      email: "julie@exemple.fr",
    });
  });

  it("refuses an available or unknown connector, and an incomplete address", () => {
    expect(publicWaitlistSchema.safeParse({ connector: "systeme", email: "julie@exemple.fr" }).success).toBe(false);
    expect(publicWaitlistSchema.safeParse({ connector: "kajabi", email: "julie@exemple.fr" }).success).toBe(false);
    expect(publicWaitlistSchema.safeParse({ connector: "calendly", email: "julie@exemple" }).success).toBe(false);
  });
});

describe("joinPublicWaitlist", () => {
  it("keeps an address once per connector", async () => {
    await joinPublicWaitlist(database, { connector: "stripe", email: "julie@exemple.fr" });
    await joinPublicWaitlist(database, { connector: "stripe", email: "julie@exemple.fr" });
    await joinPublicWaitlist(database, { connector: "calendly", email: "julie@exemple.fr" });

    const rows = await database.select().from(connectorWaitlistEmails);
    expect(rows.map((row) => row.connector).sort()).toEqual(["calendly", "stripe"]);
  });
});
