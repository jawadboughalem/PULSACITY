import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { listTextHeadings, readNodeText, slugifyHeading } from "./text-headings";

describe("slugifyHeading", () => {
  it("writes the anchor of a title without accents, spaces or punctuation", () => {
    expect(slugifyHeading("Qui traite vos données")).toBe("qui-traite-vos-donnees");
    expect(slugifyHeading("Méthode 1 : copier les avis à la main")).toBe("methode-1-copier-les-avis-a-la-main");
    expect(slugifyHeading("Publier : l'accord explicite de l'auteur")).toBe("publier-l-accord-explicite-de-l-auteur");
  });
});

describe("readNodeText", () => {
  it("reads the words of a title rendered with bold parts", () => {
    expect(readNodeText(["Les ", createElement("strong", null, "ventes"), " passées"])).toBe("Les ventes passées");
  });
});

describe("listTextHeadings", () => {
  it("lists the second-level titles, with the anchor written by hand when there is one", () => {
    const source = [
      "Une introduction.",
      "## Qui sommes-nous",
      "### Un sous-titre, hors de la liste",
      '<AnchoredHeading id="cookies">Cookies</AnchoredHeading>',
    ].join("\n");
    expect(listTextHeadings(source)).toEqual([
      { id: "qui-sommes-nous", title: "Qui sommes-nous" },
      { id: "cookies", title: "Cookies" },
    ]);
  });

  it("gives every guide and legal text a contents with distinct anchors", () => {
    for (const folder of ["src/content/guides", "src/content/legal"]) {
      for (const name of readdirSync(folder).filter((file) => file.endsWith(".mdx"))) {
        const headings = listTextHeadings(readFileSync(join(folder, name), "utf8"));
        expect(headings.length, name).toBeGreaterThan(1);
        expect(new Set(headings.map((heading) => heading.id)).size, name).toBe(headings.length);
      }
    }
  });
});
