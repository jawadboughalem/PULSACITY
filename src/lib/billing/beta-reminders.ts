import { and, eq, gt, inArray, isNull, lte } from "drizzle-orm";
import { createElement } from "react";
import type { Database } from "@/db/database";
import { spaces, subscriptions, user } from "@/db/schema";
import { BetaEndingEmail, describeBetaEndingSubject } from "@/emails/BetaEndingEmail";
import { getAppUrl } from "@/lib/app-url";
import { sendAccountEmail } from "@/lib/email/send-email";
import { SUPPORT_EMAIL } from "@/lib/support/support-address";
import { BILLING_PATH } from "./billing-paths";

/** « Nous vous écrivons le 5 janvier, 7 jours avant le premier prélèvement » (maquette 8.3, bêta-testeur). */
export const BETA_REMINDER_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

type SendEmail = typeof sendAccountEmail;

const dueReminders = (now: Date) =>
  and(
    eq(subscriptions.betaTester, true),
    isNull(subscriptions.betaReminderSentAt),
    isNull(subscriptions.cancelAt),
    inArray(subscriptions.status, ["active", "trialing"]),
    gt(subscriptions.betaUntil, now),
    lte(subscriptions.betaUntil, new Date(now.getTime() + BETA_REMINDER_DAYS * DAY_MS)),
  );

/**
 * Sends the reminders due: a beta tester whose offered months end within 7 days, who has not stopped, gets one e-mail.
 * The row is claimed before the e-mail leaves, and released if it could not leave, so that a reminder goes once.
 * Called by the cron task, and when Stripe announces the coming invoice (invoice.upcoming).
 */
export const sendDueBetaReminders = async (
  database: Database,
  { now = new Date(), subscriptionId, send = sendAccountEmail }: { now?: Date; subscriptionId?: string; send?: SendEmail } = {},
): Promise<number> => {
  const claimed = await database
    .update(subscriptions)
    .set({ betaReminderSentAt: now })
    .where(and(dueReminders(now), subscriptionId === undefined ? undefined : eq(subscriptions.id, subscriptionId)))
    .returning({
      id: subscriptions.id,
      spaceId: subscriptions.spaceId,
      betaUntil: subscriptions.betaUntil,
      amountCents: subscriptions.amountCents,
      cardBrand: subscriptions.cardBrand,
      cardLast4: subscriptions.cardLast4,
    });
  let sent = 0;
  for (const reminder of claimed) {
    try {
      const [owner] = await database
        .select({ email: user.email })
        .from(spaces)
        .innerJoin(user, eq(user.id, spaces.userId))
        .where(eq(spaces.id, reminder.spaceId));
      if (owner === undefined || reminder.betaUntil === null) continue;
      await send({
        to: owner.email,
        subject: describeBetaEndingSubject(reminder.betaUntil),
        replyTo: SUPPORT_EMAIL,
        body: createElement(BetaEndingEmail, {
          firstPaymentAt: reminder.betaUntil,
          amountCents: reminder.amountCents,
          card:
            reminder.cardBrand !== null && reminder.cardLast4 !== null
              ? { brand: reminder.cardBrand, last4: reminder.cardLast4 }
              : null,
          billingUrl: `${getAppUrl()}${BILLING_PATH}`,
        }),
      });
      sent += 1;
    } catch (error) {
      await database
        .update(subscriptions)
        .set({ betaReminderSentAt: null })
        .where(eq(subscriptions.id, reminder.id));
      throw error;
    }
  }
  return sent;
};
