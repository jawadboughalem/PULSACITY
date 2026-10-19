import * as Sentry from "@sentry/nextjs";
import { and, eq, gte, inArray, isNotNull, isNull } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, products, purchases, reviewRequests, spaces, user, welcomeEmails, widgets } from "@/db/schema";
import { WelcomeEmail, type WelcomeProgress, describeWelcomeSubject } from "@/emails/WelcomeEmail";
import { getAppUrl } from "@/lib/app-url";
import { atParisHour, readParisDate } from "@/lib/dates/paris-date";
import { sendCreatorEmail } from "@/lib/email/send-email";
import { SUPPORT_EMAIL } from "@/lib/support/support-address";
import {
  WELCOME_EMAIL_DAYS,
  WELCOME_EMAIL_HOUR,
  WELCOME_EMAIL_LATENESS_MS,
  WELCOME_EMAIL_STEPS,
  type WelcomeEmailStep,
} from "./welcome-email-steps";
import { buildWelcomeUnsubscribeUrl } from "./welcome-unsubscribe";

const DAY_MS = 24 * 60 * 60 * 1000;

/** When an e-mail is due: J0 at the creation of the space, the others at 10 a.m. in Paris, that many days later. */
export const readWelcomeDueAt = (step: WelcomeEmailStep, spaceCreatedAt: Date): Date => {
  if (step === "j0") return spaceCreatedAt;
  const created = readParisDate(spaceCreatedAt);
  return atParisHour({ ...created, day: created.day + WELCOME_EMAIL_DAYS[step] }, WELCOME_EMAIL_HOUR);
};

const isDue = (step: WelcomeEmailStep, spaceCreatedAt: Date, now: Date): boolean => {
  const dueAt = readWelcomeDueAt(step, spaceCreatedAt).getTime();
  return dueAt <= now.getTime() && now.getTime() < dueAt + WELCOME_EMAIL_LATENESS_MS;
};

const exists = async (rows: Promise<unknown[]>) => (await rows).length > 0;

/** Where the space stands in its start, read just before an e-mail leaves. */
export const readWelcomeProgress = async (database: Database, spaceId: string): Promise<WelcomeProgress> => {
  const [offer, tool, widget, request] = await Promise.all([
    exists(database.select({ id: products.id }).from(products).where(eq(products.spaceId, spaceId)).limit(1)),
    exists(
      database
        .select({ id: connections.id })
        .from(connections)
        .where(and(eq(connections.spaceId, spaceId), eq(connections.status, "active")))
        .limit(1),
    ),
    exists(
      database
        .select({ id: widgets.id })
        .from(widgets)
        .where(and(eq(widgets.spaceId, spaceId), isNotNull(widgets.firstLoadedAt)))
        .limit(1),
    ),
    exists(
      database
        .select({ id: reviewRequests.id })
        .from(reviewRequests)
        .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
        .where(eq(purchases.spaceId, spaceId))
        .limit(1),
    ),
  ]);
  return { offer, tool, widget, request };
};

/** The step each e-mail pushes: done before it leaves, the e-mail never does (offre, outil, widget, première demande). */
const STEP_OF_EMAIL: Record<WelcomeEmailStep, keyof WelcomeProgress> = {
  j0: "offer",
  j1: "tool",
  j3: "widget",
  j7: "request",
};

export const isWelcomeStepDone = (step: WelcomeEmailStep, progress: WelcomeProgress): boolean =>
  progress[STEP_OF_EMAIL[step]];

export type WelcomeEmailOutcome = "sent" | "skipped" | "unsubscribed" | "not-due" | "already-handled" | "no-space";

type SendOptions = { now?: Date; send?: typeof sendCreatorEmail };

/**
 * Sends one welcome e-mail when it is due and its step is not done. The row of welcome_emails is written before the
 * e-mail leaves: two runs at once send it once. If the e-mail cannot leave, the row goes, and the next run tries again.
 */
