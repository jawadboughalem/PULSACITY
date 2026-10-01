"use client";

import { useState, useTransition } from "react";
import { deleteTestimonialForGood } from "@/app/app/(espace)/temoignages/testimonial-actions";
import type { ReviewError } from "./review-messages";

export const useTestimonialDeletion = (testimonialId: string, onDeleted?: () => void) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, startDeleting] = useTransition();
  const [error, setError] = useState<ReviewError | null>(null);

  const confirmDeletion = () => {
    setIsConfirmationOpen(false);
    setError(null);
    startDeleting(async () => {
      try {
        const result = await deleteTestimonialForGood(testimonialId);
        if (result.ok) {
          setIsDeleted(true);
          onDeleted?.();
        } else {
          setError(result.error === "testimonial-not-found" ? "testimonial-not-found" : "not-saved");
        }
      } catch {
        setError("not-saved");
      }
    });
  };

  return {
    isConfirmationOpen,
    isDeleted,
    isDeleting,
    error,
    askToDelete: () => setIsConfirmationOpen(true),
    cancelDeletion: () => setIsConfirmationOpen(false),
    confirmDeletion,
  };
};
