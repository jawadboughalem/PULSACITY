import { and, asc, count, eq, inArray } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, externalProducts, productRefs, products, purchases, testimonials } from "@/db/schema";

export type OfferConnectorRef = {
  connector: string;
  externalRef: string;
  /** The product as the platform names it, once a sale brought it. */
  productName: string | null;
};

export type OfferPrice = { amountCents: number; currency: string };

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
  /** The price of its first associated product that has one. */
  price: OfferPrice | null;
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
      .select({
        productId: productRefs.productId,
        connector: connections.connector,
        externalRef: productRefs.externalRef,
        productName: externalProducts.name,
        priceCents: externalProducts.priceCents,
        currency: externalProducts.currency,
      })
      .from(productRefs)
      .innerJoin(connections, eq(connections.id, productRefs.connectionId))
      .leftJoin(
        externalProducts,
        and(
          eq(externalProducts.connectionId, productRefs.connectionId),
          eq(externalProducts.externalRef, productRefs.externalRef),
        ),
      )
      .where(inArray(productRefs.productId, offerIds))
      .orderBy(asc(connections.connector), asc(externalProducts.firstSeenAt), asc(productRefs.externalRef)),
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

  return offers.map((offer) => {
    const offerRefs = refs.filter((ref) => ref.productId === offer.id);
    const priced = offerRefs.find((ref) => ref.priceCents !== null && ref.currency !== null);
    return {
      ...offer,
      testimonialCount: countByOffer.get(offer.id) ?? 0,
      hasSales: offersWithSales.has(offer.id),
      connectorRefs: offerRefs.map(({ connector, externalRef, productName }) => ({ connector, externalRef, productName })),
      price:
        priced && priced.priceCents !== null && priced.currency !== null
          ? { amountCents: priced.priceCents, currency: priced.currency }
          : null,
    };
  });
};

/** The connectors this space has set up, so an offer can say which of them has no product linked to it yet. */
export const listSpaceConnectors = async (database: Database, spaceId: string): Promise<string[]> => {
  const rows = await database
    .select({ connector: connections.connector })
    .from(connections)
    .where(eq(connections.spaceId, spaceId))
    .orderBy(asc(connections.connector));
  return rows.map((row) => row.connector);
};
