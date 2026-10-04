import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { toolSuggestions } from "@/db/schema";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { saveToolSuggestion, toolNameSchema } from "./public-tool-suggestion";

let database: Database;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
});

describe("toolNameSchema", () => {
  it("accepts the name of a tool, trimmed, and refuses a letter alone or a sentence", () => {
    expect(toolNameSchema.parse("  Learnybox ")).toBe("Learnybox");
    expect(toolNameSchema.safeParse("L").success).toBe(false);
    expect(toolNameSchema.safeParse("x".repeat(81)).success).toBe(false);
  });
});

describe("saveToolSuggestion", () => {
  it("keeps every suggestion, the same tool twice included: how often it is named counts", async () => {
    await saveToolSuggestion(database, "Learnybox");
    await saveToolSuggestion(database, "Learnybox");
    await saveToolSuggestion(database, "Podia");

    const rows = await database.select().from(toolSuggestions);
    expect(rows.map((row) => row.toolName).sort()).toEqual(["Learnybox", "Learnybox", "Podia"]);
  });
});
