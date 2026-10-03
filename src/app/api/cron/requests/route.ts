import { timingSafeEqual } from "node:crypto";
import * as Sentry from "@sentry/nextjs";
import { getDb } from "@/db";
import { processMissedEvents } from "@/lib/connectors/process-webhook-event";
import { sendDueReviewEmails } from "@/lib/requests/send-review-emails";

/** Vercel Cron calls every 15 minutes; a run stops sending in time to answer. */
export const maxDuration = 60;

const SENDING_TIME_MS = 45_000;

const NO_CACHE = { "Cache-Control": "no-store" };

/** Vercel Cron sends « Authorization: Bearer <CRON_SECRET> ». Without the variable, nobody may run it. */
const isAuthorized = (request: Request): boolean => {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  return expected.length === received.length && timingSafeEqual(expected, received);
};

export const GET = async (request: Request): Promise<Response> => {
  if (!isAuthorized(request)) return new Response(null, { status: 401, headers: NO_CACHE });

  const startedAt = Date.now();
  const database = getDb();
  try {
    const missedEvents = await processMissedEvents(database);
    const summary = await sendDueReviewEmails(database, { deadline: startedAt + SENDING_TIME_MS });
    return Response.json({ missedEvents, ...summary }, { headers: NO_CACHE });
  } catch (error) {
    Sentry.captureException(error);
    return Response.json({ error: "run-failed" }, { status: 500, headers: NO_CACHE });
  }
};
