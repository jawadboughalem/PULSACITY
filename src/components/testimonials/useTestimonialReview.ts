"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  approveTestimonial,
  featureTestimonial,
  hideTestimonial,
} from "@/app/app/(espace)/temoignages/testimonial-actions";
import type { TestimonialStatus } from "@/lib/testimonials/testimonial-filters";
import { useCelebrateFirstApproval } from "./FirstApprovalCelebration";
import type { ReviewError } from "./review-messages";

type ReviewedTestimonial = {
  id: string;
  status: TestimonialStatus;
  featured: boolean;
};

/** Valider, Masquer and Mettre en avant show at once, and come back if the server refuses. */
export const useTestimonialReview = (testimonial: ReviewedTestimonial, isApprovalAllowed: boolean) => {
  const [status, setOptimisticStatus] = useOptimistic(testimonial.status);
  const [featured, setOptimisticFeatured] = useOptimistic(testimonial.featured);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<ReviewError | null>(null);
  const [isJustApproved, setIsJustApproved] = useState(false);
  const [isHideConfirmationOpen, setIsHideConfirmationOpen] = useState(false);
  const celebrateFirstApproval = useCelebrateFirstApproval();

  const run = (change: () => Promise<void>) => {
    setError(null);
    startTransition(async () => {
      try {
        await change();
      } catch {
        setError("not-saved");
      }
    });
  };

  const approve = () =>
    run(async () => {
      setOptimisticStatus("approved");
      const result = await approveTestimonial(testimonial.id);
      if (result.ok) {
        setIsJustApproved(true);
        if (result.data.isFirstApproval) celebrateFirstApproval();
      } else if (result.error !== "plan-limit-reached") {
        setError(result.error);
      }
    });

  const hide = () => {
    setIsHideConfirmationOpen(false);
    run(async () => {
      setOptimisticStatus("hidden");
      const result = await hideTestimonial(testimonial.id);
      if (!result.ok) setError(result.error === "testimonial-not-found" ? "testimonial-not-found" : "not-saved");
    });
  };

  const toggleFeatured = () =>
    run(async () => {
      setOptimisticFeatured(!featured);
      const result = await featureTestimonial(testimonial.id, !featured);
      if (!result.ok) setError(result.error === "testimonial-not-found" ? "testimonial-not-found" : "not-saved");
    });

  return {
    status,
    featured,
    isPending,
    error,
    isOverPlanLimit: !isApprovalAllowed && status !== "approved",
    isJustApproved,
    isHideConfirmationOpen,
    approve,
    askToHide: () => setIsHideConfirmationOpen(true),
    cancelHide: () => setIsHideConfirmationOpen(false),
    hide,
    toggleFeatured,
  };
};
