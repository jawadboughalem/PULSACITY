import { eq } from "drizzle-orm";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { spaces, widgets } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { readPulsacityShowcase } from "./read-pulsacity-showcase";

vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

let database: Database;
let spaceId: string;

const approve = async (count: number) => {
  for (let index = 0; index < count; index += 1) {
    await insertTestTestimonial(database, { spaceId, authorName: `Créateur ${index}`, status: "approved" });
  }
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  spaceId = await insertTestSpace(database, await insertTestUser(database, "fondateur@exemple.fr"), "pulsacity", "pro");
  vi.stubEnv("PULSACITY_SPACE_ID", spaceId);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("readPulsacityShowcase", () => {
  it("shows nothing on pulsacity.com before five real testimonials are validated", async () => {
    await database.insert(widgets).values([{ spaceId, type: "wall" }, { spaceId, type: "badge" }]);
    await approve(4);
    await insertTestTestimonial(database, { spaceId, status: "pending" });

    expect(await readPulsacityShowcase(database)).toEqual({ wallWidgetId: null, badgeWidgetId: null });
  });

  it("shows the space's wall on the home page and its badge on Tarifs from the fifth one", async () => {
    const [wall, badge] = await database
      .insert(widgets)
      .values([{ spaceId, type: "wall" }, { spaceId, type: "badge" }])
      .returning({ id: widgets.id });
    await approve(5);

    expect(await readPulsacityShowcase(database)).toEqual({ wallWidgetId: wall.id, badgeWidgetId: badge.id });
  });

  it("leaves out a widget the plan pauses, as it would answer like an unknown one", async () => {
    await database.update(spaces).set({ plan: "free" }).where(eq(spaces.id, spaceId));
    const [wall] = await database
      .insert(widgets)
      .values([{ spaceId, type: "wall" }])
      .returning({ id: widgets.id });
    await database.insert(widgets).values({ spaceId, type: "badge", createdAt: new Date(Date.now() + 1000) });
    await approve(5);

    expect(await readPulsacityShowcase(database)).toEqual({ wallWidgetId: wall.id, badgeWidgetId: null });
  });

  it("shows nothing in an environment without PULSACITY's space", async () => {
    await database.insert(widgets).values({ spaceId, type: "wall" });
    await approve(5);
    vi.stubEnv("PULSACITY_SPACE_ID", "");

    expect(await readPulsacityShowcase(database)).toEqual({ wallWidgetId: null, badgeWidgetId: null });
  });
});
