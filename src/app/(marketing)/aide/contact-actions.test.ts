import { count, is, sql } from "drizzle-orm";
import { PgTable, getTableConfig } from "drizzle-orm/pg-core";
import { type Mock, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import * as schema from "@/db/schema";
import { rateLimits } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { HONEYPOT_FIELD_NAME } from "@/lib/forms/honeypot";
import { CONTACT_MESSAGES_PER_DAY, CONTACT_MESSAGES_PER_IP } from "@/lib/support/contact-message";
import { sendContactMessage } from "./contact-actions";

type TestContext = {
  database: Database | null;
  clientIp: string;
  signedInUser: { id: string; email: string; name: string } | null;
  send: Mock;
};

const testContext = vi.hoisted(
  (): TestContext => ({ database: null, clientIp: "203.0.113.7", signedInUser: null, send: vi.fn() }),
);

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": testContext.clientIp }),
}));
vi.mock("@/db", () => ({ getDb: () => testContext.database }));
vi.mock("@/lib/auth/get-signed-in-user", () => ({ getSignedInUser: async () => testContext.signedInUser }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: testContext.send };
  },
}));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));

const TABLE_NAMES = Object.values(schema)
  .filter((value) => is(value, PgTable))
  .map((table) => getTableConfig(table).name);

const db = () => {
  if (!testContext.database) throw new Error("The test database is not ready.");
  return testContext.database;
};

type Fields = { email?: string; subject?: string; message?: string; honeypot?: string };

const submit = ({
  email = "julie@exemple.fr",
  subject = "Relier Kajabi",
  message = "Bonjour,\nKajabi arrive quand ?",
  honeypot,
}: Fields = {}) => {
  const formData = new FormData();
  formData.set("email", email);
  formData.set("subject", subject);
  formData.set("message", message);
  if (honeypot !== undefined) formData.set(HONEYPOT_FIELD_NAME, honeypot);
  return sendContactMessage(null, formData);
};

/** The messages carry the non-breaking spaces of the site: compared here as plain text. */
const plain = (result: unknown) => JSON.parse(JSON.stringify(result).replace(/\u00a0/g, " ").replace(/\u2060/g, ""));

const sentPayload = () => testContext.send.mock.calls[0][0] as Record<string, string>;

beforeAll(async () => {
  testContext.database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(db());
  testContext.clientIp = "203.0.113.7";
  testContext.signedInUser = null;
  testContext.send.mockReset();
  testContext.send.mockResolvedValue({ data: { id: "email-id" }, error: null });
  vi.stubEnv("BETTER_AUTH_SECRET", "a-test-secret-of-at-least-32-characters");
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("EMAIL_FROM_DOMAIN", "envois.pulsacity.com");
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sendContactMessage", () => {
  it("sends the message to PULSACITY's one address, the answer going to its sender", async () => {
    expect(await submit({ email: "  Julie@Exemple.fr " })).toEqual({ ok: true, data: { email: "julie@exemple.fr" } });

    expect(testContext.send).toHaveBeenCalledTimes(1);
    const payload = sentPayload();
    expect(payload.to).toBe("contact@pulsacity.com");
    expect(payload.replyTo).toBe("julie@exemple.fr");
    expect(payload.from).toBe('"Aide et contact PULSACITY" <notifications@envois.pulsacity.com>');
    expect(payload.subject).toBe("Relier Kajabi");
    expect(payload.text).toContain("julie@exemple.fr");
    expect(payload.text).toContain("Bonjour,");
    expect(payload.text).toContain("Kajabi arrive quand ?");
    expect(payload.text).toContain("Écrit sans être connecté à un espace.");
  });

  it("says from which space a signed-in creator writes", async () => {
    const userId = await insertTestUser(db(), "julie@exemple.fr");
    await insertTestSpace(db(), userId, "julie-nutrition", "essentiel");
    testContext.signedInUser = { id: userId, email: "julie@exemple.fr", name: "Julie" };

    expect(await submit()).toEqual({ ok: true, data: { email: "julie@exemple.fr" } });
    expect(sentPayload().text).toContain("Espace julie-nutrition, plan Essentiel. Écrit en étant connecté.");
  });

  it("keeps the subject on one line", async () => {
    await submit({ subject: "  Mon widget\r\nne s'affiche pas  " });

    expect(sentPayload().subject).toBe("Mon widget ne s'affiche pas");
  });

  it("refuses an incomplete form, every point at once, without sending", async () => {
    const result = await submit({ email: "julie@exemple", subject: "   ", message: "\n  \n" });

    expect(plain(result)).toEqual({
      ok: false,
      error: "invalid-input",
      fieldErrors: {
        email: "Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr.",
        subject: "Indiquez le sujet de votre message.",
        message: "Écrivez votre message.",
      },
    });
    expect(testContext.send).not.toHaveBeenCalled();
  });

  it("asks for the address when it is missing", async () => {
    const result = await submit({ email: " " });

    expect(plain(result)).toMatchObject({
      ok: false,
      fieldErrors: { email: "Indiquez votre adresse e-mail : c'est là que nous vous répondrons." },
    });
  });

  it("refuses a message too long to read", async () => {
    const result = await submit({ message: "a".repeat(5001) });

    expect(plain(result)).toMatchObject({
      ok: false,
      fieldErrors: { message: expect.stringMatching(/^Ce message dépasse 5\s000 caractères\./) },
    });
    expect(testContext.send).not.toHaveBeenCalled();
  });

  it("tells a robot that filled the hidden field it worked, and sends nothing", async () => {
    expect(await submit({ honeypot: "https://spam.example" })).toEqual({ ok: true, data: { email: "julie@exemple.fr" } });
    expect(testContext.send).not.toHaveBeenCalled();
  });

  it("stops a single IP after a few messages", async () => {
    for (let message = 0; message < CONTACT_MESSAGES_PER_IP.limit; message += 1) {
      expect(await submit()).toMatchObject({ ok: true });
    }

    expect(await submit()).toEqual({ ok: false, error: "too-many-requests" });
    expect(testContext.send).toHaveBeenCalledTimes(CONTACT_MESSAGES_PER_IP.limit);

    testContext.clientIp = "198.51.100.4";
    expect(await submit()).toMatchObject({ ok: true });
  });

  it("stops every visitor together once the messages of the day are sent", async () => {
    for (let message = 0; message < CONTACT_MESSAGES_PER_DAY.limit; message += 1) {
      testContext.clientIp = `198.51.100.${message}`;
      await submit();
    }

    testContext.clientIp = "192.0.2.1";
    expect(await submit()).toEqual({ ok: false, error: "not-sent" });
    expect(testContext.send).toHaveBeenCalledTimes(CONTACT_MESSAGES_PER_DAY.limit);
  });

  it("keeps the visitor on the page when the provider refuses the message", async () => {
    testContext.send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "Domain not verified" } });

    expect(await submit()).toEqual({ ok: false, error: "not-sent" });
  });

  it("keeps nothing of the message in the database, only the counters", async () => {
    await submit();

    for (const name of TABLE_NAMES) {
      const result = await db().execute(sql.raw(`select * from "${name}"`));
      const rows = JSON.stringify((result as unknown as { rows: unknown[] }).rows);
      expect(rows, name).not.toContain("Kajabi");
      expect(rows, name).not.toContain("julie@exemple.fr");
    }
    const [counters] = await db().select({ total: count() }).from(rateLimits);
    expect(counters.total).toBe(2);
  });
});
