import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";
import type { ImageUploadRequest } from "./image-upload-rules";

const UPLOAD_URL_LIFETIME_SECONDS = 5 * 60;

const SIGNED_UPLOAD_HEADERS = new Set(["content-type", "content-length"]);

const createR2Client = () =>
  new S3Client({
    region: "auto",
    endpoint: `https://${readRequiredEnvironmentVariable("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: readRequiredEnvironmentVariable("R2_ACCESS_KEY_ID"),
      secretAccessKey: readRequiredEnvironmentVariable("R2_SECRET_ACCESS_KEY"),
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

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

export const getUploadPublicUrl = (key: string): string =>
  `${readRequiredEnvironmentVariable("R2_PUBLIC_URL").replace(/\/+$/, "")}/${key}`;
