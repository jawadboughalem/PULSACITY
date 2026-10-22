import { and, eq, gt, isNull, lte, ne, or, sql } from "drizzle-orm";
import { createElement } from "react";
import type { Database } from "@/db/database";
import { spaces, subscriptions, user } from "@/db/schema";
import { AnnualRenewalEmail, describeAnnualRenewalSubject } from "@/emails/AnnualRenewalEmail";
import { getAppUrl } from "@/lib/app-url";
import { sendAccountEmail } from "@/lib/email/send-email";
import { SUPPORT_EMAIL } from "@/lib/support/support-address";
import { BILLING_PATH } from "./billing-paths";

/** CGV 5.2: « Avant un renouvellement annuel, nous vous prévenons par e-mail au moins 7 jours à l'avance. » */
export const RENEWAL_REMINDER_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

type SendEmail = typeof sendAccountEmail;

/**
 * A yearly subscription that renews within 7 days, still yearly after it, not announced yet for this period. A stop,
 * a move to the monthly period or to the free plan is no yearly renewal; a beta tester's offered months have their
 * own reminder.
 */
const dueReminders = (now: Date) =>
  and(
    eq(subscriptions.period, "yearly"),
    eq(subscriptions.status, "active"),
    isNull(subscriptions.cancelAt),
    or(isNull(subscriptions.scheduledPeriod), eq(subscriptions.scheduledPeriod, "yearly")),
    or(isNull(subscriptions.scheduledPlan), ne(subscriptions.scheduledPlan, "free")),
    or(eq(subscriptions.betaTester, false), isNull(subscriptions.betaUntil), lte(subscriptions.betaUntil, now)),
    gt(subscriptions.currentPeriodEnd, now),
    lte(subscriptions.currentPeriodEnd, new Date(now.getTime() + RENEWAL_REMINDER_DAYS * DAY_MS)),
    or(
      isNull(subscriptions.renewalReminderPeriodEnd),
      ne(subscriptions.renewalReminderPeriodEnd, subscriptions.currentPeriodEnd),
    ),
  );

/**
 * Sends the reminders due before a yearly renewal, one per renewal: the row is claimed with the period it announces
 * before the e-mail leaves, and released if it could not leave. Called by the cron task, and when Stripe announces the
 * coming invoice (invoice.upcoming), so that it never depends on Stripe's own e-mail, which would also write before
 * every monthly payment.
 */
export const sendDueRenewalReminders = async (
  database: Database,
  { now = new Date(), subscriptionId, send = sendAccountEmail }: { now?: Date; subscriptionId?: string; send?: SendEmail } = {},
): Promise<number> => {
  const claimed = await database
    .update(subscriptions)
    .set({ renewalReminderPeriodEnd: sql`${subscriptions.currentPeriodEnd}` })
    .where(and(dueReminders(now), subscriptionId === undefined ? undefined : eq(subscriptions.id, subscriptionId)))
    .returning({
      id: subscriptions.id,
      spaceId: subscriptions.spaceId,
      renewalAt: subscriptions.currentPeriodEnd,
      plan: subscriptions.plan,
      priceList: subscriptions.priceList,
      amountCents: subscriptions.amountCents,
      scheduledPlan: subscriptions.scheduledPlan,
      scheduledPriceList: subscriptions.scheduledPriceList,
      scheduledAmountCents: subscriptions.scheduledAmountCents,
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
      if (owner === undefined || reminder.renewalAt === null) continue;
      // A change programmed for the end of the period (Pro to Essentiel, still yearly) is what renews.
      await send({
        to: owner.email,
        subject: describeAnnualRenewalSubject(reminder.renewalAt),
        replyTo: SUPPORT_EMAIL,
        body: createElement(AnnualRenewalEmail, {
          renewalAt: reminder.renewalAt,
          plan: reminder.scheduledPlan ?? reminder.plan,
          priceList: reminder.scheduledPriceList ?? reminder.priceList,
          amountCents: reminder.scheduledAmountCents ?? reminder.amountCents,
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
        .set({ renewalReminderPeriodEnd: null })
        .where(eq(subscriptions.id, reminder.id));
      throw error;
    }
  }
  return sent;
};
