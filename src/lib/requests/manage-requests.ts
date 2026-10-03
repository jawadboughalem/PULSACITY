import { and, eq, inArray, isNull } from "drizzle-orm";
import type { Database } from "@/db/database";
import { purchases, reviewRequests, spaces } from "@/db/schema";
import {
  type SendOptions,
  type SendResult,
  countRequestsSentThisMonth,
  loadRequestToSend,
  sendFirstRequest,
} from "./send-review-emails";

const findOwnedRequest = async (database: Database, userId: string, requestId: string) => {
  const [request] = await database
    .select({ id: reviewRequests.id, status: reviewRequests.status, spaceId: purchases.spaceId })
    .from(reviewRequests)
    .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
    .innerJoin(spaces, eq(spaces.id, purchases.spaceId))
    .where(and(eq(reviewRequests.id, requestId), eq(spaces.userId, userId)))
    .limit(1);
  return request ?? null;
};

export type CancelRequestResult = { status: "cancelled" | "reminder-cancelled" | "not-cancellable" | "not-found" };

/** A planned request is cancelled; a request already sent only loses its reminder, and its link keeps working. */
export const cancelOwnedRequest = async (
  database: Database,
  userId: string,
  requestId: string,
): Promise<CancelRequestResult> => {
  const request = await findOwnedRequest(database, userId, requestId);
  if (!request) return { status: "not-found" };

  const [cancelled] = await database
    .update(reviewRequests)
    .set({ status: "cancelled" })
    .where(and(eq(reviewRequests.id, request.id), inArray(reviewRequests.status, ["scheduled", "failed"]), isNull(reviewRequests.sentAt)))
    .returning({ id: reviewRequests.id });
  if (cancelled) return { status: "cancelled" };

  const [withoutReminder] = await database
    .update(reviewRequests)
    .set({ reminderScheduledAt: null })
    .where(and(eq(reviewRequests.id, request.id), eq(reviewRequests.status, "sent"), isNull(reviewRequests.reminderSentAt)))
    .returning({ id: reviewRequests.id });
  return { status: withoutReminder ? "reminder-cancelled" : "not-cancellable" };
};

export type SendNowResult = { status: SendResult | "not-found" };

/** « Envoyer maintenant »: the planned request leaves at once, with the same lock and within the plan. */
export const sendOwnedRequestNow = async (
  database: Database,
  userId: string,
  requestId: string,
  options: SendOptions = {},
): Promise<SendNowResult> => {
  const owned = await findOwnedRequest(database, userId, requestId);
  if (!owned) return { status: "not-found" };
  if (owned.status !== "scheduled" && owned.status !== "failed") return { status: "already-sent" };
  const request = await loadRequestToSend(database, owned.id);
  if (!request) return { status: "not-found" };

  const now = options.now ?? new Date();
  const sentThisMonth = await countRequestsSentThisMonth(database, owned.spaceId, now);
  return { status: await sendFirstRequest(database, request, sentThisMonth, { ...options, now }) };
};
