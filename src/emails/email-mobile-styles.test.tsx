// @vitest-environment jsdom
import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MagicLinkEmail } from "./MagicLinkEmail";
import { ReviewRequestEmail } from "./ReviewRequestEmail";

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
        spaceName="Julie Nutrition"
        logoUrl={null}
        firstName="Camille"
        productName="Programme 30 jours"
        eventType="sale"
        purchasedAt={new Date("2026-10-01T10:00:00Z")}
        reviewUrl="https://pulsacity.com/t/julie-nutrition"
        unsubscribeUrl="https://pulsacity.com/api/unsubscribe"
        senderPostalAddress={null}
      />,
    );
    const account = await render(<MagicLinkEmail url="https://pulsacity.com/connexion" lifetimeMinutes={15} />);

    for (const html of [request, account]) {
      expect(readPaddedCells(html)).toEqual([
        { selector: ".email-card > tbody > tr > td", padding: "48px" },
        { selector: ".email-legal > tbody > tr > td", padding: "0px 48px" },
      ]);
    }
  });
});
