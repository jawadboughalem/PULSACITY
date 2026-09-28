import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { products, purchases, spaces } from "@/db/schema";

export type RemoveProductResult = { status: "removed" } | { status: "product-not-found" } | { status: "has-sales" };

export const removeProduct = async (
  database: Database,
  userId: string,
  productId: string,
): Promise<RemoveProductResult> => {
  const [product] = await database
    .select({ id: products.id, spaceId: products.spaceId })
    .from(products)
    .innerJoin(spaces, eq(spaces.id, products.spaceId))
    .where(and(eq(products.id, productId), eq(spaces.userId, userId)))
    .limit(1);
  if (!product) return { status: "product-not-found" };

  const [sale] = await database
    .select({ id: purchases.id })
    .from(purchases)
    .where(eq(purchases.productId, product.id))
    .limit(1);
  if (sale) return { status: "has-sales" };

  await database.delete(products).where(and(eq(products.id, product.id), eq(products.spaceId, product.spaceId)));
  return { status: "removed" };
};
