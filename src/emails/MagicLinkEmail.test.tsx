import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MagicLinkEmail } from "./MagicLinkEmail";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

const LINK = "https://pulsacity.com/api/auth/magic-link/verify?token=abc&callbackURL=%2Fapp";

describe("MagicLinkEmail", () => {
  it("carries the link on its button and as a fallback, with its lifetime", async () => {
    const html = await render(<MagicLinkEmail url={LINK} lifetimeMinutes={15} />);

    expect(html.match(/href="https:\/\/pulsacity\.com\/api\/auth\/magic-link\/verify\?token=abc&amp;callbackURL=%2Fapp"/g)).toHaveLength(2);
    expect(html).toContain("Accéder à mon espace");
    expect(html).toContain("valable 15 minutes");
    expect(html).toContain('lang="fr"');
    expect(html).not.toContain('lang="en"');
  });

  it("signs with the symbol and the name, readable with images blocked", async () => {
    const html = await render(<MagicLinkEmail url={LINK} lifetimeMinutes={15} />);

    expect(html).toMatch(/<img alt="" height="24" src="https:\/\/pulsacity\.com\/brand\/email-symbole-48\.png"/);
    expect(html).toMatch(/>Pulsacity<\/p>/);
    expect(html).not.toContain(">PULSACITY<");
  });

  it("reads as plain text for clients without HTML", async () => {
    const text = await render(<MagicLinkEmail url={LINK} lifetimeMinutes={15} />, { plainText: true });

    expect(text).toContain(LINK);
    expect(text).toContain("Ignorez cet e-mail");
  });
});
