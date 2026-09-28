import { ImageNotReadableError } from "./image-not-readable-error";
import { MAX_IMAGE_DIMENSION } from "./image-upload-rules";

const JPEG_QUALITY = 0.85;
const OPAQUE_BACKGROUND = "#FFFFFF";

export type ResizedImageType = "image/jpeg" | "image/png";

export const computeResizedDimensions = (width: number, height: number, maxDimension = MAX_IMAGE_DIMENSION) => {
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
};

const encodeCanvas = (canvas: HTMLCanvasElement, type: ResizedImageType) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new ImageNotReadableError());
      },
      type,
      JPEG_QUALITY,
    );
  });

export const resizeImage = async (file: Blob, type: ResizedImageType): Promise<Blob> => {
  const bitmap = await createImageBitmap(file).catch((error: unknown) => {
    throw new ImageNotReadableError(error);
  });
  const { width, height } = computeResizedDimensions(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new ImageNotReadableError();

  if (type === "image/jpeg") {
    context.fillStyle = OPAQUE_BACKGROUND;
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return encodeCanvas(canvas, type);
};
