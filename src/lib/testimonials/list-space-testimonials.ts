import { type SQL, and, count, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { products, testimonials } from "@/db/schema";
import { type TestimonialFilters, type TestimonialStatus, WITHOUT_PRODUCT } from "./testimonial-filters";

export const TESTIMONIALS_PAGE_SIZE = 50;

export type SpaceTestimonial = {
  id: string;
  authorName: string;
  authorTitle: string | null;
  authorPhotoUrl: string | null;
  rating: number;
  body: string;
  displayBody: string | null;
  displayEditedAt: Date | null;
  status: TestimonialStatus;
  source: "form" | "manual" | "csv";
  featured: boolean;
  createdAt: Date;
  productId: string | null;
  productName: string | null;
};

export type SpaceTestimonialPage = {
  testimonials: SpaceTestimonial[];
  total: number;
  pageCount: number;
};

export type TestimonialStatusCounts = Record<TestimonialStatus | "all", number>;

const escapeLikePattern = (text: string) => text.replace(/[\\%_]/g, (character) => `\\${character}`);

const buildConditions = (spaceId: string, filters: TestimonialFilters): SQL[] => {
  const conditions = [eq(testimonials.spaceId, spaceId)];
  if (filters.query) {
    const pattern = `%${escapeLikePattern(filters.query)}%`;
    const matches = or(
      ilike(testimonials.authorName, pattern),
      ilike(testimonials.authorTitle, pattern),
      ilike(testimonials.body, pattern),
      ilike(testimonials.displayBody, pattern),
    );
    if (matches) conditions.push(matches);
  }
  if (filters.status) conditions.push(eq(testimonials.status, filters.status));
  if (filters.productId === WITHOUT_PRODUCT) conditions.push(isNull(testimonials.productId));
  else if (filters.productId) conditions.push(eq(testimonials.productId, filters.productId));
  if (filters.rating) conditions.push(eq(testimonials.rating, filters.rating));
  return conditions;
};

const selectSpaceTestimonials = (database: Database) =>
  database
    .select({
      id: testimonials.id,
      authorName: testimonials.authorName,
      authorTitle: testimonials.authorTitle,
      authorPhotoUrl: testimonials.authorPhotoUrl,
      rating: testimonials.rating,
      body: testimonials.body,
      displayBody: testimonials.displayBody,
      displayEditedAt: testimonials.displayEditedAt,
      status: testimonials.status,
      source: testimonials.source,
      featured: testimonials.featured,
      createdAt: testimonials.createdAt,
      productId: testimonials.productId,
      productName: products.name,
    })
    .from(testimonials)
    .leftJoin(products, eq(products.id, testimonials.productId));

export const LATEST_TESTIMONIALS_LIMIT = 4;

export const listLatestTestimonials = (
  database: Database,
  spaceId: string,
  limit = LATEST_TESTIMONIALS_LIMIT,
): Promise<SpaceTestimonial[]> =>
  selectSpaceTestimonials(database)
    .where(eq(testimonials.spaceId, spaceId))
    .orderBy(desc(testimonials.createdAt), desc(testimonials.id))
    .limit(limit);

export const listSpaceTestimonials = async (
  database: Database,
  spaceId: string,
  filters: TestimonialFilters,
  page = 1,
): Promise<SpaceTestimonialPage> => {
  const where = and(...buildConditions(spaceId, filters));
  const [{ total }] = await database.select({ total: count() }).from(testimonials).where(where);
  const pageCount = Math.max(1, Math.ceil(total / TESTIMONIALS_PAGE_SIZE));

  const rows = await selectSpaceTestimonials(database)
    .where(where)
    .orderBy(desc(testimonials.createdAt), desc(testimonials.id))
    .limit(TESTIMONIALS_PAGE_SIZE)
    .offset((Math.min(page, pageCount) - 1) * TESTIMONIALS_PAGE_SIZE);

  return { testimonials: rows, total, pageCount };
};

export const countTestimonialsByStatus = async (
  database: Database,
  spaceId: string,
): Promise<TestimonialStatusCounts> => {
  const byStatus = (status: TestimonialStatus) =>
    sql<number>`count(*) filter (where ${testimonials.status} = ${status})`.mapWith(Number);
  const [counts] = await database
    .select({
      all: count(),
      pending: byStatus("pending"),
      approved: byStatus("approved"),
      hidden: byStatus("hidden"),
    })
    .from(testimonials)
    .where(eq(testimonials.spaceId, spaceId));
  return counts ?? { all: 0, pending: 0, approved: 0, hidden: 0 };
};
