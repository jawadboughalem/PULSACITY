import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { decodeCsvFile } from "./decode-csv-file";
import { readTestimonialCsv } from "./read-testimonial-csv";

const RECETTE_FILE = new URL("../../../../docs-internes/recette/temoignages-50-lignes.csv", import.meta.url);

describe("the acceptance file of the CSV import", () => {
  it("holds 50 testimonials, 3 of them invalid on lines 12, 27 and 41", () => {
    const reading = readTestimonialCsv(decodeCsvFile(readFileSync(RECETTE_FILE)), {
      products: [{ id: "programme", name: "Programme 30 jours" }],
      existingTestimonials: [],
      testimonialsLeft: null,
      today: { year: 2026, month: 10, day: 1 },
    });

    expect(reading.status).toBe("read");
    if (reading.status !== "read") return;
    expect(reading.rows).toHaveLength(50);
    expect(reading.rows.filter((row) => row.status === "ready")).toHaveLength(47);
    expect(reading.rows.filter((row) => row.status !== "ready").map((row) => row.line)).toEqual([12, 27, 41]);
    expect(reading.newProductNames).toEqual(["Atelier cuisine"]);
  });
});
