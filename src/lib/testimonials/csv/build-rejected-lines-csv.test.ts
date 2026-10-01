import { describe, expect, it } from "vitest";
import { buildRejectedLinesCsv } from "./build-rejected-lines-csv";
import { readTestimonialCsv } from "./read-testimonial-csv";

describe("buildRejectedLinesCsv", () => {
  it("gives back the rejected lines as written, in a file the import reads again", () => {
    const reading = readTestimonialCsv(
      'nom;titre;note;texte;formation;date\nCamille R.;;5;Top.;;\nHélène T.;Cheffe;6;"Bien ; vraiment\n""top""";;19/09/2026\n;;5;Sans nom.;;',
      {
        products: [],
        existingTestimonials: [],
        testimonialsLeft: null,
        today: { year: 2026, month: 10, day: 1 },
      },
    );
    if (reading.status !== "read") throw new Error(reading.message);
    const rejected = reading.rows.filter((row) => row.status !== "ready");

    const csv = buildRejectedLinesCsv(rejected);

    expect(csv).toBe(
      '﻿nom;titre;note;texte;formation;date\r\nHélène T.;Cheffe;6;"Bien ; vraiment\n""top""";;19/09/2026\r\n;;5;Sans nom.;;\r\n',
    );
    const again = readTestimonialCsv(csv.slice(1), {
      products: [],
      existingTestimonials: [],
      testimonialsLeft: null,
      today: { year: 2026, month: 10, day: 1 },
    });
    expect(again.status === "read" && again.rows.map((row) => row.cells.texte)).toEqual(['Bien ; vraiment\n"top"', "Sans nom."]);
  });
});
