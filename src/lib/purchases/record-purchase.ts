import { and, eq, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { customers, purchases } from "@/db/schema";
import type { NormalizedPurchase } from "@/lib/connectors/types";
import { type ScheduleOutcome, scheduleReviewRequest } from "@/lib/requests/schedule-review-request";

export type PurchaseToRecord = {
  spaceId: string;
  connectionId: string;
  productId: string;
  purchase: NormalizedPurchase;
};

export type RecordPurchaseResult = {
  purchaseId: string;
  outcome: ScheduleOutcome | "duplicate";
};

/** A name received with a later sale completes the customer, and never erases it. */
const upsertCustomer = async (transaction: Database, spaceId: string, purchase: NormalizedPurchase): Promise<string> => {
  const [customer] = await transaction
    .insert(customers)
    .values({
      spaceId,
      email: purchase.email.trim().toLowerCase(),
      firstName: purchase.firstName,
      lastName: purchase.lastName,
    })
    .onConflictDoUpdate({
      target: [customers.spaceId, customers.email],
      set: {
        firstName: sql`coalesce(excluded.first_name, ${customers.firstName})`,
        lastName: sql`coalesce(excluded.last_name, ${customers.lastName})`,
      },
    })
    .returning({ id: customers.id });
  return customer.id;
};

/** The core of PULSACITY: from a sale of any connector to a customer, a purchase and a planned request. */
export const recordPurchase = (
  database: Database,
  { spaceId, connectionId, productId, purchase }: PurchaseToRecord,
): Promise<RecordPurchaseResult> =>
  database.transaction(async (transaction) => {
    const customerId = await upsertCustomer(transaction, spaceId, purchase);
    const [created] = await transaction
      .insert(purchases)
      .values({
        spaceId,
        customerId,
        productId,
        connectionId,
        source: "connector",
        eventType: purchase.eventType,
        externalRef: purchase.externalRef,
        purchasedAt: purchase.occurredAt,
      })
      .onConflictDoNothing({ target: [purchases.connectionId, purchases.externalRef] })
      .returning({ id: purchases.id });

    if (!created) {
      const [existing] = await transaction
        .select({ id: purchases.id })
        .from(purchases)
        .where(and(eq(purchases.connectionId, connectionId), eq(purchases.externalRef, purchase.externalRef)))
        .limit(1);
      return { purchaseId: existing.id, outcome: "duplicate" };
    }

    const outcome = await scheduleReviewRequest(transaction, {
      purchaseId: created.id,
      customerId,
      productId,
      occurredAt: purchase.occurredAt,
    });
    return { purchaseId: created.id, outcome };
  });
