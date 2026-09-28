"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { spaces } from "@/db/schema";
import { consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { hashRateLimitSubject } from "@/lib/rate-limit/hash-rate-limit-subject";
import { readClientIp } from "@/lib/rate-limit/read-client-ip";
import { TESTIMONIAL_PHOTOS_PER_IP } from "@/lib/testimonials/testimonial-rate-limits";
import { type ImageUploadRequest, imageUploadRequestSchema } from "@/lib/uploads/image-upload-rules";
import { presignImageUpload } from "@/lib/uploads/presign-image-upload";
import type { ImageUploadTicketResult } from "@/lib/uploads/upload-image";
import { buildTestimonialPhotoKey } from "@/lib/uploads/upload-keys";

export const requestTestimonialPhotoUpload = async (
  spaceSlug: string,
  request: ImageUploadRequest,
): Promise<ImageUploadTicketResult> => {
  const parsed = imageUploadRequestSchema.safeParse(request);
  if (!parsed.success) return { ok: false, error: "invalid-image" };

  const database = getDb();
  const [space] = await database.select({ id: spaces.id }).from(spaces).where(eq(spaces.slug, spaceSlug)).limit(1);
  if (!space) return { ok: false, error: "not-allowed" };

  const clientIp = readClientIp(await headers());
  if (!(await consumeRateLimit(database, TESTIMONIAL_PHOTOS_PER_IP, hashRateLimitSubject(clientIp)))) {
    return { ok: false, error: "too-many-uploads" };
  }

  const key = buildTestimonialPhotoKey(space.id, parsed.data.contentType);
  return { ok: true, data: { key, uploadUrl: await presignImageUpload(key, parsed.data) } };
};
