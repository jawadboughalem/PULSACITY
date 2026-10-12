import { randomBytes } from "node:crypto";
import { and, between, eq, ne, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests } from "@/db/schema";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Two connectors that send the same customer this close are telling the same sale (decisions/connecteurs.md). */
export const CROSS_CONNECTOR_WINDOW_MS = 48 * 60 * 60 * 1000;

const TOKEN_BYTES = 24;

export type ScheduleOutcome =
  | "request-scheduled"
  | "request-exists"
  | "request-elsewhere"
  | "unsubscribed"
  | "requests-disabled";

export type PurchaseToSchedule = {
  purchaseId: string;
  customerId: string;
  productId: string;
  /** The connection the sale came from: another connection's sale of the same customer may already have its request. */
  connectionId: string;
  occurredAt: Date;
};

/** A request already planned for the customer by a sale of another connector, within the window. */
const findRequestOfAnotherConnector = async (
  transaction: Database,
  { customerId, connectionId, occurredAt }: Pick<PurchaseToSchedule, "customerId" | "connectionId" | "occurredAt">,
) => {
  const [twin] = await transaction
    .select({ id: reviewRequests.id })
    .from(reviewRequests)
    .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
    .where(
      and(
        eq(purchases.customerId, customerId),
        eq(purchases.source, "connector"),
        ne(purchases.connectionId, connectionId),
        between(
          purchases.purchasedAt,
          new Date(occurredAt.getTime() - CROSS_CONNECTOR_WINDOW_MS),
          new Date(occurredAt.getTime() + CROSS_CONNECTOR_WINDOW_MS),
        ),
      ),
    )
    .limit(1);
  return twin ?? null;
};

export const generateRequestToken = (): string => randomBytes(TOKEN_BYTES).toString("base64url");

export const computeRequestDate = (occurredAt: Date, delayDays: number): Date =>
  new Date(occurredAt.getTime() + delayDays * DAY_MS);

/**
 * One request per customer and offer, ever: with its reminder, never more than two e-mails. And one request for a
 * customer sent by two connectors within 48 hours: the same sale, told twice. A sale whose product waits for its offer
 * is recorded only once associated, so the sale already associated is the one that keeps the request. To be called
 * inside a transaction: two sales of the same customer arriving together wait for each other.
 */
export const scheduleReviewRequest = async (
  transaction: Database,
  { purchaseId, customerId, productId, connectionId, occurredAt }: PurchaseToSchedule,
): Promise<ScheduleOutcome> => {
  await transaction.execute(sql`select pg_advisory_xact_lock(hashtextextended(${customerId}, 0))`);

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
  if (await findRequestOfAnotherConnector(transaction, { customerId, connectionId, occurredAt })) return "request-elsewhere";

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
