import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { assert, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { customers, products, purchases } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { addProduct } from "./add-product";
import { listSpaceProducts } from "./list-space-products";
import { removeProduct } from "./remove-product";

let database: Database;
let julieId: string;
let julieSpaceId: string;
let marcId: string;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  julieId = await insertTestUser(database, "julie@exemple.fr");
  julieSpaceId = await insertTestSpace(database, julieId, "julie-nutrition");
  marcId = await insertTestUser(database, "marc@exemple.fr");
  await insertTestSpace(database, marcId, "marc-coaching");
});

describe("addProduct", () => {
  it("gives each formation of a space its own address", async () => {
    await addProduct(database, julieId, julieSpaceId, "Programme 30 jours");
    await addProduct(database, julieId, julieSpaceId, "Programme 30 jours");
    await addProduct(database, julieId, julieSpaceId, "!!!");

    expect((await listSpaceProducts(database, julieSpaceId)).map((product) => product.slug)).toEqual([
      "programme-30-jours",
      "programme-30-jours-2",
      "formation",
    ]);
  });

  it("writes nothing in the space of another creator", async () => {
    expect(await addProduct(database, marcId, julieSpaceId, "Formation pirate")).toEqual({
      status: "space-not-found",
    });
    expect(await addProduct(database, marcId, randomUUID(), "Formation pirate")).toEqual({
      status: "space-not-found",
    });
    expect(await listSpaceProducts(database, julieSpaceId)).toEqual([]);
  });
});

describe("removeProduct", () => {
  it("removes a formation of one's own space", async () => {
    const added = await addProduct(database, julieId, julieSpaceId, "Programme 30 jours");
    assert(added.status === "added");

    expect(await removeProduct(database, julieId, added.product.id)).toEqual({ status: "removed" });
    expect(await listSpaceProducts(database, julieSpaceId)).toEqual([]);
  });

  it("removes nothing from the space of another creator", async () => {
    const added = await addProduct(database, julieId, julieSpaceId, "Programme 30 jours");
    assert(added.status === "added");

    expect(await removeProduct(database, marcId, added.product.id)).toEqual({ status: "product-not-found" });
    expect(await listSpaceProducts(database, julieSpaceId)).toHaveLength(1);
  });

  it("keeps a formation that already has sales, so that no sale is lost", async () => {
    const added = await addProduct(database, julieId, julieSpaceId, "Programme 30 jours");
    assert(added.status === "added");
    const [customer] = await database
      .insert(customers)
      .values({ spaceId: julieSpaceId, email: "camille@exemple.fr" })
      .returning({ id: customers.id });
    await database.insert(purchases).values({
      spaceId: julieSpaceId,
      customerId: customer.id,
      productId: added.product.id,
      source: "manual",
      purchasedAt: new Date(),
    });

    expect(await removeProduct(database, julieId, added.product.id)).toEqual({ status: "has-sales" });
    expect(await database.select().from(products).where(eq(products.id, added.product.id))).toHaveLength(1);
  });
});
