import * as Sentry from "@sentry/nextjs";
import { and, asc, count, eq, gte, inArray, isNotNull, isNull, lte } from "drizzle-orm";
import { canSendRequest } from "@/config/plans";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests, spaces } from "@/db/schema";
import { ReviewRequestEmail, type ReviewEmailKind, buildReviewEmailSubject } from "@/emails/ReviewRequestEmail";
import { buildCollectionUrl } from "@/lib/app-url";
import type { PurchaseEventType } from "@/lib/connectors/types";
import { startOfParisMonth } from "@/lib/dates/paris-date";
import { type CustomerEmail, sendCustomerEmail } from "@/lib/email/send-email";
import { REQUEST_TOKEN_PARAMETER } from "@/lib/testimonials/read-request-token";
import { buildUnsubscribeUrl } from "./unsubscribe-token";

const DAY_MS = 24 * 60 * 60 * 1000;

export const REMINDER_DELAY_DAYS = 4;

/** Past this many failed sends in a row, a request stops retrying: « Échec », and « Envoyer maintenant » to try again. */
export const MAX_FAILED_ATTEMPTS = 3;

const BATCH_SIZE = 40;

/** The e-mail provider takes two messages a second. */
const DEFAULT_MIN_INTERVAL_MS = 550;

export type SendResult = "sent" | "cancelled" | "plan-limit" | "failed" | "already-sent";

export type SendOptions = {
  now?: Date;
  send?: (email: CustomerEmail) => Promise<void>;
  /** Stops before this moment, so a run of the cron ends within its time. */
  deadline?: number;
  minIntervalMs?: number;
};

export type SendSummary = {
  sent: number;
  reminded: number;
  cancelled: number;
  waitingForPlan: number;
  failed: number;
};

const requestColumns = {
  id: reviewRequests.id,
  token: reviewRequests.token,
  failedAttempts: reviewRequests.failedAttempts,
  purchasedAt: purchases.purchasedAt,
  eventType: purchases.eventType,
  customerId: customers.id,
  email: customers.email,
  firstName: customers.firstName,
  unsubscribedAt: customers.unsubscribedAt,
  productName: products.name,
  productSlug: products.slug,
  requestsEnabled: products.requestsEnabled,
  spaceId: spaces.id,
  spaceName: spaces.name,
  spaceSlug: spaces.slug,
  logoUrl: spaces.logoUrl,
  replyToEmail: spaces.replyToEmail,
  plan: spaces.plan,
};

const selectRequests = (database: Database) =>
  database
    .select(requestColumns)
    .from(reviewRequests)
    .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
    .innerJoin(customers, eq(customers.id, purchases.customerId))
    .innerJoin(products, eq(products.id, purchases.productId))
    .innerJoin(spaces, eq(spaces.id, purchases.spaceId));

export type RequestToSend = Awaited<ReturnType<typeof selectRequests>>[number];

export const loadRequestToSend = async (database: Database, requestId: string): Promise<RequestToSend | null> => {
  const [request] = await selectRequests(database).where(eq(reviewRequests.id, requestId)).limit(1);
  return request ?? null;
};

/** Requests sent this month in Paris, the measure of the plan's « Demandes auto / mois ». Reminders are not counted. */
export const countRequestsSentThisMonth = async (database: Database, spaceId: string, now: Date): Promise<number> => {
  const [row] = await database
    .select({ sent: count() })
    .from(reviewRequests)
    .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
    .where(and(eq(purchases.spaceId, spaceId), gte(reviewRequests.sentAt, startOfParisMonth(now))));
  return row?.sent ?? 0;
};

const buildReviewUrl = (request: RequestToSend) =>
  `${buildCollectionUrl(request.spaceSlug, request.productSlug)}?${REQUEST_TOKEN_PARAMETER}=${encodeURIComponent(request.token)}`;

const buildEmail = (request: RequestToSend, kind: ReviewEmailKind): CustomerEmail => {
  const unsubscribeUrl = buildUnsubscribeUrl(request.customerId);
  return {
    to: request.email,
    subject: buildReviewEmailSubject(kind, request.firstName, request.productName),
    body: (
      <ReviewRequestEmail
        kind={kind}
        spaceName={request.spaceName}
        logoUrl={request.logoUrl}
        firstName={request.firstName}
        productName={request.productName}
        eventType={(request.eventType as PurchaseEventType | null) ?? null}
        purchasedAt={request.purchasedAt}
        reviewUrl={buildReviewUrl(request)}
        unsubscribeUrl={unsubscribeUrl}
      />
    ),
    spaceName: request.spaceName,
    replyTo: request.replyToEmail,
    unsubscribeUrl,
    idempotencyKey: `review-request/${request.id}/${kind}`,
  };
};

const isStopped = (request: RequestToSend) => request.unsubscribedAt !== null || !request.requestsEnabled;

/**
 * The first e-mail. Locked on sentAt: whoever takes the request sends it, and nobody else. A send that fails gives the
 * request back, to be tried again at the next run.
 */
