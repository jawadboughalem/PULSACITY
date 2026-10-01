import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { widgets } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import type { AccountEmail } from "@/lib/email/send-email";
import { sendWidgetCodeByEmail } from "./widget-code-actions";

type TestContext = {
  database: Database | null;
  signedInUser: { id: string; email: string };
  sent: AccountEmail[];
};

const testContext = vi.hoisted((): TestContext => ({ database: null, signedInUser: { id: "", email: "" }, sent: [] }));

vi.mock("@/db", () => ({ getDb: () => testContext.database }));
vi.mock("@/lib/auth/require-signed-in-user", () => ({
  requireSignedInUser: async () => testContext.signedInUser,
}));
vi.mock("@/lib/email/send-email", () => ({
  sendAccountEmail: async (email: AccountEmail) => {
    testContext.sent.push(email);
  },
}));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

let julieSpaceId: string;
let marcSpaceId: string;

const db = () => {
  if (!testContext.database) throw new Error("The test database is not ready.");
  return testContext.database;
};

const insertWidget = async (spaceId: string, createdAt: Date) => {
  const [widget] = await db().insert(widgets).values({ spaceId, type: "wall", createdAt }).returning({ id: widgets.id });
  return widget.id;
};

const sentSnippet = () => {
  const props = testContext.sent.at(-1)?.body.props as { snippet: string } | undefined;
  return props?.snippet ?? null;
};

beforeAll(async () => {
  testContext.database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(db());
  testContext.sent = [];
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
  const julieId = await insertTestUser(db(), "julie@exemple.fr");
  testContext.signedInUser = { id: julieId, email: "julie@exemple.fr" };
  julieSpaceId = await insertTestSpace(db(), julieId, "julie-nutrition");
  marcSpaceId = await insertTestSpace(db(), await insertTestUser(db(), "marc@exemple.fr"), "marc-coaching");
});

describe("sendWidgetCodeByEmail", () => {
  it("sends the code of the widget being edited", async () => {
    await insertWidget(julieSpaceId, new Date("2026-09-01T10:00:00Z"));
    const badge = await insertWidget(julieSpaceId, new Date("2026-09-10T10:00:00Z"));

    expect(await sendWidgetCodeByEmail(badge)).toEqual({ ok: true, data: { email: "julie@exemple.fr" } });
    expect(sentSnippet()).toBe(
      `<div data-pulsacity-widget="${badge}"></div><script async src="https://pulsacity.com/w.js"></script>`,
    );
  });

  it("sends the first widget of the space from its home, where no widget is chosen", async () => {
    const first = await insertWidget(julieSpaceId, new Date("2026-09-01T10:00:00Z"));
    await insertWidget(julieSpaceId, new Date("2026-09-10T10:00:00Z"));

    expect(await sendWidgetCodeByEmail()).toMatchObject({ ok: true });
    expect(sentSnippet()).toContain(`data-pulsacity-widget="${first}"`);
  });

  it("sends nothing for the widget of another creator, or for an address that is no widget", async () => {
    const marcWidget = await insertWidget(marcSpaceId, new Date("2026-09-01T10:00:00Z"));

    expect(await sendWidgetCodeByEmail(marcWidget)).toEqual({ ok: false, error: "widget-not-found" });
    expect(await sendWidgetCodeByEmail("pas-un-widget")).toEqual({ ok: false, error: "widget-not-found" });
    expect(testContext.sent).toEqual([]);
  });
});
