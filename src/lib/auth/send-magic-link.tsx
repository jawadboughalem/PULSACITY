import type { Database } from "@/db/database";
import { MAGIC_LINK_EMAIL_SUBJECT, MagicLinkEmail } from "@/emails/MagicLinkEmail";
import { sendAccountEmail } from "@/lib/email/send-email";
import { consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { hashRateLimitSubject } from "@/lib/rate-limit/hash-rate-limit-subject";
import { MAGIC_LINK_LIFETIME_MINUTES } from "./magic-link-lifetime";
import { MAGIC_LINKS_PER_ADDRESS } from "./magic-link-rate-limits";
import { TooManyMagicLinksError } from "./too-many-magic-links-error";

export const sendMagicLink = async (database: Database, email: string, url: string): Promise<void> => {
  const isAllowed = await consumeRateLimit(database, MAGIC_LINKS_PER_ADDRESS, hashRateLimitSubject(email));
  if (!isAllowed) throw new TooManyMagicLinksError();

  await sendAccountEmail({
    to: email,
    subject: MAGIC_LINK_EMAIL_SUBJECT,
    body: <MagicLinkEmail url={url} lifetimeMinutes={MAGIC_LINK_LIFETIME_MINUTES} />,
  });
};
