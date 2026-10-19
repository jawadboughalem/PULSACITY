import { writeFileSync } from "node:fs";
import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CorrectionRequestEmail, buildCorrectionRequestSubject } from "./CorrectionRequestEmail";
import { HiddenReasonEmail, buildHiddenReasonSubject } from "./HiddenReasonEmail";

const SPACE = { name: "Julie Nutrition", logoUrl: null, accentColor: "#4F6F52", senderPostalAddress: null };
const COMMON = {
  space: SPACE,
  productName: "Programme 30 jours",
  reviewedAt: new Date("2026-10-12T10:00:00Z"),
  unsubscribeUrl: "https://pulsacity.com/api/unsubscribe?token=def",
};
const NBSP = " ";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

describe("HiddenReasonEmail", () => {
  it("names the reason in the creator's name, says the review is kept, and links to « À propos de ces avis »", async () => {
    const props = {
      ...COMMON,
      firstName: "Nadia",
      reason: "Il ne parle pas de mon offre",
      aboutUrl: "https://pulsacity.com/a-propos-des-avis",
    };
    const html = await render(<HiddenReasonEmail {...props} />);
    const text = await render(<HiddenReasonEmail {...props} />, { plainText: true });
    if (process.env.EMAIL_PREVIEW_DIR) writeFileSync(`${process.env.EMAIL_PREVIEW_DIR}/motif.html`, html);

    expect(buildHiddenReasonSubject("Nadia")).toBe("Nadia, votre avis n'est pas affiché");
    expect(buildHiddenReasonSubject(null)).toBe("Votre avis n'est pas affiché");
    expect(text).toContain("Bonjour Nadia,");
    expect(text).toContain(`Je ne l'affiche pas sur mes pages, pour ce motif${NBSP}:`);
    expect(text).toContain("Il ne parle pas de mon offre");
    expect(text).toContain(`Votre avis n'est pas supprimé${NBSP}: je peux l'afficher à nouveau à tout moment.`);
    expect(text).toContain("À propos de ces avis https://pulsacity.com/a-propos-des-avis");
    expect(text).toContain(
      "vous avez laissé un avis sur Programme 30 jours auprès de Julie Nutrition le 12 oct. 2026.",
    );
    expect(text).toContain("Ne plus recevoir ces e-mails https://pulsacity.com/api/unsubscribe?token=def");
    expect(text.toLowerCase()).not.toContain("vérifié");
  });
});

describe("CorrectionRequestEmail", () => {
  it("shows both versions, the change in bold and underlined, and leads both answers to the page", async () => {
    const props = {
      ...COMMON,
      firstName: "Camille",
      fromBody: "En 30 jours j'ai arrêté de grignoter le soir.",
      body: "En 30 jours, j'ai arrêté de grignoter le soir.",
      answerUrl: "https://pulsacity.com/t/julie-nutrition/correction?c=abc",
    };
    const html = await render(<CorrectionRequestEmail {...props} />);
    const text = await render(<CorrectionRequestEmail {...props} />, { plainText: true });
    if (process.env.EMAIL_PREVIEW_DIR) writeFileSync(`${process.env.EMAIL_PREVIEW_DIR}/correction.html`, html);

    expect(buildCorrectionRequestSubject("Camille")).toBe(`Camille, puis-je corriger votre avis${NBSP}?`);
    expect(text).toContain("Votre texte");
    expect(text).toContain(`«${NBSP}En 30 jours j'ai arrêté de grignoter le soir.${NBSP}»`);
    expect(text).toContain("Le texte corrigé");
    expect(html).toMatch(/<strong style="font-weight:700;text-decoration:underline">jours,<\/strong>/);
    expect(text).toContain("Rien ne change sans votre accord. Votre texte d'origine reste gardé.");
    expect(text).toContain("Accepter la correction");
    expect(text).toContain("Garder mon texte");
    expect(
      html.match(/href="https:\/\/pulsacity.com\/t\/julie-nutrition\/correction\?c=abc"/g)?.length,
    ).toBeGreaterThanOrEqual(3);
    expect(text).toContain("Sans réponse de votre part, votre texte d'origine reste affiché.");
  });
});
