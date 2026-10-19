import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ABOUT_REVIEWS_SECTIONS } from "./about-reviews";

const readPage = () =>
  ABOUT_REVIEWS_SECTIONS.map((section) => `${section.title} ${renderToStaticMarkup(<>{section.content}</>)}`)
    .join(" ")
    .replace(/<[^>]+>/g, " ");

describe("« À propos de ces avis »", () => {
  it("never speaks of verification: no review is said to be checked, not even in the negative", () => {
    expect(readPage().toLowerCase()).not.toMatch(/vérifi|authentifi/);
  });

  it("says the purchase of a manual request is the one the creator gave", () => {
    expect(readPage()).toContain("Pour une demande envoyée à la main, l&#x27;achat et sa date sont ceux indiqués par le créateur.");
  });
});
