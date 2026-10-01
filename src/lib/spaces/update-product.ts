import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { products, spaces } from "@/db/schema";

export type ProductChange = Partial<Pick<typeof products.$inferInsert, "name" | "requestDelayDays" | "requestsEnabled">>;

export type UpdateProductResult = { status: "updated" } | { status: "product-not-found" };

/** The slug stays: collection links already shared keep working after a rename. */
export const updateProduct = async (
  database: Database,
  userId: string,
  productId: string,
  change: ProductChange,
): Promise<UpdateProductResult> => {
  const [product] = await database
    .select({ id: products.id, spaceId: products.spaceId })
    .from(products)
    .innerJoin(spaces, eq(spaces.id, products.spaceId))
    .where(and(eq(products.id, productId), eq(spaces.userId, userId)))
    .limit(1);
  if (!product) return { status: "product-not-found" };

  await database
    .update(products)
    .set(change)
    .where(and(eq(products.id, product.id), eq(products.spaceId, product.spaceId)));
  return { status: "updated" };
};
