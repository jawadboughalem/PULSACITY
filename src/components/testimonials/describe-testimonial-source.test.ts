import { describe, expect, it } from "vitest";
import type { TestimonialDetail } from "@/lib/testimonials/load-testimonial-detail";
import { describeTestimonialSource } from "./describe-testimonial-source";

const BASE: TestimonialDetail = {
  id: "id",
  authorName: "Nadia B.",
  authorTitle: null,
  authorPhotoUrl: null,
  rating: 4,
  body: "Texte.",
  displayBody: null,
  displayEditedAt: null,
  status: "pending",
  source: "form",
  featured: false,
  consentAt: new Date("2026-09-26T19:47:00Z"),
  consentText: "J'accepte.",
  createdAt: new Date("2026-09-26T19:47:00Z"),
  productId: null,
  productName: null,
  request: null,
};

describe("describeTestimonialSource", () => {
  it("tells the sale behind an automatic request, as in the mockup", () => {
    expect(
      describeTestimonialSource({
        ...BASE,
        request: {
          connector: "systeme",
          purchasedAt: new Date("2026-06-24T10:00:00Z"),
          requestSentAt: new Date("2026-09-24T08:00:00Z"),
          answeredAt: new Date("2026-09-26T19:47:00Z"),
        },
      }),
    ).toEqual({
      icon: "connection",
      label: "Connecteur Systeme.io",
      details: "Achat du 24 juin 2026 · demande envoyée le 24 sept., réponse après 2 jours",
      shortDetails: "Achat du 24 juin 2026 · demande du 24 sept.",
    });
  });

  it("names the open page, a manual addition and an import", () => {
    expect(describeTestimonialSource(BASE)).toMatchObject({ label: "Page de collecte" });
    expect(describeTestimonialSource({ ...BASE, source: "manual" })).toMatchObject({
      label: "Ajout manuel",
      details: "Ajouté par vous le 26 sept. 2026",
    });
    expect(describeTestimonialSource({ ...BASE, source: "csv" })).toMatchObject({ label: "Import CSV" });
  });
});
