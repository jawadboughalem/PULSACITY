import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests, spaces } from "@/db/schema";
import { isReviewRequestActive } from "./active-review-request-statuses";
import { formatCustomerName } from "./format-customer-name";

export type CollectionSpace = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  replyToEmail: string;
  referralCode: string;
};

export type CollectionProduct = {
  name: string;
  slug: string;
};

export type CollectionPage =
  | {
      status: "open";
      space: CollectionSpace;
      product: CollectionProduct | null;
      request: { token: string; prefilledName: string } | null;
    }
  | { status: "link-inactive"; space: CollectionSpace };

const findCollectionSpace = async (database: Database, spaceSlug: string): Promise<CollectionSpace | null> => {
  const [space] = await database
    .select({
      id: spaces.id,
      name: spaces.name,
      slug: spaces.slug,
      logoUrl: spaces.logoUrl,
      replyToEmail: spaces.replyToEmail,
      referralCode: spaces.referralCode,
    })
    .from(spaces)
    .where(eq(spaces.slug, spaceSlug))
    .limit(1);
  return space ?? null;
};

export const findCollectionProduct = async (
  database: Database,
  spaceId: string,
  productSlug: string,
): Promise<(CollectionProduct & { id: string }) | null> => {
  const [product] = await database
    .select({ id: products.id, name: products.name, slug: products.slug })
    .from(products)
    .where(and(eq(products.spaceId, spaceId), eq(products.slug, productSlug)))
    .limit(1);
  return product ?? null;
};

export const loadCollectionPage = async (
  database: Database,
  spaceSlug: string,
  productSlug: string | null,
  requestToken: string | null,
): Promise<CollectionPage | null> => {
  const space = await findCollectionSpace(database, spaceSlug);
  if (!space) return null;

  const product = productSlug ? await findCollectionProduct(database, space.id, productSlug) : null;
  if (productSlug && !product) return null;
  if (!requestToken) return { status: "open", space, product, request: null };

  const [request] = await database
    .select({
      status: reviewRequests.status,
      firstName: customers.firstName,
      lastName: customers.lastName,
      productName: products.name,
      productSlug: products.slug,
    })
    .from(reviewRequests)
    .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
    .innerJoin(customers, eq(customers.id, purchases.customerId))
    .innerJoin(products, eq(products.id, purchases.productId))
    .where(and(eq(reviewRequests.token, requestToken), eq(purchases.spaceId, space.id)))
    .limit(1);
  if (!request || !isReviewRequestActive(request.status)) return { status: "link-inactive", space };

  return {
    status: "open",
    space,
    product: { name: request.productName, slug: request.productSlug },
    request: { token: requestToken, prefilledName: formatCustomerName(request) },
  };
};
