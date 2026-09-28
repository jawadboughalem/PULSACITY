import { describe, expect, it } from "vitest";
import { buildConsentText } from "./build-consent-text";

describe("buildConsentText", () => {
  it("names the space whose supports will show the testimonial", () => {
    expect(buildConsentText("Julie Nutrition")).toBe(
      "J'accepte que ce témoignage soit publié sur les supports de Julie Nutrition.",
    );
  });

  it("elides « de » before a space name starting with a vowel", () => {
    expect(buildConsentText("Atelier Nomade")).toBe(
      "J'accepte que ce témoignage soit publié sur les supports d'Atelier Nomade.",
    );
  });
});
