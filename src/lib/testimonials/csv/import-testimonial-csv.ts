import { and, eq, sql } from "drizzle-orm";
import { type Limit, countTestimonialsLeft, getPlan } from "@/config/plans";
import type { Database } from "@/db/database";
import { products, spaces, testimonials } from "@/db/schema";
import { readParisDate } from "@/lib/dates/paris-date";
import { addProduct } from "@/lib/spaces/add-product";
import { slugify } from "@/lib/spaces/slugify";
import { countApprovedTestimonials } from "../count-approved-testimonials";
import { CSV_CONSENT_TEXT } from "../manual-consent";
import { type CsvRow, isReadyCsvRow, readTestimonialCsv } from "./read-testimonial-csv";

export type CsvPlan = {
  name: string;
  testimonialLimit: Limit;
  testimonialsLeft: Limit;
};

export type CsvPreview =
  | { status: "previewed"; rows: CsvRow[]; newProductNames: string[]; plan: CsvPlan }
  | { status: "file-error"; message: string }
  | { status: "space-not-found" };

export type CsvImportReport =
  | {
      status: "imported";
      importedCount: number;
      pendingCount: number;
      createdProductNames: string[];
      notImported: CsvRow[];
      plan: CsvPlan;
    }
  | { status: "file-error"; message: string }
  | { status: "space-not-found" };

const readCsvAgainstSpace = async (database: Database, userId: string, spaceId: string, text: string, now: Date) => {
  const [space] = await database
    .select({ id: spaces.id, plan: spaces.plan })
    .from(spaces)
    .where(and(eq(spaces.id, spaceId), eq(spaces.userId, userId)))
    .limit(1);
  if (!space) return null;

  const [spaceProducts, existingTestimonials, approvedCount] = await Promise.all([
    database.select({ id: products.id, name: products.name }).from(products).where(eq(products.spaceId, space.id)),
    database
      .select({ authorName: testimonials.authorName, body: testimonials.body })
      .from(testimonials)
      .where(eq(testimonials.spaceId, space.id)),
    countApprovedTestimonials(database, space.id),
  ]);
  const plan = getPlan(space.plan);
  const testimonialsLeft = countTestimonialsLeft(space, approvedCount);
  const reading = readTestimonialCsv(text, {
    products: spaceProducts,
    existingTestimonials,
    testimonialsLeft,
    today: readParisDate(now),
  });
  return {
    space,
    reading,
    plan: { name: plan.name, testimonialLimit: plan.limits.testimonials, testimonialsLeft },
  };
};

export const previewTestimonialCsv = async (
  database: Database,
  userId: string,
  spaceId: string,
  text: string,
  now = new Date(),
): Promise<CsvPreview> => {
  const result = await readCsvAgainstSpace(database, userId, spaceId, text, now);
  if (!result) return { status: "space-not-found" };
  if (result.reading.status === "file-error") return result.reading;
  return {
    status: "previewed",
    rows: result.reading.rows,
    newProductNames: result.reading.newProductNames,
    plan: result.plan,
  };
};

export const importTestimonialCsv = (
  database: Database,
  userId: string,
  spaceId: string,
  text: string,
  now = new Date(),
): Promise<CsvImportReport> =>
  database.transaction(async (transaction): Promise<CsvImportReport> => {
    await transaction.execute(sql`select pg_advisory_xact_lock(hashtext(${`add-testimonials:${spaceId}`}))`);
    const result = await readCsvAgainstSpace(transaction, userId, spaceId, text, now);
    if (!result) return { status: "space-not-found" };
    if (result.reading.status === "file-error") return result.reading;

    const productIds = new Map<string, string>();
    for (const name of result.reading.newProductNames) {
      const added = await addProduct(transaction, userId, result.space.id, name);
      if (added.status === "added") productIds.set(slugify(name), added.product.id);
    }

    const readyRows = result.reading.rows.filter(isReadyCsvRow);
    if (readyRows.length > 0) {
      await transaction.insert(testimonials).values(
        readyRows.map((row) => ({
          spaceId: result.space.id,
          productId: row.productId ?? (row.productName ? (productIds.get(slugify(row.productName)) ?? null) : null),
          authorName: row.authorName,
          authorTitle: row.authorTitle,
          rating: row.rating,
          body: row.body,
          status: row.isPending ? ("pending" as const) : ("approved" as const),
          source: "csv" as const,
          consentAt: now,
          consentText: CSV_CONSENT_TEXT,
          createdAt: row.date ?? now,
        })),
      );
    }

    const pendingCount = readyRows.filter((row) => row.isPending).length;
    const approvedCount = readyRows.length - pendingCount;
    return {
      status: "imported",
      importedCount: readyRows.length,
      pendingCount,
      createdProductNames: result.reading.newProductNames,
      notImported: result.reading.rows.filter((row) => !isReadyCsvRow(row)),
      plan: {
        ...result.plan,
        testimonialsLeft: result.plan.testimonialsLeft === null ? null : result.plan.testimonialsLeft - approvedCount,
      },
    };
  });
