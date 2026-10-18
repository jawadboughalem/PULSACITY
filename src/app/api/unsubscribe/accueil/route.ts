import * as Sentry from "@sentry/nextjs";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
import { UNSUBSCRIBE_PAGE_PATH, UNSUBSCRIBE_STATE_PARAMETER } from "@/lib/requests/unsubscribe-token";
import {
  WELCOME_UNSUBSCRIBED_STATE,
  WELCOME_UNSUBSCRIBE_TOKEN_PARAMETER,
  readWelcomeUnsubscribeToken,
  unsubscribeFromWelcomeEmails,
} from "@/lib/welcome-emails/welcome-unsubscribe";

const NO_CACHE = { "Cache-Control": "no-store" };

const readToken = (request: Request) => new URL(request.url).searchParams.get(WELCOME_UNSUBSCRIBE_TOKEN_PARAMETER);

const unsubscribe = async (token: string | null): Promise<"done" | "invalid" | "failed"> => {
  const spaceId = readWelcomeUnsubscribeToken(token);
  if (!spaceId) return "invalid";
  try {
    return (await unsubscribeFromWelcomeEmails(getDb(), spaceId)) ? "done" : "invalid";
  } catch (error) {
    Sentry.captureException(error);
    return "failed";
  }
};

/** « Ne plus recevoir les e-mails d'accueil »: one click stops them, then the confirmation page says so. */
export const GET = async (request: Request): Promise<Response> => {
  const result = await unsubscribe(readToken(request));
  const page = new URL(`${getAppUrl()}${UNSUBSCRIBE_PAGE_PATH}`);
  page.searchParams.set(UNSUBSCRIBE_STATE_PARAMETER, result === "done" ? WELCOME_UNSUBSCRIBED_STATE : result);
  return Response.redirect(page, 303);
};

/** « List-Unsubscribe-Post: List-Unsubscribe=One-Click » (RFC 8058): the mail client unsubscribes without a page. */
export const POST = async (request: Request): Promise<Response> => {
  const result = await unsubscribe(readToken(request));
  const status = { done: 200, invalid: 404, failed: 503 }[result];
  return new Response(null, { status, headers: NO_CACHE });
};
