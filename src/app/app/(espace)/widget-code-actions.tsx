"use server";

import * as Sentry from "@sentry/nextjs";
import { getDb } from "@/db";
import { WIDGET_CODE_EMAIL_SUBJECT, WidgetCodeEmail } from "@/emails/WidgetCodeEmail";
import { getAppUrl } from "@/lib/app-url";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { sendAccountEmail } from "@/lib/email/send-email";
import { type RateLimitRule, consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { buildWidgetSnippet } from "@/lib/widgets/build-widget-snippet";
import { findDefaultWidgetId } from "@/lib/widgets/find-default-widget";

const WIDGET_CODE_EMAILS_PER_USER: RateLimitRule = { name: "widget-code-email", limit: 5, windowSeconds: 60 * 60 };

export type SendWidgetCodeResult =
  | { ok: true; data: { email: string } }
  | { ok: false; error: "widget-not-found" | "too-many-emails" | "not-sent" };

export const sendWidgetCodeByEmail = async (): Promise<SendWidgetCodeResult> => {
  const signedInUser = await requireSignedInUser();
  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  const widgetId = space ? await findDefaultWidgetId(database, space.id) : null;
  if (!widgetId) return { ok: false, error: "widget-not-found" };
  if (!(await consumeRateLimit(database, WIDGET_CODE_EMAILS_PER_USER, signedInUser.id))) {
    return { ok: false, error: "too-many-emails" };
  }

  try {
    await sendAccountEmail({
      to: signedInUser.email,
      subject: WIDGET_CODE_EMAIL_SUBJECT,
      body: <WidgetCodeEmail snippet={buildWidgetSnippet(getAppUrl(), widgetId)} />,
    });
  } catch (error) {
    Sentry.captureException(error);
    return { ok: false, error: "not-sent" };
  }
  return { ok: true, data: { email: signedInUser.email } };
};
