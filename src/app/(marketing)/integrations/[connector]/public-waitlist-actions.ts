"use server";

import { headers } from "next/headers";
import { getDb } from "@/db";
import { PUBLIC_WAITLIST_PER_IP, joinPublicWaitlist, publicWaitlistSchema } from "@/lib/connectors/public-waitlist";
import { consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { hashRateLimitSubject } from "@/lib/rate-limit/hash-rate-limit-subject";
import { readClientIp } from "@/lib/rate-limit/read-client-ip";
import { HONEYPOT_FIELD_NAME } from "@/lib/forms/honeypot";

export type JoinWaitlistResult =
  | { ok: true; data: { email: string } }
  | { ok: false; error: "invalid-email" | "too-many-requests" };

/** « Me prévenir » on /integrations/stripe and /integrations/calendly, for a visitor without a space. */
export const joinConnectorWaitlist = async (
  _previousResult: JoinWaitlistResult | null,
  formData: FormData,
): Promise<JoinWaitlistResult> => {
  const parsed = publicWaitlistSchema.safeParse({ connector: formData.get("connector"), email: formData.get("email") });
  if (!parsed.success) return { ok: false, error: "invalid-email" };
  // A robot that fills every field is told it worked, and nothing is kept.
  if (formData.get(HONEYPOT_FIELD_NAME)) return { ok: true, data: { email: parsed.data.email } };

  const database = getDb();
  const isAllowed = await consumeRateLimit(
    database,
    PUBLIC_WAITLIST_PER_IP,
    hashRateLimitSubject(readClientIp(await headers())),
  );
  if (!isAllowed) return { ok: false, error: "too-many-requests" };

  await joinPublicWaitlist(database, parsed.data);
  return { ok: true, data: { email: parsed.data.email } };
};
