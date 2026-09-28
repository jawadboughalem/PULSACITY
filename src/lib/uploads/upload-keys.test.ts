import { describe, expect, it } from "vitest";
import { buildLogoKey, buildTestimonialPhotoKey, isLogoKeyOf, isTestimonialPhotoKeyOf } from "./upload-keys";

const SPACE_ID = "8f14e45f-ceea-467a-9575-5f0e3a1b2c3d";

describe("upload keys", () => {
  it("files a testimonial photo under its space, with an unguessable name", () => {
    const key = buildTestimonialPhotoKey(SPACE_ID, "image/jpeg");

    expect(key).toMatch(new RegExp(`^testimonial-photos/${SPACE_ID}/[0-9a-f-]{36}\\.jpg$`));
    expect(buildTestimonialPhotoKey(SPACE_ID, "image/jpeg")).not.toBe(key);
    expect(isTestimonialPhotoKeyOf(SPACE_ID, key)).toBe(true);
  });

  it("refuses a key from another space, another folder or an arbitrary address", () => {
    const key = buildTestimonialPhotoKey(SPACE_ID, "image/webp");

    expect(isTestimonialPhotoKeyOf("another-space", key)).toBe(false);
    expect(isLogoKeyOf(SPACE_ID, key)).toBe(false);
    expect(isTestimonialPhotoKeyOf(SPACE_ID, "https://evil.example/photo.jpg")).toBe(false);
    expect(isTestimonialPhotoKeyOf(SPACE_ID, `${key}/../../logos/x.jpg`)).toBe(false);
  });

  it("files a logo under the user who uploads it", () => {
    const key = buildLogoKey("user_Ab.1", "image/png");

    expect(isLogoKeyOf("user_Ab.1", key)).toBe(true);
    expect(isLogoKeyOf("user_AbX1", key)).toBe(false);
  });
});
