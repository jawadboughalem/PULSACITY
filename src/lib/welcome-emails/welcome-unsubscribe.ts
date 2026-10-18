import { createHmac, timingSafeEqual } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";

/** A key of its own: a customer's unsubscribe token is worth nothing here, and the other way round. */
const KEY_PURPOSE = "pulsacity:welcome-unsubscribe";

export const WELCOME_UNSUBSCRIBE_PATH = "/api/unsubscribe/accueil";

export const WELCOME_UNSUBSCRIBE_TOKEN_PARAMETER = "token";

/** On the confirmation page (/desinscription?etat=accueil): the creator stopped the welcome e-mails. */
export const WELCOME_UNSUBSCRIBED_STATE = "accueil";

const readKey = () => createHmac("sha256", readRequiredEnvironmentVariable("BETTER_AUTH_SECRET")).update(KEY_PURPOSE).digest();

const sign = (spaceId: string) => createHmac("sha256", readKey()).update(spaceId).digest("base64url");

/** « <space id>.<signature> »: the link « Ne plus recevoir les e-mails d'accueil », valid as long as the space exists. */
export const signWelcomeUnsubscribeToken = (spaceId: string): string => `${spaceId}.${sign(spaceId)}`;

export const readWelcomeUnsubscribeToken = (token: string | null | undefined): string | null => {
  const [spaceId, signature, ...rest] = (token ?? "").split(".");
  if (rest.length > 0 || !signature || !z.uuid().safeParse(spaceId).success) return null;
  const expected = Buffer.from(sign(spaceId));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received) ? spaceId : null;
};

export const buildWelcomeUnsubscribeUrl = (appUrl: string, spaceId: string): string =>
  `${appUrl}${WELCOME_UNSUBSCRIBE_PATH}?${WELCOME_UNSUBSCRIBE_TOKEN_PARAMETER}=${encodeURIComponent(signWelcomeUnsubscribeToken(spaceId))}`;

/** No welcome e-mail leaves after this; the other e-mails of the space (sign-in, testimonials, billing) go on. */
export const unsubscribeFromWelcomeEmails = async (database: Database, spaceId: string, now = new Date()): Promise<boolean> => {
  await database
    .update(spaces)
    .set({ welcomeEmailsUnsubscribedAt: now })
    .where(and(eq(spaces.id, spaceId), isNull(spaces.welcomeEmailsUnsubscribedAt)));
  const [space] = await database.select({ id: spaces.id }).from(spaces).where(eq(spaces.id, spaceId)).limit(1);
  return space !== undefined;
};
