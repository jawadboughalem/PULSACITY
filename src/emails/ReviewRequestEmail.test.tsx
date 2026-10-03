import { writeFileSync } from "node:fs";
import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReviewRequestEmail, buildReviewEmailSubject } from "./ReviewRequestEmail";

const PROPS = {
  spaceName: "Julie Nutrition",
  logoUrl: null,
  firstName: "Camille",
  productName: "Programme 30 jours",
  eventType: "sale" as const,
  purchasedAt: new Date("2026-08-28T10:00:00Z"),
  reviewUrl: "https://pulsacity.com/t/julie-nutrition/programme-30-jours?r=abc",
  unsubscribeUrl: "https://pulsacity.com/api/unsubscribe?token=def",
};

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

describe("buildReviewEmailSubject", () => {
  it("writes the subjects of maquette 3, with or without a first name", () => {
    expect(buildReviewEmailSubject("request", "Camille", "Programme 30 jours")).toBe(
      "Camille, votre avis sur Programme 30 jours ?",
    );
    expect(buildReviewEmailSubject("reminder", "Camille", "Programme 30 jours")).toBe(
      "Camille, une minute pour Programme 30 jours ?",
    );
    expect(buildReviewEmailSubject("request", null, "Atelier cuisine")).toBe("Votre avis sur Atelier cuisine ?");
  });
});

describe("ReviewRequestEmail", () => {
  it("asks in the creator's name, with the button, its fallback link and the way out", async () => {
    const html = await render(<ReviewRequestEmail kind="request" {...PROPS} />);
    const text = await render(<ReviewRequestEmail kind="request" {...PROPS} />, { plainText: true });
    if (process.env.EMAIL_PREVIEW_DIR) writeFileSync(`${process.env.EMAIL_PREVIEW_DIR}/demande.html`, html);

    expect(text).toContain("Bonjour Camille,");
    expect(text).toContain("Merci d'avoir suivi Programme 30 jours.");
    expect(text).toContain("Donner mon avis (1 minute)");
    expect(text).toContain("Le bouton ne s'affiche pas ? Ouvrez ce lien : https://pulsacity.com/t/julie-nutrition/programme-30-jours?r=abc");
    expect(text).toContain("Merci d'avance,");
    expect(text).toContain("Vous recevez cet e-mail parce que vous avez acheté Programme 30 jours auprès de Julie Nutrition le 28 août 2026.");
    expect(text).toContain("Ne plus recevoir ces e-mails https://pulsacity.com/api/unsubscribe?token=def");
    expect(text).toContain("Envoyé avec PULSACITY pour Julie Nutrition");
    expect(html).toContain(">JN<");
  });

  it("reminds once, says it is the last message, and names an enrollment as such", async () => {
    const html = await render(<ReviewRequestEmail kind="reminder" {...PROPS} eventType="enrollment" />);
    const text = await render(<ReviewRequestEmail kind="reminder" {...PROPS} eventType="enrollment" />, { plainText: true });
    if (process.env.EMAIL_PREVIEW_DIR) writeFileSync(`${process.env.EMAIL_PREVIEW_DIR}/relance.html`, html);

    expect(text).toContain("Je reviens vers vous une seule fois, sans insister.");
    expect(text).toContain("Belle journée,");
    expect(text).toContain("C'est le dernier message à ce sujet. Vous le recevez parce que vous avez rejoint Programme 30 jours");
  });

  it("shows the creator's logo when the space has one", async () => {
    const html = await render(<ReviewRequestEmail kind="request" {...PROPS} logoUrl="https://photos.exemple.fr/logo.png" />);
    expect(html).toContain('src="https://photos.exemple.fr/logo.png"');
  });
});
