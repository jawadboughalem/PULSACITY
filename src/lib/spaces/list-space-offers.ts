import { asc, count, eq, inArray } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, productRefs, products, purchases, testimonials } from "@/db/schema";
import type { ConnectorId } from "@/lib/connectors/types";

export type OfferConnectorRef = {
  connector: ConnectorId;
  externalRef: string;
};

export type SpaceOffer = {
  id: string;
  name: string;
  slug: string;
  requestDelayDays: number;
  requestsEnabled: boolean;
  testimonialCount: number;
  /** An offer with sales stays: removing it would orphan them. */
  hasSales: boolean;
  connectorRefs: OfferConnectorRef[];
};

export const listSpaceOffers = async (database: Database, spaceId: string): Promise<SpaceOffer[]> => {
  const offers = await database
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      requestDelayDays: products.requestDelayDays,
      requestsEnabled: products.requestsEnabled,
    })
    .from(products)
    .where(eq(products.spaceId, spaceId))
    .orderBy(asc(products.createdAt), asc(products.name));
  if (offers.length === 0) return [];

  const offerIds = offers.map((offer) => offer.id);
  const [refs, testimonialCounts, saleCounts] = await Promise.all([
    database
      .select({ productId: productRefs.productId, connector: connections.connector, externalRef: productRefs.externalRef })
      .from(productRefs)
      .innerJoin(connections, eq(connections.id, productRefs.connectionId))
      .where(inArray(productRefs.productId, offerIds))
      .orderBy(asc(connections.connector), asc(productRefs.externalRef)),
    database
      .select({ productId: testimonials.productId, testimonialCount: count() })
      .from(testimonials)
      .where(inArray(testimonials.productId, offerIds))
      .groupBy(testimonials.productId),
    database
      .select({ productId: purchases.productId, saleCount: count() })
      .from(purchases)
      .where(inArray(purchases.productId, offerIds))
      .groupBy(purchases.productId),
  ]);
  const countByOffer = new Map(testimonialCounts.map((row) => [row.productId, row.testimonialCount] as const));
  const offersWithSales = new Set(saleCounts.map((row) => row.productId));

  return offers.map((offer) => ({
    ...offer,
    testimonialCount: countByOffer.get(offer.id) ?? 0,
    hasSales: offersWithSales.has(offer.id),
    connectorRefs: refs
      .filter((ref) => ref.productId === offer.id)
      .map(({ connector, externalRef }) => ({ connector, externalRef })),
  }));
};
