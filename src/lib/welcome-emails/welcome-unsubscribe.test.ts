import { eq } from "drizzle-orm";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { signUnsubscribeToken } from "@/lib/requests/unsubscribe-token";
import {
  buildWelcomeUnsubscribeUrl,
  readWelcomeUnsubscribeToken,
  signWelcomeUnsubscribeToken,
  unsubscribeFromWelcomeEmails,
} from "./welcome-unsubscribe";

let database: Database;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  vi.stubEnv("BETTER_AUTH_SECRET", "a-test-secret-of-at-least-32-characters");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("welcome e-mails' way out", () => {
  it("signs the space in its link, and refuses a token signed for something else", async () => {
    const spaceId = await insertTestSpace(database, await insertTestUser(database, "julie@exemple.fr"), "julie-nutrition");

    expect(readWelcomeUnsubscribeToken(signWelcomeUnsubscribeToken(spaceId))).toBe(spaceId);
    expect(readWelcomeUnsubscribeToken(signUnsubscribeToken(spaceId))).toBeNull();
    expect(readWelcomeUnsubscribeToken(`${spaceId}.forged`)).toBeNull();
    expect(buildWelcomeUnsubscribeUrl("https://pulsacity.com", spaceId)).toMatch(
      /^https:\/\/pulsacity\.com\/api\/unsubscribe\/accueil\?token=/,
    );
  });

  it("stops the welcome e-mails once, the first date kept", async () => {
    const spaceId = await insertTestSpace(database, await insertTestUser(database, "julie@exemple.fr"), "julie-nutrition");
    const first = new Date("2026-10-13T09:00:00Z");

    expect(await unsubscribeFromWelcomeEmails(database, spaceId, first)).toBe(true);
    expect(await unsubscribeFromWelcomeEmails(database, spaceId, new Date("2026-10-14T09:00:00Z"))).toBe(true);

    const [space] = await database.select().from(spaces).where(eq(spaces.id, spaceId));
    expect(space.welcomeEmailsUnsubscribedAt).toEqual(first);
  });

  it("answers no for a space that no longer exists", async () => {
    expect(await unsubscribeFromWelcomeEmails(database, "6f1d1c1e-2b9a-4a8e-9a49-2f8f6f0d4e11")).toBe(false);
  });
});
