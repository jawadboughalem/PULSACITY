"use server";

import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";
import { after } from "next/server";
import { getDb } from "@/db";
import { consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { hashRateLimitSubject } from "@/lib/rate-limit/hash-rate-limit-subject";
import { readClientIp } from "@/lib/rate-limit/read-client-ip";
import { notifyCreatorOfTestimonial } from "@/lib/testimonials/notify-creator-of-testimonial";
import { submitTestimonial } from "@/lib/testimonials/submit-testimonial";
import {
  HONEYPOT_FIELD_NAME,
  type TestimonialFieldErrors,
  collectTestimonialFieldErrors,
  testimonialFormSchema,
} from "@/lib/testimonials/testimonial-form-schema";
import { TESTIMONIALS_PER_IP } from "@/lib/testimonials/testimonial-rate-limits";

export type SubmitTestimonialFormResult =
  | { ok: true; data: null }
  | { ok: false; error: "invalid-input"; fieldErrors: TestimonialFieldErrors }
  | { ok: false; error: "too-many-submissions" | "link-inactive" | "page-not-found" | "invalid-photo" };

export const submitTestimonialForm = async (input: unknown): Promise<SubmitTestimonialFormResult> => {
  const parsed = testimonialFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "invalid-input", fieldErrors: collectTestimonialFieldErrors(parsed.error) };
  }
  if (parsed.data[HONEYPOT_FIELD_NAME]) return { ok: true, data: null };

  const database = getDb();
  const clientIp = readClientIp(await headers());
  if (!(await consumeRateLimit(database, TESTIMONIALS_PER_IP, hashRateLimitSubject(clientIp)))) {
    return { ok: false, error: "too-many-submissions" };
  }

  const result = await submitTestimonial(database, parsed.data);
  if (result.status !== "received") return { ok: false, error: result.status };

  after(async () => {
    try {
      await notifyCreatorOfTestimonial(result.notification);
    } catch (error) {
      Sentry.captureException(error);
    }
  });
  return { ok: true, data: null };
};
