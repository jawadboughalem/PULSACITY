import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnnualRenewalEmail, describeAnnualRenewalSubject } from "./AnnualRenewalEmail";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

const RENEWAL_AT = new Date("2027-11-12T10:00:00Z");

const read = (text: string) => text.replaceAll("⁠", "").replace(/[  ]/g, " ");

const renderText = async (props: Partial<Parameters<typeof AnnualRenewalEmail>[0]> = {}) =>
  read(
    await render(
      <AnnualRenewalEmail
        renewalAt={RENEWAL_AT}
        plan="essentiel"
        priceList="founder"
        amountCents={9900}
        card={{ brand: "visa", last4: "4242" }}
        billingUrl="https://pulsacity.com/app/facturation"
        {...props}
      />,
      { plainText: true },
    ),
  );

describe("AnnualRenewalEmail", () => {
  it("names the day of the renewal in its subject", () => {
    expect(describeAnnualRenewalSubject(RENEWAL_AT)).toBe("Votre abonnement annuel se renouvelle le 12 novembre");
  });

  it("says when, how much, on which card, and how to change or stop before", async () => {
    const text = await renderText();
    expect(text).toContain(
      "Votre abonnement Essentiel annuel se renouvelle le 12 novembre 2027. Le paiement aura lieu ce jour-là, sur votre Visa se terminant par 4242.",
    );
    expect(text).toContain("Essentiel, annuel · 99 € par an");
    expect(text).toContain("Prix de lancement, gardé à vie tant que votre abonnement ne s'interrompt pas. Vous payez le prix affiché.");
    expect(text).toContain("Pour changer de formule ou résilier avant cette date, c'est dans votre espace, sans frais.");
    expect(text).toContain("https://pulsacity.com/app/facturation");
    expect(text).toContain("Vous recevez cet e-mail parce que votre abonnement annuel se renouvelle le 12 novembre 2027.");
    expect(text).not.toMatch(/TVA|HT/);
  });

  it("says nothing of the launch price at the public price, and « la carte enregistrée » without a known card", async () => {
    const text = await renderText({ plan: "pro", priceList: "public", amountCents: 24900, card: null });
    expect(text).toContain("Pro, annuel · 249 € par an");
    expect(text).not.toContain("Prix de lancement");
    expect(text).toContain("ce jour-là, sur la carte enregistrée dans votre espace.");
  });
});
