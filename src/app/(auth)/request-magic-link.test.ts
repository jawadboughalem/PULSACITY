import { type Mock, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { MAGIC_LINK_REQUESTS_PER_IP } from "@/lib/auth/magic-link-rate-limits";
import { TooManyMagicLinksError } from "@/lib/auth/too-many-magic-links-error";
import { EmailNotSentError } from "@/lib/email/email-not-sent-error";
import { requestMagicLink } from "./request-magic-link";

type TestContext = {
  database: Database | null;
  signInMagicLink: Mock;
};

const testContext = vi.hoisted((): TestContext => ({ database: null, signInMagicLink: vi.fn() }));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "203.0.113.7" }),
}));
vi.mock("@/db", () => ({ getDb: () => testContext.database }));
vi.mock("@/lib/auth/get-auth", () => ({
  getAuth: () => ({ api: { signInMagicLink: testContext.signInMagicLink } }),
}));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const submit = (email: string) => {
  const formData = new FormData();
  formData.set("email", email);
  return requestMagicLink(null, formData);
};

beforeAll(async () => {
  testContext.database = await createTestDatabase();
});

beforeEach(async () => {
  if (testContext.database) await emptyTestDatabase(testContext.database);
  testContext.signInMagicLink.mockReset();
  vi.stubEnv("BETTER_AUTH_SECRET", "a-test-secret-of-at-least-32-characters");
});

describe("requestMagicLink", () => {
  it("sends the link, sending a new creator to the onboarding and a returning one to the space", async () => {
    expect(await submit("  Julie@Exemple.fr ")).toEqual({ ok: true, data: { email: "julie@exemple.fr" } });

    expect(testContext.signInMagicLink).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          email: "julie@exemple.fr",
          callbackURL: "/app",
          newUserCallbackURL: "/app/onboarding",
          errorCallbackURL: "/connexion",
        },
      }),
    );
  });

  it("refuses an incomplete address without asking for a link", async () => {
    expect(await submit("julie@")).toEqual({ ok: false, error: "invalid-email" });
    expect(testContext.signInMagicLink).not.toHaveBeenCalled();
  });

  it("stops a single IP from asking links for many addresses", async () => {
    for (let request = 0; request < MAGIC_LINK_REQUESTS_PER_IP.limit; request += 1) {
      await submit(`client-${request}@exemple.fr`);
    }

    expect(await submit("one-more@exemple.fr")).toEqual({ ok: false, error: "too-many-requests" });
    expect(testContext.signInMagicLink).toHaveBeenCalledTimes(MAGIC_LINK_REQUESTS_PER_IP.limit);
  });

  it("explains a limit reached on the address itself", async () => {
    testContext.signInMagicLink.mockRejectedValue(new TooManyMagicLinksError());

    expect(await submit("julie@exemple.fr")).toEqual({ ok: false, error: "too-many-requests" });
  });

  it("explains an e-mail the provider refused", async () => {
    testContext.signInMagicLink.mockRejectedValue(new EmailNotSentError("validation_error", "Domain not verified"));

    expect(await submit("julie@exemple.fr")).toEqual({ ok: false, error: "email-not-sent" });
  });
});
