import { S3Client } from "@aws-sdk/client-s3";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";

export const createR2Client = () =>
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
