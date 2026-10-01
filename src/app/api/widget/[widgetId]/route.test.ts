import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { type WidgetSettings, products, spaces, widgets } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { GET, OPTIONS } from "./route";

type TestContext = {
  database: Database | null;
  scheduled: Array<() => Promise<void>>;
};

const testContext = vi.hoisted((): TestContext => ({ database: null, scheduled: [] }));

vi.mock("@/db", () => ({ getDb: () => testContext.database }));
vi.mock("next/server", () => ({ after: (task: () => Promise<void>) => testContext.scheduled.push(task) }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const APP_URL = "https://pulsacity.com";
const CREATOR_PAGE = "https://julie-nutrition.systeme.io";

let database: Database;
let spaceId: string;
let programmeId: string;
let suiviId: string;

const db = () => {
  if (!testContext.database) throw new Error("The test database is not ready.");
  return testContext.database;
};

const insertWidget = async (
  values: Partial<typeof widgets.$inferInsert> & { settings?: WidgetSettings } = {},
): Promise<string> => {
  const [widget] = await db()
    .insert(widgets)
    .values({ spaceId, type: "wall", ...values })
    .returning({ id: widgets.id });
  return widget.id;
};

const fetchWidget = (widgetId: string, options: { offset?: string; origin?: string } = {}) => {
  const query = options.offset === undefined ? "" : `?offset=${options.offset}`;
  const request = new Request(`${APP_URL}/api/widget/${widgetId}${query}`, {
    headers: options.origin ? { origin: options.origin } : {},
  });
  return GET(request, { params: Promise.resolve({ widgetId }) });
};

const daysAgo = (days: number) => new Date(Date.parse("2026-09-30T10:00:00Z") - days * 24 * 60 * 60 * 1000);

beforeAll(async () => {
  testContext.database = await createTestDatabase();
  database = testContext.database;
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  testContext.scheduled = [];
  vi.stubEnv("NEXT_PUBLIC_APP_URL", APP_URL);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  await database.update(spaces).set({ referralCode: "julie42" }).where(eq(spaces.id, spaceId));
  const [programme, suivi] = await database
    .insert(products)
    .values([
      { spaceId, name: "Programme 30 jours", slug: "programme-30-jours" },
      { spaceId, name: "Suivi individuel 3 mois", slug: "suivi-individuel-3-mois" },
    ])
    .returning({ id: products.id });
  programmeId = programme.id;
  suiviId = suivi.id;
});

describe("GET /api/widget/[widgetId]", () => {
  it("serves the validated testimonials, featured first then the most recent, readable from any page and cached at the edge", async () => {
    await insertTestTestimonial(database, { spaceId, authorName: "Thomas L.", status: "approved", createdAt: daysAgo(27) });
    await insertTestTestimonial(database, { spaceId, authorName: "Nadia B.", status: "approved", createdAt: daysAgo(4) });
    await insertTestTestimonial(database, {
      spaceId,
      authorName: "Camille R.",
      status: "approved",
      featured: true,
      createdAt: daysAgo(18),
    });
    await insertTestTestimonial(database, { spaceId, authorName: "Sophie D.", status: "pending", createdAt: daysAgo(1) });
    await insertTestTestimonial(database, { spaceId, authorName: "Arthur B.", status: "hidden", createdAt: daysAgo(2) });
    const widgetId = await insertWidget();

    const response = await fetchWidget(widgetId);

    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("cache-control")).toBe("public, max-age=0, s-maxage=60, stale-while-revalidate=86400");
    const payload = await response.json();
    expect(payload.testimonials.map((testimonial: { name: string }) => testimonial.name)).toEqual([
      "Camille R.",
      "Nadia B.",
      "Thomas L.",
    ]);
    expect(payload).toMatchObject({ v: 1, type: "wall", theme: "auto", cardStyle: "sharp", total: 3, next: null });
  });

  it("averages and counts every validated testimonial, beyond those it shows", async () => {
    for (const [index, rating] of [5, 5, 4, 5, 3].entries()) {
      await insertTestTestimonial(database, { spaceId, rating, status: "approved", createdAt: daysAgo(index) });
    }
    const widgetId = await insertWidget({ settings: { maxItems: 2 } });

    const payload = await (await fetchWidget(widgetId)).json();

    expect(payload.testimonials).toHaveLength(2);
    expect(payload.total).toBe(5);
    expect(payload.average).toBeCloseTo(4.4);
    expect(payload.next).toBe(2);
  });

  it("keeps the testimonials of the widget's offer only", async () => {
    await insertTestTestimonial(database, { spaceId, authorName: "Camille R.", status: "approved", productId: programmeId });
    await insertTestTestimonial(database, { spaceId, authorName: "Nadia B.", status: "approved", productId: suiviId });
    await insertTestTestimonial(database, { spaceId, authorName: "Hugo P.", status: "approved", productId: null });
    const widgetId = await insertWidget({ productId: suiviId });

    const payload = await (await fetchWidget(widgetId)).json();

    expect(payload.testimonials.map((testimonial: { name: string }) => testimonial.name)).toEqual(["Nadia B."]);
    expect(payload.total).toBe(1);
  });

  it("holds only what a card displays, with the edited text and the day of reception in Paris", async () => {
    await insertTestTestimonial(database, {
      spaceId,
      authorName: "Camille R.",
      authorTitle: "Enseignante",
      authorPhotoUrl: "https://photos.exemple.fr/camille.jpg",
      rating: 4,
      body: "Texte original.",
      displayBody: "Texte affiché.",
      status: "approved",
      consentText: "J'accepte que ce témoignage soit publié.",
      createdAt: new Date("2026-09-11T22:30:00Z"),
    });
    const widgetId = await insertWidget();

    const payload = await (await fetchWidget(widgetId)).json();

    expect(payload.testimonials).toEqual([
      {
        name: "Camille R.",
        initials: "CR",
        title: "Enseignante",
        photo: "https://photos.exemple.fr/camille.jpg",
        rating: 4,
        text: "Texte affiché.",
        date: "2026-09-12",
      },
    ]);
  });

  it("leaves out the photos, ratings and dates the widget hides", async () => {
    await insertTestTestimonial(database, {
      spaceId,
      authorPhotoUrl: "https://photos.exemple.fr/camille.jpg",
      status: "approved",
    });
    const widgetId = await insertWidget({ settings: { showPhoto: false, showRating: false, showDate: false } });

    const payload = await (await fetchWidget(widgetId)).json();

    expect(payload.testimonials[0]).toMatchObject({ photo: null, rating: null, date: null });
    expect(payload.average).toBeNull();
  });

  it("gives a badge three faces, never a name nor a text", async () => {
    for (const [index, authorName] of ["Camille R.", "Thomas L.", "Sophie D.", "Nadia B."].entries()) {
      await insertTestTestimonial(database, { spaceId, authorName, status: "approved", createdAt: daysAgo(index) });
    }
    const widgetId = await insertWidget({ type: "badge" });

    const payload = await (await fetchWidget(widgetId)).json();

    expect(payload.avatars).toEqual([
      { initials: "CR", photo: null },
      { initials: "TL", photo: null },
      { initials: "SD", photo: null },
    ]);
    expect(payload.testimonials).toEqual([]);
    expect(payload.total).toBe(4);
    expect(JSON.stringify(payload)).not.toContain("Camille");
  });

  it("brings the next testimonials of a wall from an offset", async () => {
    for (const index of [0, 1, 2, 3, 4]) {
      await insertTestTestimonial(database, { spaceId, authorName: `Client ${index}`, status: "approved", createdAt: daysAgo(index) });
    }
    const widgetId = await insertWidget({ settings: { maxItems: 2 } });

    const payload = await (await fetchWidget(widgetId, { offset: "2" })).json();

    expect(payload.testimonials.map((testimonial: { name: string }) => testimonial.name)).toEqual([
      "Client 2",
      "Client 3",
      "Client 4",
    ]);
    expect(payload.next).toBeNull();
  });

  it("keeps « Propulsé par PULSACITY » with the referral link, except on a Pro space that removed it", async () => {
    const widgetId = await insertWidget({ settings: { hidePoweredBy: true } });

    expect((await (await fetchWidget(widgetId)).json()).poweredBy).toBe("https://pulsacity.com/?ref=julie42");

    await database.update(spaces).set({ plan: "essentiel" }).where(eq(spaces.id, spaceId));
    expect((await (await fetchWidget(widgetId)).json()).poweredBy).toBe("https://pulsacity.com/?ref=julie42");

    await database.update(spaces).set({ plan: "pro" }).where(eq(spaces.id, spaceId));
    expect((await (await fetchWidget(widgetId)).json()).poweredBy).toBeNull();
  });

  it("colours the widget with its own accent, else with the space's, else lets the page decide", async () => {
    const widgetId = await insertWidget();
    expect((await (await fetchWidget(widgetId)).json()).accentColor).toBeNull();

    await database.update(spaces).set({ accentColor: "#4F6F52" }).where(eq(spaces.id, spaceId));
    expect((await (await fetchWidget(widgetId)).json()).accentColor).toBe("#4F6F52");

    await database.update(widgets).set({ settings: { accentColor: "#a3243b" } }).where(eq(widgets.id, widgetId));
    expect((await (await fetchWidget(widgetId)).json()).accentColor).toBe("#A3243B");
  });

  it("answers an unknown or malformed widget with a readable 404", async () => {
    for (const widgetId of ["0f8d1c2e", "7c9e6679-7425-40de-944b-e07fc1f90ae7"]) {
      const response = await fetchWidget(widgetId);
      expect(response.status).toBe(404);
      expect(response.headers.get("access-control-allow-origin")).toBe("*");
      expect(await response.json()).toEqual({ error: "not-found" });
    }
  });

  it("refuses an offset that is not a whole number", async () => {
    const widgetId = await insertWidget();

    for (const offset of ["-1", "1.5", "deux", "99999"]) {
      expect((await fetchWidget(widgetId, { offset })).status).toBe(400);
    }
  });

  it("records the first display on a pasted page, once, and never for PULSACITY itself", async () => {
    const widgetId = await insertWidget();
    const readFirstLoadedAt = async () =>
      (await database.select({ firstLoadedAt: widgets.firstLoadedAt }).from(widgets).where(eq(widgets.id, widgetId)))[0]
        .firstLoadedAt;

    await fetchWidget(widgetId);
    await fetchWidget(widgetId, { origin: APP_URL });
    await fetchWidget(widgetId, { origin: "null" });
    expect(testContext.scheduled).toHaveLength(0);

    await fetchWidget(widgetId, { origin: CREATOR_PAGE });
    expect(testContext.scheduled).toHaveLength(1);
    await testContext.scheduled[0]();
    expect(await readFirstLoadedAt()).toBeInstanceOf(Date);

    await fetchWidget(widgetId, { origin: CREATOR_PAGE });
    expect(testContext.scheduled).toHaveLength(1);
  });
});

describe("OPTIONS /api/widget/[widgetId]", () => {
  it("lets any page read the widget", () => {
    const response = OPTIONS();

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
  });
});
