import { and, eq, isNull } from "drizzle-orm";
import type Stripe from "stripe";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";

export type BillingSpace = {
  id: string;
  name: string;
  slug: string;
  stripeCustomerId: string | null;
};

/**
 * The Stripe customer of a space, created at its first payment: the account's address, the space's name, French
 * e-mails from Stripe. Two clicks at once create one customer (idempotency key), and a space keeps the first one saved.
 */
export const ensureStripeCustomer = async (
  database: Database,
  stripe: Stripe,
  space: BillingSpace,
  email: string,
  { withTestClock, now = new Date() }: { withTestClock: boolean; now?: Date },
): Promise<string> => {
  if (space.stripeCustomerId !== null) return space.stripeCustomerId;
  const testClock = withTestClock
    ? await stripe.testHelpers.testClocks.create(
        { frozen_time: Math.floor(now.getTime() / 1000), name: `Recette ${space.slug}`.slice(0, 300) },
        { idempotencyKey: `test-clock-${space.id}` },
      )
    : null;
  const customer = await stripe.customers.create(
    {
      email,
      name: space.name,
      preferred_locales: ["fr"],
      metadata: { space_id: space.id },
      ...(testClock !== null ? { test_clock: testClock.id } : {}),
    },
    { idempotencyKey: `customer-${space.id}` },
  );
  const [saved] = await database
    .update(spaces)
    .set({ stripeCustomerId: customer.id })
    .where(and(eq(spaces.id, space.id), isNull(spaces.stripeCustomerId)))
    .returning({ stripeCustomerId: spaces.stripeCustomerId });
  if (saved?.stripeCustomerId) return saved.stripeCustomerId;
  const [current] = await database
    .select({ stripeCustomerId: spaces.stripeCustomerId })
    .from(spaces)
    .where(eq(spaces.id, space.id));
  return current?.stripeCustomerId ?? customer.id;
};
