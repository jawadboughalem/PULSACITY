import { describe, expect, it } from "vitest";
import { buildConsentProof } from "./build-consent-proof";
import type { TestimonialDetail } from "./load-testimonial-detail";

const NADIA: TestimonialDetail = {
  id: "0f8d1c2e-6a4b-4c3d-9e8f-7a6b5c4d3e2f",
  authorName: "Nadia B.",
  authorTitle: "Infirmière de nuit",
  authorPhotoUrl: null,
  rating: 4,
  body: "Enfin des conseils adaptés aux horaires décalés.",
  displayBody: "Des conseils adaptés aux horaires décalés.",
  displayEditedAt: new Date("2026-09-27T08:00:00Z"),
  status: "pending",
  source: "form",
  featured: false,
  consentAt: new Date("2026-09-26T19:47:00Z"),
  consentText: "J'accepte que ce témoignage soit publié sur les supports de Julie Nutrition.",
  createdAt: new Date("2026-09-26T19:47:00Z"),
  productId: null,
  productName: null,
  request: {
    connector: "systeme",
    purchasedAt: new Date("2026-06-24T10:00:00Z"),
    requestSentAt: new Date("2026-09-24T08:00:00Z"),
    answeredAt: new Date("2026-09-26T19:47:00Z"),
  },
};

describe("buildConsentProof", () => {
  it("states who agreed, to which text, when, and the original words", () => {
    const proof = buildConsentProof("Julie Nutrition", NADIA, new Date("2026-10-01T08:00:00Z"));

    expect(proof).toContain("Espace : Julie Nutrition");
    expect(proof).toContain("Auteur : Nadia B., Infirmière de nuit");
    expect(proof).toContain("Source : page de collecte, remplie par l'auteur, après une vente Systeme.io");
    expect(proof).toContain(
      "Consentement donné le : 26 sept. 2026 à 21:47 (heure de Paris), 2026-09-26T19:47:00.000Z",
    );
    expect(proof).toContain(
      "Texte accepté : « J'accepte que ce témoignage soit publié sur les supports de Julie Nutrition. »",
    );
    expect(proof).toContain("Texte original, conservé tel quel :\nEnfin des conseils adaptés aux horaires décalés.");
    expect(proof).not.toContain("Des conseils adaptés");
  });

  it("says when the creator vouched for a testimonial they added", () => {
    const proof = buildConsentProof("Julie Nutrition", { ...NADIA, source: "manual", request: null });

    expect(proof).toContain("Donné par : le créateur de l'espace, qui atteste avoir l'accord de l'auteur");
    expect(proof).toContain("Source : ajout manuel par le créateur de l'espace\n");
  });
});
