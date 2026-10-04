import { describe, expect, it } from "vitest";
import { BILLING_FAQ, HOME_FAQ } from "./faq";

const answerTo = (entries: typeof HOME_FAQ, question: string) =>
  entries.find((entry) => entry.question === question)?.answer ?? "";

describe("HOME_FAQ", () => {
  it("answers the five questions of maquette 7, in its order", () => {
    expect(HOME_FAQ.map((entry) => entry.question)).toEqual([
      "Quand la demande d'avis est-elle envoyée ?",
      "Est-ce conforme au RGPD ?",
      "Mes clients peuvent-ils se désinscrire ?",
      "Est-ce compatible avec mon site ?",
      "Comment résilier ?",
    ]);
  });

  it("gives the default delay and the reminder of the sending code", () => {
    const answer = answerTo(HOME_FAQ, "Quand la demande d'avis est-elle envoyée ?");
    expect(answer).toContain("Par défaut, 14 jours.");
    expect(answer).toContain("une seule relance part 4 jours plus tard");
  });
});

describe("BILLING_FAQ", () => {
  it("computes what Essentiel costs before VAT from its price", () => {
    const answer = answerTo(BILLING_FAQ, "Les prix incluent-ils la TVA ?");
    expect(answer).toMatch(/8,33\s€ HT par mois/);
    expect(answer).toMatch(/vous payez 9,99\s€, sans TVA/);
  });

  it("names the testimonials the free plan keeps showing", () => {
    expect(answerTo(BILLING_FAQ, "Que deviennent mes témoignages si j'arrête ?")).toContain("au-delà de 15 témoignages validés");
  });
});
