import { describe, expect, it } from "vitest";
import { buildConsentText } from "./build-consent-text";

const readable = (text: string) => text.replaceAll(" ", " ").replaceAll("⁠", "");

describe("buildConsentText", () => {
  it("names what the widget shows of a review that follows a request, and the way to withdraw", () => {
    expect(readable(buildConsentText("Julie Nutrition", "request"))).toBe(
      "J'ai 18 ans ou plus et j'accepte que Julie Nutrition publie mon avis sur ses pages de vente : ma note, mon texte, le nom et le titre que j'indique, ma photo si j'en ajoute une, la date de mon avis et le mois de mon achat. Je peux retirer mon accord à tout moment avec le lien de l'e-mail reçu.",
    );
  });

  it("leaves out the purchase and the e-mail on the public link", () => {
    expect(readable(buildConsentText("Julie Nutrition", "public-link"))).toBe(
      "J'ai 18 ans ou plus et j'accepte que Julie Nutrition publie mon avis sur ses pages de vente : ma note, mon texte, le nom et le titre que j'indique, ma photo si j'en ajoute une, et la date de mon avis. Je peux retirer mon accord à tout moment en écrivant à Julie Nutrition ou à contact@pulsacity.com.",
    );
  });

  it("elides « que » before a space name starting with a vowel", () => {
    expect(readable(buildConsentText("Atelier Nomade", "request"))).toContain("j'accepte qu'Atelier Nomade publie");
  });
});
