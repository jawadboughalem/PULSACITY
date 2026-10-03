import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests, testimonials } from "@/db/schema";
import { startOfParisMonth } from "@/lib/dates/paris-date";
import { formatCustomerName } from "@/lib/testimonials/format-customer-name";

/** The rows shown at first, and added by each « Afficher les … suivantes ». */
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
  customerEmail: string;
  isUnsubscribed: boolean;
  productName: string;
  scheduledAt: Date;
  sentAt: Date | null;
  reminderScheduledAt: Date | null;
  reminderSentAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  failedAt: Date | null;
  /** The opinion the customer left for this offer, for « Voir l'avis ». */
  testimonialId: string | null;
};

/**
 * The count of each status, for the filter. Then the month in Paris, like the dashboard: the requests whose e-mail left
 * this month, those of them reminded, and those of them answered, which give the response rate.
 */
export type RequestCounts = Record<ReviewRequestStatus, number> & {
  all: number;
  sentThisMonth: number;
  remindedThisMonth: number;
  answeredThisMonth: number;
};

const isWaiting = sql`${reviewRequests.status} in ('scheduled', 'failed')`;

/** The latest thing that happened to a request: its answer, reminder, sending, cancellation or last failed try. */
const lastActivity = sql`greatest(${reviewRequests.completedAt}, ${reviewRequests.reminderSentAt}, ${reviewRequests.sentAt}, ${reviewRequests.cancelledAt}, ${reviewRequests.failedAt})`;

/**
 * What leaves next on top: the requests still to send, the soonest first. Then the others, the latest activity first.
 * A request cancelled before its date was recorded has none: it comes last, never above what really happened.
 */
const ORDER = [
  sql`case when ${isWaiting} then 0 else 1 end`,
  sql`case when ${isWaiting} then ${reviewRequests.scheduledAt} end asc`,
  sql`${lastActivity} desc nulls last`,
  desc(reviewRequests.scheduledAt),
  desc(reviewRequests.id),
];

export const listSpaceRequests = async (
  database: Database,
  spaceId: string,
  { status, limit }: { status: ReviewRequestStatus | null; limit: number },
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
        cancelledAt: reviewRequests.cancelledAt,
        failedAt: reviewRequests.failedAt,
        testimonialId: sql<string | null>`(
          select ${testimonials.id} from ${testimonials}
          where ${testimonials.customerId} = ${purchases.customerId} and ${testimonials.productId} = ${purchases.productId}
          order by ${testimonials.createdAt} desc limit 1
        )`,
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
      .limit(limit),
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
      customerEmail: email,
      isUnsubscribed: unsubscribedAt !== null,
    })),
  };
};

export const countSpaceRequests = async (database: Database, spaceId: string, now = new Date()): Promise<RequestCounts> => {
  const sentThisMonth = gte(reviewRequests.sentAt, startOfParisMonth(now));
  const [byStatus, [month]] = await Promise.all([
    database
      .select({ status: reviewRequests.status, total: count() })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .where(eq(purchases.spaceId, spaceId))
      .groupBy(reviewRequests.status),
    database
      .select({
        sent: count(),
        reminded: sql<number>`count(${reviewRequests.reminderSentAt})`.mapWith(Number),
        answered: sql<number>`count(*) filter (where ${reviewRequests.status} = 'completed')`.mapWith(Number),
      })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .where(and(eq(purchases.spaceId, spaceId), sentThisMonth)),
  ]);
  const counts = Object.fromEntries(REQUEST_STATUSES.map((status) => [status, 0])) as Record<ReviewRequestStatus, number>;
  for (const row of byStatus) counts[row.status] = row.total;
  return {
    ...counts,
    all: byStatus.reduce((sum, row) => sum + row.total, 0),
    sentThisMonth: month?.sent ?? 0,
    remindedThisMonth: month?.reminded ?? 0,
    answeredThisMonth: month?.answered ?? 0,
  };
};
