"use server";

import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { getDb } from "@/db";
import type { Database } from "@/db/database";
import { WIDGET_CODE_EMAIL_SUBJECT, WidgetCodeEmail } from "@/emails/WidgetCodeEmail";
import { getAppUrl } from "@/lib/app-url";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { sendAccountEmail } from "@/lib/email/send-email";
import { type RateLimitRule, consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { buildWidgetSnippet } from "@/lib/widgets/build-widget-snippet";
import { findDefaultWidgetId } from "@/lib/widgets/find-default-widget";
import { findOwnedWidget } from "@/lib/widgets/space-widgets";

const WIDGET_CODE_EMAILS_PER_USER: RateLimitRule = { name: "widget-code-email", limit: 5, windowSeconds: 60 * 60 };

export type SendWidgetCodeResult =
  | { ok: true; data: { email: string } }
  | { ok: false; error: "widget-not-found" | "too-many-emails" | "not-sent" };

/** The widget being edited, or else the first widget of the space, as on the home of the space. */
const findWidgetToSend = async (database: Database, userId: string, widgetId: string | undefined) => {
  if (widgetId !== undefined) {
    if (!z.uuid().safeParse(widgetId).success) return null;
    return (await findOwnedWidget(database, userId, widgetId))?.id ?? null;
  }
  const space = await findOwnedSpace(database, userId);
  return space ? findDefaultWidgetId(database, space.id) : null;
};

export const sendWidgetCodeByEmail = async (widgetId?: string): Promise<SendWidgetCodeResult> => {
  const signedInUser = await requireSignedInUser();
  const database = getDb();
  const widgetToSend = await findWidgetToSend(database, signedInUser.id, widgetId);
  if (!widgetToSend) return { ok: false, error: "widget-not-found" };
  if (!(await consumeRateLimit(database, WIDGET_CODE_EMAILS_PER_USER, signedInUser.id))) {
    return { ok: false, error: "too-many-emails" };
  }

  try {
    await sendAccountEmail({
      to: signedInUser.email,
      subject: WIDGET_CODE_EMAIL_SUBJECT,
      body: <WidgetCodeEmail snippet={buildWidgetSnippet(getAppUrl(), widgetToSend)} />,
    });
  } catch (error) {
    Sentry.captureException(error);
    return { ok: false, error: "not-sent" };
  }
  return { ok: true, data: { email: signedInUser.email } };
};
