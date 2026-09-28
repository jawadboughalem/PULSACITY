import { asc, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { products } from "@/db/schema";
import type { SpaceProduct } from "./add-product";

export const listSpaceProducts = (database: Database, spaceId: string): Promise<SpaceProduct[]> =>
  database
    .select({ id: products.id, name: products.name, slug: products.slug })
    .from(products)
    .where(eq(products.spaceId, spaceId))
    .orderBy(asc(products.createdAt), asc(products.name));
