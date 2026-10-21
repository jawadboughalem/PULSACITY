import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests, spaces, testimonials } from "@/db/schema";
import { isReviewRequestActive } from "./active-review-request-statuses";
import { formatCustomerName } from "./format-customer-name";

export type CollectionSpace = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  /** The creator's accent, on the button of the page (charte v2). Null: Soleil. */
  accentColor: string | null;
  replyToEmail: string;
  referralCode: string;
  /** Réglages, « J'offre une contrepartie à mes clients »: said before the form, so the customer knows before writing. */
  incentiveDeclaredAt: Date | null;
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
  /**
   * « Gérer mon avis »: the link of a request already answered. While the review is kept, its author can withdraw the
   * consent; once it is gone (withdrawn, or deleted by the creator), the page says so.
   */
  | { status: "review-saved"; space: CollectionSpace; requestToken: string }
  | { status: "review-removed"; space: CollectionSpace; requestToken: string }
  | { status: "link-inactive"; space: CollectionSpace };

const findCollectionSpace = async (database: Database, spaceSlug: string): Promise<CollectionSpace | null> => {
  const [space] = await database
    .select({
      id: spaces.id,
      name: spaces.name,
      slug: spaces.slug,
      logoUrl: spaces.logoUrl,
      accentColor: spaces.accentColor,
      replyToEmail: spaces.replyToEmail,
      referralCode: spaces.referralCode,
      incentiveDeclaredAt: spaces.incentiveDeclaredAt,
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
      id: reviewRequests.id,
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
  if (request?.status === "completed") {
    const [review] = await database
      .select({ id: testimonials.id })
      .from(testimonials)
      .where(and(eq(testimonials.reviewRequestId, request.id), eq(testimonials.spaceId, space.id)))
      .limit(1);
    return review ? { status: "review-saved", space, requestToken } : { status: "review-removed", space, requestToken };
  }
  if (!request || !isReviewRequestActive(request.status)) return { status: "link-inactive", space };

  return {
    status: "open",
    space,
    product: { name: request.productName, slug: request.productSlug },
    request: { token: requestToken, prefilledName: formatCustomerName(request) },
  };
};
