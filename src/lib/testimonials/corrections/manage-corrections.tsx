import { randomBytes } from "node:crypto";
import * as Sentry from "@sentry/nextjs";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { spaces, testimonialCorrections, testimonials } from "@/db/schema";
import { CorrectionRequestEmail, buildCorrectionRequestSubject } from "@/emails/CorrectionRequestEmail";
import type { CustomerEmailSpace } from "@/emails/CustomerEmailLayout";
import { buildCollectionUrl } from "@/lib/app-url";
import { type CustomerEmail, sendCustomerEmail } from "@/lib/email/send-email";
import { buildUnsubscribeUrl } from "@/lib/requests/unsubscribe-token";
import { getDisplayedBody } from "../displayed-body";
import { findOwnedTestimonial } from "../find-owned-testimonial";
import { loadAuthorContact, readAuthorReach } from "../load-author-contact";
import { MAX_CORRECTIONS_PER_TESTIMONIAL } from "./correction-outcome";

/** The page where the author answers, under the space's collection page: /t/julie-nutrition/correction?c=… */
export const CORRECTION_PAGE_SEGMENT = "correction";

export const CORRECTION_TOKEN_PARAMETER = "c";

export const buildCorrectionAnswerUrl = (spaceSlug: string, token: string): string =>
  `${buildCollectionUrl(spaceSlug)}/${CORRECTION_PAGE_SEGMENT}?${CORRECTION_TOKEN_PARAMETER}=${encodeURIComponent(token)}`;

const normalize = (text: string) => text.replace(/\r\n?/g, "\n").trim();

export type ProposeCorrectionResult =
  | { status: "sent" }
  | { status: "testimonial-not-found" }
  /** No address to write to (added, imported, public link), or the author unsubscribed. */
  | { status: "unreachable"; reach: "no-address" | "unsubscribed" }
  | { status: "already-waiting" }
  | { status: "too-many" }
  | { status: "unchanged" }
  | { status: "not-sent" };

type SendOptions = {
  now?: Date;
  send?: (email: CustomerEmail) => Promise<void>;
};

/**
 * « Corriger le texte affiché » (positionnement.md, point 4): the correction goes to the author by e-mail, and shows
 * only with their agreement; until then, nothing changes on the creator's pages. One waits at a time, two at most per
 * testimonial. If the e-mail does not leave, the correction is forgotten: the creator can propose it again.
 */
export const proposeCorrection = async (
  database: Database,
  userId: string,
  testimonialId: string,
  proposedBody: string,
  { now = new Date(), send = sendCustomerEmail }: SendOptions = {},
): Promise<ProposeCorrectionResult> => {
  const owned = await findOwnedTestimonial(database, userId, testimonialId);
  if (!owned) return { status: "testimonial-not-found" };
  const contact = await loadAuthorContact(database, owned.id);
  if (!contact) return { status: "testimonial-not-found" };
  const reach = readAuthorReach(contact);
  if (reach !== "reachable" || !contact.customerId || !contact.email) {
    return { status: "unreachable", reach: reach === "unsubscribed" ? "unsubscribed" : "no-address" };
  }

  const [shown] = await database
    .select({ body: testimonials.body, displayBody: testimonials.displayBody })
    .from(testimonials)
    .where(eq(testimonials.id, owned.id));
  const fromBody = getDisplayedBody(shown);
  const body = normalize(proposedBody);
  if (body === normalize(fromBody)) return { status: "unchanged" };

  const token = randomBytes(24).toString("base64url");
  const created = await database.transaction(async (transaction) => {
    await transaction.execute(sql`select pg_advisory_xact_lock(hashtext(${`correction:${owned.id}`}))`);
    const [{ proposed }] = await transaction
      .select({ proposed: count() })
      .from(testimonialCorrections)
      .where(eq(testimonialCorrections.testimonialId, owned.id));
    if (proposed >= MAX_CORRECTIONS_PER_TESTIMONIAL) return "too-many" as const;
    const [waiting] = await transaction
      .select({ id: testimonialCorrections.id })
      .from(testimonialCorrections)
      .where(and(eq(testimonialCorrections.testimonialId, owned.id), isNull(testimonialCorrections.outcome)))
      .limit(1);
    if (waiting) return "already-waiting" as const;
    const [correction] = await transaction
      .insert(testimonialCorrections)
      .values({ testimonialId: owned.id, fromBody, body, token, createdAt: now })
      .returning({ id: testimonialCorrections.id });
    return correction;
  });
  if (created === "too-many" || created === "already-waiting") return { status: created };

  try {
    await send({
      to: contact.email,
      subject: buildCorrectionRequestSubject(contact.firstName),
      body: (
        <CorrectionRequestEmail
          space={contact.space}
          firstName={contact.firstName}
          productName={contact.productName}
          fromBody={fromBody}
          body={body}
          reviewedAt={contact.createdAt}
          answerUrl={buildCorrectionAnswerUrl(contact.spaceSlug, token)}
          unsubscribeUrl={buildUnsubscribeUrl(contact.customerId)}
        />
      ),
      spaceName: contact.space.name,
      replyTo: contact.replyToEmail,
      unsubscribeUrl: buildUnsubscribeUrl(contact.customerId),
      idempotencyKey: `correction:${created.id}`,
    });
  } catch (error) {
    Sentry.captureException(error);
    await database.delete(testimonialCorrections).where(eq(testimonialCorrections.id, created.id));
    return { status: "not-sent" };
  }
  await database.update(testimonialCorrections).set({ sentAt: now }).where(eq(testimonialCorrections.id, created.id));
  return { status: "sent" };
};

