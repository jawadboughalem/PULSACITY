import { randomUUID } from "node:crypto";
import type { Database } from "./database";
import {
  connections,
  connectorWaitlist,
  customers,
  externalProducts,
  productRefs,
  products,
  purchases,
  reviewRequests,
  session,
  testimonials,
  webhookEvents,
  widgets,
} from "./schema";

/**
 * A space with a row in every table that belongs to it: an offer, a connection with its notification and its product to
 * associate, a customer, a sale, its request, a testimonial with its consent, a widget, a « Me prévenir », a session.
 */
export const fillTestSpace = async (database: Database, userId: string, spaceId: string, tag: string) => {
  await database.insert(session).values({
    id: randomUUID(),
    token: randomUUID(),
    userId,
    expiresAt: new Date("2099-01-01T00:00:00Z"),
    updatedAt: new Date("2026-10-10T08:00:00Z"),
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Version/18.0 Mobile/15E148 Safari/604.1",
  });
  const [product] = await database
    .insert(products)
    .values({ spaceId, name: `Programme ${tag}`, slug: `programme-${tag}` })
    .returning({ id: products.id });
  const [connection] = await database
    .insert(connections)
    .values({ spaceId, connector: "systeme", webhookToken: `secret-token-${tag}`, config: { signingSecret: `secret-key-${tag}` } })
    .returning({ id: connections.id });
  await database.insert(productRefs).values({ productId: product.id, connectionId: connection.id, externalRef: `price-plan:${tag}` });
  await database.insert(externalProducts).values({
    connectionId: connection.id,
    externalRef: `price-plan:other-${tag}`,
    name: `Produit ${tag}`,
    firstSeenAt: new Date("2026-10-01T10:00:00Z"),
  });
  const [customer] = await database
    .insert(customers)
    .values({ spaceId, email: `camille-${tag}@exemple.fr`, firstName: "Camille", lastName: "Roux" })
    .returning({ id: customers.id });
  const [purchase] = await database
    .insert(purchases)
    .values({
      spaceId,
      customerId: customer.id,
      productId: product.id,
      connectionId: connection.id,
      source: "connector",
      eventType: "sale",
      externalRef: `order-item:${tag}`,
      purchasedAt: new Date("2026-10-01T10:00:00Z"),
    })
    .returning({ id: purchases.id });
  await database.insert(reviewRequests).values({
    purchaseId: purchase.id,
    token: `secret-request-${tag}`,
    scheduledAt: new Date("2026-10-15T10:00:00Z"),
    sentAt: new Date("2026-10-15T10:05:00Z"),
    completedAt: new Date("2026-10-16T09:00:00Z"),
    status: "completed",
  });
  await database.insert(webhookEvents).values({
    connectionId: connection.id,
    rawPayload: { customer: { email: `camille-${tag}@exemple.fr` } },
    headers: {},
    purchaseId: purchase.id,
  });
  await database.insert(testimonials).values({
    spaceId,
    productId: product.id,
    customerId: customer.id,
    authorName: "Camille R.",
    authorPhotoUrl: `https://photos.exemple.fr/testimonial-photos/${spaceId}/photo.jpg`,
    rating: 5,
    body: `J'ai arrêté de grignoter le soir (${tag}).`,
    status: "approved",
    source: "form",
    consentAt: new Date("2026-10-16T09:00:00Z"),
    consentText: "J'accepte que mon témoignage soit publié.",
  });
  await database.insert(widgets).values({ spaceId, type: "wall", productId: product.id, settings: { theme: "light" } });
  await database.insert(connectorWaitlist).values({ spaceId, connector: "stripe" });
};