export const sendWelcomeEmail = async (
  database: Database,
  spaceId: string,
  step: WelcomeEmailStep,
  { now = new Date(), send = sendCreatorEmail }: SendOptions = {},
): Promise<WelcomeEmailOutcome> => {
  const [space] = await database
    .select({
      name: spaces.name,
      createdAt: spaces.createdAt,
      unsubscribedAt: spaces.welcomeEmailsUnsubscribedAt,
      email: user.email,
    })
    .from(spaces)
    .innerJoin(user, eq(user.id, spaces.userId))
    .where(eq(spaces.id, spaceId))
    .limit(1);
  if (space === undefined) return "no-space";
  if (space.unsubscribedAt !== null) return "unsubscribed";
  if (!isDue(step, space.createdAt, now)) return "not-due";

  const progress = await readWelcomeProgress(database, spaceId);
  if (isWelcomeStepDone(step, progress)) {
    const skipped = await database
      .insert(welcomeEmails)
      .values({ spaceId, step, claimedAt: now, skippedAt: now })
      .onConflictDoNothing()
      .returning({ id: welcomeEmails.id });
    return skipped.length === 1 ? "skipped" : "already-handled";
  }

  const [claimed] = await database
    .insert(welcomeEmails)
    .values({ spaceId, step, claimedAt: now })
    .onConflictDoNothing()
    .returning({ id: welcomeEmails.id });
  if (claimed === undefined) return "already-handled";

  const appUrl = getAppUrl();
  const unsubscribeUrl = buildWelcomeUnsubscribeUrl(appUrl, spaceId);
  try {
    await send({
      to: space.email,
      subject: describeWelcomeSubject(step, space.name),
      body: (
        <WelcomeEmail
          step={step}
          spaceCreatedAt={space.createdAt}
          progress={progress}
          appUrl={appUrl}
          unsubscribeUrl={unsubscribeUrl}
        />
      ),
      replyTo: SUPPORT_EMAIL,
      unsubscribeUrl,
      idempotencyKey: `welcome-${spaceId}-${step}`,
    });
  } catch (error) {
    await database.delete(welcomeEmails).where(eq(welcomeEmails.id, claimed.id));
    throw error;
  }
  await database.update(welcomeEmails).set({ sentAt: new Date() }).where(eq(welcomeEmails.id, claimed.id));
  return "sent";
};

export type WelcomeEmailsSummary = { welcomeEmailsSent: number; welcomeEmailsSkipped: number };

/** The oldest space still owed an e-mail: J7 at 10 a.m., plus the delay past which an e-mail is no longer sent. */
const CANDIDATE_WINDOW_MS = (WELCOME_EMAIL_DAYS.j7 + 1) * DAY_MS + WELCOME_EMAIL_LATENESS_MS;

/** The cron task's part: every welcome e-mail due and not yet handled leaves, or is skipped when its step is done. */
export const sendDueWelcomeEmails = async (
  database: Database,
  { now = new Date(), deadline = Number.POSITIVE_INFINITY, send = sendCreatorEmail }: SendOptions & { deadline?: number } = {},
): Promise<WelcomeEmailsSummary> => {
  const candidates = await database
    .select({ id: spaces.id, createdAt: spaces.createdAt })
    .from(spaces)
    .where(
      and(gte(spaces.createdAt, new Date(now.getTime() - CANDIDATE_WINDOW_MS)), isNull(spaces.welcomeEmailsUnsubscribedAt)),
    );
  const summary: WelcomeEmailsSummary = { welcomeEmailsSent: 0, welcomeEmailsSkipped: 0 };
  if (candidates.length === 0) return summary;

  const handled = await database
    .select({ spaceId: welcomeEmails.spaceId, step: welcomeEmails.step })
    .from(welcomeEmails)
    .where(
      inArray(
        welcomeEmails.spaceId,
        candidates.map((space) => space.id),
      ),
    );
  const handledKeys = new Set(handled.map((row) => `${row.spaceId}:${row.step}`));

  for (const space of candidates) {
    for (const step of WELCOME_EMAIL_STEPS) {
      if (Date.now() > deadline) return summary;
      if (handledKeys.has(`${space.id}:${step}`) || !isDue(step, space.createdAt, now)) continue;
      try {
        const outcome = await sendWelcomeEmail(database, space.id, step, { now, send });
        if (outcome === "sent") summary.welcomeEmailsSent += 1;
        if (outcome === "skipped") summary.welcomeEmailsSkipped += 1;
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  }
  return summary;
};
