import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";
import { readUploadKey } from "./presign-image-upload";
import { createR2Client } from "./r2-client";

export const deleteUploadedImage = async (publicUrl: string): Promise<void> => {
  const key = readUploadKey(publicUrl);
  if (!key) return;
  await createR2Client().send(
    new DeleteObjectCommand({ Bucket: readRequiredEnvironmentVariable("R2_BUCKET"), Key: key }),
  );
};
