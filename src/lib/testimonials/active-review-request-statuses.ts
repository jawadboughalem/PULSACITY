import type { reviewRequests } from "@/db/schema";

type ReviewRequestStatus = (typeof reviewRequests.$inferSelect)["status"];

export const ACTIVE_REVIEW_REQUEST_STATUSES: readonly ReviewRequestStatus[] = ["scheduled", "sent", "reminded", "failed"];

export const isReviewRequestActive = (status: ReviewRequestStatus): boolean =>
  ACTIVE_REVIEW_REQUEST_STATUSES.includes(status);
