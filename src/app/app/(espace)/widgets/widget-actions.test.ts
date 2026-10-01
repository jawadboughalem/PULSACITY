import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { widgets } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { createWidgetFromList, saveWidget } from "./widget-actions";

type TestContext = {
  database: Database | null;
  signedInUser: { id: string; email: string };
};

const testContext = vi.hoisted((): TestContext => ({ database: null, signedInUser: { id: "", email: "" } }));

const { RedirectedError } = vi.hoisted(() => ({
  RedirectedError: class RedirectedError extends Error {
    constructor(path: string) {
      super(`redirect:${path}`);
      this.name = "RedirectedError";
    }
  },
}));

vi.mock("@/db", () => ({ getDb: () => testContext.database }));
vi.mock("@/lib/auth/require-signed-in-user", () => ({
  requireSignedInUser: async () => testContext.signedInUser,
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new RedirectedError(path);
  },
}));

const EDIT = {
  type: "badge",
  productId: null,
  theme: "light",
  accentColor: "#4f6f52",
  maxItems: 12,
  showPhoto: true,
  showRating: true,
  showDate: true,
  hidePoweredBy: false,
};

let julieSpaceId: string;
let marcSpaceId: string;

const db = () => {
  if (!testContext.database) throw new Error("The test database is not ready.");
  return testContext.database;
};

const insertWidget = async (spaceId: string) => {
  const [widget] = await db().insert(widgets).values({ spaceId, type: "wall" }).returning({ id: widgets.id });
  return widget.id;
};

const readWidget = async (widgetId: string) => {
  const [widget] = await db().select().from(widgets).where(eq(widgets.id, widgetId));
  return widget;
};

beforeAll(async () => {
  testContext.database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(db());
  const julieId = await insertTestUser(db(), "julie@exemple.fr");
  testContext.signedInUser = { id: julieId, email: "julie@exemple.fr" };
  julieSpaceId = await insertTestSpace(db(), julieId, "julie-nutrition");
  marcSpaceId = await insertTestSpace(db(), await insertTestUser(db(), "marc@exemple.fr"), "marc-coaching");
});

describe("saveWidget", () => {
  it("saves the settings of one's own widget, the accent color written in capitals", async () => {
    const widgetId = await insertWidget(julieSpaceId);

    expect(await saveWidget(widgetId, EDIT)).toEqual({ ok: true, data: null });
    expect(await readWidget(widgetId)).toMatchObject({ type: "badge", settings: { theme: "light", accentColor: "#4F6F52" } });
  });

  it("refuses settings out of bounds, and leaves the widget as it was", async () => {
    const widgetId = await insertWidget(julieSpaceId);

    for (const edit of [
      { ...EDIT, maxItems: 0 },
      { ...EDIT, maxItems: 51 },
      { ...EDIT, accentColor: "red" },
      { ...EDIT, type: "slider" },
      { ...EDIT, productId: "pas-une-offre" },
      null,
    ]) {
      expect(await saveWidget(widgetId, edit)).toEqual({ ok: false, error: "invalid-settings" });
    }
    expect(await readWidget(widgetId)).toMatchObject({ type: "wall", settings: {} });
  });

  it("changes nothing on the widget of another creator", async () => {
    const marcWidget = await insertWidget(marcSpaceId);

    expect(await saveWidget(marcWidget, EDIT)).toEqual({ ok: false, error: "widget-not-found" });
    expect(await saveWidget("pas-un-widget", EDIT)).toEqual({ ok: false, error: "widget-not-found" });
    expect(await readWidget(marcWidget)).toMatchObject({ type: "wall", settings: {} });
  });
});

describe("createWidgetFromList", () => {
  it("opens the editor of the new widget", async () => {
    await expect(createWidgetFromList()).rejects.toThrow(/^redirect:\/app\/widgets\/[0-9a-f-]{36}$/);
    expect(await db().select().from(widgets).where(eq(widgets.spaceId, julieSpaceId))).toHaveLength(1);
  });

  it("proposes the next plan instead of a second widget on the free plan", async () => {
    await insertWidget(julieSpaceId);

    expect(await createWidgetFromList()).toEqual({ ok: false, error: "plan-limit" });
  });
});
