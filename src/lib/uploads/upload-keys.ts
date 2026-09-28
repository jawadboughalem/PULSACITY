import { randomUUID } from "node:crypto";
import { IMAGE_EXTENSIONS, type ImageContentType } from "./image-upload-rules";

const LOGO_FOLDER = "logos";
const TESTIMONIAL_PHOTO_FOLDER = "testimonial-photos";

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const EXTENSION = `(?:${Object.values(IMAGE_EXTENSIONS).join("|")})`;

const escapeForPattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildKey = (folder: string, ownerId: string, contentType: ImageContentType) =>
  `${folder}/${ownerId}/${randomUUID()}.${IMAGE_EXTENSIONS[contentType]}`;

const isKeyOf = (folder: string, ownerId: string, key: string) =>
  new RegExp(`^${folder}/${escapeForPattern(ownerId)}/${UUID}\\.${EXTENSION}$`).test(key);

export const buildLogoKey = (userId: string, contentType: ImageContentType) =>
  buildKey(LOGO_FOLDER, userId, contentType);

export const isLogoKeyOf = (userId: string, key: string) => isKeyOf(LOGO_FOLDER, userId, key);

export const buildTestimonialPhotoKey = (spaceId: string, contentType: ImageContentType) =>
  buildKey(TESTIMONIAL_PHOTO_FOLDER, spaceId, contentType);

export const isTestimonialPhotoKeyOf = (spaceId: string, key: string) =>
  isKeyOf(TESTIMONIAL_PHOTO_FOLDER, spaceId, key);
