import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { getAppUrl } from "@/lib/app-url";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";

/** A key of its own, drawn from the application's secret: a token signed for one use is worth nothing elsewhere. */
const KEY_PURPOSE = "pulsacity:unsubscribe";

export const UNSUBSCRIBE_TOKEN_PARAMETER = "token";

/** The confirmation page, reached after the link of an e-mail. */
export const UNSUBSCRIBE_PAGE_PATH = "/desinscription";

/** On the confirmation page: « invalid » or « failed » when the link did not unsubscribe. */
export const UNSUBSCRIBE_STATE_PARAMETER = "etat";

const readKey = () => createHmac("sha256", readRequiredEnvironmentVariable("BETTER_AUTH_SECRET")).update(KEY_PURPOSE).digest();

const sign = (customerId: string) => createHmac("sha256", readKey()).update(customerId).digest("base64url");

/** « <customer id>.<signature> »: one token per customer of a space, valid as long as the customer exists. */
export const signUnsubscribeToken = (customerId: string): string => `${customerId}.${sign(customerId)}`;

export const readUnsubscribeToken = (token: string | null | undefined): string | null => {
  const [customerId, signature, ...rest] = (token ?? "").split(".");
  if (rest.length > 0 || !signature || !z.uuid().safeParse(customerId).success) return null;
  const expected = Buffer.from(sign(customerId));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received) ? customerId : null;
};

export const buildUnsubscribeUrl = (customerId: string): string =>
  `${getAppUrl()}/api/unsubscribe?${UNSUBSCRIBE_TOKEN_PARAMETER}=${encodeURIComponent(signUnsubscribeToken(customerId))}`;
