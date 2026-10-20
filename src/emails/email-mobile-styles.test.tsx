// @vitest-environment jsdom
import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MagicLinkEmail } from "./MagicLinkEmail";
import { ReviewRequestEmail } from "./ReviewRequestEmail";
import { WelcomeEmail } from "./WelcomeEmail";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

/** The phone's rule must reach the cell that holds the padding: react-email puts it on the card's cell, not its table. */
const readPaddedCells = (html: string) => {
  const page = new DOMParser().parseFromString(html, "text/html");
  const rules = page.querySelector("style")?.textContent ?? "";
  const selectors = [...rules.matchAll(/^\s*([^@{}\n]+?)\s*\{\s*padding/gm)].map((match) => match[1]);
  return selectors.map((selector) => {
    const cell = page.querySelector<HTMLElement>(selector);
    return { selector, padding: cell?.style.padding ?? null };
  });
};

describe("e-mails on a phone", () => {
  it("narrows the padding of the card and of the legal notice, where it really is", async () => {
    const request = await render(
      <ReviewRequestEmail
        kind="request"
        space={{ name: "Julie Nutrition", logoUrl: null, accentColor: null, senderPostalAddress: null }}
        firstName="Camille"
        productName="Programme 30 jours"
        eventType="sale"
        purchasedAt={new Date("2026-10-01T10:00:00Z")}
        reviewUrl="https://pulsacity.com/t/julie-nutrition"
        unsubscribeUrl="https://pulsacity.com/desinscription/abc"
      />,
    );
    const account = await render(
      <MagicLinkEmail url="https://pulsacity.com/entrer/abc" email="julie@exemple.fr" lifetimeMinutes={15} />,
    );

    expect(readPaddedCells(request)).toEqual([
      { selector: ".customer-email-card > tbody > tr > td", padding: "40px" },
      { selector: ".customer-email-legal > tbody > tr > td", padding: "0px 40px" },
    ]);
    expect(readPaddedCells(account)).toEqual([
      { selector: ".creator-email-card > tbody > tr > td", padding: "40px" },
      { selector: ".creator-email-legal > tbody > tr > td", padding: "0px 40px" },
    ]);
  });

  it("narrows the padding of the welcome e-mails (v2) the same way", async () => {
    const welcome = await render(
      <WelcomeEmail
        step="j0"
        spaceCreatedAt={new Date("2026-10-12T08:06:00Z")}
        progress={{ offer: false, tool: false, widget: false, request: false }}
        appUrl="https://pulsacity.com"
        unsubscribeUrl="https://pulsacity.com/api/unsubscribe/accueil?token=abc"
      />,
    );

    expect(readPaddedCells(welcome)).toEqual([
      { selector: ".creator-email-card > tbody > tr > td", padding: "40px" },
      { selector: ".creator-email-legal > tbody > tr > td", padding: "0px 40px" },
    ]);
  });
});
