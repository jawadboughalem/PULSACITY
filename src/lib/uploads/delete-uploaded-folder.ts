import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";
import { createR2Client } from "./r2-client";

/**
 * Deletes every file whose key starts with this folder (« logos/<user>/ »). One file at a time, as a single photo is
 * deleted (deleteUploadedImage): a space holds a few dozen files at most.
 */
export const deleteUploadedFolder = async (folder: string): Promise<void> => {
  const client = createR2Client();
  const bucket = readRequiredEnvironmentVariable("R2_BUCKET");
  let continuationToken: string | undefined;
  do {
    const listed = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: folder, ContinuationToken: continuationToken }),
    );
    for (const object of listed.Contents ?? []) {
      if (object.Key) await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: object.Key }));
    }
    continuationToken = listed.IsTruncated ? listed.NextContinuationToken : undefined;
  } while (continuationToken);
};
