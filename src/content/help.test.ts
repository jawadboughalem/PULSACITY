import { describe, expect, it } from "vitest";
import { BILLING_FAQ, HOME_FAQ } from "./faq";
import { findGuide } from "./guides";
import { HELP_THEMES } from "./help";

const answerTo = (question: string) =>
  HELP_THEMES.flatMap((theme) => theme.entries).find((entry) => entry.question.startsWith(question))?.answer ?? "";

describe("HELP_THEMES", () => {
  it("gives the six themes of maquette 8.4, in its order, each with its anchor", () => {
    expect(HELP_THEMES.map((theme) => [theme.id, theme.title])).toEqual([
      ["demarrer", "Démarrer"],
      ["connecteurs", "Connecteurs"],
      ["demandes", "Demandes"],
      ["widgets", "Widgets"],
      ["abonnement", "Abonnement"],
      ["donnees-personnelles", "Données personnelles"],
    ]);
  });

  it("asks the questions of maquette 8.4", () => {
    expect(HELP_THEMES.map((theme) => theme.entries.map((entry) => entry.question.replace(/ /g, " ")))).toEqual([
      ["Je ne suis pas technique. C'est pour moi ?", "Combien de temps avant le premier témoignage ?"],
      ["Mon outil n'est pas dans la liste.", "Que veut dire « Bientôt » ?"],
      ["Quand la demande d'avis est-elle envoyée ?", "Mes clients vont-ils être dérangés ?"],
      ["Est-ce compatible avec mon site ?", "Le widget peut-il abîmer ma page ?"],
      ["Les prix incluent-ils la TVA ?", "Que se passe-t-il si je dépasse une limite ?", "Comment résilier ?"],
      ["Est-ce conforme au RGPD ?", "Puis-je exporter ou supprimer mes données ?"],
    ]);
  });

  it("links each guide to a published one, under the four themes of the maquette", () => {
    const linked = HELP_THEMES.filter((theme) => theme.guideSlug).map((theme) => theme.id);
    expect(linked).toEqual(["demarrer", "connecteurs", "widgets", "donnees-personnelles"]);
    for (const theme of HELP_THEMES) {
      if (theme.guideSlug) expect(findGuide(theme.guideSlug), theme.guideSlug).not.toBeNull();
    }
  });

  it("says the same as the home page and the prices where they ask the same question", () => {
    const shared = [...HOME_FAQ, ...BILLING_FAQ];
    for (const entry of HELP_THEMES.flatMap((theme) => theme.entries)) {
      const elsewhere = shared.find((other) => other.question === entry.question);
      if (elsewhere) expect(entry.answer).toBe(elsewhere.answer);
    }
  });

  it("reads the limits of the free plan and the default delay from their one source", () => {
    expect(answerTo("Que se passe-t-il si je dépasse")).toMatch(
      /^Rien n'est supprimé\. Au plan Gratuit, au-delà de 15 témoignages validés, les nouveaux attendent dans votre espace\. Au-delà de 20 demandes dans le mois, les suivantes partent le 1er du mois suivant\./,
    );
    expect(answerTo("Combien de temps")).toMatch(/^Le délai choisi pour l'offre\s: 14 jours par défaut\./);
  });

  it("promises no date, no duration and no verification", () => {
    const texts = HELP_THEMES.flatMap((theme) => theme.entries.flatMap((entry) => [entry.question, entry.answer]));
    for (const text of texts) {
      expect(text).not.toMatch(/TVA comprise|\bHT\b|minutes?\b|avis vérifiés|partenaire officiel/);
    }
  });
});
