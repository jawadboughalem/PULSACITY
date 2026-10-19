import { randomUUID } from "node:crypto";
import type { Database } from "./database";
import { customers, products, purchases, reviewRequests } from "./schema";

type TestReviewRequest = {
  spaceId: string;
  productName: string;
  firstName: string | null;
  lastName: string | null;
  status?: "scheduled" | "sent" | "reminded" | "completed" | "cancelled" | "failed";
};

export const insertTestReviewRequest = async (
  database: Database,
  { spaceId, productName, firstName, lastName, status = "sent" }: TestReviewRequest,
) => {
  const [product] = await database
    .insert(products)
    .values({ spaceId, name: productName, slug: randomUUID() })
    .returning({ id: products.id, slug: products.slug });
  const [customer] = await database
    .insert(customers)
    .values({ spaceId, email: `${randomUUID()}@exemple.fr`, firstName, lastName })
    .returning({ id: customers.id });
  const [purchase] = await database
    .insert(purchases)
    .values({ spaceId, customerId: customer.id, productId: product.id, source: "manual", purchasedAt: new Date() })
    .returning({ id: purchases.id });
  const token = randomUUID();
  const [request] = await database
    .insert(reviewRequests)
    .values({ purchaseId: purchase.id, token, scheduledAt: new Date(), status })
    .returning({ id: reviewRequests.id });
  return { id: request.id, token, customerId: customer.id, productId: product.id, productSlug: product.slug };
};
