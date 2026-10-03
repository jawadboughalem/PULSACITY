import { and, eq, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { externalProducts, productRefs } from "@/db/schema";
import type { NormalizedPurchase } from "./types";

/** The product as the platform names it now; its first sale stays the first. */
export const upsertExternalProduct = async (
  database: Database,
  connectionId: string,
  purchase: NormalizedPurchase,
): Promise<void> => {
  await database
    .insert(externalProducts)
    .values({
      connectionId,
      externalRef: purchase.productRef,
      name: purchase.productName,
      priceCents: purchase.productPrice?.amountCents ?? null,
      currency: purchase.productPrice?.currency ?? null,
      firstSeenAt: purchase.occurredAt,
      eventType: purchase.eventType,
    })
    .onConflictDoUpdate({
      target: [externalProducts.connectionId, externalProducts.externalRef],
      set: {
        name: sql`excluded.name`,
        priceCents: sql`coalesce(excluded.price_cents, ${externalProducts.priceCents})`,
        currency: sql`coalesce(excluded.currency, ${externalProducts.currency})`,
        firstSeenAt: sql`least(excluded.first_seen_at, ${externalProducts.firstSeenAt})`,
        eventType: sql`coalesce(${externalProducts.eventType}, excluded.event_type)`,
      },
    });
};

export const findAssociatedProductId = async (
  database: Database,
  connectionId: string,
  externalRef: string,
): Promise<string | null> => {
  const [ref] = await database
    .select({ productId: productRefs.productId })
    .from(productRefs)
    .where(and(eq(productRefs.connectionId, connectionId), eq(productRefs.externalRef, externalRef)))
    .limit(1);
  return ref?.productId ?? null;
};
