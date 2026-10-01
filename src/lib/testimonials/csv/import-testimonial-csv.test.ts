import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db/database";
import { products, testimonials } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import { importTestimonialCsv, previewTestimonialCsv } from "./import-testimonial-csv";

let database: Database;
let userId: string;
let spaceId: string;

const NOW = new Date("2026-09-30T10:00:00Z");

const INVALID_LINES = new Map([
  [12, "Inès M.;Coach;6;Très bon accompagnement.;Programme 30 jours;02/03/2026"],
  [27, ";;5;Un texte sans nom.;;"],
  [41, "Paul D.;;4;;Atelier cuisine;35/08/2026"],
]);

const buildFiftyLineCsv = () => {
  const lines = ["nom;titre;note;texte;formation;date"];
  for (let line = 2; line <= 51; line += 1) {
    lines.push(
      INVALID_LINES.get(line) ??
        `Client ${line};Métier ${line};${(line % 5) + 1};"Avis numéro ${line} ; sur deux lignes\nc'est possible.";${line % 2 ? "Programme 30 jours" : "Atelier cuisine"};${String((line % 28) + 1).padStart(2, "0")}/08/2026`,
    );
  }
  return lines.join("\r\n");
};

const findSpaceTestimonials = () => database.select().from(testimonials).where(eq(testimonials.spaceId, spaceId));

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition", "essentiel");
  await database.insert(products).values({ spaceId, name: "Programme 30 jours", slug: "programme-30-jours" });
});

describe("importTestimonialCsv", () => {
  it("imports 47 of 50 lines and reports the 3 invalid ones, line by line", async () => {
    const csv = buildFiftyLineCsv();

    const preview = await previewTestimonialCsv(database, userId, spaceId, csv, NOW);
    expect(preview).toMatchObject({ status: "previewed", newProductNames: ["Atelier cuisine"] });
    expect(await findSpaceTestimonials()).toHaveLength(0);

    const report = await importTestimonialCsv(database, userId, spaceId, csv, NOW);

    expect(report).toMatchObject({
      status: "imported",
      importedCount: 47,
      isFirstApproval: true,
      pendingCount: 0,
      createdProductNames: ["Atelier cuisine"],
      plan: { name: "Essentiel", testimonialsLeft: null },
    });
    if (report.status !== "imported") return;
    expect(report.notImported.map((row) => [row.line, row.problems])).toEqual([
      [12, ["La note « 6 » n'est pas reconnue. Indiquez un chiffre de 1 à 5."]],
      [27, ["Le nom est vide. Indiquez le nom de la personne."]],
      [
        41,
        [
          "Le texte est vide. Collez le témoignage dans la colonne texte.",
          "La date « 35/08/2026 » n'est pas reconnue. Écrivez-la sous la forme 14/03/2026.",
        ],
      ],
    ]);

    const imported = await findSpaceTestimonials();
    expect(imported).toHaveLength(47);
    expect(imported.every((testimonial) => testimonial.source === "csv" && testimonial.status === "approved")).toBe(
      true,
    );
    const atelier = await database.select().from(products).where(eq(products.name, "Atelier cuisine"));
    expect(atelier).toHaveLength(1);
    expect(imported.find((testimonial) => testimonial.authorName === "Client 2")).toMatchObject({
      productId: atelier[0].id,
      rating: 3,
      body: "Avis numéro 2 ; sur deux lignes\nc'est possible.",
      createdAt: new Date("2026-08-03T12:00:00Z"),
      consentAt: NOW,
      consentText: "J'ai l'accord de chaque personne de ce fichier pour publier son témoignage.",
    });
  });

  it("imports only what is new when the corrected file comes back", async () => {
    const csv = buildFiftyLineCsv();
    await importTestimonialCsv(database, userId, spaceId, csv, NOW);

    const corrected = csv.replace(";;5;Un texte sans nom.;;", "Léa P.;;5;Un texte sans nom.;;");
    const report = await importTestimonialCsv(database, userId, spaceId, corrected, NOW);

    expect(report).toMatchObject({
      status: "imported",
      importedCount: 1,
      isFirstApproval: false,
      createdProductNames: [],
    });
    expect(await findSpaceTestimonials()).toHaveLength(48);
  });

  it("imports past the free plan limit as pending, without touching what is already there", async () => {
    const freeUserId = await insertTestUser(database, "marc@exemple.fr");
    const freeSpaceId = await insertTestSpace(database, freeUserId, "marc-coaching");
    for (let index = 0; index < 13; index += 1) {
      await insertTestTestimonial(database, { spaceId: freeSpaceId, status: "approved" });
    }

    const report = await importTestimonialCsv(
      database,
      freeUserId,
      freeSpaceId,
      "nom;note;texte\nA;5;Un\nB;5;Deux\nC;5;Trois\nD;5;Quatre",
      NOW,
    );

    expect(report).toMatchObject({
      status: "imported",
      importedCount: 4,
      pendingCount: 2,
      notImported: [],
      plan: { name: "Gratuit", testimonialLimit: 15, testimonialsLeft: 0 },
    });
    const imported = await database
      .select({ authorName: testimonials.authorName, status: testimonials.status })
      .from(testimonials)
      .where(eq(testimonials.spaceId, freeSpaceId));
    expect(imported.filter((testimonial) => testimonial.status === "approved")).toHaveLength(15);
    expect(imported.filter((testimonial) => testimonial.status === "pending").map((row) => row.authorName)).toEqual([
      "C",
      "D",
    ]);
  });

  it("refuses the space of another creator", async () => {
    const otherUserId = await insertTestUser(database, "marc@exemple.fr");

    expect(await importTestimonialCsv(database, otherUserId, spaceId, buildFiftyLineCsv(), NOW)).toEqual({
      status: "space-not-found",
    });
    expect(await previewTestimonialCsv(database, otherUserId, spaceId, buildFiftyLineCsv(), NOW)).toEqual({
      status: "space-not-found",
    });
    expect(await findSpaceTestimonials()).toHaveLength(0);
  });
});
