import { randomBytes } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests } from "@/db/schema";

const DAY_MS = 24 * 60 * 60 * 1000;

const TOKEN_BYTES = 24;

export type ScheduleOutcome = "request-scheduled" | "request-exists" | "unsubscribed" | "requests-disabled";

export type PurchaseToSchedule = {
  purchaseId: string;
  customerId: string;
  productId: string;
  occurredAt: Date;
};

export const generateRequestToken = (): string => randomBytes(TOKEN_BYTES).toString("base64url");

export const computeRequestDate = (occurredAt: Date, delayDays: number): Date =>
  new Date(occurredAt.getTime() + delayDays * DAY_MS);

/**
 * One request per customer and offer, ever: with its reminder, never more than two e-mails. To be called inside a
 * transaction: two sales of the same offer arriving together wait for each other.
 */
export const scheduleReviewRequest = async (
  transaction: Database,
  { purchaseId, customerId, productId, occurredAt }: PurchaseToSchedule,
): Promise<ScheduleOutcome> => {
  await transaction.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`${customerId}:${productId}`}, 0))`);

  const [[customer], [product], [existing]] = await Promise.all([
    transaction
      .select({ unsubscribedAt: customers.unsubscribedAt })
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1),
    transaction
      .select({ requestDelayDays: products.requestDelayDays, requestsEnabled: products.requestsEnabled })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1),
    transaction
      .select({ id: reviewRequests.id })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .where(and(eq(purchases.customerId, customerId), eq(purchases.productId, productId)))
      .limit(1),
  ]);
  if (customer?.unsubscribedAt) return "unsubscribed";
  if (!product?.requestsEnabled) return "requests-disabled";
  if (existing) return "request-exists";

  await transaction
    .insert(reviewRequests)
    .values({
      purchaseId,
      token: generateRequestToken(),
      scheduledAt: computeRequestDate(occurredAt, product.requestDelayDays),
    })
    .onConflictDoNothing({ target: reviewRequests.purchaseId });
  return "request-scheduled";
};
