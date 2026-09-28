import { assert, describe, expect, it } from "vitest";
import { type TestimonialFormInput, collectTestimonialFieldErrors, testimonialFormSchema } from "./testimonial-form-schema";

const COMPLETE_FORM: TestimonialFormInput = {
  spaceSlug: "julie-nutrition",
  productSlug: null,
  requestToken: null,
  rating: 5,
  body: "  En 30 jours j'ai arrêté de grignoter le soir.  ",
  authorName: " Camille R. ",
  authorTitle: "  ",
  photoKey: null,
  hasConsented: true,
  pulsacity_check: "",
};

describe("testimonialFormSchema", () => {
  it("cleans the texts and drops an empty title", () => {
    expect(testimonialFormSchema.parse(COMPLETE_FORM)).toMatchObject({
      body: "En 30 jours j'ai arrêté de grignoter le soir.",
      authorName: "Camille R.",
      authorTitle: null,
    });
  });

  it("names every missing piece, consent included", () => {
    const parsed = testimonialFormSchema.safeParse({
      ...COMPLETE_FORM,
      rating: 0,
      body: " ",
      authorName: "",
      hasConsented: false,
    });
    assert(!parsed.success);

    expect(collectTestimonialFieldErrors(parsed.error)).toEqual({
      rating: "missing",
      body: "missing",
      authorName: "missing",
      hasConsented: "missing",
    });
  });

  it("tells a text too long from a missing one", () => {
    const parsed = testimonialFormSchema.safeParse({
      ...COMPLETE_FORM,
      body: "a".repeat(2001),
      authorTitle: "b".repeat(81),
    });
    assert(!parsed.success);

    expect(collectTestimonialFieldErrors(parsed.error)).toEqual({ body: "too-long", authorTitle: "too-long" });
  });
});
