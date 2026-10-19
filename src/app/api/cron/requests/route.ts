import { timingSafeEqual } from "node:crypto";
import * as Sentry from "@sentry/nextjs";
import { getDb } from "@/db";
import { runBillingTasks } from "@/lib/billing/run-billing-tasks";
import { getStripe, isStripeConfigured } from "@/lib/billing/stripe-client";
import { processMissedEvents } from "@/lib/connectors/process-webhook-event";
import { sendDueReviewEmails } from "@/lib/requests/send-review-emails";
import { sendWaitingHiddenReasons } from "@/lib/testimonials/send-hidden-reason";
import { sendDueWelcomeEmails } from "@/lib/welcome-emails/send-welcome-emails";

/**
 * The workflow « Send review requests » calls every 15 minutes, Vercel Cron once a day (the most the Hobby plan allows).
 * A run also replays the Stripe events left behind, sends the beta testers' reminders, the welcome e-mails due and the
 * reasons of « Masquer » that did not leave at once. It stops sending in time to answer.
 */
export const maxDuration = 60;

const SENDING_TIME_MS = 45_000;

const NO_CACHE = { "Cache-Control": "no-store" };

/** Both send « Authorization: Bearer <CRON_SECRET> ». Without the variable, nobody may run it. */
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
    const billing = await runBillingTasks(database, isStripeConfigured() ? getStripe() : null);
    const summary = await sendDueReviewEmails(database, { deadline: startedAt + SENDING_TIME_MS });
    const welcome = await sendDueWelcomeEmails(database, { deadline: startedAt + SENDING_TIME_MS });
    const hiddenReasons = await sendWaitingHiddenReasons(database, { deadline: startedAt + SENDING_TIME_MS });
    return Response.json({ missedEvents, billing, ...summary, ...welcome, ...hiddenReasons }, { headers: NO_CACHE });
  } catch (error) {
    Sentry.captureException(error);
    return Response.json({ error: "run-failed" }, { status: 500, headers: NO_CACHE });
  }
};
