import { describe, expect, it } from "vitest";
import {
  type ManualTestimonialFormInput,
  collectManualTestimonialFieldErrors,
  manualTestimonialFormSchema,
} from "./manual-testimonial-form-schema";

const NADIA: ManualTestimonialFormInput = {
  productId: "",
  rating: 5,
  body: "  Merci pour ce suivi.  ",
  authorName: "Nadia B.",
  authorTitle: "",
  receivedAt: "2026-06-02",
  photoKey: null,
  hasConsent: true,
};

describe("manualTestimonialFormSchema", () => {
  it("trims the text and reads the date of an input of type date", () => {
    expect(manualTestimonialFormSchema.parse(NADIA)).toEqual({
      productId: null,
      rating: 5,
      body: "Merci pour ce suivi.",
      authorName: "Nadia B.",
      authorTitle: null,
      receivedAt: new Date("2026-06-02T12:00:00Z"),
      photoKey: null,
      hasConsent: true,
    });
    expect(manualTestimonialFormSchema.parse({ ...NADIA, receivedAt: "" }).receivedAt).toBeNull();
  });

  it("names each field to correct", () => {
    const result = manualTestimonialFormSchema.safeParse({
      ...NADIA,
      rating: 0,
      body: " ",
      authorName: "",
      receivedAt: "2999-01-01",
      hasConsent: false,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(collectManualTestimonialFieldErrors(result.error)).toEqual({
      rating: "missing",
      body: "missing",
      authorName: "missing",
      authorTitle: undefined,
      receivedAt: "future",
      hasConsent: "missing",
    });
  });

  it("refuses a formation that is not an identifier", () => {
    expect(manualTestimonialFormSchema.safeParse({ ...NADIA, productId: "programme" }).success).toBe(false);
  });
});
