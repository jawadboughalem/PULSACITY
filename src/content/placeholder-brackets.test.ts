import { describe, expect, it } from "vitest";
import { listPublicTextFiles, readTexts } from "./public-texts";

/**
 * A filler left in a page: « [À COMPLÉTER : SIREN] », « […] », « [....] », « [adresse de l'éditeur] ». A missing
 * information is never shown: its line goes (lot 4.9). Not a filler: a markdown link « [texte](/page) », a Tailwind
 * value in a class (« max-w-[720px] », never a space inside), and the masked passage of a review, « [nom masqué] »
 * (lot 4.13), which is the review's own content, written by src/lib, not by a page.
 */
const BRACKETS = /\[([^[\]\n]*)\]/g;

const FILLER_WORDS = /compl[ée]ter|renseigner|remplir|\b(?:INFO|CODE|TODO|XXX)\b/i;

/** A JSX attribute of an MDX line: its value is code (classes, props), not text the reader sees. */
const MDX_ATTRIBUTE = /\b[\w-]+=(?:"[^"]*"|\{[^}]*\})/g;

export const findFillers = (text: string, isMdx: boolean): string[] => {
  const words = isMdx ? text.replace(MDX_ATTRIBUTE, "") : text;
  return [...words.matchAll(BRACKETS)].flatMap((match) => {
    const [whole, inside] = match;
    const isLink = isMdx && words[(match.index ?? 0) + whole.length] === "(";
    if (isLink) return [];
    const isFiller =
      isMdx ||
      /\s|…|\.\./.test(inside) ||
      FILLER_WORDS.test(inside) ||
      /^[A-ZÀ-ÖØ-Þ_]+$/.test(inside) ||
      inside.trim() === "";
    return isFiller ? [whole] : [];
  });
};

describe("findFillers", () => {
  it("finds every kind of filler", () => {
    for (const filler of ["[À COMPLÉTER : SIREN]", "[…]", "[....]", "[à compléter]", "[INFO : nom]", "[CODE]", "[]"]) {
      expect(findFillers(`Éditeur : ${filler}.`, false), filler).toEqual([filler]);
      expect(findFillers(`Éditeur : ${filler}.`, true), filler).toEqual([filler]);
    }
    expect(findFillers("Téléphone : [numéro de mobile]", false)).toEqual(["[numéro de mobile]"]);
    expect(findFillers("Le site [4.13] est en ligne.", true)).toEqual(["[4.13]"]);
  });

  it("leaves links, classes and code alone", () => {
    expect(findFillers("Voir la [politique de confidentialité](/confidentialite).", true)).toEqual([]);
    expect(findFillers('<div className="max-w-[720px]">', true)).toEqual([]);
    expect(findFillers("rounded-[4px] bg-[#FFBE3B] grid-cols-[minmax(0,800px)_440px] [--accent]", false)).toEqual([]);
  });
});

describe("placeholder brackets of the public site", () => {
  it("never shows a filler in square brackets: a missing information is left out", () => {
    const fillers = listPublicTextFiles(["widget/src"]).flatMap((path) =>
      readTexts(path).flatMap((text) =>
        findFillers(text, path.endsWith(".mdx")).map((filler) => `${path}: ${filler}`),
      ),
    );
    expect(fillers).toEqual([]);
  });
});
