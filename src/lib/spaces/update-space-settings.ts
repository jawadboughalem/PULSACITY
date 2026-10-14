import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";
import { isUniqueViolation } from "@/lib/database-errors";
import { findOwnedSpace } from "./find-owned-space";
import { suggestAvailableSpaceSlug } from "./suggest-available-space-slug";

export type LogoChange = { action: "keep" } | { action: "set"; url: string } | { action: "remove" };

export type SpaceSettings = {
  name: string;
  slug: string;
  accentColor: string | null;
  replyToEmail: string;
  senderPostalAddress: string | null;
  newTestimonialEmailEnabled: boolean;
  offersIncentive: boolean;
  logo: LogoChange;
};

export type UpdateSpaceSettingsResult =
  | { status: "updated"; slug: string }
  | { status: "slug-taken"; suggestedSlug: string }
  | { status: "space-not-found" };

/** null: the address is free for this user's space (or already its own). Otherwise a free one to suggest. */
export const findSlugSuggestion = async (database: Database, userId: string, slug: string): Promise<string | null> => {
  const [slugOwner] = await database
    .select({ ownerId: spaces.userId })
    .from(spaces)
    .where(eq(spaces.slug, slug))
    .limit(1);
  if (!slugOwner || slugOwner.ownerId === userId) return null;
  return suggestAvailableSpaceSlug(database, slug);
};

const readLogoUrl = (logo: LogoChange, currentUrl: string | null) => {
  if (logo.action === "set") return logo.url;
  if (logo.action === "remove") return null;
  return currentUrl;
};

/**
 * Saves Réglages for the space of this user, and of no one else. A new address of the collection page must be free:
 * otherwise nothing is saved, and a free one is suggested. « J'offre une contrepartie » keeps the day it was first
 * declared, until it is unticked.
 */
export const updateSpaceSettings = async (
  database: Database,
  userId: string,
  settings: SpaceSettings,
  now: Date = new Date(),
): Promise<UpdateSpaceSettingsResult> => {
  const space = await findOwnedSpace(database, userId);
  if (!space) return { status: "space-not-found" };

  const suggestedSlug = await findSlugSuggestion(database, userId, settings.slug);
  if (suggestedSlug) return { status: "slug-taken", suggestedSlug };

  try {
    await database
      .update(spaces)
      .set({
        name: settings.name,
        slug: settings.slug,
        accentColor: settings.accentColor,
        replyToEmail: settings.replyToEmail,
        senderPostalAddress: settings.senderPostalAddress,
        newTestimonialEmailEnabled: settings.newTestimonialEmailEnabled,
        incentiveDeclaredAt: settings.offersIncentive ? (space.incentiveDeclaredAt ?? now) : null,
        logoUrl: readLogoUrl(settings.logo, space.logoUrl),
      })
      .where(and(eq(spaces.id, space.id), eq(spaces.userId, userId)));
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
    return { status: "slug-taken", suggestedSlug: await suggestAvailableSpaceSlug(database, settings.slug) };
  }

  return { status: "updated", slug: settings.slug };
};