export type CancelCorrectionResult = { status: "cancelled" } | { status: "testimonial-not-found" } | { status: "not-waiting" };

/** « Annuler la correction »: the author's link now says it is no longer proposed. */
export const cancelCorrection = async (
  database: Database,
  userId: string,
  testimonialId: string,
): Promise<CancelCorrectionResult> => {
  const owned = await findOwnedTestimonial(database, userId, testimonialId);
  if (!owned) return { status: "testimonial-not-found" };
  const [cancelled] = await database
    .update(testimonialCorrections)
    .set({ outcome: "cancelled" })
    .where(and(eq(testimonialCorrections.testimonialId, owned.id), isNull(testimonialCorrections.outcome)))
    .returning({ id: testimonialCorrections.id });
  return cancelled ? { status: "cancelled" } : { status: "not-waiting" };
};

export type CorrectionAnswer = "accept" | "keep";

export type CorrectionPage = {
  space: CustomerEmailSpace & { replyToEmail: string; referralCode: string };
  fromBody: string;
  body: string;
};

export type CorrectionLookup =
  | ({ status: "waiting" } & CorrectionPage)
  | ({ status: "answered"; outcome: "accepted" | "refused" } & CorrectionPage)
  | ({ status: "withdrawn" } & CorrectionPage)
  | { status: "not-found" };

const selectCorrection = (database: Database, spaceSlug: string, token: string) =>
  database
    .select({
      id: testimonialCorrections.id,
      testimonialId: testimonialCorrections.testimonialId,
      outcome: testimonialCorrections.outcome,
      fromBody: testimonialCorrections.fromBody,
      body: testimonialCorrections.body,
      spaceName: spaces.name,
      logoUrl: spaces.logoUrl,
      accentColor: spaces.accentColor,
      senderPostalAddress: spaces.senderPostalAddress,
      replyToEmail: spaces.replyToEmail,
      referralCode: spaces.referralCode,
    })
    .from(testimonialCorrections)
    .innerJoin(testimonials, eq(testimonials.id, testimonialCorrections.testimonialId))
    .innerJoin(spaces, eq(spaces.id, testimonials.spaceId))
    .where(and(eq(testimonialCorrections.token, token), eq(spaces.slug, spaceSlug)))
    .orderBy(desc(testimonialCorrections.createdAt))
    .limit(1);

type CorrectionRow = Awaited<ReturnType<typeof selectCorrection>>[number];

const toPage = (row: CorrectionRow): CorrectionPage => ({
  space: {
    name: row.spaceName,
    logoUrl: row.logoUrl,
    accentColor: row.accentColor,
    senderPostalAddress: row.senderPostalAddress,
    replyToEmail: row.replyToEmail,
    referralCode: row.referralCode,
  },
  fromBody: row.fromBody,
  body: row.body,
});

const describe = (row: CorrectionRow): CorrectionLookup => {
  if (row.outcome === null) return { status: "waiting", ...toPage(row) };
  if (row.outcome === "cancelled") return { status: "withdrawn", ...toPage(row) };
  return { status: "answered", outcome: row.outcome, ...toPage(row) };
};

/** The page of the e-mail's link: the two versions and the two choices, or what became of the correction. */
export const findCorrection = async (database: Database, spaceSlug: string, token: string): Promise<CorrectionLookup> => {
  const [row] = await selectCorrection(database, spaceSlug, token);
  return row ? describe(row) : { status: "not-found" };
};

/**
 * The author's answer, given by a button of the page and never by the link alone (a mail's security software opens
 * links by itself). Accepted, the corrected text shows; kept, nothing changes. The original body is never touched.
 */
export const answerCorrection = (
  database: Database,
  spaceSlug: string,
  token: string,
  answer: CorrectionAnswer,
  now = new Date(),
): Promise<CorrectionLookup> =>
  database.transaction(async (transaction) => {
    const [row] = await selectCorrection(transaction, spaceSlug, token).for("update", { of: testimonialCorrections });
    if (!row) return { status: "not-found" };
    if (row.outcome !== null) return describe(row);

    const outcome = answer === "accept" ? "accepted" : "refused";
    await transaction
      .update(testimonialCorrections)
      .set({ outcome, answeredAt: now })
      .where(eq(testimonialCorrections.id, row.id));
    if (answer === "accept") {
      await transaction
        .update(testimonials)
        .set({ displayBody: row.body, displayEditedAt: now })
        .where(eq(testimonials.id, row.testimonialId));
    }
    return { status: "answered", outcome, ...toPage(row) };
  });
