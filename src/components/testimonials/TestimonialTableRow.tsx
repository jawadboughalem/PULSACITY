"use client";

import Link from "next/link";
import { DISCREET_BUTTON_CLASSES, FOCUS_RING, SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FieldError } from "@/components/ui/FieldError";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { cn } from "@/lib/cn";
import { formatDayMonth } from "@/lib/dates/format-french-date";
import { getDisplayedBody } from "@/lib/testimonials/displayed-body";
import type { SpaceTestimonial } from "@/lib/testimonials/list-space-testimonials";
import { FeatureToggle } from "./FeatureToggle";
import { RatingStars } from "./RatingStars";
import { PLAN_LIMIT_MESSAGE, REVIEW_ERROR_MESSAGES, buildDeleteConfirmation } from "./review-messages";
import { RowMenu } from "./RowMenu";
import { StatusBadge } from "./StatusBadge";
import { useTestimonialDeletion } from "./useTestimonialDeletion";
import { HideTestimonialDialog } from "./HideTestimonialDialog";
import { useTestimonialReview } from "./useTestimonialReview";

/** Charte v2, Tableau: rows on white, padding 18 16, no rule between them; Nuage under the pointer, radius-field ends. */
const CELL_CLASSES = "pz-couleur py-[18px] pr-4 group-hover/row:bg-cloud";

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
    <tr className={cn("group/row align-middle", deletion.isDeleting && "opacity-60")}>
      <td className={cn(CELL_CLASSES, "rounded-l-field pl-4")}>
        <div className="flex items-center gap-4">
          <SpaceAvatar name={testimonial.authorName} logoUrl={testimonial.authorPhotoUrl} size={44} background="sky" />
          <div className="flex min-w-[0] flex-col">
            <Link
              href={detailHref}
              className={cn("truncate text-body font-bold decoration-2 underline-offset-4 hover:underline", FOCUS_RING)}
            >
              {testimonial.authorName}
            </Link>
            <span className="text-small whitespace-nowrap text-gray">{`Reçu le ${formatDayMonth(testimonial.createdAt)}`}</span>
          </div>
        </div>
      </td>
      <td className={CELL_CLASSES}>
        <p className="line-clamp-2 text-body">{getDisplayedBody(testimonial)}</p>
        {review.isOverPlanLimit ? <p className="mt-2 text-small text-gray">{PLAN_LIMIT_MESSAGE}</p> : null}
        {error ? (
          <div className="mt-2">
            <FieldError id={`${testimonial.id}-row-error`} message={REVIEW_ERROR_MESSAGES[error]} />
          </div>
        ) : null}
      </td>
      <td className={CELL_CLASSES}>
        <RatingStars rating={testimonial.rating} size={18} />
      </td>
      <td className={cn(CELL_CLASSES, "text-small text-gray")}>
        <span className="line-clamp-2">{testimonial.productName ?? "Sans offre"}</span>
      </td>
      <td className={CELL_CLASSES}>
        <StatusBadge status={review.status} isJustApproved={review.isJustApproved} />
      </td>
      <td className={CELL_CLASSES}>
        <FeatureToggle isFeatured={review.featured} authorName={testimonial.authorName} onToggle={review.toggleFeatured} />
      </td>
      <td className={cn(CELL_CLASSES, "rounded-r-field pr-2")}>
        <div className="flex items-center justify-end gap-2">
          {review.status !== "approved" ? (
            <button
              type="button"
              onClick={review.approve}
              disabled={review.isOverPlanLimit}
              className={SECONDARY_COMPACT_BUTTON_CLASSES}
            >
              Valider
            </button>
          ) : null}
          {review.status !== "hidden" ? (
            <button type="button" onClick={review.askToHide} className={DISCREET_BUTTON_CLASSES}>
              Masquer
            </button>
          ) : null}
          <RowMenu authorName={testimonial.authorName} detailHref={detailHref} onDelete={deletion.askToDelete} />
        </div>
        <HideTestimonialDialog
          isOpen={review.isHideConfirmationOpen}
          authorName={testimonial.authorName}
          authorReach={testimonial.authorReach}
          isReasonAlreadySent={testimonial.isReasonAlreadySent}
          isPending={review.isHiding}
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
