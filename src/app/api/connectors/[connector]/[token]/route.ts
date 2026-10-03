import * as Sentry from "@sentry/nextjs";
import { after } from "next/server";
import { getDb } from "@/db";
import { processWebhookEvent } from "@/lib/connectors/process-webhook-event";
import { type ReceivedWebhook, receiveWebhook } from "@/lib/connectors/receive-webhook";

const NO_CACHE = { "Cache-Control": "no-store" };

const RETRY_LATER = { ...NO_CACHE, "Retry-After": "60" };

/**
 * Every connector's deliveries: stored as received, answered at once, processed after the answer. The cron catches up
 * an event whose processing did not run. A wrong address answers 404 and nothing else.
 */
export const POST = async (
  request: Request,
  { params }: RouteContext<"/api/connectors/[connector]/[token]">,
): Promise<Response> => {
  const { connector, token } = await params;
  const database = getDb();
  let received: ReceivedWebhook;
  try {
    received = await receiveWebhook(database, connector, token, request);
  } catch (error) {
    Sentry.captureException(error);
    return new Response(null, { status: 503, headers: RETRY_LATER });
  }

  if (received.status === "not-found") return new Response(null, { status: 404, headers: NO_CACHE });
  if (received.status === "too-large") return new Response(null, { status: 413, headers: NO_CACHE });
  if (received.status === "too-many") return new Response(null, { status: 429, headers: RETRY_LATER });

  if (received.isVerified) {
    const { eventId } = received;
    after(async () => {
      try {
        await processWebhookEvent(database, eventId);
      } catch (error) {
        Sentry.captureException(error);
      }
    });
  }
  return Response.json({ received: true }, { headers: NO_CACHE });
};
