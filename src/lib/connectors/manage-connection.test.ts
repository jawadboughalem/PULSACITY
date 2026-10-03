import { readFileSync } from "node:fs";
import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import {
  connections,
  connectorWaitlist,
  externalProducts,
  productRefs,
  products,
  purchases,
  reviewRequests,
  webhookEvents,
} from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { listConnectionEvents, loadConnectionOverview } from "./load-connection-overview";
import { associateExternalProduct, joinConnectorWaitlist, replayOwnedEvent } from "./manage-connection";
import { processWebhookEvent } from "./process-webhook-event";

vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const SALE = JSON.parse(readFileSync(new URL("./systeme/__fixtures__/sale-new.body.json", import.meta.url), "utf8")) as unknown;
const SALE_HEADERS = JSON.parse(
  readFileSync(new URL("./systeme/__fixtures__/sale-new.headers.json", import.meta.url), "utf8"),
) as Record<string, string>;

let database: Database;
let userId: string;
let spaceId: string;
let connectionId: string;
let programmeId: string;

const receiveSale = async (change: { error?: "invalid-signature" } = {}) => {
  const [event] = await database
    .insert(webhookEvents)
    .values({ connectionId, rawPayload: SALE, headers: SALE_HEADERS, eventType: "SALE_NEW", ...change })
    .returning({ id: webhookEvents.id });
  await processWebhookEvent(database, event.id);
  return event.id;
};

const findExternalProductId = async () => {
  const [product] = await database.select({ id: externalProducts.id }).from(externalProducts);
  return product.id;
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  const [connection] = await database
    .insert(connections)
    .values({ spaceId, connector: "systeme", webhookToken: "jeton-0123456789abcdefghij", status: "active" })
    .returning({ id: connections.id });
  connectionId = connection.id;
  const [programme] = await database
    .insert(products)
    .values({ spaceId, name: "Programme 30 jours", slug: "programme-30-jours" })
    .returning({ id: products.id });
  programmeId = programme.id;
});

describe("associateExternalProduct", () => {
  it("links the product to an offer and processes the sales kept aside", async () => {
    const eventId = await receiveSale();
    expect(await database.select().from(purchases)).toEqual([]);

    const result = await associateExternalProduct(database, userId, await findExternalProductId(), { productId: programmeId });

    expect(result).toEqual({ status: "associated", productId: programmeId });
    expect(await database.select({ productId: purchases.productId }).from(purchases)).toEqual([{ productId: programmeId }]);
    expect(await database.select({ id: reviewRequests.id }).from(reviewRequests)).toHaveLength(1);
    const [event] = await database.select().from(webhookEvents).where(eq(webhookEvents.id, eventId));
    expect(event.outcome).toBe("request-scheduled");
  });

  it("creates the offer named after the product when asked", async () => {
    await receiveSale();
    const result = await associateExternalProduct(database, userId, await findExternalProductId(), {
      newOfferName: "Produit physique test PULSACITY",
    });

    expect(result.status).toBe("associated");
    const [created] = await database.select().from(products).where(eq(products.name, "Produit physique test PULSACITY"));
    expect(created.slug).toBe("produit-physique-test-pulsacity");
    expect(await database.select({ productId: productRefs.productId }).from(productRefs)).toEqual([{ productId: created.id }]);
  });

  it("moves the product to another offer without recording its sales twice", async () => {
    await receiveSale();
    const externalProductId = await findExternalProductId();
    await associateExternalProduct(database, userId, externalProductId, { productId: programmeId });
    await associateExternalProduct(database, userId, externalProductId, { newOfferName: "Atelier" });

    expect(await database.select().from(productRefs)).toHaveLength(1);
    expect(await database.select().from(purchases)).toHaveLength(1);
  });

  it("refuses another creator's product, and another space's offer", async () => {
    await receiveSale();
    const externalProductId = await findExternalProductId();
    const marcId = await insertTestUser(database, "marc@exemple.fr");
    const marcSpaceId = await insertTestSpace(database, marcId, "marc-coaching");
    const [marcOffer] = await database
      .insert(products)
      .values({ spaceId: marcSpaceId, name: "Coaching", slug: "coaching" })
      .returning({ id: products.id });

    expect(await associateExternalProduct(database, marcId, externalProductId, { productId: marcOffer.id })).toEqual({
      status: "not-found",
    });
    expect(await associateExternalProduct(database, userId, externalProductId, { productId: marcOffer.id })).toEqual({
      status: "not-found",
    });
    expect(await database.select().from(productRefs)).toEqual([]);
  });
});

describe("replayOwnedEvent", () => {
  it("processes a sale kept aside for its signature once the creator asks, and only the creator", async () => {
    await database.insert(productRefs).values({ productId: programmeId, connectionId, externalRef: "price-plan:3456303" });
    const eventId = await receiveSale({ error: "invalid-signature" });
    expect(await database.select().from(purchases)).toEqual([]);

    const marcId = await insertTestUser(database, "marc@exemple.fr");
    expect(await replayOwnedEvent(database, marcId, eventId)).toEqual({ status: "not-found" });
    expect(await replayOwnedEvent(database, userId, eventId)).toEqual({ status: "replayed" });
    expect(await replayOwnedEvent(database, userId, eventId)).toEqual({ status: "replayed" });

    expect(await database.select().from(purchases)).toHaveLength(1);
    expect(await database.select().from(reviewRequests)).toHaveLength(1);
  });
});

describe("loadConnectionOverview", () => {
  it("counts the sales put aside until « Rejouer », and names the offer their product is associated with", async () => {
    await database.insert(productRefs).values({ productId: programmeId, connectionId, externalRef: "price-plan:3456303" });
    const eventId = await receiveSale({ error: "invalid-signature" });
    await receiveSale();
    const [connection] = await database.select().from(connections).where(eq(connections.id, connectionId));

    expect(await loadConnectionOverview(database, connection)).toMatchObject({ setAsideCount: 1, eventCount: 2 });
    const setAside = await listConnectionEvents(database, connection, { limit: 5, isSetAsideOnly: true });
    expect(setAside).toEqual([
      expect.objectContaining({ id: eventId, error: "invalid-signature", productName: "Programme 30 jours" }),
    ]);

    await replayOwnedEvent(database, userId, eventId);
    expect(await loadConnectionOverview(database, connection)).toMatchObject({ setAsideCount: 0 });
  });
});

describe("joinConnectorWaitlist", () => {
  it("keeps one line per connector, and one per tool named", async () => {
    await joinConnectorWaitlist(database, spaceId, "stripe");
    await joinConnectorWaitlist(database, spaceId, "stripe");
    await joinConnectorWaitlist(database, spaceId, "other", "Learnybox");
    await joinConnectorWaitlist(database, spaceId, "other", "Learnybox");
    await joinConnectorWaitlist(database, spaceId, "other", "Podia");

    expect(await database.select().from(connectorWaitlist)).toHaveLength(3);
  });
});
