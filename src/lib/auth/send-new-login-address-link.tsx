import * as Sentry from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { user } from "@/db/schema";
import { NEW_LOGIN_ADDRESS_SUBJECT, NewLoginAddressEmail } from "@/emails/NewLoginAddressEmail";
import { sendAccountEmail } from "@/lib/email/send-email";
import { type RateLimitRule, consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";

export const NEW_LOGIN_ADDRESS_LINK_LIFETIME_HOURS = 24;

export const NEW_LOGIN_ADDRESS_LINK_LIFETIME_SECONDS = NEW_LOGIN_ADDRESS_LINK_LIFETIME_HOURS * 60 * 60;

/**
 * Better Auth's own address (/api/auth/change-email) can be called without Mon compte: whatever the way in, an account
 * sends this many links an hour at most, to nobody's inbox but the ones it asks for.
 */
export const NEW_LOGIN_ADDRESS_LINKS_PER_USER: RateLimitRule = {
  name: "new-login-address-link",
  limit: 5,
  windowSeconds: 60 * 60,
};

type VerificationRequest = {
  user: { id: string; email: string };
  url: string;
};

/**
 * Better Auth asks to verify an address only when a creator changes theirs (Mon compte): the request carries the new
 * address, and the account still has the old one. Any other request is not ours to send: magic links already verify
 * every address, and nothing else may write to an address nobody asked for.
 */
export const sendNewLoginAddressLink = async (database: Database, { user: requester, url }: VerificationRequest) => {
  const [account] = await database.select({ email: user.email }).from(user).where(eq(user.id, requester.id)).limit(1);
  if (!account || account.email === requester.email) return;
  if (!(await consumeRateLimit(database, NEW_LOGIN_ADDRESS_LINKS_PER_USER, requester.id))) return;

  try {
    await sendAccountEmail({
      to: requester.email,
      subject: NEW_LOGIN_ADDRESS_SUBJECT,
      body: <NewLoginAddressEmail url={url} lifetimeHours={NEW_LOGIN_ADDRESS_LINK_LIFETIME_HOURS} />,
    });
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
