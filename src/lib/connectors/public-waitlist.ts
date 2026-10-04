import { z } from "zod";
import type { Database } from "@/db/database";
import { connectorWaitlistEmails } from "@/db/schema";
import type { RateLimitRule } from "@/lib/rate-limit/consume-rate-limit";
import { UPCOMING_CONNECTOR_IDS } from "./upcoming-connectors";

export const publicWaitlistSchema = z.object({
  connector: z.enum(UPCOMING_CONNECTOR_IDS),
  email: z.string().trim().toLowerCase().pipe(z.email()),
});

/** A visitor of a public connector page, without a space: a few addresses an hour is plenty. */
export const PUBLIC_WAITLIST_PER_IP: RateLimitRule = {
  name: "public-waitlist-ip",
  limit: 5,
  windowSeconds: 60 * 60,
};

/** Twice the same address for the same connector is kept once: the visitor sees the same confirmation. */
export const joinPublicWaitlist = async (
  database: Database,
  entry: z.infer<typeof publicWaitlistSchema>,
): Promise<void> => {
  await database
    .insert(connectorWaitlistEmails)
    .values(entry)
    .onConflictDoNothing({ target: [connectorWaitlistEmails.connector, connectorWaitlistEmails.email] });
};
