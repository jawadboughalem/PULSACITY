import { describe, expect, it } from "vitest";
import { BILLING_FAQ, HOME_FAQ } from "./faq";

const answerTo = (entries: typeof HOME_FAQ, question: string) =>
  entries.find((entry) => entry.question === question)?.answer ?? "";

describe("HOME_FAQ", () => {
  it("answers the nine questions of positionnement.md, in their order (maquettes 3.5)", () => {
    expect(HOME_FAQ.map((entry) => entry.question)).toEqual([
      "Et si mes clients ne répondent pas ?",
      "J'ai déjà un formulaire. Pourquoi changer ?",
      "Je ne suis pas technique. C'est pour moi ?",
      "Le widget peut-il abîmer ma page ?",
      "Que se passe-t-il si je reçois un avis négatif ?",
      "Mes clients vont-ils être dérangés ?",
      "Et les données personnelles ?",
      "Combien de temps avant le premier témoignage ?",
      "Mon outil n'est pas dans la liste.",
    ]);
  });

  it("gives the default delay of the sending code", () => {
    expect(answerTo(HOME_FAQ, "Combien de temps avant le premier témoignage ?")).toMatch(
      /^Le délai choisi pour l'offre\s: 14 jours par défaut\./,
    );
  });

  it("counts every review in the badge's rating, but those hidden for a reason (lot 4.13)", () => {
    expect(answerTo(HOME_FAQ, "Que se passe-t-il si je reçois un avis négatif ?")).toContain(
      "La note du badge compte tous les avis reçus, sauf ceux que vous masquez pour un motif.",
    );
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
    expect(answer).toContain("1 widget reste sur votre page, le plus ancien ou celui que vous choisissez, avec 15 témoignages validés");
    expect(answer).toContain("vos autres widgets reviennent avec Essentiel");
  });

  it("moves to the yearly plan, or back, at the end of the period paid, never pro rata (decisions/tarifs.md)", () => {
    const answer = answerTo(BILLING_FAQ, "Puis-je passer du mensuel à l'annuel ?");
    expect(answer).toContain("à la fin de la période déjà payée, sans remboursement");
    expect(answer).toMatch(/L'année coûte 10 mois\s: 2 mois sont offerts\./);
  });

  it("keeps the launch price for life, and names the public price after the hundredth (arbitrages.md, n° 1)", () => {
    const answer = answerTo(BILLING_FAQ, "Le prix de lancement est-il gardé longtemps ?");
    expect(answer).toContain("à vie, tant que votre abonnement ne s'interrompt pas");
    expect(answer).toContain("réservé aux 100 premiers abonnés");
    expect(answer).toMatch(/Essentiel passe à 14,99\s€ par mois/);
  });

  it("keeps the requests past the free plan's month for the next one (arbitrages.md, n° 4)", () => {
    const answer = answerTo(BILLING_FAQ, "Et si je dépasse 20 demandes dans le mois, au plan Gratuit ?");
    expect(answer).toMatch(/^Les suivantes sont gardées\s: elles partent le 1er du mois suivant\./);
  });
});
