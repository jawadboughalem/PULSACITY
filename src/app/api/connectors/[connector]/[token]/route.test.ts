import { readFileSync } from "node:fs";
import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import {
  connections,
  customers,
  externalProducts,
  productRefs,
  products,
  purchases,
  reviewRequests,
  webhookEvents,
} from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { processAwaitingEvents, processMissedEvents } from "@/lib/connectors/process-webhook-event";
import { signHmacSha256Hex } from "@/lib/connectors/signing";
import type { Connector } from "@/lib/connectors/types";
import { POST } from "./route";

type TestContext = {
  database: Database | null;
  scheduled: Array<() => Promise<void>>;
};

const testContext = vi.hoisted((): TestContext => ({ database: null, scheduled: [] }));

vi.mock("@/db", () => ({ getDb: () => testContext.database }));
vi.mock("next/server", () => ({ after: (task: () => Promise<void>) => testContext.scheduled.push(task) }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

/** A connector that exists only in this test: the engine must receive and process it with nothing else to add. */
vi.mock("@/lib/connectors/registry", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/connectors/registry")>();
  const testConnector: Connector = {
    id: "test",
    slug: "test",
    name: "Test",
    description: "Connecteur de test",
    createConfig: () => ({ signingSecret: "cle-de-test" }),
    verify: async (request, config) => request.headers.get("x-test-key") === config.signingSecret,
    readEventType: (payload) => (payload as { kind?: string }).kind ?? null,
    normalize: (payload) => {
      const event = payload as { kind: string; id: string; email: string; product: string; at: string };
      if (event.kind !== "paid") return null;
      return {
        eventType: "sale",
        externalRef: event.id,
        email: event.email,
        firstName: "Léa",
        lastName: "Martin",
        productRef: event.product,
        productName: `Produit ${event.product}`,
        productPrice: null,
        occurredAt: new Date(event.at),
      };
    },
  };
  return {
    ...original,
    getConnector: (id: string) => (id === "test" ? testConnector : original.getConnector(id)),
  };
});

const readFixture = (name: string) =>
  readFileSync(new URL(`../../../../../lib/connectors/systeme/__fixtures__/${name}`, import.meta.url), "utf8");

const SALE_BODY = readFixture("sale-new.body.json").trimEnd();
const SALE_HEADERS = JSON.parse(readFixture("sale-new.headers.json")) as Record<string, string>;
const ENROLLMENT_BODY = readFixture("contact-course-enrolled.body.json").trimEnd();
const ENROLLMENT_HEADERS = JSON.parse(readFixture("contact-course-enrolled.headers.json")) as Record<string, string>;

const SECRET = "0123456789abcdef0123456789abcdef";
const TOKEN = "jeton-secret-de-julie-0123456789abcdefghij";
const DAY_MS = 24 * 60 * 60 * 1000;

let spaceId: string;
let connectionId: string;
let programmeId: string;

const db = () => {
  if (!testContext.database) throw new Error("The test database is not ready.");
  return testContext.database;
};

const deliver = (connector: string, token: string, body: string, headers: Record<string, string>) =>
  POST(new Request(`https://pulsacity.com/api/connectors/${connector}/${token}`, { method: "POST", body, headers }), {
    params: Promise.resolve({ connector, token }),
  });

const signedSale = (body = SALE_BODY) => ({
  ...SALE_HEADERS,
  "x-webhook-signature": signHmacSha256Hex(SECRET, Buffer.from(body)),
});

const runScheduled = async () => {
  const tasks = testContext.scheduled.splice(0);
  for (const task of tasks) await task();
};

const associate = async (externalRef: string, productId: string) => {
  await db().insert(productRefs).values({ productId, connectionId, externalRef });
  await processAwaitingEvents(db(), connectionId, externalRef);
};

beforeAll(async () => {
  testContext.database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(db());
  testContext.scheduled = [];
  const userId = await insertTestUser(db(), "julie@exemple.fr");
  spaceId = await insertTestSpace(db(), userId, "julie-nutrition");
  const [connection] = await db()
    .insert(connections)
    .values({ spaceId, connector: "systeme", webhookToken: TOKEN, config: { signingSecret: SECRET } })
    .returning({ id: connections.id });
  connectionId = connection.id;
  const [programme] = await db()
    .insert(products)
    .values({ spaceId, name: "Programme 30 jours", slug: "programme-30-jours" })
    .returning({ id: products.id });
  programmeId = programme.id;
});

describe("POST /api/connectors/[connector]/[token]", () => {
  it("answers a silent 404 to an unknown connector, an unknown token, or the token of another connector", async () => {
    for (const [connector, token] of [
      ["inconnu", TOKEN],
      ["systeme", "jeton-qui-n-existe-pas-0123456789"],
      ["systeme", "court"],
      ["test", TOKEN],
      ["__proto__", TOKEN],
    ]) {
      const response = await deliver(connector, token, SALE_BODY, signedSale());
      expect(response.status).toBe(404);
      expect(await response.text()).toBe("");
    }
    expect(await db().select().from(webhookEvents)).toEqual([]);
  });

  it("stores the raw delivery, answers 200 at once, and processes it after the answer", async () => {
    const response = await deliver("systeme", TOKEN, SALE_BODY, signedSale());

    expect(response.status).toBe(200);
    const [event] = await db().select().from(webhookEvents);
    expect(event).toMatchObject({ connectionId, rawBody: SALE_BODY, eventType: "SALE_NEW", processedAt: null, error: null });
    expect(event.headers["x-webhook-message-id"]).toBe("01a0e483-09fb-7d11-ac67-be0fb3c6a98b");
    expect(testContext.scheduled).toHaveLength(1);

    await runScheduled();
    const [connection] = await db().select().from(connections);
    expect(connection.status).toBe("active");
    expect(connection.lastEventAt).not.toBeNull();
  });

  it("keeps the sales of an unknown product aside, then plans the request once it is associated", async () => {
    await deliver("systeme", TOKEN, SALE_BODY, signedSale());
    await runScheduled();

    expect(await db().select({ outcome: webhookEvents.outcome }).from(webhookEvents)).toEqual([
      { outcome: "awaiting-product" },
    ]);
    expect(await db().select().from(externalProducts)).toMatchObject([
      { externalRef: "price-plan:3456303", name: "Produit physique test PULSACITY", priceCents: 100, currency: "EUR" },
    ]);
    expect(await db().select().from(purchases)).toEqual([]);

    await associate("price-plan:3456303", programmeId);

    const [customer] = await db().select().from(customers);
    expect(customer).toMatchObject({ spaceId, email: "utilisateurdemo+capture@example.com", firstName: "Test" });
    const [purchase] = await db().select().from(purchases);
    expect(purchase).toMatchObject({
      customerId: customer.id,
      productId: programmeId,
      connectionId,
      source: "connector",
      eventType: "sale",
      externalRef: "order-item:15460129",
    });
    const [request] = await db().select().from(reviewRequests);
    expect(request).toMatchObject({ purchaseId: purchase.id, status: "scheduled" });
    expect(request.scheduledAt.getTime()).toBe(new Date("2026-09-27T20:16:26Z").getTime() + 14 * DAY_MS);
    const [event] = await db().select().from(webhookEvents);
    expect(event).toMatchObject({ outcome: "request-scheduled", purchaseId: purchase.id });
  });

  it("records the same sale received twice once, with one request", async () => {
    await db().insert(productRefs).values({ productId: programmeId, connectionId, externalRef: "price-plan:3456303" });

    await deliver("systeme", TOKEN, SALE_BODY, signedSale());
    await deliver("systeme", TOKEN, SALE_BODY, signedSale());
    await runScheduled();

    expect(await db().select({ id: purchases.id }).from(purchases)).toHaveLength(1);
    expect(await db().select({ id: reviewRequests.id }).from(reviewRequests)).toHaveLength(1);
    const outcomes = (await db().select({ outcome: webhookEvents.outcome }).from(webhookEvents)).map((row) => row.outcome);
    expect(outcomes.sort()).toEqual(["duplicate", "request-scheduled"]);
  });

  it("keeps a sale signed with another secret aside, and shows the problem on the connection", async () => {
    const response = await deliver("systeme", TOKEN, SALE_BODY, {
      ...SALE_HEADERS,
      "x-webhook-signature": signHmacSha256Hex("ancienne-cle", Buffer.from(SALE_BODY)),
    });

    expect(response.status).toBe(200);
    expect(testContext.scheduled).toEqual([]);
    const [event] = await db().select().from(webhookEvents);
    expect(event).toMatchObject({ error: "invalid-signature", processedAt: null });
    const [connection] = await db().select().from(connections);
    expect(connection.status).toBe("error");

    await processMissedEvents(db(), new Date(Date.now() + DAY_MS));
    expect(await db().select().from(purchases)).toEqual([]);
  });

  it("receives the unsigned enrollment of an automation rule, authenticated by its address", async () => {
    await db().insert(productRefs).values({ productId: programmeId, connectionId, externalRef: "course:680647" });

    await deliver("systeme", TOKEN, ENROLLMENT_BODY, ENROLLMENT_HEADERS);
    await runScheduled();

    const [purchase] = await db().select().from(purchases);
    expect(purchase).toMatchObject({ eventType: "enrollment", externalRef: "enrollment:445573087:680647" });
    expect(await db().select({ lastName: customers.lastName }).from(customers)).toEqual([{ lastName: "Capture" }]);
  });

  it("keeps an event it does not read, without a request", async () => {
    const canceled = { ...SALE_HEADERS, "x-webhook-event": "SALE_CANCELED" };
    await deliver("systeme", TOKEN, SALE_BODY, { ...canceled, "x-webhook-signature": signedSale()["x-webhook-signature"] });
    await runScheduled();

    expect(await db().select({ outcome: webhookEvents.outcome, eventType: webhookEvents.eventType }).from(webhookEvents)).toEqual([
      { outcome: "unsupported", eventType: "SALE_CANCELED" },
    ]);
    expect(await db().select().from(purchases)).toEqual([]);
  });

  it("keeps a body that is not JSON, as text", async () => {
    await deliver("systeme", TOKEN, "pas du json", ENROLLMENT_HEADERS);
    const [event] = await db().select().from(webhookEvents);
    expect(event.rawPayload).toBe("pas du json");
  });

  it("processes, in the cron, an event whose processing never ran", async () => {
    await db().insert(productRefs).values({ productId: programmeId, connectionId, externalRef: "price-plan:3456303" });
    await deliver("systeme", TOKEN, SALE_BODY, signedSale());
    testContext.scheduled = [];

    expect(await processMissedEvents(db(), new Date())).toBe(0);
    expect(await processMissedEvents(db(), new Date(Date.now() + 3 * 60 * 1000))).toBe(1);
    expect(await db().select({ id: reviewRequests.id }).from(reviewRequests)).toHaveLength(1);
  });

  it("receives and processes a connector added to the registry alone, with the same engine", async () => {
    const [testConnection] = await db()
      .insert(connections)
      .values({ spaceId, connector: "test", webhookToken: "jeton-du-connecteur-de-test-0123456789", config: { signingSecret: "cle-de-test" } })
      .returning({ id: connections.id });
    await db().insert(productRefs).values({ productId: programmeId, connectionId: testConnection.id, externalRef: "p-1" });
    const body = JSON.stringify({ kind: "paid", id: "vente-1", email: "lea@exemple.fr", product: "p-1", at: "2026-10-01T09:00:00Z" });

    const refused = await deliver("test", "jeton-du-connecteur-de-test-0123456789", body, { "x-test-key": "faux" });
    const response = await deliver("test", "jeton-du-connecteur-de-test-0123456789", body, { "x-test-key": "cle-de-test" });
    await runScheduled();

    expect(refused.status).toBe(200);
    expect(response.status).toBe(200);
    const [purchase] = await db().select().from(purchases).where(eq(purchases.connectionId, testConnection.id));
    expect(purchase).toMatchObject({ productId: programmeId, externalRef: "vente-1", eventType: "sale" });
    const [request] = await db().select().from(reviewRequests);
    expect(request.scheduledAt.toISOString()).toBe(new Date(Date.parse("2026-10-01T09:00:00Z") + 14 * DAY_MS).toISOString());
  });
});
