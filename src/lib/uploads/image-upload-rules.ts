import { z } from "zod";

export const MAX_IMAGE_DIMENSION = 400;

export const MAX_SOURCE_IMAGE_BYTES = 10 * 1024 * 1024;

export const MAX_UPLOADED_IMAGE_BYTES = 2 * 1024 * 1024;

export const IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type ImageContentType = keyof typeof IMAGE_EXTENSIONS;

export const imageUploadRequestSchema = z.object({
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  contentLength: z.number().int().positive().max(MAX_UPLOADED_IMAGE_BYTES),
});

export type ImageUploadRequest = z.infer<typeof imageUploadRequestSchema>;

export type ImageUploadTicket = {
  uploadUrl: string;
  key: string;
};
