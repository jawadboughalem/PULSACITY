import { eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { user } from "@/db/schema";
import { type StopSubscription, SubscriptionNotStoppedError, stopSpaceSubscription } from "@/lib/billing/stop-space-subscription";
import { findOwnedSpace } from "./find-owned-space";

export type DeleteSpaceResult =
  | { status: "deleted"; spaceId: string; userId: string }
  | { status: "space-not-found" }
  | { status: "name-mismatch" }
  | { status: "subscription-not-stopped" };

type DeleteSpaceOptions = {
  stopSubscription?: StopSubscription;
};

/**
 * « Supprimer mon espace »: the creator types the name of the space, exactly. The subscription stops first; if it
 * cannot, nothing is deleted. Then the account goes, and with it, by cascade, the space and everything in it: offers,
 * customers, sales, requests, testimonials, widgets, connections and their notifications, sessions. Nothing of another
 * space is touched. The files (logo, photos) are deleted afterwards, by their owner's folders.
 */
export const deleteSpace = async (
  database: Database,
  userId: string,
  typedName: string,
  { stopSubscription = stopSpaceSubscription }: DeleteSpaceOptions = {},
): Promise<DeleteSpaceResult> => {
  const space = await findOwnedSpace(database, userId);
  if (!space) return { status: "space-not-found" };
  if (typedName.trim() !== space.name) return { status: "name-mismatch" };

  try {
    await stopSubscription(space);
  } catch (error) {
    if (error instanceof SubscriptionNotStoppedError) return { status: "subscription-not-stopped" };
    throw error;
  }

  await database.delete(user).where(eq(user.id, userId));
  return { status: "deleted", spaceId: space.id, userId };
};
