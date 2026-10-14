import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { fillTestSpace } from "@/db/full-space-fixtures";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { deleteMySpace, requestLoginEmailChange, saveFirstName, signOutOtherDevices } from "./account-actions";

type TestContext = {
  database: Database | null;
  signedInUser: { id: string; email: string; name: string } | null;
  scheduled: (() => Promise<void>)[];
};

const testContext = vi.hoisted((): TestContext => ({ database: null, signedInUser: null, scheduled: [] }));

const { RedirectedError, auth, deleteUploadedFolder } = vi.hoisted(() => ({
  RedirectedError: class RedirectedError extends Error {
    constructor(path: string) {
      super(`redirect:${path}`);
      this.name = "RedirectedError";
    }
  },
  auth: {
    changeEmail: vi.fn(),
    updateUser: vi.fn(),
    revokeOtherSessions: vi.fn(),
    signOut: vi.fn(),
  },
  deleteUploadedFolder: vi.fn(),
}));

vi.mock("@/db", () => ({ getDb: () => testContext.database }));
vi.mock("@/lib/auth/require-signed-in-user", () => ({
  requireSignedInUser: async () => {
    if (!testContext.signedInUser) throw new RedirectedError("/connexion");
    return testContext.signedInUser;
  },
}));
vi.mock("@/lib/auth/get-auth", () => ({ getAuth: () => ({ api: auth }) }));
vi.mock("@/lib/uploads/delete-uploaded-folder", () => ({ deleteUploadedFolder }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ cookie: "session=julie" }) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/server", () => ({ after: (work: () => Promise<void>) => testContext.scheduled.push(work) }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new RedirectedError(path);
  },
}));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const db = () => {
  if (!testContext.database) throw new Error("The test database is not ready.");
  return testContext.database;
};

let julieId: string;
let julieSpaceId: string;
let marcId: string;

beforeAll(async () => {
  testContext.database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(db());
  julieId = await insertTestUser(db(), "julie@exemple.fr");
  julieSpaceId = await insertTestSpace(db(), julieId, "julie-nutrition");
  marcId = await insertTestUser(db(), "marc@exemple.fr");
  const marcSpaceId = await insertTestSpace(db(), marcId, "marc-coaching");
  await fillTestSpace(db(), marcId, marcSpaceId, "marc");
  testContext.signedInUser = { id: julieId, email: "julie@exemple.fr", name: "" };
  testContext.scheduled = [];
  for (const mock of [...Object.values(auth), deleteUploadedFolder]) mock.mockReset();
});

describe("requestLoginEmailChange", () => {
  it("asks Better Auth for a link to the new address, back to Mon compte", async () => {
    expect(await requestLoginEmailChange(" Julie.Martin@Exemple.fr ")).toEqual({
      ok: true,
      data: { email: "julie.martin@exemple.fr" },
    });
    expect(auth.changeEmail).toHaveBeenCalledWith({
      body: { newEmail: "julie.martin@exemple.fr", callbackURL: "/app/compte?adresse=1" },
      headers: expect.any(Headers),
    });
  });

  it("refuses an incomplete address, the same address, and too many links", async () => {
    expect(await requestLoginEmailChange("julie.martin@exemple")).toEqual({ ok: false, error: "invalid-email" });
    expect(await requestLoginEmailChange("JULIE@exemple.fr")).toEqual({ ok: false, error: "same-email" });
    for (let index = 0; index < 5; index += 1) await requestLoginEmailChange(`julie${index}@exemple.fr`);
    expect(await requestLoginEmailChange("julie9@exemple.fr")).toEqual({ ok: false, error: "too-many-requests" });
    expect(auth.changeEmail).toHaveBeenCalledTimes(5);
  });
});

describe("saveFirstName", () => {
  it("keeps the first name, cleaned, and refuses one too long", async () => {
    expect(await saveFirstName("  Julie   Anne ")).toEqual({ ok: true, data: { firstName: "Julie Anne" } });
    expect(auth.updateUser).toHaveBeenCalledWith({ body: { name: "Julie Anne" }, headers: expect.any(Headers) });

    expect(await saveFirstName("J".repeat(41))).toEqual({ ok: false, error: "too-long" });
    expect(auth.updateUser).toHaveBeenCalledTimes(1);
  });
});

describe("signOutOtherDevices", () => {
  it("revokes every other session of the creator", async () => {
    expect(await signOutOtherDevices()).toEqual({ ok: true, data: null });
    expect(auth.revokeOtherSessions).toHaveBeenCalledWith({ headers: expect.any(Headers) });
  });
});

describe("deleteMySpace", () => {
  it("deletes the creator's own space, signs out, then deletes their files", async () => {
    await expect(deleteMySpace("Espace julie-nutrition")).rejects.toThrow("redirect:/espace-supprime");

    expect(await findOwnedSpace(db(), julieId)).toBeNull();
    expect(await findOwnedSpace(db(), marcId)).not.toBeNull();
    expect(auth.signOut).toHaveBeenCalledOnce();
    expect(deleteUploadedFolder).not.toHaveBeenCalled();
    for (const work of testContext.scheduled) await work();
    expect(deleteUploadedFolder.mock.calls).toEqual([[`testimonial-photos/${julieSpaceId}/`], [`logos/${julieId}/`]]);
  });

  it("deletes nothing when the name is not typed exactly", async () => {
    expect(await deleteMySpace("Espace julie")).toEqual({ ok: false, error: "name-mismatch" });
    expect(await findOwnedSpace(db(), julieId)).not.toBeNull();
    expect(auth.signOut).not.toHaveBeenCalled();
  });

  it("asks to sign in first", async () => {
    testContext.signedInUser = null;
    await expect(deleteMySpace("Espace julie-nutrition")).rejects.toThrow("redirect:/connexion");
    expect(await findOwnedSpace(db(), julieId)).not.toBeNull();
  });
});
