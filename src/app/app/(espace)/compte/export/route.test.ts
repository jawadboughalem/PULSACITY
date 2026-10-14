import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { fillTestSpace } from "@/db/full-space-fixtures";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { GET } from "./route";

type TestContext = {
  database: Database | null;
  signedInUser: { id: string; email: string; name: string } | null;
};

const testContext = vi.hoisted((): TestContext => ({ database: null, signedInUser: null }));

vi.mock("@/db", () => ({ getDb: () => testContext.database }));
vi.mock("@/lib/auth/get-signed-in-user", () => ({ getSignedInUser: async () => testContext.signedInUser }));

const db = () => {
  if (!testContext.database) throw new Error("The test database is not ready.");
  return testContext.database;
};

beforeAll(async () => {
  testContext.database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(db());
  const julieId = await insertTestUser(db(), "julie@exemple.fr");
  await fillTestSpace(db(), julieId, await insertTestSpace(db(), julieId, "julie-nutrition"), "julie");
  const marcId = await insertTestUser(db(), "marc@exemple.fr");
  await fillTestSpace(db(), marcId, await insertTestSpace(db(), marcId, "marc-coaching"), "marc");
  testContext.signedInUser = { id: julieId, email: "julie@exemple.fr", name: "" };
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

describe("GET /app/compte/export", () => {
  it("gives the signed-in creator a JSON file of their space, to save, never kept in a cache", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/json; charset=utf-8");
    expect(response.headers.get("Content-Disposition")).toMatch(/^attachment; filename="pulsacity-julie-nutrition-\d{4}-\d{2}-\d{2}\.json"$/);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    const file = await response.text();
    expect(JSON.parse(file)).toMatchObject({
      compte: { adresse_de_connexion: "julie@exemple.fr" },
      espace: { page_de_collecte: "https://pulsacity.com/t/julie-nutrition" },
    });
    expect(file).not.toContain("marc");
  });

  it("refuses someone who is not signed in", async () => {
    testContext.signedInUser = null;
    expect((await GET()).status).toBe(401);
  });
});
