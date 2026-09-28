import { ImageNotReadableError } from "./image-not-readable-error";
import { type ImageUploadRequest, type ImageUploadTicket, MAX_SOURCE_IMAGE_BYTES } from "./image-upload-rules";
import { type ResizedImageType, resizeImage } from "./resize-image";

export type ImageUploadError = "too-large" | "not-an-image" | "upload-failed" | "too-many-uploads";

export type ImageUploadTicketResult =
  | { ok: true; data: ImageUploadTicket }
  | { ok: false; error: "too-many-uploads" | "invalid-image" | "not-allowed" };

export type UploadedImage = {
  key: string;
  previewUrl: string;
};

export type ImageUploadResult = { ok: true; data: UploadedImage } | { ok: false; error: ImageUploadError };

export const uploadImage = async (
  file: File,
  type: ResizedImageType,
  requestTicket: (request: ImageUploadRequest) => Promise<ImageUploadTicketResult>,
): Promise<ImageUploadResult> => {
  if (!file.type.startsWith("image/")) return { ok: false, error: "not-an-image" };
  if (file.size > MAX_SOURCE_IMAGE_BYTES) return { ok: false, error: "too-large" };

  let resized: Blob;
  try {
    resized = await resizeImage(file, type);
  } catch (error) {
    if (error instanceof ImageNotReadableError) return { ok: false, error: "not-an-image" };
    throw error;
  }

  const ticket = await requestTicket({ contentType: type, contentLength: resized.size });
  if (!ticket.ok) return { ok: false, error: ticket.error === "too-many-uploads" ? "too-many-uploads" : "upload-failed" };

  const response = await fetch(ticket.data.uploadUrl, {
    method: "PUT",
    body: resized,
    headers: { "Content-Type": type },
  }).catch(() => null);
  if (!response?.ok) return { ok: false, error: "upload-failed" };

  return { ok: true, data: { key: ticket.data.key, previewUrl: URL.createObjectURL(resized) } };
};
