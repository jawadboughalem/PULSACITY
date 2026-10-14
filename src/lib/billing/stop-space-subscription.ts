export type SubscribedSpace = {
  id: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

/** The subscription of a space could not be stopped: the space must not be deleted, or it would still be charged. */
export class SubscriptionNotStoppedError extends Error {
  constructor(spaceId: string) {
    super(`The subscription of space ${spaceId} could not be stopped`);
    this.name = "SubscriptionNotStoppedError";
  }
}

export type StopSubscription = (space: SubscribedSpace) => Promise<void>;

/**
 * Called before a space is deleted (Mon compte, « Supprimer mon espace »): « Votre abonnement s'arrête : plus aucun
 * prélèvement. » Lot 4.5 cancels the Stripe subscription here, at once. Until Stripe is wired, no space has a
 * subscription; one that had would be refused, rather than deleted while still charged.
 */
export const stopSpaceSubscription: StopSubscription = async (space) => {
  if (space.stripeSubscriptionId === null) return;
  throw new SubscriptionNotStoppedError(space.id);
};
