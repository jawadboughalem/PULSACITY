import { sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { spaces, widgets } from "@/db/schema";
import { findOwnedSpace } from "./find-owned-space";
import { generateReferralCode } from "./generate-referral-code";
import { suggestAvailableSpaceSlug } from "./suggest-available-space-slug";

export type NewSpace = {
  name: string;
  slug: string;
  replyToEmail: string;
  accentColor: string | null;
  logoUrl: string | null;
};

export type CreateSpaceResult =
  | { status: "created"; space: { id: string; slug: string } }
  | { status: "slug-taken"; suggestedSlug: string }
  | { status: "already-has-space" };

export const createSpace = (database: Database, userId: string, newSpace: NewSpace): Promise<CreateSpaceResult> =>
  database.transaction(async (transaction): Promise<CreateSpaceResult> => {
    await transaction.execute(sql`select pg_advisory_xact_lock(hashtext(${`create-space:${userId}`}))`);
    if (await findOwnedSpace(transaction, userId)) return { status: "already-has-space" };

    const [space] = await transaction
      .insert(spaces)
      .values({ ...newSpace, userId, referralCode: generateReferralCode() })
      .onConflictDoNothing({ target: spaces.slug })
      .returning({ id: spaces.id, slug: spaces.slug });
    if (!space) {
      return { status: "slug-taken", suggestedSlug: await suggestAvailableSpaceSlug(transaction, newSpace.slug) };
    }

    await transaction.insert(widgets).values({ spaceId: space.id, type: "wall" });
    return { status: "created", space };
  });
