import { beforeEach, describe, expect, it, vi } from "vitest";
import { getUploadPublicUrl, presignImageUpload } from "./presign-image-upload";

beforeEach(() => {
  vi.stubEnv("R2_ACCOUNT_ID", "account-id");
  vi.stubEnv("R2_ACCESS_KEY_ID", "access-key-id");
  vi.stubEnv("R2_SECRET_ACCESS_KEY", "secret-access-key");
  vi.stubEnv("R2_BUCKET", "pulsacity-photos");
  vi.stubEnv("R2_PUBLIC_URL", "https://photos.pulsacity.com/");
});

describe("presignImageUpload", () => {
  it("signs a PUT for this key, this type and this exact size only", async () => {
    const url = new URL(
      await presignImageUpload("testimonial-photos/space/photo.jpg", {
        contentType: "image/jpeg",
        contentLength: 48_213,
      }),
    );

    expect(url.origin).toBe("https://pulsacity-photos.account-id.r2.cloudflarestorage.com");
    expect(url.pathname).toBe("/testimonial-photos/space/photo.jpg");
    expect(url.searchParams.get("X-Amz-SignedHeaders")?.split(";")).toEqual(
      expect.arrayContaining(["content-length", "content-type", "host"]),
    );
    expect(url.searchParams.get("X-Amz-Expires")).toBe("300");
  });

  it("adds no checksum the browser could not reproduce", async () => {
    const url = await presignImageUpload("logos/user/logo.png", { contentType: "image/png", contentLength: 1_000 });

    expect(url).not.toMatch(/checksum/i);
  });
});

describe("getUploadPublicUrl", () => {
  it("serves the key from the public bucket address", () => {
    expect(getUploadPublicUrl("logos/user/logo.png")).toBe("https://photos.pulsacity.com/logos/user/logo.png");
  });
});
