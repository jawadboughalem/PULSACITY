import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { products, spaces, widgets } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { createWidget, findOwnedWidget, listSpaceWidgets, updateWidget } from "./space-widgets";
import type { WidgetEdit } from "./widget-settings";

let database: Database;
let julieId: string;
let julieSpaceId: string;
let programmeId: string;
let marcId: string;
let marcSpaceId: string;

const EDIT: WidgetEdit = {
  type: "carousel",
  productId: null,
  theme: "dark",
  accentColor: "#4F6F52",
  maxItems: 8,
  showPhoto: false,
  showRating: true,
  showDate: false,
  hidePoweredBy: false,
};

const insertWidget = async (values: Partial<typeof widgets.$inferInsert> & { spaceId: string }) => {
  const [widget] = await database
    .insert(widgets)
    .values({ type: "wall", ...values })
    .returning({ id: widgets.id });
  return widget.id;
};

const readWidget = async (widgetId: string) => {
  const [widget] = await database.select().from(widgets).where(eq(widgets.id, widgetId));
  return widget;
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  julieId = await insertTestUser(database, "julie@exemple.fr");
  julieSpaceId = await insertTestSpace(database, julieId, "julie-nutrition");
  marcId = await insertTestUser(database, "marc@exemple.fr");
  marcSpaceId = await insertTestSpace(database, marcId, "marc-coaching");
  const [programme] = await database
    .insert(products)
    .values({ spaceId: julieSpaceId, name: "Programme 30 jours", slug: "programme-30-jours" })
    .returning({ id: products.id });
  programmeId = programme.id;
});

describe("listSpaceWidgets", () => {
  it("lists the widgets of the space, oldest first, with the name of their offer", async () => {
    const wall = await insertWidget({ spaceId: julieSpaceId, createdAt: new Date("2026-09-01T10:00:00Z") });
    const badge = await insertWidget({
      spaceId: julieSpaceId,
      type: "badge",
      productId: programmeId,
      firstLoadedAt: new Date("2026-09-20T10:00:00Z"),
      createdAt: new Date("2026-09-10T10:00:00Z"),
    });
    await insertWidget({ spaceId: marcSpaceId });

    expect(await listSpaceWidgets(database, julieSpaceId)).toEqual([
      { id: wall, type: "wall", productId: null, productName: null, firstLoadedAt: null },
      {
        id: badge,
        type: "badge",
        productId: programmeId,
        productName: "Programme 30 jours",
        firstLoadedAt: new Date("2026-09-20T10:00:00Z"),
      },
    ]);
  });
});

describe("findOwnedWidget", () => {
  it("finds a widget only for the creator of its space", async () => {
    const widgetId = await insertWidget({ spaceId: julieSpaceId });

    expect(await findOwnedWidget(database, julieId, widgetId)).toMatchObject({ id: widgetId, spaceId: julieSpaceId });
    expect(await findOwnedWidget(database, marcId, widgetId)).toBeNull();
  });
});

describe("createWidget", () => {
  it("starts a wall of every offer when the plan allows one more widget", async () => {
    await database.update(spaces).set({ plan: "essentiel" }).where(eq(spaces.id, julieSpaceId));
    await insertWidget({ spaceId: julieSpaceId });

    const result = await createWidget(database, julieId);

    expect(result.status).toBe("created");
    if (result.status !== "created") return;
    expect(await readWidget(result.widgetId)).toMatchObject({
      spaceId: julieSpaceId,
      type: "wall",
      productId: null,
      settings: {},
    });
  });

  it("keeps the free plan to one widget, and two clicks make a single widget", async () => {
    const results = await Promise.all([createWidget(database, julieId), createWidget(database, julieId)]);

    expect(results.map((result) => result.status).sort()).toEqual(["created", "plan-limit"]);
    expect(await listSpaceWidgets(database, julieSpaceId)).toHaveLength(1);
  });

  it("creates nothing for a creator without a space", async () => {
    const lonelyId = await insertTestUser(database, "sans-espace@exemple.fr");

    expect(await createWidget(database, lonelyId)).toEqual({ status: "space-not-found" });
  });
});

describe("updateWidget", () => {
  it("saves the type, the offer and the settings, and keeps those the editor does not show", async () => {
    const widgetId = await insertWidget({ spaceId: julieSpaceId, settings: { cardStyle: "soft" } });

    expect(await updateWidget(database, julieId, widgetId, { ...EDIT, productId: programmeId })).toEqual({
      status: "updated",
    });
    expect(await readWidget(widgetId)).toMatchObject({
      type: "carousel",
      productId: programmeId,
      settings: {
        cardStyle: "soft",
        theme: "dark",
        accentColor: "#4F6F52",
        maxItems: 8,
        showPhoto: false,
        showRating: true,
        showDate: false,
        hidePoweredBy: false,
      },
    });
  });

  it("hides « Propulsé par PULSACITY » on the Pro plan only", async () => {
    const widgetId = await insertWidget({ spaceId: julieSpaceId });

    for (const plan of ["free", "essentiel"] as const) {
      await database.update(spaces).set({ plan }).where(eq(spaces.id, julieSpaceId));
      await updateWidget(database, julieId, widgetId, { ...EDIT, hidePoweredBy: true });
      expect((await readWidget(widgetId)).settings.hidePoweredBy).toBe(false);
    }
    await database.update(spaces).set({ plan: "pro" }).where(eq(spaces.id, julieSpaceId));
    await updateWidget(database, julieId, widgetId, { ...EDIT, hidePoweredBy: true });
    expect((await readWidget(widgetId)).settings.hidePoweredBy).toBe(true);
  });

  it("refuses the offer of another space, and the widget of another creator", async () => {
    const julieWidget = await insertWidget({ spaceId: julieSpaceId });
    const [marcOffer] = await database
      .insert(products)
      .values({ spaceId: marcSpaceId, name: "Coaching", slug: "coaching" })
      .returning({ id: products.id });

    expect(await updateWidget(database, julieId, julieWidget, { ...EDIT, productId: marcOffer.id })).toEqual({
      status: "offer-not-found",
    });
    expect(await updateWidget(database, marcId, julieWidget, EDIT)).toEqual({ status: "widget-not-found" });
    expect(await readWidget(julieWidget)).toMatchObject({ type: "wall", productId: null, settings: {} });
  });
});
