import { eq } from "drizzle-orm";
import { type Mock, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { spaceAcquisitions, spaces } from "@/db/schema";
import { insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { buildLogoKey } from "@/lib/uploads/upload-keys";
import { createSpaceFromOnboarding } from "./create-space-from-onboarding";

type TestContext = {
  database: Database | null;
  signedInUser: { id: string; email: string };
  after: Mock;
};

const testContext = vi.hoisted((): TestContext => ({ database: null, signedInUser: { id: "", email: "" }, after: vi.fn() }));

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
vi.mock("next/server", () => ({ after: testContext.after }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new RedirectedError(path);
  },
}));

const submit = (fields: Record<string, string>) => {
  const formData = new FormData();
  for (const [name, value] of Object.entries({
    name: "Julie Nutrition",
    slug: "julie-nutrition",
    replyToEmail: "julie@exemple.fr",
    accentColor: "",
    logoKey: "",
    ...fields,
  })) {
    formData.set(name, value);
  }
  return createSpaceFromOnboarding(null, formData);
};

const findSpaceOf = async (userId: string) => {
  if (!testContext.database) return [];
  return testContext.database.select().from(spaces).where(eq(spaces.userId, userId));
};

beforeAll(async () => {
  testContext.database = await createTestDatabase();
});

beforeEach(async () => {
  if (!testContext.database) return;
  await emptyTestDatabase(testContext.database);
  const id = await insertTestUser(testContext.database, "julie@exemple.fr");
  testContext.signedInUser = { id, email: "julie@exemple.fr" };
  vi.stubEnv("R2_PUBLIC_URL", "https://photos.pulsacity.com");
});

describe("createSpaceFromOnboarding", () => {
  it("creates the space of the signed-in creator, then moves on to the formations", async () => {
    const logoKey = buildLogoKey(testContext.signedInUser.id, "image/png");

    await expect(submit({ logoKey, accentColor: "#a3243b" })).rejects.toThrow(
      new RedirectedError("/app/onboarding/formations"),
    );

    expect(await findSpaceOf(testContext.signedInUser.id)).toEqual([
      expect.objectContaining({
        name: "Julie Nutrition",
        accentColor: "#A3243B",
        logoUrl: `https://photos.pulsacity.com/${logoKey}`,
      }),
    ]);
  });

  it("sends the welcome e-mail J0 once the page has answered", async () => {
    testContext.after.mockClear();

    await expect(submit({})).rejects.toThrow(new RedirectedError("/app/onboarding/formations"));

    expect(testContext.after).toHaveBeenCalledTimes(1);
  });

  it("records the source of the sign-up sent back by the form, from the sign-in link to the space", async () => {
    await expect(submit({ utm_source: "youtube", utm_medium: "video", connu: "youtube" })).rejects.toThrow(
      new RedirectedError("/app/onboarding/formations"),
    );

    const [space] = await findSpaceOf(testContext.signedInUser.id);
    expect(await testContext.database?.select().from(spaceAcquisitions)).toEqual([
      expect.objectContaining({ spaceId: space.id, utmSource: "youtube", utmMedium: "video", heardFrom: "youtube" }),
    ]);
  });

  it("refuses a logo uploaded by someone else", async () => {
    const result = await submit({ logoKey: buildLogoKey("another-user", "image/png") });

    expect(result).toEqual({
      ok: false,
      error: "invalid-input",
      fieldErrors: { logoKey: "Le logo n'a pas été reçu. Choisissez-le à nouveau." },
    });
    expect(await findSpaceOf(testContext.signedInUser.id)).toEqual([]);
  });

  it("returns the errors to correct without creating anything", async () => {
    const result = await submit({ name: "", slug: "a" });

    expect(result).toMatchObject({ ok: false, error: "invalid-input", fieldErrors: { name: expect.any(String) } });
    expect(await findSpaceOf(testContext.signedInUser.id)).toEqual([]);
  });
});
