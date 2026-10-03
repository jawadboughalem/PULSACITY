import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, connectorWaitlist, externalProducts, productRefs, products, spaces, webhookEvents } from "@/db/schema";
import { addProduct } from "@/lib/spaces/add-product";
import { processAwaitingEvents, reprocessWebhookEvent } from "./process-webhook-event";

export type AssociationTarget = { productId: string } | { newOfferName: string };

export type AssociateResult = { status: "associated"; productId: string } | { status: "not-found" };

/**
 * Links a product of the platform to an offer, an existing one or one created for it. The sales kept aside for it are
 * processed at once: their requests are planned from the date of each sale.
 */
export const associateExternalProduct = async (
  database: Database,
  userId: string,
  externalProductId: string,
  target: AssociationTarget,
): Promise<AssociateResult> => {
  const [external] = await database
    .select({
      connectionId: externalProducts.connectionId,
      externalRef: externalProducts.externalRef,
      spaceId: connections.spaceId,
    })
    .from(externalProducts)
    .innerJoin(connections, eq(connections.id, externalProducts.connectionId))
    .innerJoin(spaces, eq(spaces.id, connections.spaceId))
    .where(and(eq(externalProducts.id, externalProductId), eq(spaces.userId, userId)))
    .limit(1);
  if (!external) return { status: "not-found" };

  let productId: string;
  if ("productId" in target) {
    const [product] = await database
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, target.productId), eq(products.spaceId, external.spaceId)))
      .limit(1);
    if (!product) return { status: "not-found" };
    productId = product.id;
  } else {
    const added = await addProduct(database, userId, external.spaceId, target.newOfferName);
    if (added.status !== "added") return { status: "not-found" };
    productId = added.product.id;
  }

  await database
    .insert(productRefs)
    .values({ productId, connectionId: external.connectionId, externalRef: external.externalRef })
    .onConflictDoUpdate({ target: [productRefs.connectionId, productRefs.externalRef], set: { productId } });
  await processAwaitingEvents(database, external.connectionId, external.externalRef);
  return { status: "associated", productId };
};

export type ReplayResult = { status: "replayed" } | { status: "not-found" };

/** « Rejouer »: the creator's own event, processed again. A sale already recorded is never recorded twice. */
export const replayOwnedEvent = async (database: Database, userId: string, eventId: string): Promise<ReplayResult> => {
  const [event] = await database
    .select({ id: webhookEvents.id })
    .from(webhookEvents)
    .innerJoin(connections, eq(connections.id, webhookEvents.connectionId))
    .innerJoin(spaces, eq(spaces.id, connections.spaceId))
    .where(and(eq(webhookEvents.id, eventId), eq(spaces.userId, userId)))
    .limit(1);
  if (!event) return { status: "not-found" };
  await reprocessWebhookEvent(database, event.id);
  return { status: "replayed" };
};

/** « Me prévenir », or a tool named after « Dites-nous quel outil »: asking twice keeps one line. */
export const joinConnectorWaitlist = async (
  database: Database,
  spaceId: string,
  connector: string,
  toolName: string | null = null,
): Promise<void> => {
  await database
    .insert(connectorWaitlist)
    .values({ spaceId, connector, toolName })
    .onConflictDoNothing({ target: [connectorWaitlist.spaceId, connectorWaitlist.connector, connectorWaitlist.toolName] });
};

export const listWaitlistedConnectors = async (database: Database, spaceId: string): Promise<string[]> => {
  const rows = await database
    .select({ connector: connectorWaitlist.connector })
    .from(connectorWaitlist)
    .where(eq(connectorWaitlist.spaceId, spaceId));
  return rows.map((row) => row.connector);
};
