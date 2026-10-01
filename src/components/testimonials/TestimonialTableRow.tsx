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
import { PLAN_LIMIT_MESSAGE, REVIEW_ERROR_MESSAGES, buildDeleteConfirmation, buildHideConfirmation } from "./review-messages";
import { RowMenu } from "./RowMenu";
import { StatusBadge } from "./StatusBadge";
import { useTestimonialDeletion } from "./useTestimonialDeletion";
import { useTestimonialReview } from "./useTestimonialReview";

type TestimonialTableRowProps = {
  testimonial: SpaceTestimonial;
  detailHref: string;
  isApprovalAllowed: boolean;
};

export const TestimonialTableRow = ({ testimonial, detailHref, isApprovalAllowed }: TestimonialTableRowProps) => {
  const review = useTestimonialReview(testimonial, isApprovalAllowed);
  const deletion = useTestimonialDeletion(testimonial.id);
  const error = review.error ?? deletion.error;
  if (deletion.isDeleted) return null;

  return (
    <tr className={cn("border-b border-hairline-200 align-middle", deletion.isDeleting && "opacity-60")}>
      <td className="py-5 pr-4">
        <div className="flex items-center gap-4">
          <SpaceAvatar name={testimonial.authorName} logoUrl={testimonial.authorPhotoUrl} size={44} background="paper" />
          <div className="flex min-w-[0] flex-col">
            <Link
              href={detailHref}
              className="truncate text-body font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
            >
              {testimonial.authorName}
            </Link>
            <span className="text-small whitespace-nowrap text-slate-600">{`Reçu le ${formatDayMonth(testimonial.createdAt)}`}</span>
          </div>
        </div>
      </td>
      <td className="py-5 pr-4">
        <p className="line-clamp-2 font-serif text-body">{getDisplayedBody(testimonial)}</p>
        {review.isOverPlanLimit ? <p className="mt-2 text-small text-slate-600">{PLAN_LIMIT_MESSAGE}</p> : null}
        {error ? (
          <div className="mt-2">
            <FieldError id={`${testimonial.id}-row-error`} message={REVIEW_ERROR_MESSAGES[error]} />
          </div>
        ) : null}
      </td>
      <td className="py-5 pr-4">
        <RatingStars rating={testimonial.rating} size={16} />
      </td>
      <td className="py-5 pr-4 text-small text-slate-600">
        <span className="line-clamp-2">{testimonial.productName ?? "Sans offre"}</span>
      </td>
      <td className="py-5 pr-4">
        <StatusBadge status={review.status} isJustApproved={review.isJustApproved} />
      </td>
      <td className="py-5 pr-4">
        <FeatureToggle isFeatured={review.featured} authorName={testimonial.authorName} onToggle={review.toggleFeatured} />
      </td>
      <td className="py-5">
        <div className="flex items-center justify-end gap-3">
          {review.status !== "approved" ? (
            <button
              type="button"
              onClick={review.approve}
              disabled={review.isOverPlanLimit}
              className={SECONDARY_BUTTON_CLASSES}
            >
              Valider
            </button>
          ) : null}
          {review.status !== "hidden" ? (
            <button type="button" onClick={review.askToHide} className={cn(DISCREET_BUTTON_CLASSES, "min-h-[44px]")}>
              Masquer
            </button>
          ) : null}
          <RowMenu authorName={testimonial.authorName} detailHref={detailHref} onDelete={deletion.askToDelete} />
        </div>
        <ConfirmDialog
          isOpen={review.isHideConfirmationOpen}
          {...buildHideConfirmation(testimonial.authorName)}
          onConfirm={review.hide}
          onCancel={review.cancelHide}
        />
        <ConfirmDialog
          isOpen={deletion.isConfirmationOpen}
          {...buildDeleteConfirmation(testimonial.authorName)}
          onConfirm={deletion.confirmDeletion}
          onCancel={deletion.cancelDeletion}
        />
      </td>
    </tr>
  );
};
