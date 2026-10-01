"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import { deleteTestimonial } from "@/lib/testimonials/delete-testimonial";
import { editTestimonialPresentation, setTestimonialProduct } from "@/lib/testimonials/edit-testimonial-presentation";
import { restoreTestimonialOriginal } from "@/lib/testimonials/restore-testimonial-original";
import { setTestimonialFeatured } from "@/lib/testimonials/set-testimonial-featured";
import { type TestimonialChangeResult, setTestimonialStatus } from "@/lib/testimonials/set-testimonial-status";
import {
  MAX_AUTHOR_NAME_LENGTH,
  MAX_AUTHOR_TITLE_LENGTH,
  MAX_TESTIMONIAL_LENGTH,
} from "@/lib/testimonials/testimonial-form-schema";
import { deleteUploadedImage } from "@/lib/uploads/delete-uploaded-image";

export type TestimonialActionResult =
  | { ok: true; data: null }
  | { ok: false; error: "testimonial-not-found" | "product-not-found" };

export type TestimonialPresentationField = "displayBody" | "authorName" | "authorTitle";

export type SaveTestimonialPresentationResult =
  | { ok: true; data: null }
  | { ok: false; error: "testimonial-not-found" }
  | { ok: false; error: "invalid-input"; fields: TestimonialPresentationField[] };

const testimonialIdSchema = z.uuid();

const presentationSchema = z.object({
  displayBody: z.string().trim().min(1).max(MAX_TESTIMONIAL_LENGTH),
  authorName: z.string().trim().min(1).max(MAX_AUTHOR_NAME_LENGTH),
  authorTitle: z
    .string()
    .trim()
    .max(MAX_AUTHOR_TITLE_LENGTH)
    .transform((title) => title || null),
});

const changeTestimonial = async (
  testimonialId: unknown,
  change: (
    userId: string,
    testimonialId: string,
  ) => Promise<TestimonialChangeResult | { status: "product-not-found" }>,
): Promise<TestimonialActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };

  const result = await change(signedInUser.id, parsedId.data);
  if (result.status !== "updated") return { ok: false, error: result.status };

  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: null };
};

export type ApproveTestimonialResult =
  | { ok: true; data: { isFirstApproval: boolean } }
  | { ok: false; error: "testimonial-not-found" }
  | { ok: false; error: "plan-limit-reached"; planName: string; testimonialLimit: number | null };

export const approveTestimonial = async (testimonialId: string): Promise<ApproveTestimonialResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };

  const result = await setTestimonialStatus(getDb(), signedInUser.id, parsedId.data, "approved");
  if (result.status === "testimonial-not-found") return { ok: false, error: result.status };

  revalidatePath(SPACE_HOME_PATH, "layout");
  if (result.status === "plan-limit-reached") return { ok: false, error: "plan-limit-reached", ...result };
  return { ok: true, data: { isFirstApproval: result.isFirstApproval } };
};

export const hideTestimonial = async (testimonialId: string): Promise<TestimonialActionResult> =>
  changeTestimonial(testimonialId, async (userId, id) => {
    const result = await setTestimonialStatus(getDb(), userId, id, "hidden");
    return result.status === "updated" ? { status: "updated" } : { status: "testimonial-not-found" };
  });

export const featureTestimonial = async (testimonialId: string, featured: boolean): Promise<TestimonialActionResult> =>
  changeTestimonial(testimonialId, (userId, id) => setTestimonialFeatured(getDb(), userId, id, featured === true));

export const saveTestimonialPresentation = async (
  testimonialId: string,
  presentation: { displayBody: string; authorName: string; authorTitle: string },
): Promise<SaveTestimonialPresentationResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };
  const parsed = presentationSchema.safeParse(presentation);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((issue) => issue.path[0]))].filter(
      (field): field is TestimonialPresentationField =>
        field === "displayBody" || field === "authorName" || field === "authorTitle",
    );
    return { ok: false, error: "invalid-input", fields };
  }

  const result = await editTestimonialPresentation(getDb(), signedInUser.id, parsedId.data, parsed.data);
  if (result.status !== "updated") return { ok: false, error: result.status };

  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: null };
};

export const linkTestimonialProduct = async (
  testimonialId: string,
  productId: string | null,
): Promise<TestimonialActionResult> => {
  const parsedProductId = z.uuid().nullable().safeParse(productId);
  if (!parsedProductId.success) {
    await requireSignedInUser();
    return { ok: false, error: "product-not-found" };
  }
  return changeTestimonial(testimonialId, (userId, id) =>
    setTestimonialProduct(getDb(), userId, id, parsedProductId.data),
  );
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
