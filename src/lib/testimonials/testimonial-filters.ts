import { z } from "zod";
import { RATINGS } from "./testimonial-form-schema";

export const TESTIMONIAL_STATUSES = ["pending", "approved", "hidden"] as const;

export type TestimonialStatus = (typeof TESTIMONIAL_STATUSES)[number];

export const WITHOUT_PRODUCT = "none";

export const MAX_SEARCH_LENGTH = 80;

export type TestimonialFilters = {
  query: string | null;
  status: TestimonialStatus | null;
  productId: string | typeof WITHOUT_PRODUCT | null;
  rating: (typeof RATINGS)[number] | null;
};

export const NO_TESTIMONIAL_FILTER: TestimonialFilters = { query: null, status: null, productId: null, rating: null };

export const STATUS_SEARCH_VALUES = {
  pending: "en-attente",
  approved: "valides",
  hidden: "masques",
} as const satisfies Record<TestimonialStatus, string>;

export const TESTIMONIAL_SEARCH_PARAMS = {
  query: "recherche",
  status: "statut",
  productId: "offre",
  rating: "note",
  page: "page",
} as const;

export const WITHOUT_PRODUCT_SEARCH_VALUE = "sans";

type SearchParams = Record<string, string | string[] | undefined>;

const readFirst = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const STATUS_BY_SEARCH_VALUE = new Map<string, TestimonialStatus>(
  TESTIMONIAL_STATUSES.map((status) => [STATUS_SEARCH_VALUES[status], status]),
);

const ratingSchema = z.coerce.number().int().min(1).max(5);

const pageSchema = z.coerce.number().int().min(1).max(10_000);

const readProductId = (value: string | undefined): TestimonialFilters["productId"] => {
  if (value === WITHOUT_PRODUCT_SEARCH_VALUE) return WITHOUT_PRODUCT;
  return z.uuid().safeParse(value).success ? (value as string) : null;
};

const readQuery = (value: string | undefined): string | null =>
  value?.replace(/\s+/g, " ").trim().slice(0, MAX_SEARCH_LENGTH) || null;

export const readTestimonialFilters = (searchParams: SearchParams): TestimonialFilters => {
  const rating = ratingSchema.safeParse(readFirst(searchParams[TESTIMONIAL_SEARCH_PARAMS.rating]));
  return {
    query: readQuery(readFirst(searchParams[TESTIMONIAL_SEARCH_PARAMS.query])),
    status: STATUS_BY_SEARCH_VALUE.get(readFirst(searchParams[TESTIMONIAL_SEARCH_PARAMS.status]) ?? "") ?? null,
    productId: readProductId(readFirst(searchParams[TESTIMONIAL_SEARCH_PARAMS.productId])),
    rating: rating.success ? (rating.data as TestimonialFilters["rating"]) : null,
  };
};

export const readTestimonialPage = (searchParams: SearchParams): number => {
  const page = pageSchema.safeParse(readFirst(searchParams[TESTIMONIAL_SEARCH_PARAMS.page]));
  return page.success ? page.data : 1;
};

export const buildTestimonialSearch = (filters: TestimonialFilters, page = 1): string => {
  const search = new URLSearchParams();
  if (filters.query) search.set(TESTIMONIAL_SEARCH_PARAMS.query, filters.query);
  if (filters.status) search.set(TESTIMONIAL_SEARCH_PARAMS.status, STATUS_SEARCH_VALUES[filters.status]);
  if (filters.productId) {
    search.set(
      TESTIMONIAL_SEARCH_PARAMS.productId,
      filters.productId === WITHOUT_PRODUCT ? WITHOUT_PRODUCT_SEARCH_VALUE : filters.productId,
    );
  }
  if (filters.rating) search.set(TESTIMONIAL_SEARCH_PARAMS.rating, String(filters.rating));
  if (page > 1) search.set(TESTIMONIAL_SEARCH_PARAMS.page, String(page));
  const query = search.toString();
  return query ? `?${query}` : "";
};

export const hasTestimonialFilter = (filters: TestimonialFilters): boolean =>
  filters.query !== null || filters.status !== null || filters.productId !== null || filters.rating !== null;
