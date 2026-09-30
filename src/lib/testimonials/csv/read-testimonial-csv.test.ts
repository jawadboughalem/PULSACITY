import { describe, expect, it } from "vitest";
import { type CsvContext, readTestimonialCsv } from "./read-testimonial-csv";

const CONTEXT: CsvContext = {
  products: [{ id: "programme-id", name: "Programme 30 jours" }],
  existingTestimonials: [],
  testimonialsLeft: null,
  today: { year: 2026, month: 9, day: 30 },
};

const read = (text: string, context: Partial<CsvContext> = {}) => readTestimonialCsv(text, { ...CONTEXT, ...context });

const readRows = (text: string, context: Partial<CsvContext> = {}) => {
  const reading = read(text, context);
  if (reading.status !== "read") throw new Error(reading.message);
  return reading;
};

describe("readTestimonialCsv", () => {
  it("reads every column, matches the formation and dates the testimonial", () => {
    const { rows, newProductNames } = readRows(
      "nom;titre;note;texte;formation;date\nCamille R.;Enseignante, Lyon;5;Top.;programme 30 jours;14/03/2026",
    );

    expect(newProductNames).toEqual([]);
    expect(rows).toEqual([
      {
        line: 2,
        authorName: "Camille R.",
        authorTitle: "Enseignante, Lyon",
        rating: 5,
        body: "Top.",
        productName: "Programme 30 jours",
        productId: "programme-id",
        date: new Date("2026-03-14T12:00:00Z"),
        status: "ready",
        problems: [],
      },
    ]);
  });

  it("accepts the headers in any order, case and accent, and without the optional ones", () => {
    const { rows } = readRows("Témoignage,NOTE,Nom\nSuper,4,Nadia B.");

    expect(rows[0]).toMatchObject({ authorName: "Nadia B.", rating: 4, body: "Super", authorTitle: null, date: null });
  });

  it("names the missing columns", () => {
    expect(read("nom;texte\nCamille;Top")).toEqual({
      status: "file-error",
      message:
        "La colonne « note » est introuvable. La première ligne doit contenir : nom, titre, note, texte, formation, date.",
    });
    expect(read("prénom;commentaires\nCamille;Top")).toMatchObject({
      message: expect.stringContaining("Les colonnes « nom », « note », « texte » sont introuvables."),
    });
  });

  it("refuses an empty file or one without testimonials", () => {
    expect(read("")).toMatchObject({ status: "file-error", message: expect.stringContaining("Ce fichier est vide.") });
    expect(read("nom;note;texte\n;;\n")).toMatchObject({
      status: "file-error",
      message: "Ce fichier ne contient aucun témoignage sous la ligne des colonnes.",
    });
  });

  it("explains every problem of a line, with the spreadsheet line number", () => {
    const { rows } = readRows(
      [
        "nom;note;texte;date",
        "Camille;5;Top;",
        ";;;",
        ";6;;31/02/2026",
        "Marc;4,5;Bien;01/10/2026",
      ].join("\n"),
    );

    expect(rows.map((row) => [row.line, row.status, row.problems])).toEqual([
      [2, "ready", []],
      [
        4,
        "invalid",
        [
          "Le nom est vide. Indiquez le nom de la personne.",
          "La note « 6 » n'est pas reconnue. Indiquez un chiffre de 1 à 5.",
          "Le texte est vide. Collez le témoignage dans la colonne texte.",
          "La date « 31/02/2026 » n'est pas reconnue. Écrivez-la sous la forme 14/03/2026.",
        ],
      ],
      [
        5,
        "invalid",
        [
          "La note « 4,5 » n'est pas reconnue. Indiquez un chiffre de 1 à 5.",
          "La date « 01/10/2026 » est dans le futur. Vérifiez-la.",
        ],
      ],
    ]);
  });

  it("spots a testimonial already in the space or already in the file", () => {
    const { rows } = readRows("nom;note;texte\nCamille R.;5;Top  formation\nNadia;4;Bien\nnadia;4;bien", {
      existingTestimonials: [{ authorName: "Camille R.", body: "Top formation" }],
    });

    expect(rows.map((row) => [row.line, row.status, row.problems])).toEqual([
      [2, "duplicate", ["Ce témoignage est déjà dans votre espace."]],
      [3, "ready", []],
      [4, "duplicate", ["Ce témoignage est déjà présent ligne 3."]],
    ]);
  });

  it("keeps the rows beyond the plan limit out, and lists the formations to create", () => {
    const { rows, newProductNames } = readRows(
      "nom;note;texte;formation\nA;5;Un;Coaching\nB;5;Deux;coaching\nC;5;Trois;Atelier",
      { testimonialsLeft: 2 },
    );

    expect(rows.map((row) => row.status)).toEqual(["ready", "ready", "over-limit"]);
    expect(newProductNames).toEqual(["Coaching"]);
  });
});
