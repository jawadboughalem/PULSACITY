import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { insertTestReviewRequest } from "@/db/review-request-fixtures";
import { products } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { loadCollectionPage } from "./load-collection-page";

let database: Database;
let spaceId: string;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  spaceId = await insertTestSpace(database, await insertTestUser(database, "julie@exemple.fr"), "julie-nutrition");
});

describe("loadCollectionPage", () => {
  it("opens the page of a space, and of one of its formations", async () => {
    await database.insert(products).values({ spaceId, name: "Programme 30 jours", slug: "programme-30-jours" });

    expect(await loadCollectionPage(database, "julie-nutrition", null, null)).toMatchObject({
      status: "open",
      product: null,
      request: null,
    });
    expect(await loadCollectionPage(database, "julie-nutrition", "programme-30-jours", null)).toMatchObject({
      status: "open",
      product: { name: "Programme 30 jours", slug: "programme-30-jours" },
    });
  });

  it("finds nothing for an unknown space or formation", async () => {
    expect(await loadCollectionPage(database, "inconnu", null, null)).toBeNull();
    expect(await loadCollectionPage(database, "julie-nutrition", "inconnue", null)).toBeNull();
  });

  it("fills in the client's name and formation from the purchase behind the link", async () => {
    const request = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Suivi individuel",
      firstName: "Camille",
      lastName: "roux",
    });

    expect(await loadCollectionPage(database, "julie-nutrition", null, request.token)).toMatchObject({
      status: "open",
      product: { name: "Suivi individuel", slug: request.productSlug },
      request: { token: request.token, prefilledName: "Camille R." },
    });
  });

  it("recognises a link already used, cancelled or unknown", async () => {
    const used = await insertTestReviewRequest(database, {
      spaceId,
      productName: "Suivi",
      firstName: "Camille",
      lastName: null,
      status: "completed",
    });

    for (const token of [used.token, "unknown-token"]) {
      expect(await loadCollectionPage(database, "julie-nutrition", null, token)).toMatchObject({
        status: "link-inactive",
      });
    }
  });
});
