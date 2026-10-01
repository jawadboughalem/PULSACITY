import { describe, expect, it } from "vitest";
import {
  NO_TESTIMONIAL_FILTER,
  WITHOUT_PRODUCT,
  buildTestimonialSearch,
  hasTestimonialFilter,
  readTestimonialFilters,
  readTestimonialPage,
} from "./testimonial-filters";

const PRODUCT_ID = "0f8d1c2e-6a4b-4c3d-9e8f-7a6b5c4d3e2f";

describe("readTestimonialFilters", () => {
  it("reads the French search parameters", () => {
    expect(readTestimonialFilters({ recherche: "  Nadia  B ", statut: "en-attente", offre: PRODUCT_ID, note: "4" })).toEqual({
      query: "Nadia B",
      status: "pending",
      productId: PRODUCT_ID,
      rating: 4,
    });
    expect(readTestimonialFilters({ statut: "masques", offre: "sans", recherche: " " })).toEqual({
      query: null,
      status: "hidden",
      productId: WITHOUT_PRODUCT,
      rating: null,
    });
  });

  it("ignores values it does not know", () => {
    expect(readTestimonialFilters({ statut: "pending", offre: "programme", note: "6" })).toEqual(NO_TESTIMONIAL_FILTER);
    expect(readTestimonialFilters({ statut: ["valides", "masques"], note: "4.5" })).toEqual({
      ...NO_TESTIMONIAL_FILTER,
      status: "approved",
    });
  });
});

describe("buildTestimonialSearch", () => {
  it("writes back what readTestimonialFilters reads", () => {
    const filters = { query: "recettes", status: "approved", productId: WITHOUT_PRODUCT, rating: 5 } as const;
    const search = buildTestimonialSearch(filters, 2);

    expect(search).toBe("?recherche=recettes&statut=valides&offre=sans&note=5&page=2");
    const params = Object.fromEntries(new URLSearchParams(search));
    expect(readTestimonialFilters(params)).toEqual(filters);
    expect(readTestimonialPage(params)).toBe(2);
  });

  it("stays empty without a filter", () => {
    expect(buildTestimonialSearch(NO_TESTIMONIAL_FILTER)).toBe("");
    expect(hasTestimonialFilter(NO_TESTIMONIAL_FILTER)).toBe(false);
    expect(readTestimonialPage({ page: "0" })).toBe(1);
  });
});
