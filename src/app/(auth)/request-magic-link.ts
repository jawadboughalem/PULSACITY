"use server";

import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";
import { z } from "zod";
import { getDb } from "@/db";
import { getAuth } from "@/lib/auth/get-auth";
import { MAGIC_LINK_REQUESTS_PER_IP } from "@/lib/auth/magic-link-rate-limits";
import { SIGN_IN_PATH } from "@/lib/auth/require-signed-in-user";
import { TooManyMagicLinksError } from "@/lib/auth/too-many-magic-links-error";
import { EmailNotSentError } from "@/lib/email/email-not-sent-error";
import { consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { hashRateLimitSubject } from "@/lib/rate-limit/hash-rate-limit-subject";
import { readClientIp } from "@/lib/rate-limit/read-client-ip";

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export type RequestMagicLinkResult =
  | { ok: true; data: { email: string } }
  | { ok: false; error: "invalid-email" | "too-many-requests" | "email-not-sent" };

export const requestMagicLink = async (
  _previousResult: RequestMagicLinkResult | null,
  formData: FormData,
): Promise<RequestMagicLinkResult> => {
  const parsedEmail = emailSchema.safeParse(formData.get("email"));
  if (!parsedEmail.success) return { ok: false, error: "invalid-email" };

  const requestHeaders = await headers();
  const isAllowed = await consumeRateLimit(
    getDb(),
    MAGIC_LINK_REQUESTS_PER_IP,
    hashRateLimitSubject(readClientIp(requestHeaders)),
  );
  if (!isAllowed) return { ok: false, error: "too-many-requests" };

  try {
    await getAuth().api.signInMagicLink({
      body: {
        email: parsedEmail.data,
        callbackURL: "/app",
        newUserCallbackURL: "/app/onboarding",
        errorCallbackURL: SIGN_IN_PATH,
      },
      headers: requestHeaders,
    });
  } catch (error) {
    if (error instanceof TooManyMagicLinksError) return { ok: false, error: "too-many-requests" };
    if (error instanceof EmailNotSentError) {
      Sentry.captureException(error);
      return { ok: false, error: "email-not-sent" };
    }
    throw error;
  }

  return { ok: true, data: { email: parsedEmail.data } };
};
