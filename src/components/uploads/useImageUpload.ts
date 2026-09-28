"use client";

import { useState } from "react";
import type { ImageUploadRequest } from "@/lib/uploads/image-upload-rules";
import type { ResizedImageType } from "@/lib/uploads/resize-image";
import {
  type ImageUploadError,
  type ImageUploadTicketResult,
  type UploadedImage,
  uploadImage,
} from "@/lib/uploads/upload-image";

export type ImageUploadState =
  | { status: "empty" }
  | { status: "uploading" }
  | { status: "uploaded"; image: UploadedImage }
  | { status: "failed"; error: ImageUploadError };

export const useImageUpload = (
  type: ResizedImageType,
  requestTicket: (request: ImageUploadRequest) => Promise<ImageUploadTicketResult>,
) => {
  const [state, setState] = useState<ImageUploadState>({ status: "empty" });

  const releasePreview = () => {
    if (state.status === "uploaded") URL.revokeObjectURL(state.image.previewUrl);
  };

  const handleSelectFile = async (file: File | undefined) => {
    if (!file) return;
    releasePreview();
    setState({ status: "uploading" });
    const result = await uploadImage(file, type, requestTicket);
    setState(result.ok ? { status: "uploaded", image: result.data } : { status: "failed", error: result.error });
  };

  const handleRemove = () => {
    releasePreview();
    setState({ status: "empty" });
  };

  return { state, handleSelectFile, handleRemove };
};

export type ImageUpload = ReturnType<typeof useImageUpload>;
