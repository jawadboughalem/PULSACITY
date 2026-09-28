import { z } from "zod";

export const MAX_TESTIMONIAL_LENGTH = 2000;
export const MAX_AUTHOR_NAME_LENGTH = 80;
export const MAX_AUTHOR_TITLE_LENGTH = 80;
export const RATINGS = [1, 2, 3, 4, 5] as const;
export const HONEYPOT_FIELD_NAME = "pulsacity_check";

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, { error: "too-long" })
    .transform((value) => value || null);

export const testimonialFormSchema = z.object({
  spaceSlug: z.string().min(1),
  productSlug: z.string().nullable(),
  requestToken: z.string().nullable(),
  rating: z.number({ error: "missing" }).int().min(1, { error: "missing" }).max(5, { error: "missing" }),
  body: z
    .string()
    .trim()
    .min(1, { error: "missing" })
    .max(MAX_TESTIMONIAL_LENGTH, { error: "too-long" }),
  authorName: z
    .string()
    .trim()
    .min(1, { error: "missing" })
    .max(MAX_AUTHOR_NAME_LENGTH, { error: "too-long" }),
  authorTitle: optionalText(MAX_AUTHOR_TITLE_LENGTH),
  photoKey: z.string().nullable(),
  hasConsented: z.boolean({ error: "missing" }).refine((isChecked) => isChecked, { error: "missing" }),
  [HONEYPOT_FIELD_NAME]: z.string().default(""),
});

export type TestimonialFormInput = z.input<typeof testimonialFormSchema>;

export type TestimonialForm = z.infer<typeof testimonialFormSchema>;

export type TestimonialField = "rating" | "body" | "authorName" | "authorTitle" | "hasConsented";

export type TestimonialFieldError = "missing" | "too-long";

export type TestimonialFieldErrors = Partial<Record<TestimonialField, TestimonialFieldError>>;

const toFieldError = (message: string | undefined): TestimonialFieldError | undefined => {
  if (message === "too-long") return "too-long";
  return message === undefined ? undefined : "missing";
};

export const collectTestimonialFieldErrors = (error: z.ZodError<TestimonialForm>): TestimonialFieldErrors => {
  const { fieldErrors } = z.flattenError(error);
  return {
    rating: toFieldError(fieldErrors.rating?.[0]),
    body: toFieldError(fieldErrors.body?.[0]),
    authorName: toFieldError(fieldErrors.authorName?.[0]),
    authorTitle: toFieldError(fieldErrors.authorTitle?.[0]),
    hasConsented: toFieldError(fieldErrors.hasConsented?.[0]),
  };
};
