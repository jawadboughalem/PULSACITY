"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { getSignedInUser } from "@/lib/auth/get-signed-in-user";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { type RateLimitRule, consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import { addManualTestimonial } from "@/lib/testimonials/add-manual-testimonial";
import {
  type ManualTestimonialFieldErrors,
  collectManualTestimonialFieldErrors,
  manualTestimonialFormSchema,
} from "@/lib/testimonials/manual-testimonial-form-schema";
import { type ImageUploadRequest, imageUploadRequestSchema } from "@/lib/uploads/image-upload-rules";
import { presignImageUpload } from "@/lib/uploads/presign-image-upload";
import type { ImageUploadTicketResult } from "@/lib/uploads/upload-image";
import { buildTestimonialPhotoKey } from "@/lib/uploads/upload-keys";

const MANUAL_PHOTO_UPLOADS_PER_USER: RateLimitRule = {
  name: "manual-testimonial-photo-upload",
  limit: 40,
  windowSeconds: 60 * 60,
};

export type AddManualTestimonialFormResult =
  | {
      ok: true;
      data: {
        testimonialId: string;
        isFirstApproval: boolean;
        pendingPlan: { name: string; testimonialLimit: number | null } | null;
      };
    }
  | { ok: false; error: "invalid-input"; fieldErrors: ManualTestimonialFieldErrors }
  | { ok: false; error: "space-not-found" | "product-not-found" | "invalid-photo" };

export const addManualTestimonialForm = async (input: unknown): Promise<AddManualTestimonialFormResult> => {
  const signedInUser = await requireSignedInUser();
  const parsed = manualTestimonialFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "invalid-input", fieldErrors: collectManualTestimonialFieldErrors(parsed.error) };
  }

  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  if (!space) return { ok: false, error: "space-not-found" };

  const { productId, rating, body, authorName, authorTitle, receivedAt, photoKey } = parsed.data;
  const result = await addManualTestimonial(database, signedInUser.id, space.id, {
    productId,
    rating,
    body,
    authorName,
    authorTitle,
    receivedAt,
    photoKey,
  });
  if (result.status !== "added") return { ok: false, error: result.status };

  revalidatePath(SPACE_HOME_PATH, "layout");
  return {
    ok: true,
    data: { testimonialId: result.testimonialId, isFirstApproval: result.isFirstApproval, pendingPlan: result.plan },
  };
};

export const requestManualTestimonialPhotoUpload = async (
  request: ImageUploadRequest,
): Promise<ImageUploadTicketResult> => {
  const signedInUser = await getSignedInUser();
  if (!signedInUser) return { ok: false, error: "not-allowed" };

  const parsed = imageUploadRequestSchema.safeParse(request);
  if (!parsed.success) return { ok: false, error: "invalid-image" };

  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  if (!space) return { ok: false, error: "not-allowed" };
  if (!(await consumeRateLimit(database, MANUAL_PHOTO_UPLOADS_PER_USER, signedInUser.id))) {
    return { ok: false, error: "too-many-uploads" };
  }

  const key = buildTestimonialPhotoKey(space.id, parsed.data.contentType);
  return { ok: true, data: { key, uploadUrl: await presignImageUpload(key, parsed.data) } };
};
