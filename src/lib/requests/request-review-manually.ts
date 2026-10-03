import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { canRequestManually } from "@/config/plans";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests, spaces } from "@/db/schema";
import { startOfParisDay } from "@/lib/dates/paris-date";
import { formatCustomerName } from "@/lib/testimonials/format-customer-name";
import { generateRequestToken } from "./schedule-review-request";

export type ManualRequest = {
  firstName: string | null;
  lastName: string | null;
  email: string;
  productId: string;
  /** The day of the purchase, as the creator typed it: « 2026-10-05 ». */
  purchasedOn: string;
};

type ReviewRequestRow = typeof reviewRequests.$inferSelect;

export type ExistingRequest = Pick<
  ReviewRequestRow,
  "status" | "scheduledAt" | "sentAt" | "reminderScheduledAt" | "reminderSentAt" | "completedAt" | "cancelledAt"
>;

export type ManualRequestResult =
  | { status: "scheduled"; requestId: string }
  | { status: "request-exists"; customerName: string; existing: ExistingRequest }
  | { status: "unsubscribed"; customerName: string; unsubscribedAt: Date }
  | { status: "daily-limit" }
  | { status: "offer-not-found" };

/** A day typed in by the creator, at noon in UTC: the same day in Paris whatever the season. */
export const readPurchaseDay = (purchasedOn: string): Date => new Date(`${purchasedOn}T12:00:00Z`);

/** Requests typed in by hand since midnight in Paris: the measure of the plan's `manualRequestsPerDay`. */
export const countManualRequestsToday = async (database: Database, spaceId: string, now = new Date()): Promise<number> => {
  const [row] = await database
    .select({ total: count() })
    .from(purchases)
    .where(and(eq(purchases.spaceId, spaceId), eq(purchases.source, "manual"), gte(purchases.createdAt, startOfParisDay(now))));
  return row?.total ?? 0;
};

/**
 * « Demander un avis »: a customer the creator types in, by the same path as a sale received from a connector. The
 * customer, a manual purchase, and a request that leaves at the next run. One request per customer and offer, ever;
 * nothing for a customer who unsubscribed; the plan's daily cap against mass sending. The monthly limit of the plan
 * applies when it leaves, as for any request.
 */
export const requestReviewManually = (
  database: Database,
  spaceId: string,
  request: ManualRequest,
  now = new Date(),
): Promise<ManualRequestResult> =>
  database.transaction(async (transaction): Promise<ManualRequestResult> => {
    const [[space], [product]] = await Promise.all([
      transaction.select({ plan: spaces.plan }).from(spaces).where(eq(spaces.id, spaceId)).limit(1),
      transaction
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.id, request.productId), eq(products.spaceId, spaceId)))
        .limit(1),
    ]);
    if (!space || !product) return { status: "offer-not-found" };

    // One creator typing fast in two tabs waits for the other: the daily cap is counted once at a time.
    await transaction.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`manual-requests:${spaceId}`}, 0))`);
    if (!canRequestManually(space, await countManualRequestsToday(transaction, spaceId, now))) {
      return { status: "daily-limit" };
    }

    const [customer] = await transaction
      .insert(customers)
      .values({ spaceId, email: request.email, firstName: request.firstName, lastName: request.lastName })
      .onConflictDoUpdate({
        target: [customers.spaceId, customers.email],
        set: {
          firstName: sql`coalesce(${customers.firstName}, excluded.first_name)`,
          lastName: sql`coalesce(${customers.lastName}, excluded.last_name)`,
        },
      })
      .returning({
        id: customers.id,
        firstName: customers.firstName,
        lastName: customers.lastName,
        unsubscribedAt: customers.unsubscribedAt,
      });
    const customerName = formatCustomerName(customer) || request.email;
    if (customer.unsubscribedAt) return { status: "unsubscribed", customerName, unsubscribedAt: customer.unsubscribedAt };

    await transaction.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`${customer.id}:${product.id}`}, 0))`);
    const [existing] = await transaction
      .select({
        status: reviewRequests.status,
        scheduledAt: reviewRequests.scheduledAt,
        sentAt: reviewRequests.sentAt,
        reminderScheduledAt: reviewRequests.reminderScheduledAt,
        reminderSentAt: reviewRequests.reminderSentAt,
        completedAt: reviewRequests.completedAt,
        cancelledAt: reviewRequests.cancelledAt,
      })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .where(and(eq(purchases.customerId, customer.id), eq(purchases.productId, product.id)))
      .orderBy(desc(reviewRequests.scheduledAt))
      .limit(1);
    if (existing) return { status: "request-exists", customerName, existing };

    const [purchase] = await transaction
      .insert(purchases)
      .values({
        spaceId,
        customerId: customer.id,
        productId: product.id,
        source: "manual",
        eventType: "sale",
        purchasedAt: readPurchaseDay(request.purchasedOn),
        createdAt: now,
      })
      .returning({ id: purchases.id });
    const [created] = await transaction
      .insert(reviewRequests)
      .values({ purchaseId: purchase.id, token: generateRequestToken(), scheduledAt: now })
      .returning({ id: reviewRequests.id });
    return { status: "scheduled", requestId: created.id };
  });
