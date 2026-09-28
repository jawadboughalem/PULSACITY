import { randomUUID } from "node:crypto";
import type { Database } from "@/db/database";
import { products } from "@/db/schema";
import { isSpaceOwnedBy } from "./is-space-owned-by";
import { appendSlugSuffix, slugify } from "./slugify";

const FALLBACK_PRODUCT_SLUG = "formation";
const MAX_NUMBERED_SLUG = 50;

export type SpaceProduct = {
  id: string;
  name: string;
  slug: string;
};

export type AddProductResult = { status: "added"; product: SpaceProduct } | { status: "space-not-found" };

const buildCandidateSlug = (baseSlug: string, attempt: number) =>
  attempt === 1 ? baseSlug : appendSlugSuffix(baseSlug, String(attempt));

export const addProduct = async (
  database: Database,
  userId: string,
  spaceId: string,
  name: string,
): Promise<AddProductResult> => {
  if (!(await isSpaceOwnedBy(database, userId, spaceId))) return { status: "space-not-found" };

  const baseSlug = slugify(name) || FALLBACK_PRODUCT_SLUG;
  for (let attempt = 1; attempt <= MAX_NUMBERED_SLUG; attempt += 1) {
    const [product] = await database
      .insert(products)
      .values({ spaceId, name, slug: buildCandidateSlug(baseSlug, attempt) })
      .onConflictDoNothing({ target: [products.spaceId, products.slug] })
      .returning({ id: products.id, name: products.name, slug: products.slug });
    if (product) return { status: "added", product };
  }

  const [product] = await database
    .insert(products)
    .values({ spaceId, name, slug: appendSlugSuffix(baseSlug, randomUUID().slice(0, 8)) })
    .returning({ id: products.id, name: products.name, slug: products.slug });
  return { status: "added", product };
};
