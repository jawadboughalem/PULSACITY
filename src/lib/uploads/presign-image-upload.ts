import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";
import type { ImageUploadRequest } from "./image-upload-rules";
import { createR2Client } from "./r2-client";

const UPLOAD_URL_LIFETIME_SECONDS = 5 * 60;

const SIGNED_UPLOAD_HEADERS = new Set(["content-type", "content-length"]);

export const presignImageUpload = async (key: string, request: ImageUploadRequest): Promise<string> =>
  getSignedUrl(
    createR2Client(),
    new PutObjectCommand({
      Bucket: readRequiredEnvironmentVariable("R2_BUCKET"),
      Key: key,
      ContentType: request.contentType,
      ContentLength: request.contentLength,
    }),
    { expiresIn: UPLOAD_URL_LIFETIME_SECONDS, signableHeaders: SIGNED_UPLOAD_HEADERS },
  );

const readPublicUrlBase = () => `${readRequiredEnvironmentVariable("R2_PUBLIC_URL").replace(/\/+$/, "")}/`;

export const getUploadPublicUrl = (key: string): string => `${readPublicUrlBase()}${key}`;

export const readUploadKey = (publicUrl: string): string | null => {
  const base = readPublicUrlBase();
  return publicUrl.startsWith(base) && publicUrl.length > base.length ? publicUrl.slice(base.length) : null;
};
