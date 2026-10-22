import { describe, expect, it } from "vitest";
import { MASKED_PASSAGE_TEXT } from "@/lib/testimonials/corrections/mask-passage";
import { listTextFiles, readTexts } from "./public-texts";

/**
 * A filler left in a page or a screen of the space: « [À COMPLÉTER : SIREN] », « […] », « [....] », « [l'offre] »,
 * « [date] ». A missing information is never shown: its line goes (lot 4.9). Not a filler: a markdown link
 * « [texte](/page) », a Tailwind value or a CSS selector glued to its class (« max-w-[720px] », « a[href] »), a route
 * segment (« /guides/[slug] »), and the masked passage of a review, « [nom masqué] » (lot 4.13), which is the
 * review's own content.
 */
const BRACKETS = /\[([^[\]\n]*)\]/g;

const FILLER_WORDS = /compl[ée]ter|renseigner|remplir|\b(?:INFO|CODE|TODO|XXX)\b/i;

/** Only words, as a reader would: « l'offre », « date », « nom de l'espace ». */
const PLAIN_WORDS = /^(?=.*\p{L})[\p{L}'’ ]+$/u;

/** A bracket glued to code: a class (« grid-rows-[auto_1fr] »), a selector (« a[href] »), a route (« /[slug] »). */
const CODE_BEFORE = /[\w\-/:(&]/;

const MASKED_PASSAGES = new Set(Object.values(MASKED_PASSAGE_TEXT));

/** A JSX attribute of an MDX line: its value is code (classes, props), not text the reader sees. */
const MDX_ATTRIBUTE = /\b[\w-]+=(?:"[^"]*"|\{[^}]*\})/g;

export const findFillers = (text: string, isMdx: boolean): string[] => {
  const words = isMdx ? text.replace(MDX_ATTRIBUTE, "") : text;
  return [...words.matchAll(BRACKETS)].flatMap((match) => {
    const [whole, inside] = match;
    const start = match.index ?? 0;
    const isLink = words[start + whole.length] === "(";
    if (isLink || MASKED_PASSAGES.has(whole)) return [];
    const isGluedToCode = start > 0 && CODE_BEFORE.test(words[start - 1]);
    const isFiller =
      isMdx ||
      /\s|…|\.\./.test(inside) ||
      FILLER_WORDS.test(inside) ||
      /^[A-ZÀ-ÖØ-Þ_]+$/.test(inside) ||
      inside.trim() === "" ||
      (PLAIN_WORDS.test(inside) && !isGluedToCode);
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
    expect(findFillers("« vous avez acheté [l'offre] auprès de Julie le [date] »", false)).toEqual(["[l'offre]", "[date]"]);
    expect(findFillers("[date]", false)).toEqual(["[date]"]);
  });

  it("leaves links, classes, selectors, routes, code and masked passages alone", () => {
    expect(findFillers("Voir la [politique de confidentialité](/confidentialite).", true)).toEqual([]);
    expect(findFillers("J'accepte les [conditions générales de vente](https://pulsacity.com/cgv)", false)).toEqual([]);
    expect(findFillers('<div className="max-w-[720px]">', true)).toEqual([]);
    expect(findFillers("rounded-[4px] bg-[#FFBE3B] grid-cols-[minmax(0,800px)_440px] [--accent]", false)).toEqual([]);
    expect(findFillers("grid-rows-[auto_1fr] after:content-[''] a[href], button:not([disabled])", false)).toEqual([]);
    expect(findFillers("/integrations/[connector]", false)).toEqual([]);
    expect(findFillers("Bravo [nom masqué], écrivez à [coordonnée masquée].", false)).toEqual([]);
  });
});

describe("placeholder brackets", () => {
  it("are never shown, on the site, in the space, in an e-mail or in the widget: a missing information is left out", () => {
    const fillers = [...listTextFiles("src"), ...listTextFiles("widget/src")].flatMap((path) =>
      readTexts(path).flatMap((text) =>
        findFillers(text, path.endsWith(".mdx")).map((filler) => `${path}: ${filler}`),
      ),
    );
    expect(fillers).toEqual([]);
  });
});
