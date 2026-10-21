import { render } from "react-email";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { NEW_LOGIN_ADDRESS_SUBJECT } from "@/emails/NewLoginAddressEmail";
import { sendAccountEmail } from "@/lib/email/send-email";
import { NEW_LOGIN_ADDRESS_LINKS_PER_USER, sendNewLoginAddressLink } from "./send-new-login-address-link";

vi.mock("@/lib/email/send-email", () => ({ sendAccountEmail: vi.fn() }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const LINK = "https://pulsacity.com/api/auth/verify-email?token=abc&callbackURL=%2Fapp%2Fcompte%3Fadresse%3D1";

let database: Database;
let julieId: string;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  julieId = await insertTestUser(database, "julie@exemple.fr");
  vi.mocked(sendAccountEmail).mockReset();
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

describe("sendNewLoginAddressLink", () => {
  it("sends the link to the new address, which the account does not have yet", async () => {
    await sendNewLoginAddressLink(database, { user: { id: julieId, email: "julie.martin@exemple.fr" }, url: LINK });

    expect(sendAccountEmail).toHaveBeenCalledOnce();
    const email = vi.mocked(sendAccountEmail).mock.calls[0][0];
    expect(email).toMatchObject({ to: "julie.martin@exemple.fr", subject: NEW_LOGIN_ADDRESS_SUBJECT });
    const text = await render(email.body, { plainText: true });
    expect(text).toContain(`Confirmer cette adresse ${LINK}`);
    expect(text).toContain("Ce lien est valable 24 heures et ne sert qu'une fois.");
  });

  it("sends nothing for an address the account already has, nor for an unknown account", async () => {
    await sendNewLoginAddressLink(database, { user: { id: julieId, email: "julie@exemple.fr" }, url: LINK });
    await sendNewLoginAddressLink(database, { user: { id: "nobody", email: "someone@exemple.fr" }, url: LINK });

    expect(sendAccountEmail).not.toHaveBeenCalled();
  });

  it("sends a limited number of links an hour, however they are asked for", async () => {
    for (let index = 0; index <= NEW_LOGIN_ADDRESS_LINKS_PER_USER.limit; index += 1) {
      await sendNewLoginAddressLink(database, { user: { id: julieId, email: `julie${index}@exemple.fr` }, url: LINK });
    }

    expect(sendAccountEmail).toHaveBeenCalledTimes(NEW_LOGIN_ADDRESS_LINKS_PER_USER.limit);
  });
});
