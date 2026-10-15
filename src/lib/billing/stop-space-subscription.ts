import type Stripe from "stripe";
import { prepareStop } from "./plan-change";
import { getStripe } from "./stripe-client";

export type SubscribedSpace = {
  id: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

/** The subscription of a space could not be stopped: the space must not be deleted, or it would still be charged. */
export class SubscriptionNotStoppedError extends Error {
  constructor(spaceId: string, options?: ErrorOptions) {
    super(`The subscription of space ${spaceId} could not be stopped`, options);
    this.name = "SubscriptionNotStoppedError";
  }
}

export type StopSubscription = (space: SubscribedSpace) => Promise<void>;

const isAlreadyGone = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error.code === "resource_missing" || error.code === "subscription_canceled");

/**
 * Stops the subscription at once, without refund: « Votre abonnement s'arrête : plus aucun prélèvement. » Called
 * before a space is deleted (Mon compte). A subscription Stripe no longer has is already stopped.
 */
export const stopSubscriptionWith =
  (stripe: () => Stripe): StopSubscription =>
  async (space) => {
    if (space.stripeSubscriptionId === null) return;
    try {
      const client = stripe();
      const subscription = await client.subscriptions.retrieve(space.stripeSubscriptionId);
      if (subscription.status === "canceled" || subscription.status === "incomplete_expired") return;
      await prepareStop(client, subscription.id);
      await client.subscriptions.cancel(subscription.id, { invoice_now: false, prorate: false });
    } catch (error) {
      if (isAlreadyGone(error)) return;
      throw new SubscriptionNotStoppedError(space.id, { cause: error });
    }
  };

export const stopSpaceSubscription: StopSubscription = stopSubscriptionWith(getStripe);
