import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { connections, productRefs, products } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { listSpaceOffers } from "./list-space-offers";
import { updateProduct } from "./update-product";

let database: Database;
let userId: string;
let spaceId: string;
let productId: string;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  const [product] = await database
    .insert(products)
    .values({ spaceId, name: "Programme 30 jours", slug: "programme-30-jours" })
    .returning({ id: products.id });
  productId = product.id;
});

describe("listSpaceOffers", () => {
  it("lists each offer with its settings, its testimonials and its connector references", async () => {
    const [connection] = await database
      .insert(connections)
      .values({ spaceId, connector: "systeme", webhookToken: randomUUID(), status: "active" })
      .returning({ id: connections.id });
    await database.insert(productRefs).values([
      { productId, connectionId: connection.id, externalRef: "offer-price-2" },
      { productId, connectionId: connection.id, externalRef: "course-1" },
    ]);
    await insertTestTestimonial(database, { spaceId, productId });
    await insertTestTestimonial(database, { spaceId, productId });
    await database.insert(products).values({ spaceId, name: "Suivi individuel", slug: "suivi-individuel" });

    expect(await listSpaceOffers(database, spaceId)).toEqual([
      {
        id: productId,
        name: "Programme 30 jours",
        slug: "programme-30-jours",
        requestDelayDays: 14,
        requestsEnabled: true,
        testimonialCount: 2,
        connectorRefs: [
          { connector: "systeme", externalRef: "course-1" },
          { connector: "systeme", externalRef: "offer-price-2" },
        ],
      },
      expect.objectContaining({ name: "Suivi individuel", testimonialCount: 0, connectorRefs: [] }),
    ]);
  });
});

describe("updateProduct", () => {
  it("renames without changing the collection link, and sets the request settings", async () => {
    await updateProduct(database, userId, productId, { name: "Programme 30 jours — édition 2" });
    await updateProduct(database, userId, productId, { requestDelayDays: 7 });
    await updateProduct(database, userId, productId, { requestsEnabled: false });

    const [product] = await database.select().from(products).where(eq(products.id, productId));
    expect(product).toMatchObject({
      name: "Programme 30 jours — édition 2",
      slug: "programme-30-jours",
      requestDelayDays: 7,
      requestsEnabled: false,
    });
  });

  it("refuses the offer of another creator", async () => {
    const otherUserId = await insertTestUser(database, "marc@exemple.fr");

    expect(await updateProduct(database, otherUserId, productId, { name: "Volé" })).toEqual({
      status: "product-not-found",
    });
    const [product] = await database.select().from(products).where(eq(products.id, productId));
    expect(product.name).toBe("Programme 30 jours");
  });
});
