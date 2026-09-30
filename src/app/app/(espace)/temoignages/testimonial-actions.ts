"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import { deleteTestimonial } from "@/lib/testimonials/delete-testimonial";
import { editTestimonialDisplay, restoreTestimonialOriginal } from "@/lib/testimonials/edit-testimonial-display";
import { setTestimonialFeatured } from "@/lib/testimonials/set-testimonial-featured";
import { type TestimonialChangeResult, setTestimonialStatus } from "@/lib/testimonials/set-testimonial-status";
import { MAX_TESTIMONIAL_LENGTH } from "@/lib/testimonials/testimonial-form-schema";
import { deleteUploadedImage } from "@/lib/uploads/delete-uploaded-image";

export type TestimonialActionResult =
  | { ok: true; data: null }
  | { ok: false; error: "testimonial-not-found" | "invalid-text" };

const testimonialIdSchema = z.uuid();

const displayBodySchema = z.string().trim().min(1).max(MAX_TESTIMONIAL_LENGTH);

const changeTestimonial = async (
  testimonialId: unknown,
  change: (userId: string, testimonialId: string) => Promise<TestimonialChangeResult>,
): Promise<TestimonialActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };

  const result = await change(signedInUser.id, parsedId.data);
  if (result.status !== "updated") return { ok: false, error: result.status };

  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: null };
};

export const approveTestimonial = async (testimonialId: string): Promise<TestimonialActionResult> =>
  changeTestimonial(testimonialId, (userId, id) => setTestimonialStatus(getDb(), userId, id, "approved"));

export const hideTestimonial = async (testimonialId: string): Promise<TestimonialActionResult> =>
  changeTestimonial(testimonialId, (userId, id) => setTestimonialStatus(getDb(), userId, id, "hidden"));

export const featureTestimonial = async (testimonialId: string, featured: boolean): Promise<TestimonialActionResult> =>
  changeTestimonial(testimonialId, (userId, id) => setTestimonialFeatured(getDb(), userId, id, featured === true));

export const saveTestimonialDisplay = async (
  testimonialId: string,
  displayBody: string,
): Promise<TestimonialActionResult> => {
  const parsedBody = displayBodySchema.safeParse(displayBody);
  if (!parsedBody.success) {
    await requireSignedInUser();
    return { ok: false, error: "invalid-text" };
  }
  return changeTestimonial(testimonialId, (userId, id) => editTestimonialDisplay(getDb(), userId, id, parsedBody.data));
};

export const restoreTestimonialDisplay = async (testimonialId: string): Promise<TestimonialActionResult> =>
  changeTestimonial(testimonialId, (userId, id) => restoreTestimonialOriginal(getDb(), userId, id));

export const deleteTestimonialForGood = async (testimonialId: string): Promise<TestimonialActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };

  const result = await deleteTestimonial(getDb(), signedInUser.id, parsedId.data);
  if (result.status !== "deleted") return { ok: false, error: result.status };

  const { authorPhotoUrl } = result;
  if (authorPhotoUrl) {
    after(async () => {
      try {
        await deleteUploadedImage(authorPhotoUrl);
      } catch (error) {
        Sentry.captureException(error);
      }
    });
  }
  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: null };
};
