"use client";

import { useState } from "react";

const COPIED_FEEDBACK_MS = 3000;

const isShareCancelled = (error: unknown) => error instanceof DOMException && error.name === "AbortError";

export const useCopyLink = (url: string, onCopied?: () => void) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    onCopied?.();
    window.setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS);
  };

  const handleCopy = () => {
    void copyLink();
  };

  const handleShare = () => {
    if (typeof navigator.share !== "function") {
      void copyLink();
      return;
    }
    navigator
      .share({ url })
      .then(() => onCopied?.())
      .catch((error: unknown) => {
        if (!isShareCancelled(error)) void copyLink();
      });
  };

  return { isCopied, handleCopy, handleShare };
};
