import type { Limit } from "@/config/plans";
import type { CalendarDate } from "@/lib/dates/paris-date";
import { quoteInFrench } from "@/lib/french/typography";
import { MAX_PRODUCT_NAME_LENGTH } from "@/lib/spaces/product-rules";
import { slugify } from "@/lib/spaces/slugify";
import { MAX_AUTHOR_NAME_LENGTH, MAX_AUTHOR_TITLE_LENGTH, MAX_TESTIMONIAL_LENGTH } from "../testimonial-form-schema";
import { parseCsv } from "./parse-csv";
import { calendarDateToTimestamp, isAfterDay, readCsvDate, readCsvRating } from "./read-csv-cells";

export const CSV_COLUMNS = ["nom", "titre", "note", "texte", "formation", "date"] as const;

export type CsvColumn = (typeof CSV_COLUMNS)[number];

const REQUIRED_COLUMNS: readonly CsvColumn[] = ["nom", "note", "texte"];

const COLUMN_ALIASES: Record<CsvColumn, readonly string[]> = {
  nom: ["nom", "nom complet", "prenom et nom", "prenom nom", "auteur", "name"],
  titre: ["titre", "metier", "fonction", "title"],
  note: ["note", "etoiles", "rating"],
  texte: ["texte", "temoignage", "avis", "commentaire", "message", "text"],
  formation: ["formation", "offre", "produit"],
  date: ["date"],
};

export const MAX_CSV_ROWS = 1000;

export const MAX_CSV_LENGTH = 500_000;

export type CsvRowStatus = "ready" | "invalid" | "duplicate" | "over-limit";

export type CsvRow = {
  line: number;
  authorName: string;
  authorTitle: string | null;
  rating: number | null;
  body: string;
  productName: string | null;
  productId: string | null;
  date: Date | null;
  status: CsvRowStatus;
  problems: string[];
};

export type ReadyCsvRow = CsvRow & { status: "ready"; rating: number };

export const isReadyCsvRow = (row: CsvRow): row is ReadyCsvRow => row.status === "ready" && row.rating !== null;

export type CsvReading =
  | { status: "read"; rows: CsvRow[]; newProductNames: string[] }
  | { status: "file-error"; message: string };

export type CsvContext = {
  products: readonly { id: string; name: string }[];
  existingTestimonials: readonly { authorName: string; body: string }[];
  testimonialsLeft: Limit;
  today: CalendarDate;
};

const NUMBER_FORMAT = new Intl.NumberFormat("fr-FR");

const EXPECTED_HEADER = CSV_COLUMNS.join(", ");

export const CSV_FILE_ERRORS = {
  empty: `Ce fichier est vide. La première ligne doit contenir les colonnes : ${EXPECTED_HEADER}.`,
  tooLong: `Ce fichier dépasse ${NUMBER_FORMAT.format(MAX_CSV_LENGTH / 1000)} Ko. Découpez-le en plusieurs fichiers.`,
  tooManyRows: `Ce fichier dépasse ${NUMBER_FORMAT.format(MAX_CSV_ROWS)} lignes. Découpez-le en plusieurs fichiers.`,
  noRow: "Ce fichier ne contient aucun témoignage sous la ligne des colonnes.",
} as const;

const describeMissingColumns = (columns: CsvColumn[]) =>
  columns.length === 1
    ? `La colonne ${quoteInFrench(columns[0])} est introuvable. La première ligne doit contenir : ${EXPECTED_HEADER}.`
    : `Les colonnes ${columns.map(quoteInFrench).join(", ")} sont introuvables. La première ligne doit contenir : ${EXPECTED_HEADER}.`;

const normalizeHeader = (cell: string) =>
  cell
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, " ")
    .trim();

const mapColumns = (header: string[]): Partial<Record<CsvColumn, number>> => {
  const positions: Partial<Record<CsvColumn, number>> = {};
  header.map(normalizeHeader).forEach((name, position) => {
    const column = CSV_COLUMNS.find((candidate) => COLUMN_ALIASES[candidate].includes(name));
    if (column && positions[column] === undefined) positions[column] = position;
  });
  return positions;
};

const normalizeForComparison = (text: string) => text.replace(/\s+/g, " ").trim().toLowerCase();

const buildDuplicateKey = (authorName: string, body: string) =>
  `${normalizeForComparison(authorName)}\n${normalizeForComparison(body)}`;

const describeLength = (subject: string, maxLength: number) =>
  `${subject} dépasse ${NUMBER_FORMAT.format(maxLength)} caractères. Raccourcissez-le.`;

type Cells = Record<CsvColumn, string>;

