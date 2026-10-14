import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { buildLogoKey } from "@/lib/uploads/upload-keys";
import { previewRequestEmail, saveSpaceSettings } from "./settings-actions";

type TestContext = {
  database: Database | null;
  signedInUser: { id: string; email: string; name: string } | null;
};

const testContext = vi.hoisted((): TestContext => ({ database: null, signedInUser: null }));

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
  requireSignedInUser: async () => {
    if (!testContext.signedInUser) throw new RedirectedError("/connexion");
    return testContext.signedInUser;
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const db = () => {
  if (!testContext.database) throw new Error("The test database is not ready.");
  return testContext.database;
};

let julieId: string;
let marcId: string;

const buildForm = (fields: Record<string, string> = {}) => {
  const formData = new FormData();
  const values = {
    name: "Julie Nutrition",
    slug: "julie-nutrition",
    accentColor: "4f6f52",
    replyToEmail: "Julie@Exemple.fr",
    senderPostalAddress: "  Julie Martin \r\n\r\n12 rue des Lilas\n69003   Lyon ",
    newTestimonialEmailEnabled: "false",
    offersIncentive: "true",
    logoKey: "",
    removeLogo: "false",
    ...fields,
  };
  for (const [name, value] of Object.entries(values)) formData.set(name, value);
  return formData;
};

beforeAll(async () => {
  testContext.database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(db());
  julieId = await insertTestUser(db(), "julie@exemple.fr");
  await insertTestSpace(db(), julieId, "julie-nutrition");
  marcId = await insertTestUser(db(), "marc@exemple.fr");
  await insertTestSpace(db(), marcId, "marc-coaching");
  testContext.signedInUser = { id: julieId, email: "julie@exemple.fr", name: "" };
  vi.stubEnv("R2_PUBLIC_URL", "https://photos.pulsacity.com");
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

describe("saveSpaceSettings", () => {
  it("saves what the creator typed, cleaned, on their own space", async () => {
    const result = await saveSpaceSettings(null, buildForm());

    expect(result).toMatchObject({ ok: true });
    expect(await findOwnedSpace(db(), julieId)).toMatchObject({
      name: "Julie Nutrition",
      accentColor: "#4F6F52",
      replyToEmail: "julie@exemple.fr",
      senderPostalAddress: "Julie Martin\n12 rue des Lilas\n69003 Lyon",
      newTestimonialEmailEnabled: false,
    });
    expect((await findOwnedSpace(db(), julieId))?.incentiveDeclaredAt).toBeInstanceOf(Date);
    expect(await findOwnedSpace(db(), marcId)).toMatchObject({ name: "Espace marc-coaching", accentColor: null });
  });

  it("names every point to correct at once, the taken address included", async () => {
    const result = await saveSpaceSettings(
      null,
      buildForm({ name: "", slug: "marc-coaching", replyToEmail: "julie@exemple", accentColor: "vert" }),
    );

    expect(result).toEqual({
      ok: false,
      error: "invalid-input",
      fieldErrors: {
        name: "Indiquez le nom de votre activité.",
        accentColor: "Écrivez la couleur avec # et six caractères, par exemple #4F6F52, ou choisissez-la dans le carré.",
        slug: "Cette adresse est déjà prise par un autre espace.",
        replyToEmail: "Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr.",
      },
      suggestedSlug: "marc-coaching-2",
    });
    expect(await findOwnedSpace(db(), julieId)).toMatchObject({ name: "Espace julie-nutrition", slug: "julie-nutrition" });
  });

  it("takes a logo sent by the creator, and refuses one sent by someone else", async () => {
    const ownKey = buildLogoKey(julieId, "image/png");
    expect(await saveSpaceSettings(null, buildForm({ logoKey: ownKey }))).toMatchObject({ ok: true });
    expect((await findOwnedSpace(db(), julieId))?.logoUrl).toBe(`https://photos.pulsacity.com/${ownKey}`);

    expect(await saveSpaceSettings(null, buildForm({ logoKey: buildLogoKey(marcId, "image/png") }))).toMatchObject({
      ok: false,
      fieldErrors: { logoKey: "Le logo n'a pas été reçu. Choisissez-le à nouveau." },
    });
    expect(await saveSpaceSettings(null, buildForm({ removeLogo: "true" }))).toMatchObject({ ok: true });
    expect((await findOwnedSpace(db(), julieId))?.logoUrl).toBeNull();
  });

  it("asks to sign in first", async () => {
    testContext.signedInUser = null;
    await expect(saveSpaceSettings(null, buildForm())).rejects.toThrow("redirect:/connexion");
  });
});

describe("previewRequestEmail", () => {
  it("draws the request e-mail with the name and address being typed", async () => {
    const result = await previewRequestEmail({
      spaceName: "Julie Nutrition Lyon",
      logoKey: "",
      removeLogo: false,
      senderPostalAddress: "Julie Martin\n69003 Lyon",
    });

    expect(result).toMatchObject({
      ok: true,
      data: { sender: "Julie Nutrition Lyon via PULSACITY", subject: "Camille, votre avis sur Programme 30 jours ?" },
    });
    expect(result.ok && result.data.html).toContain("Julie Martin · 69003 Lyon");
  });
});
