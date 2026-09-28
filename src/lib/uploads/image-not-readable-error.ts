export class ImageNotReadableError extends Error {
  constructor(cause?: unknown) {
    super("The browser could not read or re-encode this image.", { cause });
    this.name = "ImageNotReadableError";
  }
}
