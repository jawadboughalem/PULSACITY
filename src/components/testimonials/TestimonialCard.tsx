"use client";

import Link from "next/link";
import { DISCREET_BUTTON_CLASSES, FOCUS_RING, SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { cn } from "@/lib/cn";
import { formatDayMonth } from "@/lib/dates/format-french-date";
import { getDisplayedBody } from "@/lib/testimonials/displayed-body";
import type { SpaceTestimonial } from "@/lib/testimonials/list-space-testimonials";
import { FeatureToggle } from "./FeatureToggle";
import { RatingStars } from "./RatingStars";
import { PLAN_LIMIT_MESSAGE, REVIEW_ERROR_MESSAGES } from "./review-messages";
import { StatusBadge } from "./StatusBadge";
import { TestimonialQuote } from "./TestimonialQuote";
import { HideTestimonialDialog } from "./HideTestimonialDialog";
import { useTestimonialReview } from "./useTestimonialReview";

type TestimonialCardProps = {
  testimonial: SpaceTestimonial;
  variant: "dashboard" | "list";
  detailHref: string;
  isApprovalAllowed: boolean;
};

const describeReception = (testimonial: SpaceTestimonial, prefix: string) =>
  [testimonial.productName, `${prefix}${formatDayMonth(testimonial.createdAt)}`].filter(Boolean).join(" · ");

export const TestimonialCard = ({ testimonial, variant, detailHref, isApprovalAllowed }: TestimonialCardProps) => {
  const review = useTestimonialReview(testimonial, isApprovalAllowed);
  const isDashboard = variant === "dashboard";
  const errorId = `${testimonial.id}-review-error`;

  return (
    <article
      className={cn(
        "relative grid grid-cols-[44px_1fr] gap-x-4 gap-y-3 rounded-card bg-white p-4",
        isDashboard && "desktop:gap-y-2 desktop:p-6",
      )}
    >
      <span className={cn("flex", isDashboard && "desktop:row-span-2")}>
        <SpaceAvatar name={testimonial.authorName} logoUrl={testimonial.authorPhotoUrl} size={44} background="sky" />
      </span>
      <div className="flex min-w-[0] items-start justify-between gap-3">
        <div className="flex min-w-[0] flex-col">
          <h3 className="text-body">
            <Link
              href={detailHref}
              className={cn("font-bold after:absolute after:inset-[0]", FOCUS_RING)}
            >
              {testimonial.authorName}
            </Link>
            {isDashboard && testimonial.authorTitle ? (
              <span className="hidden text-gray desktop:inline">{` · ${testimonial.authorTitle}`}</span>
            ) : null}
          </h3>
          <p className={cn("text-small text-gray", isDashboard && "desktop:hidden")}>
            {describeReception(testimonial, "")}
          </p>
        </div>
        {isDashboard ? (
          <span className="hidden desktop:inline-flex">
            <StatusBadge status={review.status} isJustApproved={review.isJustApproved} />
          </span>
        ) : (
          <FeatureToggle
            isFeatured={review.featured}
            authorName={testimonial.authorName}
            onToggle={review.toggleFeatured}
            className="-mt-2 -mr-2"
          />
        )}
      </div>
      <div className="col-span-2 flex flex-col gap-3 desktop:col-span-1 desktop:col-start-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RatingStars rating={testimonial.rating} size={isDashboard ? 16 : 18} />
            {isDashboard ? (
              <span className="hidden text-small text-gray desktop:inline">
                {describeReception(testimonial, "reçu le ")}
              </span>
            ) : null}
          </div>
          <span className={cn("inline-flex", isDashboard && "desktop:hidden")}>
            <StatusBadge status={review.status} isJustApproved={review.isJustApproved} />
          </span>
        </div>
        <TestimonialQuote
          text={getDisplayedBody(testimonial)}
          size={isDashboard ? "quote" : "body"}
          isClamped={!isDashboard && review.status !== "pending"}
        />
        <ReviewActions
          className="mt-2"
          review={review}
          testimonial={testimonial}
          detailHref={detailHref}
          isDashboard={isDashboard}
          errorId={errorId}
        />
      </div>
    </article>
  );
};

type ReviewActionsProps = {
  className?: string;
  review: ReturnType<typeof useTestimonialReview>;
  testimonial: SpaceTestimonial;
  detailHref: string;
  isDashboard: boolean;
  errorId: string;
};

const ReviewActions = ({ className, review, testimonial, detailHref, isDashboard, errorId }: ReviewActionsProps) => {
  const canApprove = review.status !== "approved";
  const canHide = review.status !== "hidden";
  const showsActions = canApprove || isDashboard;
  if (!showsActions && !review.error) return null;

  return (
    <div className={cn("relative flex flex-col gap-2", className)}>
      {showsActions ? (
        <div
          className={cn(
            "flex items-center gap-6",
            !isDashboard && "grid grid-cols-2",
            isDashboard && "max-desktop:grid max-desktop:grid-cols-2",
            isDashboard && !canApprove && "max-desktop:hidden",
          )}
        >
          {canApprove ? (
            <button
              type="button"
              onClick={review.approve}
              disabled={review.isOverPlanLimit}
              aria-describedby={review.isOverPlanLimit ? `${errorId}-limit` : undefined}
              className={cn(SECONDARY_COMPACT_BUTTON_CLASSES, "w-full desktop:w-auto desktop:min-w-[144px]")}
            >
              Valider
            </button>
          ) : null}
          {canHide ? (
            <button
              type="button"
              onClick={review.askToHide}
              className={cn(DISCREET_BUTTON_CLASSES, "justify-center", !canApprove && "justify-start")}
            >
              Masquer
            </button>
          ) : null}
          {isDashboard ? (
            <Link
              href={detailHref}
              className={cn(DISCREET_BUTTON_CLASSES, "ml-auto hidden desktop:inline-flex")}
            >
              Ouvrir
            </Link>
          ) : null}
        </div>
      ) : null}
      {review.isOverPlanLimit ? (
        <p id={`${errorId}-limit`} className="text-small text-gray">
          {PLAN_LIMIT_MESSAGE}
        </p>
      ) : null}
      {review.error ? <FieldError id={errorId} message={REVIEW_ERROR_MESSAGES[review.error]} /> : null}
      <HideTestimonialDialog
        isOpen={review.isHideConfirmationOpen}
        authorName={testimonial.authorName}
        authorReach={testimonial.authorReach}
        isPending={review.isHiding}
        onConfirm={review.hide}
        onCancel={review.cancelHide}
      />
    </div>
  );
};
