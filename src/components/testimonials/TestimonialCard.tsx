"use client";

import Link from "next/link";
import { DISCREET_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FieldError } from "@/components/ui/FieldError";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { cn } from "@/lib/cn";
import { formatDayMonth } from "@/lib/dates/format-french-date";
import { getDisplayedBody } from "@/lib/testimonials/displayed-body";
import type { SpaceTestimonial } from "@/lib/testimonials/list-space-testimonials";
import { FeatureToggle } from "./FeatureToggle";
import { RatingStars } from "./RatingStars";
import { PLAN_LIMIT_MESSAGE, REVIEW_ERROR_MESSAGES, buildHideConfirmation } from "./review-messages";
import { StatusBadge } from "./StatusBadge";
import { TestimonialQuote } from "./TestimonialQuote";
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
        "relative grid grid-cols-[44px_1fr] gap-x-4 gap-y-3 border-b border-hairline-200 py-5",
        isDashboard && "desktop:gap-y-2 desktop:py-6",
      )}
    >
      <span className={cn("flex", isDashboard && "desktop:row-span-2")}>
        <SpaceAvatar name={testimonial.authorName} logoUrl={testimonial.authorPhotoUrl} size={44} background="paper" />
      </span>
      <div className="flex min-w-[0] items-start justify-between gap-3">
        <div className="flex min-w-[0] flex-col">
          <h3 className="text-body">
            <Link
              href={detailHref}
              className="font-semibold after:absolute after:inset-[0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
            >
              {testimonial.authorName}
            </Link>
            {isDashboard && testimonial.authorTitle ? (
              <span className="hidden text-slate-600 desktop:inline">{` · ${testimonial.authorTitle}`}</span>
            ) : null}
          </h3>
          <p className={cn("text-small text-slate-600", isDashboard && "desktop:hidden")}>
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
            <RatingStars rating={testimonial.rating} size={16} />
            {isDashboard ? (
              <span className="hidden text-small text-slate-600 desktop:inline">
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
            "flex items-center gap-5",
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
              className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:min-w-[144px]")}
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
              className="ml-auto hidden text-small font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 desktop:inline"
            >
              Ouvrir
            </Link>
          ) : null}
        </div>
      ) : null}
      {review.isOverPlanLimit ? (
        <p id={`${errorId}-limit`} className="text-small text-slate-600">
          {PLAN_LIMIT_MESSAGE}
        </p>
      ) : null}
      {review.error ? <FieldError id={errorId} message={REVIEW_ERROR_MESSAGES[review.error]} /> : null}
      <ConfirmDialog
        isOpen={review.isHideConfirmationOpen}
        {...buildHideConfirmation(testimonial.authorName)}
        onConfirm={review.hide}
        onCancel={review.cancelHide}
      />
    </div>
  );
};
