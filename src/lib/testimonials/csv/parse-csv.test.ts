import { describe, expect, it } from "vitest";
import { detectDelimiter, parseCsv } from "./parse-csv";

describe("detectDelimiter", () => {
  it("recognises the semicolon of French Excel, the comma and the tab", () => {
    expect(detectDelimiter("nom;titre;note;texte\nCamille;;5;Super")).toBe(";");
    expect(detectDelimiter("nom,titre,note,texte")).toBe(",");
    expect(detectDelimiter("nom\ttitre\tnote\ttexte")).toBe("\t");
  });

  it("does not count a delimiter inside quotes", () => {
    expect(detectDelimiter('"nom, prénom";note;texte')).toBe(";");
  });
});

describe("parseCsv", () => {
  it("reads quoted cells with delimiters, quotes and line breaks", () => {
    const text = 'nom;texte\r\n"Camille R.";"Elle m\'a dit : ""mange""; et\r\nça marche"\r\nNadia;Top\r\n';

    expect(parseCsv(text)).toEqual([
      ["nom", "texte"],
      ["Camille R.", 'Elle m\'a dit : "mange"; et\r\nça marche'],
      ["Nadia", "Top"],
    ]);
  });

  it("keeps one row per spreadsheet row, blank ones included", () => {
    expect(parseCsv("nom,note\n\nNadia,4\rMarc,5")).toEqual([["nom", "note"], [""], ["Nadia", "4"], ["Marc", "5"]]);
  });

  it("keeps empty cells and a last row without a line break", () => {
    expect(parseCsv("a,b,c\n1,,3")).toEqual([
      ["a", "b", "c"],
      ["1", "", "3"],
    ]);
    expect(parseCsv("")).toEqual([]);
  });
});
