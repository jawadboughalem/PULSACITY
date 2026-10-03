import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { customers, purchases, reviewRequests, spaces } from "@/db/schema";

export type UnsubscribedCustomer = {
  spaceName: string;
  logoUrl: string | null;
  replyToEmail: string;
  referralCode: string;
};

const purchasesOf = (database: Database, customerId: string) =>
  database.select({ id: purchases.id }).from(purchases).where(eq(purchases.customerId, customerId));

/**
 * Nothing leaves for this customer any more: planned requests are cancelled, reminders dropped. A request already sent
 * keeps its link, so the customer can still leave an opinion.
 */
export const unsubscribeCustomer = (
  database: Database,
  customerId: string,
  now = new Date(),
): Promise<UnsubscribedCustomer | null> =>
  database.transaction(async (transaction) => {
    const [customer] = await transaction
      .update(customers)
      .set({ unsubscribedAt: sql`coalesce(${customers.unsubscribedAt}, ${now.toISOString()}::timestamptz)` })
      .where(eq(customers.id, customerId))
      .returning({ spaceId: customers.spaceId });
    if (!customer) return null;

    await transaction
      .update(reviewRequests)
      .set({ status: "cancelled", cancelledAt: now })
      .where(
        and(
          inArray(reviewRequests.status, ["scheduled", "failed"]),
          inArray(reviewRequests.purchaseId, purchasesOf(transaction, customerId)),
        ),
      );
    await transaction
      .update(reviewRequests)
      .set({ reminderScheduledAt: null })
      .where(
        and(
          eq(reviewRequests.status, "sent"),
          isNull(reviewRequests.reminderSentAt),
          inArray(reviewRequests.purchaseId, purchasesOf(transaction, customerId)),
        ),
      );

    const [space] = await transaction
      .select({
        spaceName: spaces.name,
        logoUrl: spaces.logoUrl,
        replyToEmail: spaces.replyToEmail,
        referralCode: spaces.referralCode,
      })
      .from(spaces)
      .where(eq(spaces.id, customer.spaceId))
      .limit(1);
    return space ?? null;
  });

/** What the confirmation page shows: whose e-mails stopped. Null for a customer who no longer exists. */
export const loadUnsubscribedCustomer = async (
  database: Database,
  customerId: string,
): Promise<(UnsubscribedCustomer & { isUnsubscribed: boolean }) | null> => {
  const [row] = await database
    .select({
      spaceName: spaces.name,
      logoUrl: spaces.logoUrl,
      replyToEmail: spaces.replyToEmail,
      referralCode: spaces.referralCode,
      unsubscribedAt: customers.unsubscribedAt,
    })
    .from(customers)
    .innerJoin(spaces, eq(spaces.id, customers.spaceId))
    .where(eq(customers.id, customerId))
    .limit(1);
  if (!row) return null;
  const { unsubscribedAt, ...space } = row;
  return { ...space, isUnsubscribed: unsubscribedAt !== null };
};
