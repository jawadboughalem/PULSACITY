import { z } from "zod";
import { readParisDate } from "@/lib/dates/paris-date";
import { calendarDateToTimestamp, isAfterDay, readCsvDate } from "./csv/read-csv-cells";
import { MAX_AUTHOR_NAME_LENGTH, MAX_AUTHOR_TITLE_LENGTH, MAX_TESTIMONIAL_LENGTH } from "./testimonial-form-schema";

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, { error: "too-long" })
    .transform((value) => value || null);

const receivedAtSchema = z
  .string()
  .trim()
  .transform((value, context) => {
    if (!value) return null;
    const date = readCsvDate(value);
    if (!date) {
      context.addIssue({ code: "custom", message: "invalid" });
      return z.NEVER;
    }
    if (isAfterDay(date, readParisDate(new Date()))) {
      context.addIssue({ code: "custom", message: "future" });
      return z.NEVER;
    }
    return calendarDateToTimestamp(date);
  });

export const manualTestimonialFormSchema = z.object({
  productId: z.union([z.literal("").transform(() => null), z.uuid()]),
  rating: z.number({ error: "missing" }).int().min(1, { error: "missing" }).max(5, { error: "missing" }),
  body: z.string().trim().min(1, { error: "missing" }).max(MAX_TESTIMONIAL_LENGTH, { error: "too-long" }),
  authorName: z.string().trim().min(1, { error: "missing" }).max(MAX_AUTHOR_NAME_LENGTH, { error: "too-long" }),
  authorTitle: optionalText(MAX_AUTHOR_TITLE_LENGTH),
  receivedAt: receivedAtSchema,
  photoKey: z.string().nullable(),
  hasConsent: z.boolean({ error: "missing" }).refine((isChecked) => isChecked, { error: "missing" }),
});

export type ManualTestimonialFormInput = z.input<typeof manualTestimonialFormSchema>;

export type ManualTestimonialField = "rating" | "body" | "authorName" | "authorTitle" | "receivedAt" | "hasConsent";

export type ManualTestimonialFieldError = "missing" | "too-long" | "invalid" | "future";

export type ManualTestimonialFieldErrors = Partial<Record<ManualTestimonialField, ManualTestimonialFieldError>>;

const FIELD_ERRORS = new Set<string>(["missing", "too-long", "invalid", "future"]);

const toFieldError = (message: string | undefined): ManualTestimonialFieldError | undefined => {
  if (message === undefined) return undefined;
  return FIELD_ERRORS.has(message) ? (message as ManualTestimonialFieldError) : "missing";
};

export const collectManualTestimonialFieldErrors = (
  error: z.ZodError<z.infer<typeof manualTestimonialFormSchema>>,
): ManualTestimonialFieldErrors => {
  const { fieldErrors } = z.flattenError(error);
  return {
    rating: toFieldError(fieldErrors.rating?.[0]),
    body: toFieldError(fieldErrors.body?.[0]),
    authorName: toFieldError(fieldErrors.authorName?.[0]),
    authorTitle: toFieldError(fieldErrors.authorTitle?.[0]),
    receivedAt: toFieldError(fieldErrors.receivedAt?.[0]),
    hasConsent: toFieldError(fieldErrors.hasConsent?.[0]),
  };
};
