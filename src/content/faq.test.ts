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
  it("says the price shown is the price paid, with no VAT to recover (decisions/tarifs.md)", () => {
    const answer = answerTo(BILLING_FAQ, "Les prix incluent-ils la TVA ?");
    expect(answer).toMatch(/^Le prix affiché est celui que vous payez\. PULSACITY ne facture pas de TVA aujourd'hui/);
    expect(answer).toContain("aucune à récupérer sur nos factures");
    expect(answer).not.toMatch(/TVA comprise|HT/);
  });

  it("names the widget and the testimonials the free plan keeps showing", () => {
    const answer = answerTo(BILLING_FAQ, "Que deviennent mes témoignages si j'arrête ?");
    expect(answer).toContain("1 widget reste sur votre page, avec 15 témoignages validés");
    expect(answer).toContain("vos autres widgets reviennent avec Essentiel");
  });

  it("moves to the yearly plan at the end of the month paid, never pro rata", () => {
    const answer = answerTo(BILLING_FAQ, "Puis-je passer du mensuel à l'annuel ?");
    expect(answer).toContain("à la fin du mois déjà payé");
    expect(answer).toMatch(/L'année coûte 10 mois\s: 2 mois sont offerts\./);
  });
});
