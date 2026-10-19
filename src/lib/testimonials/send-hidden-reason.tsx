import * as Sentry from "@sentry/nextjs";
import { and, asc, eq, isNotNull, isNull, lt } from "drizzle-orm";
import type { Database } from "@/db/database";
import { customers, testimonials } from "@/db/schema";
import { HiddenReasonEmail, buildHiddenReasonSubject } from "@/emails/HiddenReasonEmail";
import { getAppUrl } from "@/lib/app-url";
import { type CustomerEmail, sendCustomerEmail } from "@/lib/email/send-email";
import { buildUnsubscribeUrl } from "@/lib/requests/unsubscribe-token";
import { buildAboutReviewsUrl } from "@/lib/widgets/load-widget-payload";
import { describeHiddenReason } from "./hidden-reasons";
import { loadAuthorContact, readAuthorReach } from "./load-author-contact";

export type HiddenReasonSendResult = "sent" | "not-hidden" | "unreachable" | "already-sent" | "failed";

type SendOptions = {
  now?: Date;
  send?: (email: CustomerEmail) => Promise<void>;
};

/**
 * The reason of « Masquer », by e-mail to the author (maquette 3.6), once per testimonial: like a request and its
 * reminder, an author is never written to again and again about the same review. The row is claimed before the e-mail
 * leaves, and released if it does not, for the task of /api/cron/requests to try again.
 */
export const sendHiddenReason = async (
  database: Database,
  testimonialId: string,
  { now = new Date(), send = sendCustomerEmail }: SendOptions = {},
): Promise<HiddenReasonSendResult> => {
  const contact = await loadAuthorContact(database, testimonialId);
  const reason = contact ? describeHiddenReason(contact) : null;
  if (!contact || contact.status !== "hidden" || reason === null) return "not-hidden";
  if (readAuthorReach(contact) !== "reachable" || !contact.customerId || !contact.email) return "unreachable";
  if (contact.hiddenReasonSentAt) return "already-sent";

  const [claimed] = await database
    .update(testimonials)
    .set({ hiddenReasonSentAt: now })
    .where(and(eq(testimonials.id, testimonialId), isNull(testimonials.hiddenReasonSentAt)))
    .returning({ id: testimonials.id });
  if (!claimed) return "already-sent";

  try {
    await send({
      to: contact.email,
      subject: buildHiddenReasonSubject(contact.firstName),
      body: (
        <HiddenReasonEmail
          space={contact.space}
          firstName={contact.firstName}
          productName={contact.productName}
          reason={reason}
          reviewedAt={contact.createdAt}
          aboutUrl={buildAboutReviewsUrl(getAppUrl())}
          unsubscribeUrl={buildUnsubscribeUrl(contact.customerId)}
        />
      ),
      spaceName: contact.space.name,
      replyTo: contact.replyToEmail,
      unsubscribeUrl: buildUnsubscribeUrl(contact.customerId),
      idempotencyKey: `hidden-reason:${testimonialId}`,
    });
    return "sent";
  } catch (error) {
    Sentry.captureException(error);
    await database
      .update(testimonials)
      .set({ hiddenReasonSentAt: null })
      .where(and(eq(testimonials.id, testimonialId), eq(testimonials.hiddenReasonSentAt, now)));
    return "failed";
  }
};

/** Left to the task the reasons the action could not send right away: after this long, it tries again. */
const RETRY_AFTER_MS = 10 * 60 * 1000;

const BATCH_SIZE = 40;

/** The task of /api/cron/requests: the reasons of the testimonials hidden lately, not sent yet. */
export const sendWaitingHiddenReasons = async (
  database: Database,
  { now = new Date(), send = sendCustomerEmail, deadline }: SendOptions & { deadline?: number } = {},
): Promise<{ hiddenReasonsSent: number }> => {
  const waiting = await database
    .select({ id: testimonials.id })
    .from(testimonials)
    .innerJoin(customers, eq(customers.id, testimonials.customerId))
    .where(
      and(
        eq(testimonials.status, "hidden"),
        isNotNull(testimonials.hiddenReason),
        isNull(testimonials.hiddenReasonSentAt),
        lt(testimonials.hiddenAt, new Date(now.getTime() - RETRY_AFTER_MS)),
        isNull(customers.unsubscribedAt),
      ),
    )
    .orderBy(asc(testimonials.hiddenAt))
    .limit(BATCH_SIZE);

  let hiddenReasonsSent = 0;
  for (const { id } of waiting) {
    if (deadline !== undefined && Date.now() >= deadline) break;
    if ((await sendHiddenReason(database, id, { now, send })) === "sent") hiddenReasonsSent += 1;
  }
  return { hiddenReasonsSent };
};
