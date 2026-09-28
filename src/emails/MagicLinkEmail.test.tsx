import { render } from "react-email";
import { describe, expect, it } from "vitest";
import { MagicLinkEmail } from "./MagicLinkEmail";

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

  it("reads as plain text for clients without HTML", async () => {
    const text = await render(<MagicLinkEmail url={LINK} lifetimeMinutes={15} />, { plainText: true });

    expect(text).toContain(LINK);
    expect(text).toContain("Ignorez cet e-mail");
  });
});
