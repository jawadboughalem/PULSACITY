"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  approveTestimonial,
  featureTestimonial,
  hideTestimonialWithReason,
} from "@/app/app/(espace)/temoignages/testimonial-actions";
import type { HidingReason } from "@/lib/testimonials/hide-testimonial";
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
  const [isHiding, setIsHiding] = useState(false);
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

  /** The window stays open while the reason leaves to the author (charte v2: « Envoi… »), then closes. */
  const hide = (hiding: HidingReason) => {
    setIsHiding(true);
    run(async () => {
      try {
        const result = await hideTestimonialWithReason(testimonial.id, hiding);
        if (result.ok) setOptimisticStatus("hidden");
        else setError(result.error === "testimonial-not-found" ? "testimonial-not-found" : "not-saved");
      } finally {
        setIsHiding(false);
        setIsHideConfirmationOpen(false);
      }
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
    isHiding,
    approve,
    askToHide: () => setIsHideConfirmationOpen(true),
    cancelHide: () => {
      if (!isHiding) setIsHideConfirmationOpen(false);
    },
    hide,
    toggleFeatured,
  };
};
