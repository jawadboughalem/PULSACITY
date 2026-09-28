import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { MAGIC_LINK_EMAIL_SUBJECT } from "@/emails/MagicLinkEmail";
import { sendAccountEmail } from "@/lib/email/send-email";
import { MAGIC_LINKS_PER_ADDRESS } from "./magic-link-rate-limits";
import { sendMagicLink } from "./send-magic-link";
import { TooManyMagicLinksError } from "./too-many-magic-links-error";

vi.mock("@/lib/email/send-email", () => ({ sendAccountEmail: vi.fn() }));

const LINK = "https://pulsacity.com/api/auth/magic-link/verify?token=abc";

let database: Database;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  vi.mocked(sendAccountEmail).mockClear();
  vi.stubEnv("BETTER_AUTH_SECRET", "a-test-secret-of-at-least-32-characters");
});

describe("sendMagicLink", () => {
  it("e-mails the link to the address that asked for it", async () => {
    await sendMagicLink(database, "julie@exemple.fr", LINK);

    expect(sendAccountEmail).toHaveBeenCalledOnce();
    expect(vi.mocked(sendAccountEmail).mock.calls[0][0]).toMatchObject({
      to: "julie@exemple.fr",
      subject: MAGIC_LINK_EMAIL_SUBJECT,
    });
  });

  it("stops e-mailing an address once it asked too often, whatever the IP", async () => {
    for (let request = 0; request < MAGIC_LINKS_PER_ADDRESS.limit; request += 1) {
      await sendMagicLink(database, "julie@exemple.fr", LINK);
    }

    await expect(sendMagicLink(database, "Julie@Exemple.fr", LINK)).rejects.toThrow(TooManyMagicLinksError);
    expect(sendAccountEmail).toHaveBeenCalledTimes(MAGIC_LINKS_PER_ADDRESS.limit);

    await sendMagicLink(database, "camille@exemple.fr", LINK);
    expect(sendAccountEmail).toHaveBeenCalledTimes(MAGIC_LINKS_PER_ADDRESS.limit + 1);
  });
});
