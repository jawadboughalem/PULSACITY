import { and, count, desc, eq, isNotNull, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests } from "@/db/schema";
import { formatCustomerName } from "@/lib/testimonials/format-customer-name";

export const REQUESTS_PAGE_SIZE = 50;

export type ReviewRequestStatus = (typeof reviewRequests.$inferSelect)["status"];

export const REQUEST_STATUSES = [
  "scheduled",
  "sent",
  "reminded",
  "completed",
  "cancelled",
  "failed",
] as const satisfies readonly ReviewRequestStatus[];

export type SpaceRequest = {
  id: string;
  status: ReviewRequestStatus;
  customerName: string;
  isUnsubscribed: boolean;
  productName: string;
  scheduledAt: Date;
  sentAt: Date | null;
  reminderScheduledAt: Date | null;
  reminderSentAt: Date | null;
  completedAt: Date | null;
};

export type RequestCounts = Record<ReviewRequestStatus, number> & {
  all: number;
  /** Requests whose e-mail left, answered or not: the base of the response rate. */
  sent: number;
  answered: number;
  remindersSent: number;
};

const isWaiting = sql`${reviewRequests.status} in ('scheduled', 'failed')`;

/**
 * What leaves next on top: the requests still to send, the soonest first. Then the others, the latest activity first
 * (answer, reminder or sending).
 */
const ORDER = [
  sql`case when ${isWaiting} then 0 else 1 end`,
  sql`case when ${isWaiting} then ${reviewRequests.scheduledAt} end asc`,
  sql`greatest(${reviewRequests.completedAt}, ${reviewRequests.reminderSentAt}, ${reviewRequests.sentAt}, ${reviewRequests.scheduledAt}) desc`,
  desc(reviewRequests.id),
];

export const listSpaceRequests = async (
  database: Database,
  spaceId: string,
  { status, page }: { status: ReviewRequestStatus | null; page: number },
): Promise<{ requests: SpaceRequest[]; total: number }> => {
  const where = and(eq(purchases.spaceId, spaceId), status ? eq(reviewRequests.status, status) : undefined);
  const [rows, [total]] = await Promise.all([
    database
      .select({
        id: reviewRequests.id,
        status: reviewRequests.status,
        scheduledAt: reviewRequests.scheduledAt,
        sentAt: reviewRequests.sentAt,
        reminderScheduledAt: reviewRequests.reminderScheduledAt,
        reminderSentAt: reviewRequests.reminderSentAt,
        completedAt: reviewRequests.completedAt,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        unsubscribedAt: customers.unsubscribedAt,
        productName: products.name,
      })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .innerJoin(customers, eq(customers.id, purchases.customerId))
      .innerJoin(products, eq(products.id, purchases.productId))
      .where(where)
      .orderBy(...ORDER)
      .limit(REQUESTS_PAGE_SIZE)
      .offset((page - 1) * REQUESTS_PAGE_SIZE),
    database
      .select({ total: count() })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .where(where),
  ]);
  return {
    total: total?.total ?? 0,
    requests: rows.map(({ firstName, lastName, email, unsubscribedAt, ...request }) => ({
      ...request,
      customerName: formatCustomerName({ firstName, lastName }) || email,
      isUnsubscribed: unsubscribedAt !== null,
    })),
  };
};

export const countSpaceRequests = async (database: Database, spaceId: string): Promise<RequestCounts> => {
  const [byStatus, [sent]] = await Promise.all([
    database
      .select({ status: reviewRequests.status, total: count() })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .where(eq(purchases.spaceId, spaceId))
      .groupBy(reviewRequests.status),
    database
      .select({
        sent: count(),
        answered: sql<number>`count(*) filter (where ${reviewRequests.status} = 'completed')`.mapWith(Number),
        remindersSent: sql<number>`count(${reviewRequests.reminderSentAt})`.mapWith(Number),
      })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .where(and(eq(purchases.spaceId, spaceId), isNotNull(reviewRequests.sentAt))),
  ]);
  const counts = Object.fromEntries(REQUEST_STATUSES.map((status) => [status, 0])) as Record<ReviewRequestStatus, number>;
  for (const row of byStatus) counts[row.status] = row.total;
  return {
    ...counts,
    all: byStatus.reduce((sum, row) => sum + row.total, 0),
    sent: sent?.sent ?? 0,
    answered: sent?.answered ?? 0,
    remindersSent: sent?.remindersSent ?? 0,
  };
};
