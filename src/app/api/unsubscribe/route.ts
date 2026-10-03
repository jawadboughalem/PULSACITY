import * as Sentry from "@sentry/nextjs";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
import { unsubscribeCustomer } from "@/lib/requests/unsubscribe-customer";
import {
  UNSUBSCRIBE_PAGE_PATH,
  UNSUBSCRIBE_STATE_PARAMETER,
  UNSUBSCRIBE_TOKEN_PARAMETER,
  readUnsubscribeToken,
} from "@/lib/requests/unsubscribe-token";

const NO_CACHE = { "Cache-Control": "no-store" };

const readToken = (request: Request) => new URL(request.url).searchParams.get(UNSUBSCRIBE_TOKEN_PARAMETER);

const unsubscribe = async (token: string | null): Promise<"done" | "invalid" | "failed"> => {
  const customerId = readUnsubscribeToken(token);
  if (!customerId) return "invalid";
  try {
    return (await unsubscribeCustomer(getDb(), customerId)) ? "done" : "invalid";
  } catch (error) {
    Sentry.captureException(error);
    return "failed";
  }
};

/** The link of every e-mail: one click unsubscribes, then the confirmation page says so. */
export const GET = async (request: Request): Promise<Response> => {
  const token = readToken(request);
  const result = await unsubscribe(token);
  const page = new URL(`${getAppUrl()}${UNSUBSCRIBE_PAGE_PATH}`);
  if (result === "done" && token) page.searchParams.set(UNSUBSCRIBE_TOKEN_PARAMETER, token);
  if (result !== "done") page.searchParams.set(UNSUBSCRIBE_STATE_PARAMETER, result);
  return Response.redirect(page, 303);
};

/** « List-Unsubscribe-Post: List-Unsubscribe=One-Click » (RFC 8058): the mail client unsubscribes without a page. */
export const POST = async (request: Request): Promise<Response> => {
  const result = await unsubscribe(readToken(request));
  const status = { done: 200, invalid: 404, failed: 503 }[result];
  return new Response(null, { status, headers: NO_CACHE });
};
