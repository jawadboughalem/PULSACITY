import { describe, expect, it } from "vitest";
import type { TestimonialDetail } from "@/lib/testimonials/load-testimonial-detail";
import { describeTestimonialSource } from "./describe-testimonial-source";

const BASE: Pick<
  TestimonialDetail,
  "provenance" | "purchasedAt" | "purchaseConnector" | "request" | "consentAt" | "createdAt"
> = {
  provenance: "public-link",
  purchasedAt: null,
  purchaseConnector: null,
  request: null,
  consentAt: new Date("2026-09-26T19:47:00Z"),
  createdAt: new Date("2026-09-26T19:47:00Z"),
};

const ANSWERED = {
  purchasedAt: new Date("2026-06-24T10:00:00Z"),
  request: { requestSentAt: new Date("2026-09-24T08:00:00Z"), answeredAt: new Date("2026-09-26T19:47:00Z") },
};

describe("describeTestimonialSource", () => {
  it("tells the sale behind an automatic request, and what the widgets show, as in the mockup", () => {
    expect(
      describeTestimonialSource({ ...BASE, ...ANSWERED, provenance: "sale", purchaseConnector: "systeme" }),
    ).toEqual({
      icon: "connection",
      label: "Vente reçue · Systeme.io",
      details: "Achat du 24 juin 2026 · demande envoyée le 24 sept., réponse après 2 jours",
      shortDetails: "Achat du 24 juin 2026 · demande du 24 sept.",
      widgetLine: "Dans vos widgets : avis du 26 sept. 2026, achat en juin 2026.",
    });
  });

  it("tells a manual request with its purchase, even once the request is gone", () => {
    expect(describeTestimonialSource({ ...BASE, ...ANSWERED, provenance: "request" })).toMatchObject({
      icon: "mail",
      label: "Demande manuelle",
      widgetLine: "Dans vos widgets : avis du 26 sept. 2026, achat en juin 2026.",
    });
    expect(
      describeTestimonialSource({ ...BASE, provenance: "request", purchasedAt: ANSWERED.purchasedAt }),
    ).toMatchObject({ details: "Achat du 24 juin 2026", shortDetails: "Achat du 24 juin 2026" });
  });

  it("names an addition, an import and the public link, without a purchase date", () => {
    expect(describeTestimonialSource({ ...BASE, provenance: "added" })).toMatchObject({
      icon: "quote",
      label: "Ajout",
      details: "Ajouté par vous le 26 sept. 2026 · date d'achat inconnue",
      widgetLine: "Dans vos widgets : avis du 26 sept. 2026.",
    });
    expect(describeTestimonialSource({ ...BASE, provenance: "import" })).toMatchObject({
      icon: "upload",
      label: "Import",
      details: "Importé par vous le 26 sept. 2026 · date d'achat inconnue",
    });
    expect(describeTestimonialSource(BASE)).toMatchObject({
      icon: "share",
      label: "Lien public",
      details: "Laissé depuis votre lien de collecte · date d'achat inconnue",
    });
  });
});
