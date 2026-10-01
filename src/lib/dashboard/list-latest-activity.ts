import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, customers, products, purchases, reviewRequests, testimonials } from "@/db/schema";
import type { ConnectorId } from "@/lib/connectors/types";
import { formatCustomerName } from "@/lib/testimonials/format-customer-name";
import type { TestimonialStatus } from "@/lib/testimonials/testimonial-filters";

export const LATEST_ACTIVITY_LIMIT = 6;

export type ActivityItem =
  | {
      kind: "testimonial";
      at: Date;
      testimonialId: string;
      authorName: string;
      rating: number;
      status: TestimonialStatus;
      productName: string | null;
    }
  | { kind: "request-sent" | "reminder-sent"; at: Date; customerName: string; productName: string }
  | { kind: "sale"; at: Date; customerName: string; productName: string; connector: ConnectorId | null };

const readCustomerName = (customer: { firstName: string | null; lastName: string | null; email: string }) =>
  formatCustomerName(customer) || customer.email;

export const listLatestActivity = async (
  database: Database,
  spaceId: string,
  limit = LATEST_ACTIVITY_LIMIT,
): Promise<ActivityItem[]> => {
  const customerColumns = { firstName: customers.firstName, lastName: customers.lastName, email: customers.email };
  const [latestTestimonials, latestRequests, latestSales] = await Promise.all([
    database
      .select({
        testimonialId: testimonials.id,
        at: testimonials.createdAt,
        authorName: testimonials.authorName,
        rating: testimonials.rating,
        status: testimonials.status,
        productName: products.name,
      })
      .from(testimonials)
      .leftJoin(products, eq(products.id, testimonials.productId))
      .where(eq(testimonials.spaceId, spaceId))
      .orderBy(desc(testimonials.createdAt))
      .limit(limit),
    database
      .select({
        sentAt: reviewRequests.sentAt,
        reminderSentAt: reviewRequests.reminderSentAt,
        productName: products.name,
        ...customerColumns,
      })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .innerJoin(customers, eq(customers.id, purchases.customerId))
      .innerJoin(products, eq(products.id, purchases.productId))
      .where(and(eq(purchases.spaceId, spaceId), isNotNull(reviewRequests.sentAt)))
      .orderBy(desc(sql`greatest(${reviewRequests.sentAt}, ${reviewRequests.reminderSentAt})`))
      .limit(limit),
    database
      .select({
        at: purchases.purchasedAt,
        productName: products.name,
        connector: connections.connector,
        ...customerColumns,
      })
      .from(purchases)
      .innerJoin(customers, eq(customers.id, purchases.customerId))
      .innerJoin(products, eq(products.id, purchases.productId))
      .leftJoin(connections, eq(connections.id, purchases.connectionId))
      .where(eq(purchases.spaceId, spaceId))
      .orderBy(desc(purchases.purchasedAt))
      .limit(limit),
  ]);

  const items: ActivityItem[] = [
    ...latestTestimonials.map((testimonial) => ({ kind: "testimonial" as const, ...testimonial })),
    ...latestRequests.flatMap((request) => {
      const customerName = readCustomerName(request);
      const sent = request.sentAt
        ? [{ kind: "request-sent" as const, at: request.sentAt, customerName, productName: request.productName }]
        : [];
      const reminded = request.reminderSentAt
        ? [{ kind: "reminder-sent" as const, at: request.reminderSentAt, customerName, productName: request.productName }]
        : [];
      return [...sent, ...reminded];
    }),
    ...latestSales.map((sale) => ({
      kind: "sale" as const,
      at: sale.at,
      customerName: readCustomerName(sale),
      productName: sale.productName,
      connector: sale.connector,
    })),
  ];
  return items.sort((left, right) => right.at.getTime() - left.at.getTime()).slice(0, limit);
};