export const sendFirstRequest = async (
  database: Database,
  request: RequestToSend,
  sentThisMonth: number,
  { now = new Date(), send = sendCustomerEmail }: SendOptions = {},
): Promise<SendResult> => {
  const waiting = inArray(reviewRequests.status, ["scheduled", "failed"]);
  if (isStopped(request)) {
    await database
      .update(reviewRequests)
      .set({ status: "cancelled" })
      .where(and(eq(reviewRequests.id, request.id), waiting));
    return "cancelled";
  }
  if (!canSendRequest(request, sentThisMonth)) return "plan-limit";

  const [taken] = await database
    .update(reviewRequests)
    .set({ sentAt: now, status: "sent", reminderScheduledAt: new Date(now.getTime() + REMINDER_DELAY_DAYS * DAY_MS) })
    .where(and(eq(reviewRequests.id, request.id), waiting, isNull(reviewRequests.sentAt)))
    .returning({ id: reviewRequests.id });
  if (!taken) return "already-sent";

  try {
    await send(buildEmail(request, "request"));
  } catch (error) {
    Sentry.captureException(error);
    const failedAttempts = request.failedAttempts + 1;
    await database
      .update(reviewRequests)
      .set({
        sentAt: null,
        reminderScheduledAt: null,
        failedAttempts,
        status: failedAttempts >= MAX_FAILED_ATTEMPTS ? "failed" : "scheduled",
      })
      .where(eq(reviewRequests.id, request.id));
    return "failed";
  }
  await database.update(reviewRequests).set({ failedAttempts: 0 }).where(eq(reviewRequests.id, request.id));
  return "sent";
};

/** The one reminder, four days after the request, if the customer has not answered. Locked on reminderSentAt. */
export const sendReminder = async (
  database: Database,
  request: RequestToSend,
  { now = new Date(), send = sendCustomerEmail }: SendOptions = {},
): Promise<SendResult> => {
  if (isStopped(request)) {
    await database
      .update(reviewRequests)
      .set({ reminderScheduledAt: null })
      .where(and(eq(reviewRequests.id, request.id), isNull(reviewRequests.reminderSentAt)));
    return "cancelled";
  }

  const [taken] = await database
    .update(reviewRequests)
    .set({ reminderSentAt: now, status: "reminded" })
    .where(
      and(
        eq(reviewRequests.id, request.id),
        eq(reviewRequests.status, "sent"),
        isNull(reviewRequests.reminderSentAt),
        isNotNull(reviewRequests.reminderScheduledAt),
      ),
    )
    .returning({ id: reviewRequests.id });
  if (!taken) return "already-sent";

  try {
    await send(buildEmail(request, "reminder"));
  } catch (error) {
    Sentry.captureException(error);
    const failedAttempts = request.failedAttempts + 1;
    await database
      .update(reviewRequests)
      .set({
        reminderSentAt: null,
        status: "sent",
        failedAttempts,
        ...(failedAttempts >= MAX_FAILED_ATTEMPTS ? { reminderScheduledAt: null } : {}),
      })
      .where(eq(reviewRequests.id, request.id));
    return "failed";
  }
  await database.update(reviewRequests).set({ failedAttempts: 0 }).where(eq(reviewRequests.id, request.id));
  return "sent";
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** The cron's run: the requests that are due, then the reminders, oldest first. */
export const sendDueReviewEmails = async (database: Database, options: SendOptions = {}): Promise<SendSummary> => {
  const now = options.now ?? new Date();
  const minIntervalMs = options.minIntervalMs ?? DEFAULT_MIN_INTERVAL_MS;
  const summary: SendSummary = { sent: 0, reminded: 0, cancelled: 0, waitingForPlan: 0, failed: 0 };
  const sentThisMonth = new Map<string, number>();
  let lastSendAt = 0;

  const pace = async () => {
    const elapsed = Date.now() - lastSendAt;
    if (elapsed < minIntervalMs) await wait(minIntervalMs - elapsed);
    lastSendAt = Date.now();
  };
  const isOutOfTime = () => options.deadline !== undefined && Date.now() > options.deadline;
  const tally = (result: SendResult, sentKey: "sent" | "reminded") => {
    if (result === "sent") summary[sentKey] += 1;
    if (result === "cancelled") summary.cancelled += 1;
    if (result === "plan-limit") summary.waitingForPlan += 1;
    if (result === "failed") summary.failed += 1;
  };

  const dueRequests = await selectRequests(database)
    .where(and(eq(reviewRequests.status, "scheduled"), lte(reviewRequests.scheduledAt, now)))
    .orderBy(asc(reviewRequests.scheduledAt))
    .limit(BATCH_SIZE);
  for (const request of dueRequests) {
    if (isOutOfTime()) return summary;
    const counted = sentThisMonth.get(request.spaceId) ?? (await countRequestsSentThisMonth(database, request.spaceId, now));
    if (!isStopped(request) && canSendRequest(request, counted)) await pace();
    const result = await sendFirstRequest(database, request, counted, { ...options, now });
    sentThisMonth.set(request.spaceId, counted + (result === "sent" ? 1 : 0));
    tally(result, "sent");
  }

  const dueReminders = await selectRequests(database)
    .where(
      and(
        eq(reviewRequests.status, "sent"),
        isNull(reviewRequests.reminderSentAt),
        lte(reviewRequests.reminderScheduledAt, now),
      ),
    )
    .orderBy(asc(reviewRequests.reminderScheduledAt))
    .limit(BATCH_SIZE);
  for (const request of dueReminders) {
    if (isOutOfTime()) return summary;
    if (!isStopped(request)) await pace();
    tally(await sendReminder(database, request, { ...options, now }), "reminded");
  }
  return summary;
};

/** For the creator's list: the requests waiting for next month because of the plan. */
export const countRequestsDue = async (database: Database, spaceId: string, now = new Date()): Promise<number> => {
  const [row] = await database
    .select({ due: count() })
    .from(reviewRequests)
    .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
    .where(
      and(
        eq(purchases.spaceId, spaceId),
        eq(reviewRequests.status, "scheduled"),
        lte(reviewRequests.scheduledAt, now),
      ),
    );
  return row?.due ?? 0;
};
