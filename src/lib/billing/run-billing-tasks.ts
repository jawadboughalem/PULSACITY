import * as Sentry from "@sentry/nextjs";
import type Stripe from "stripe";
import type { Database } from "@/db/database";
import { sendDueBetaReminders } from "./beta-reminders";
import { listEventsToReplay, processStripeEvent } from "./stripe-events";

export type BillingTasksSummary = { replayedEvents: number; betaReminders: number };

/**
 * The billing part of the cron task: the Stripe events left unprocessed are replayed, the beta testers' reminders due
 * are sent. A failure is reported and does not stop the review requests that follow.
 */
export const runBillingTasks = async (
  database: Database,
  stripe: Stripe | null,
  now: Date = new Date(),
): Promise<BillingTasksSummary> => {
  let replayedEvents = 0;
  if (stripe !== null) {
    for (const eventId of await listEventsToReplay(database, now)) {
      try {
        await processStripeEvent(database, stripe, eventId, now);
        replayedEvents += 1;
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  }
  let betaReminders = 0;
  try {
    betaReminders = await sendDueBetaReminders(database, { now });
  } catch (error) {
    Sentry.captureException(error);
  }
  return { replayedEvents, betaReminders };
};
