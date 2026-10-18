import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { buildBadgeReferralUrl, buildReferralLink, resolveReferralLink } from "./referral-links";

let database: Database;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
});

describe("referral links", () => {
  it("names the space by the address of its page de collecte", () => {
    expect(buildReferralLink("https://pulsacity.com", "julie-nutrition")).toBe("https://pulsacity.com/p/julie-nutrition");
  });

  it("leads a referral link to the home page with the space's referral code", async () => {
    const spaceId = await insertTestSpace(database, await insertTestUser(database, "julie@exemple.fr"), "julie-nutrition");
    await database.update(spaces).set({ referralCode: "k7m2xq9p" }).where(eq(spaces.id, spaceId));

    expect(await resolveReferralLink(database, "Julie-Nutrition")).toBe(
      "/?utm_source=parrainage&utm_medium=lien&ref=k7m2xq9p",
    );
  });

  it("leads an unknown referral link to the home page alone", async () => {
    expect(await resolveReferralLink(database, "personne")).toBe("/");
  });

  it("tells a badge « Propulsé par » from a referral link, on the widget and on the page de collecte", () => {
    expect(buildBadgeReferralUrl("https://pulsacity.com", "k7m2xq9p", "widget")).toBe(
      "https://pulsacity.com/?utm_source=badge&utm_medium=widget&ref=k7m2xq9p",
    );
    expect(buildBadgeReferralUrl("https://pulsacity.com", "k7m2xq9p", "collecte")).toBe(
      "https://pulsacity.com/?utm_source=badge&utm_medium=collecte&ref=k7m2xq9p",
    );
  });
});
