import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MissingEnvironmentVariableError } from "@/lib/environment/missing-environment-variable-error";
import { EmailNotSentError } from "./email-not-sent-error";
import { sendAccountEmail } from "./send-email";

const send = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const EMAIL = { to: "julie@exemple.fr", subject: "Un sujet", body: <p>Le contenu</p> };

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ data: { id: "email-id" }, error: null });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("sendAccountEmail", () => {
  it("sends the HTML and text versions from PULSACITY's technical address", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("EMAIL_FROM_DOMAIN", "envois.pulsacity.com");

    await sendAccountEmail(EMAIL);

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"PULSACITY" <notifications@envois.pulsacity.com>',
        to: "julie@exemple.fr",
        subject: "Un sujet",
        html: expect.stringContaining("<p>Le contenu</p>"),
        text: "Le contenu",
      }),
    );
  });

  it("raises a named error when the provider refuses the message", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("EMAIL_FROM_DOMAIN", "envois.pulsacity.com");
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "Domain not verified" } });

    await expect(sendAccountEmail(EMAIL)).rejects.toThrow(EmailNotSentError);
  });

  it("prints the e-mail instead of sending it in development without a key", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("NODE_ENV", "development");
    const print = vi.spyOn(console, "info").mockImplementation(() => undefined);

    await sendAccountEmail(EMAIL);

    expect(send).not.toHaveBeenCalled();
    expect(print).toHaveBeenCalledWith(expect.stringContaining("Le contenu"));
  });

  it("refuses to run in production without a key", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("NODE_ENV", "production");

    await expect(sendAccountEmail(EMAIL)).rejects.toThrow(MissingEnvironmentVariableError);
  });
});
