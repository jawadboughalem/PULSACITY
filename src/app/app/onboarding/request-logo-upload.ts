"use server";

import { getDb } from "@/db";
import { getSignedInUser } from "@/lib/auth/get-signed-in-user";
import { type RateLimitRule, consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { type ImageUploadRequest, imageUploadRequestSchema } from "@/lib/uploads/image-upload-rules";
import { presignImageUpload } from "@/lib/uploads/presign-image-upload";
import type { ImageUploadTicketResult } from "@/lib/uploads/upload-image";
import { buildLogoKey } from "@/lib/uploads/upload-keys";

const LOGO_UPLOADS_PER_USER: RateLimitRule = { name: "logo-upload", limit: 20, windowSeconds: 60 * 60 };

export const requestLogoUpload = async (request: ImageUploadRequest): Promise<ImageUploadTicketResult> => {
  const signedInUser = await getSignedInUser();
  if (!signedInUser) return { ok: false, error: "not-allowed" };

  const parsed = imageUploadRequestSchema.safeParse(request);
  if (!parsed.success) return { ok: false, error: "invalid-image" };

  if (!(await consumeRateLimit(getDb(), LOGO_UPLOADS_PER_USER, signedInUser.id))) {
    return { ok: false, error: "too-many-uploads" };
  }

  const key = buildLogoKey(signedInUser.id, parsed.data.contentType);
  return { ok: true, data: { key, uploadUrl: await presignImageUpload(key, parsed.data) } };
};
