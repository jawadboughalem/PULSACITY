import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BetaEndingEmail, describeBetaEndingSubject } from "./BetaEndingEmail";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

const FIRST_PAYMENT = new Date("2027-01-12T10:00:00Z");

describe("BetaEndingEmail", () => {
  it("names the day of the first payment in its subject", () => {
    expect(describeBetaEndingSubject(FIRST_PAYMENT)).toBe("Votre plan Essentiel devient payant le 12 janvier");
  });

  it("says what will be taken, on which card, and how to stop before", async () => {
    const text = await render(
      <BetaEndingEmail
        firstPaymentAt={FIRST_PAYMENT}
        amountCents={999}
        card={{ brand: "visa", last4: "4242" }}
        billingUrl="https://pulsacity.com/app/facturation"
      />,
      { plainText: true },
    );
    expect(text).toContain("Votre plan Essentiel offert se termine le 12 janvier 2027.");
    expect(text).toMatch(/nous prélevons 9,99\s€ sur votre Visa se terminant par\s4242, puis 9,99\s€ chaque mois/);
    expect(text).toContain("passez au plan Gratuit avant le 12 janvier 2027 : rien ne sera prélevé");
    expect(text).toContain("https://pulsacity.com/app/facturation");
  });

  it("says nothing of a card Stripe does not know", async () => {
    const text = await render(
      <BetaEndingEmail firstPaymentAt={FIRST_PAYMENT} amountCents={999} card={null} billingUrl="https://pulsacity.com/app/facturation" />,
      { plainText: true },
    );
    expect(text).toMatch(/nous prélevons 9,99\s€, puis/);
  });
});
