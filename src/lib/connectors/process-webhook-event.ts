import * as Sentry from "@sentry/nextjs";
import { and, asc, eq, isNull, lt } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, webhookEvents } from "@/db/schema";
import { recordPurchase } from "@/lib/purchases/record-purchase";
import { findAssociatedProductId, upsertExternalProduct } from "./external-products";
import { InvalidPayloadError } from "./invalid-payload-error";
import { getConnector } from "./registry";
import type { NormalizedPurchase, WebhookHeaders } from "./types";
import type { WebhookEventError, WebhookEventOutcome } from "./webhook-event-states";

/** An event still unprocessed this long after it arrived was missed: the cron takes it over. */
const MISSED_AFTER_MS = 2 * 60 * 1000;

const MISSED_BATCH = 50;

export type ProcessedEvent = { outcome: WebhookEventOutcome } | { error: WebhookEventError } | null;

type StoredEvent = {
  id: string;
  connectionId: string;
  spaceId: string;
  connector: string;
  rawPayload: unknown;
  headers: WebhookHeaders;
};

const markProcessed = async (database: Database, eventId: string, outcome: WebhookEventOutcome, purchaseId?: string) => {
  await database
    .update(webhookEvents)
    .set({ processedAt: new Date(), outcome, purchaseId: purchaseId ?? null, error: null })
    .where(eq(webhookEvents.id, eventId));
  return { outcome };
};

const markFailed = async (database: Database, eventId: string, error: WebhookEventError) => {
  await database.update(webhookEvents).set({ error }).where(eq(webhookEvents.id, eventId));
  return { error };
};

/** What the connector reads in the event, or why it cannot: never throws. */
export const normalizeStoredEvent = (
  event: Pick<StoredEvent, "connector" | "rawPayload" | "headers">,
): { purchase: NormalizedPurchase | null } | { error: WebhookEventError } => {
  const connector = getConnector(event.connector);
  if (!connector) return { error: "processing-failed" };
  try {
    return { purchase: connector.normalize(event.rawPayload, event.headers) };
  } catch (error) {
    if (error instanceof InvalidPayloadError) return { error: "invalid-payload" };
    Sentry.captureException(error);
    return { error: "processing-failed" };
  }
};

const processEvent = async (database: Database, event: StoredEvent) => {
  const normalized = normalizeStoredEvent(event);
  if ("error" in normalized) return markFailed(database, event.id, normalized.error);
  const { purchase } = normalized;
  if (!purchase) return markProcessed(database, event.id, "unsupported");

  await upsertExternalProduct(database, event.connectionId, purchase);
  const productId = await findAssociatedProductId(database, event.connectionId, purchase.productRef);
  if (!productId) return markProcessed(database, event.id, "awaiting-product");

  const { purchaseId, outcome } = await recordPurchase(database, {
    spaceId: event.spaceId,
    connectionId: event.connectionId,
    productId,
    purchase,
  });
  return markProcessed(database, event.id, outcome, purchaseId);
};

const findEvent = async (database: Database, eventId: string) => {
  const [event] = await database
    .select({
      id: webhookEvents.id,
      connectionId: webhookEvents.connectionId,
      spaceId: connections.spaceId,
      connector: connections.connector,
      rawPayload: webhookEvents.rawPayload,
      headers: webhookEvents.headers,
      processedAt: webhookEvents.processedAt,
      error: webhookEvents.error,
    })
    .from(webhookEvents)
    .innerJoin(connections, eq(connections.id, webhookEvents.connectionId))
    .where(eq(webhookEvents.id, eventId))
    .limit(1);
  return event ?? null;
};

/**
 * Processes an event once: processed already, or put aside, it is left as it is. Processing again never duplicates
 * anything: a sale is recorded once per connection, a request once per customer and offer.
 */
export const processWebhookEvent = async (database: Database, eventId: string): Promise<ProcessedEvent> => {
  const event = await findEvent(database, eventId);
  if (!event || event.processedAt || event.error) return null;
  try {
    return await processEvent(database, event);
  } catch (error) {
    Sentry.captureException(error);
    return markFailed(database, event.id, "processing-failed");
  }
};

/** « Rejouer »: the creator asks for an event put aside to be processed again, whatever put it aside. */
export const reprocessWebhookEvent = async (database: Database, eventId: string): Promise<ProcessedEvent> => {
  await database
    .update(webhookEvents)
    .set({ processedAt: null, outcome: null, purchaseId: null, error: null })
    .where(eq(webhookEvents.id, eventId));
  return processWebhookEvent(database, eventId);
};

/** The sales kept aside for a product, processed now that it is associated with an offer. */
export const processAwaitingEvents = async (database: Database, connectionId: string, productRef: string) => {
  const awaiting = await database
    .select({
      id: webhookEvents.id,
      connector: connections.connector,
      rawPayload: webhookEvents.rawPayload,
      headers: webhookEvents.headers,
    })
    .from(webhookEvents)
    .innerJoin(connections, eq(connections.id, webhookEvents.connectionId))
    .where(and(eq(webhookEvents.connectionId, connectionId), eq(webhookEvents.outcome, "awaiting-product")))
    .orderBy(asc(webhookEvents.receivedAt));

  for (const event of awaiting) {
    const normalized = normalizeStoredEvent(event);
    if ("purchase" in normalized && normalized.purchase?.productRef === productRef) {
      await reprocessWebhookEvent(database, event.id);
    }
  }
};

/** The safety net of the cron: an event whose processing never ran after the answer, or was cut short. */
export const processMissedEvents = async (database: Database, now = new Date()) => {
  const missed = await database
    .select({ id: webhookEvents.id })
    .from(webhookEvents)
    .where(
      and(
        isNull(webhookEvents.processedAt),
        isNull(webhookEvents.error),
        lt(webhookEvents.receivedAt, new Date(now.getTime() - MISSED_AFTER_MS)),
      ),
    )
    .orderBy(asc(webhookEvents.receivedAt))
    .limit(MISSED_BATCH);
  for (const event of missed) await processWebhookEvent(database, event.id);
  return missed.length;
};
