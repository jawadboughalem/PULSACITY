import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BetaEndingEmail, describeBetaEndingSubject } from "./BetaEndingEmail";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

const FIRST_PAYMENT = new Date("2027-01-12T10:00:00Z");

const read = (text: string) => text.replaceAll("⁠", "").replace(/[  ]/g, " ");

describe("BetaEndingEmail", () => {
  it("names the day the offered plan ends in its subject (maquettes 3.6)", () => {
    expect(describeBetaEndingSubject(FIRST_PAYMENT)).toBe("Votre plan Essentiel offert se termine le 12 janvier");
  });

  it("says when, how much at the launch price, on which card, and how to change before", async () => {
    const text = read(
      await render(
        <BetaEndingEmail
          firstPaymentAt={FIRST_PAYMENT}
          amountCents={999}
          card={{ brand: "visa", last4: "4242" }}
          billingUrl="https://pulsacity.com/app/facturation"
        />,
        { plainText: true },
      ),
    );
    expect(text).toContain("Merci d'avoir testé PULSACITY pendant la bêta.");
    expect(text).toContain(
      "Votre plan Essentiel offert se termine le 12 janvier 2027. Le premier prélèvement aura lieu ce jour-là, sur votre Visa se terminant par 4242.",
    );
    expect(text).toContain("Essentiel, mensuel · 9,99 € par mois");
    expect(text).toContain("Prix de lancement, gardé à vie tant que votre abonnement ne s'interrompt pas. Vous payez le prix affiché.");
    expect(text).toContain("Pour changer de formule ou résilier avant cette date, c'est dans votre espace, sans frais.");
    expect(text).toContain("Gérer mon abonnement");
    expect(text).toContain("https://pulsacity.com/app/facturation");
    expect(text).not.toMatch(/TVA|HT/);
  });

  it("says « la carte enregistrée » when Stripe does not know the card", async () => {
    const text = read(
      await render(
        <BetaEndingEmail firstPaymentAt={FIRST_PAYMENT} amountCents={999} card={null} billingUrl="https://pulsacity.com/app/facturation" />,
        { plainText: true },
      ),
    );
    expect(text).toContain("ce jour-là, sur la carte enregistrée dans votre espace.");
  });
});
