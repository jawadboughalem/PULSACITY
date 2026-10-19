import { describe, expect, it } from "vitest";
import { diffWords } from "./diff-words";

const changed = (from: string, to: string) =>
  diffWords(from, to)
    .filter((segment) => segment.isChanged)
    .map((segment) => segment.text);

describe("diffWords", () => {
  it("marks the words changed, without the spaces around them", () => {
    expect(diffWords("En 30 jours j'ai arrêté", "En 30 jours, j'ai arrêté")).toEqual([
      { text: "En 30 ", isChanged: false },
      { text: "jours,", isChanged: true },
      { text: " j'ai arrêté", isChanged: false },
    ]);
  });

  it("joins the words of one change with the spaces between them", () => {
    expect(changed("Fini les fringales de 17 h.", "Fini les envies de sucre de 17 h.")).toEqual(["envies de sucre"]);
  });

  it("marks nothing when the text is the same, and everything when it is all new", () => {
    expect(changed("Merci Julie.", "Merci Julie.")).toEqual([]);
    expect(diffWords("Merci.", "Bravo Julie")).toEqual([{ text: "Bravo Julie", isChanged: true }]);
  });

  it("gives back the corrected text, whole", () => {
    const to = "Un suivi attentif,\ndes messages bienveillants. Je recommande.";
    expect(
      diffWords("Un suivi attentif, des messages toujours bienveillants.", to)
        .map((segment) => segment.text)
        .join(""),
    ).toBe(to);
  });
});
