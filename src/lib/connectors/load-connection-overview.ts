import { and, asc, count, desc, eq, gt, isNull, max, min, ne, or, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { externalProducts, productRefs, products, purchases, reviewRequests, webhookEvents } from "@/db/schema";
import { formatCustomerName } from "@/lib/testimonials/format-customer-name";
import type { SpaceConnection } from "./connections";
import { normalizeStoredEvent } from "./process-webhook-event";
import type { PurchaseEventType } from "./types";
import type { WebhookEventError, WebhookEventOutcome } from "./webhook-event-states";

export const OVERVIEW_EVENT_COUNT = 5;

export const HISTORY_PAGE_SIZE = 50;

type ReviewRequestStatus = (typeof reviewRequests.$inferSelect)["status"];

export type ConnectionEvent = {
  id: string;
  receivedAt: Date;
  /** A sale, an enrollment, or an event the connector keeps without reading it. */
  kind: PurchaseEventType | "other";
  /** The offer once associated, otherwise the product as the platform names it. */
  productName: string | null;
  customerName: string | null;
  outcome: WebhookEventOutcome | null;
  error: WebhookEventError | null;
  request: { status: ReviewRequestStatus; scheduledAt: Date; sentAt: Date | null } | null;
};

export type ExternalProductRow = {
  id: string;
  name: string;
  priceCents: number | null;
  currency: string | null;
  firstSeenAt: Date;
  productId: string | null;
};

export type ConnectionOverview = {
  status: SpaceConnection["status"];
  lastEventAt: Date | null;
  /** The first delivery refused since the last one accepted: the connection has had a problem since then. */
  problemSince: Date | null;
  externalProducts: ExternalProductRow[];
  awaitingProductCount: number;
  eventCount: number;
  firstEventAt: Date | null;
};

export const listExternalProducts = async (database: Database, connectionId: string): Promise<ExternalProductRow[]> =>
  database
    .select({
      id: externalProducts.id,
      name: externalProducts.name,
      priceCents: externalProducts.priceCents,
      currency: externalProducts.currency,
      firstSeenAt: externalProducts.firstSeenAt,
      productId: productRefs.productId,
    })
    .from(externalProducts)
    .leftJoin(
      productRefs,
      and(eq(productRefs.connectionId, externalProducts.connectionId), eq(productRefs.externalRef, externalProducts.externalRef)),
    )
    .where(eq(externalProducts.connectionId, connectionId))
    .orderBy(asc(externalProducts.firstSeenAt), asc(externalProducts.name));

const readProblemSince = async (database: Database, connectionId: string): Promise<Date | null> => {
  const [lastAccepted] = await database
    .select({ at: max(webhookEvents.receivedAt) })
    .from(webhookEvents)
    .where(
      and(
        eq(webhookEvents.connectionId, connectionId),
        or(isNull(webhookEvents.error), ne(webhookEvents.error, "invalid-signature")),
      ),
    );
  const [firstRefused] = await database
    .select({ at: min(webhookEvents.receivedAt) })
    .from(webhookEvents)
    .where(
      and(
        eq(webhookEvents.connectionId, connectionId),
        eq(webhookEvents.error, "invalid-signature"),
        lastAccepted?.at ? gt(webhookEvents.receivedAt, lastAccepted.at) : sql`true`,
      ),
    );
  return firstRefused?.at ?? null;
};

export const loadConnectionOverview = async (
  database: Database,
  connection: SpaceConnection,
): Promise<ConnectionOverview> => {
  const [rows, [events], problemSince] = await Promise.all([
    listExternalProducts(database, connection.id),
    database
      .select({ total: count(), first: min(webhookEvents.receivedAt) })
      .from(webhookEvents)
      .where(eq(webhookEvents.connectionId, connection.id)),
    connection.status === "error" ? readProblemSince(database, connection.id) : Promise.resolve(null),
  ]);
  return {
    status: connection.status,
    lastEventAt: connection.lastEventAt,
    problemSince,
    externalProducts: rows,
    awaitingProductCount: rows.filter((row) => row.productId === null).length,
    eventCount: events?.total ?? 0,
    firstEventAt: events?.first ?? null,
  };
};

/** The latest events first, readable: what was sold, to whom, and what came of it. */
export const listConnectionEvents = async (
  database: Database,
  connection: Pick<SpaceConnection, "id" | "connector">,
  { limit, offset = 0 }: { limit: number; offset?: number },
): Promise<ConnectionEvent[]> => {
  const rows = await database
    .select({
      id: webhookEvents.id,
      receivedAt: webhookEvents.receivedAt,
      rawPayload: webhookEvents.rawPayload,
      headers: webhookEvents.headers,
      outcome: webhookEvents.outcome,
      error: webhookEvents.error,
      offerName: products.name,
      requestStatus: reviewRequests.status,
      requestScheduledAt: reviewRequests.scheduledAt,
      requestSentAt: reviewRequests.sentAt,
    })
    .from(webhookEvents)
    .leftJoin(purchases, eq(purchases.id, webhookEvents.purchaseId))
    .leftJoin(products, eq(products.id, purchases.productId))
    .leftJoin(reviewRequests, eq(reviewRequests.purchaseId, purchases.id))
    .where(eq(webhookEvents.connectionId, connection.id))
    .orderBy(desc(webhookEvents.receivedAt), desc(webhookEvents.id))
    .limit(limit)
    .offset(offset);

  return rows.map((row) => {
    const normalized = normalizeStoredEvent({ connector: connection.connector, rawPayload: row.rawPayload, headers: row.headers });
    const purchase = "purchase" in normalized ? normalized.purchase : null;
    return {
      id: row.id,
      receivedAt: row.receivedAt,
      kind: purchase?.eventType ?? "other",
      productName: row.offerName ?? purchase?.productName ?? null,
      customerName: purchase ? formatCustomerName(purchase) || purchase.email : null,
      outcome: row.outcome,
      error: row.error,
      request:
        row.requestStatus && row.requestScheduledAt
          ? { status: row.requestStatus, scheduledAt: row.requestScheduledAt, sentAt: row.requestSentAt }
          : null,
    };
  });
};
