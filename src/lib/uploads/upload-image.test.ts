import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ImageNotReadableError } from "./image-not-readable-error";
import { MAX_SOURCE_IMAGE_BYTES } from "./image-upload-rules";
import { resizeImage } from "./resize-image";
import { uploadImage } from "./upload-image";

vi.mock("./resize-image", () => ({ resizeImage: vi.fn() }));

const RESIZED = new Blob(["resized"], { type: "image/jpeg" });
const TICKET = { ok: true, data: { uploadUrl: "https://r2.example/upload?signature", key: "testimonial-photos/s/p.jpg" } } as const;

const photo = (size = 1_000, type = "image/jpeg") => {
  const file = new File(["x"], "photo.jpg", { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

beforeEach(() => {
  vi.mocked(resizeImage).mockResolvedValue(RESIZED);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 200 })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("uploadImage", () => {
  it("resizes, asks for a signed address of that exact size, then sends the photo there", async () => {
    const requestTicket = vi.fn().mockResolvedValue(TICKET);

    const result = await uploadImage(photo(), "image/jpeg", requestTicket);

    expect(requestTicket).toHaveBeenCalledWith({ contentType: "image/jpeg", contentLength: RESIZED.size });
    expect(fetch).toHaveBeenCalledWith(TICKET.data.uploadUrl, {
      method: "PUT",
      body: RESIZED,
      headers: { "Content-Type": "image/jpeg" },
    });
    expect(result).toEqual({ ok: true, data: { key: TICKET.data.key, previewUrl: expect.stringMatching(/^blob:/) } });
  });

  it("refuses a file that is not an image, or that the browser cannot read", async () => {
    const requestTicket = vi.fn();

    expect(await uploadImage(photo(1_000, "application/pdf"), "image/jpeg", requestTicket)).toEqual({
      ok: false,
      error: "not-an-image",
    });
    vi.mocked(resizeImage).mockRejectedValue(new ImageNotReadableError());
    expect(await uploadImage(photo(), "image/jpeg", requestTicket)).toEqual({ ok: false, error: "not-an-image" });
    expect(requestTicket).not.toHaveBeenCalled();
  });

  it("refuses a photo over 10 MB before doing anything", async () => {
    const requestTicket = vi.fn();

    expect(await uploadImage(photo(MAX_SOURCE_IMAGE_BYTES + 1), "image/jpeg", requestTicket)).toEqual({
      ok: false,
      error: "too-large",
    });
    expect(resizeImage).not.toHaveBeenCalled();
  });

  it("reports the server refusing, and the storage failing", async () => {
    expect(
      await uploadImage(photo(), "image/jpeg", vi.fn().mockResolvedValue({ ok: false, error: "too-many-uploads" })),
    ).toEqual({ ok: false, error: "too-many-uploads" });

    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 403 }));
    expect(await uploadImage(photo(), "image/jpeg", vi.fn().mockResolvedValue(TICKET))).toEqual({
      ok: false,
      error: "upload-failed",
    });

    vi.mocked(fetch).mockRejectedValue(new TypeError("Network down"));
    expect(await uploadImage(photo(), "image/jpeg", vi.fn().mockResolvedValue(TICKET))).toEqual({
      ok: false,
      error: "upload-failed",
    });
  });
});
