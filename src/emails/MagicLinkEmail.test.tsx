import { render } from "react-email";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MagicLinkEmail } from "./MagicLinkEmail";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

const LINK = "https://pulsacity.com/entrer/abc";

const read = (text: string) => text.replaceAll("⁠", "").replaceAll(" ", " ");

describe("MagicLinkEmail", () => {
  it("carries the link on its button and as a fallback, with its lifetime", async () => {
    const html = await render(<MagicLinkEmail url={LINK} email="julie@exemple.fr" lifetimeMinutes={15} />);

    expect(html.match(/href="https:\/\/pulsacity\.com\/entrer\/abc"/g)).toHaveLength(2);
    expect(html).toContain("Accéder à mon espace");
    expect(html).toContain("Il est valable 15 minutes et ne sert qu&#x27;une fois.");
    expect(html).toContain('lang="fr"');
    expect(html).not.toContain('lang="en"');
  });

  it("signs with the symbol and the name, readable with images blocked (maquettes 3.6)", async () => {
    const html = await render(<MagicLinkEmail url={LINK} email="julie@exemple.fr" lifetimeMinutes={15} />);

    expect(html).toMatch(/<img alt="" height="24" src="https:\/\/pulsacity\.com\/brand\/email-symbole-48\.png"/);
    expect(html).toMatch(/>PULSACITY<\/p>/);
  });

  it("says why it came, and reads as plain text for clients without HTML", async () => {
    const text = read(await render(<MagicLinkEmail url={LINK} email="julie@exemple.fr" lifetimeMinutes={15} />, { plainText: true }));

    expect(text).toContain(LINK);
    expect(text).toContain("Vous n'avez pas demandé ce lien ? Ignorez cet e-mail : personne ne peut entrer dans votre espace sans lui.");
    expect(text).toContain("Vous recevez cet e-mail parce qu'une connexion a été demandée avec julie@exemple.fr.");
  });

  it("signs « PULSACITY » alone: no person's name, no postal address", async () => {
    const text = await render(<MagicLinkEmail url={LINK} email="julie@exemple.fr" lifetimeMinutes={15} />, {
      plainText: true,
    });
    expect(read(text)).toMatch(/PULSACITY\s*$/);
  });
});