const readProblems = (cells: Cells, rating: number | null, date: CalendarDate | null, today: CalendarDate) => {
  const problems: string[] = [];
  if (!cells.nom) problems.push("Le nom est vide. Indiquez le nom de la personne.");
  else if (cells.nom.length > MAX_AUTHOR_NAME_LENGTH) problems.push(describeLength("Le nom", MAX_AUTHOR_NAME_LENGTH));
  if (cells.titre.length > MAX_AUTHOR_TITLE_LENGTH) problems.push(describeLength("Le titre", MAX_AUTHOR_TITLE_LENGTH));
  if (!cells.note) problems.push("La note est vide. Indiquez un chiffre de 1 à 5.");
  else if (rating === null) {
    problems.push(`La note ${quoteInFrench(cells.note)} n'est pas reconnue. Indiquez un chiffre de 1 à 5.`);
  }
  if (!cells.texte) problems.push("Le texte est vide. Collez le témoignage dans la colonne texte.");
  else if (cells.texte.length > MAX_TESTIMONIAL_LENGTH) problems.push(describeLength("Le texte", MAX_TESTIMONIAL_LENGTH));
  if (cells.formation && cells.formation.length > MAX_PRODUCT_NAME_LENGTH) {
    problems.push(describeLength("Le nom de la formation", MAX_PRODUCT_NAME_LENGTH));
  }
  if (cells.date && date === null) {
    problems.push(`La date ${quoteInFrench(cells.date)} n'est pas reconnue. Écrivez-la sous la forme 14/03/2026.`);
  } else if (date && isAfterDay(date, today)) {
    problems.push(`La date ${quoteInFrench(cells.date)} est dans le futur. Vérifiez-la.`);
  }
  return problems;
};

export const readTestimonialCsv = (text: string, context: CsvContext): CsvReading => {
  if (text.length > MAX_CSV_LENGTH) return { status: "file-error", message: CSV_FILE_ERRORS.tooLong };

  const [header, ...records] = parseCsv(text);
  if (!header || header.every((cell) => cell.trim() === "")) {
    return { status: "file-error", message: CSV_FILE_ERRORS.empty };
  }
  const positions = mapColumns(header);
  const missingColumns = REQUIRED_COLUMNS.filter((column) => positions[column] === undefined);
  if (missingColumns.length > 0) return { status: "file-error", message: describeMissingColumns(missingColumns) };

  const lines = records
    .map((cells, index) => ({ cells, line: index + 2 }))
    .filter(({ cells }) => cells.some((cell) => cell.trim() !== ""));
  if (lines.length === 0) return { status: "file-error", message: CSV_FILE_ERRORS.noRow };
  if (lines.length > MAX_CSV_ROWS) return { status: "file-error", message: CSV_FILE_ERRORS.tooManyRows };

  const productsBySlug = new Map(context.products.map((product) => [slugify(product.name), product] as const));
  const newProductNames = new Map<string, string>();
  const seenKeys = new Map<string, number | "space">(
    context.existingTestimonials.map((testimonial) => [
      buildDuplicateKey(testimonial.authorName, testimonial.body),
      "space",
    ]),
  );
  let readyLeft = context.testimonialsLeft;

  const rows = lines.map(({ cells: rawCells, line }): CsvRow => {
    const cells = Object.fromEntries(
      CSV_COLUMNS.map((column) => {
        const position = positions[column];
        return [column, position === undefined ? "" : (rawCells[position] ?? "").trim()];
      }),
    ) as Cells;
    const rating = cells.note ? readCsvRating(cells.note) : null;
    const date = cells.date ? readCsvDate(cells.date) : null;
    const productSlug = cells.formation ? slugify(cells.formation) : "";
    const product = productSlug ? productsBySlug.get(productSlug) : undefined;
    const row: CsvRow = {
      line,
      authorName: cells.nom,
      authorTitle: cells.titre || null,
      rating,
      body: cells.texte,
      productName: product?.name ?? (cells.formation || null),
      productId: product?.id ?? null,
      date: date ? calendarDateToTimestamp(date) : null,
      status: "ready",
      problems: readProblems(cells, rating, date, context.today),
    };
    if (row.problems.length > 0) return { ...row, status: "invalid" };

    const duplicateKey = buildDuplicateKey(row.authorName, row.body);
    const duplicateOf = seenKeys.get(duplicateKey);
    if (duplicateOf !== undefined) {
      const problem =
        duplicateOf === "space"
          ? "Ce témoignage est déjà dans votre espace."
          : `Ce témoignage est déjà présent ligne ${duplicateOf}.`;
      return { ...row, status: "duplicate", problems: [problem] };
    }
    seenKeys.set(duplicateKey, line);

    if (readyLeft !== null && readyLeft <= 0) return { ...row, status: "over-limit" };
    if (readyLeft !== null) readyLeft -= 1;
    if (productSlug && !product && !newProductNames.has(productSlug)) newProductNames.set(productSlug, cells.formation);
    return row;
  });

  return { status: "read", rows, newProductNames: [...newProductNames.values()] };
};
