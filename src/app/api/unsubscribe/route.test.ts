import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { customers } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { signUnsubscribeToken } from "@/lib/requests/unsubscribe-token";
import { GET, POST } from "./route";

const testContext = vi.hoisted((): { database: Database | null } => ({ database: null }));

vi.mock("@/db", () => ({ getDb: () => testContext.database }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

let customerId: string;

const db = () => {
  if (!testContext.database) throw new Error("The test database is not ready.");
  return testContext.database;
};

const readUnsubscribedAt = async () => {
  const [customer] = await db().select().from(customers).where(eq(customers.id, customerId));
  return customer.unsubscribedAt;
};

const address = (token: string) => `https://pulsacity.com/api/unsubscribe?token=${encodeURIComponent(token)}`;

beforeAll(async () => {
  testContext.database = await createTestDatabase();
});

beforeEach(async () => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
  vi.stubEnv("BETTER_AUTH_SECRET", "un-secret-de-test-assez-long-pour-signer");
  await emptyTestDatabase(db());
  const userId = await insertTestUser(db(), "julie@exemple.fr");
  const spaceId = await insertTestSpace(db(), userId, "julie-nutrition");
  const [customer] = await db()
    .insert(customers)
    .values({ spaceId, email: "camille@exemple.fr" })
    .returning({ id: customers.id });
  customerId = customer.id;
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("/api/unsubscribe", () => {
  it("unsubscribes in one click, then shows the confirmation page", async () => {
    const token = signUnsubscribeToken(customerId);
    const response = await GET(new Request(address(token)));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(`https://pulsacity.com/desinscription?token=${encodeURIComponent(token)}`);
    expect(await readUnsubscribedAt()).not.toBeNull();
  });

  it("refuses a token that was not signed by PULSACITY", async () => {
    const forged = `${customerId}.${"a".repeat(43)}`;
    const response = await GET(new Request(address(forged)));

    expect(response.headers.get("location")).toBe("https://pulsacity.com/desinscription?etat=invalid");
    expect(await readUnsubscribedAt()).toBeNull();
    expect((await GET(new Request("https://pulsacity.com/api/unsubscribe"))).status).toBe(303);
    expect((await POST(new Request(address(signUnsubscribeToken(randomUUID())), { method: "POST" }))).status).toBe(404);
  });

  it("unsubscribes from the mail client's own button, without a page", async () => {
    const response = await POST(
      new Request(address(signUnsubscribeToken(customerId)), { method: "POST", body: "List-Unsubscribe=One-Click" }),
    );
    expect(response.status).toBe(200);
    expect(await readUnsubscribedAt()).not.toBeNull();
  });
});
