"use server";

import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";
import { getPlan } from "@/config/plans";
import { getDb } from "@/db";
import type { ContactSenderSpace } from "@/emails/ContactMessageEmail";
import { getSignedInUser } from "@/lib/auth/get-signed-in-user";
import { HONEYPOT_FIELD_NAME } from "@/lib/forms/honeypot";
import { consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { hashRateLimitSubject } from "@/lib/rate-limit/hash-rate-limit-subject";
import { readClientIp } from "@/lib/rate-limit/read-client-ip";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import {
  CONTACT_MESSAGES_PER_ADDRESS,
  CONTACT_MESSAGES_PER_DAY,
  CONTACT_MESSAGES_PER_IP,
  type ContactFieldErrors,
  EVERY_VISITOR,
  collectContactErrors,
  contactMessageSchema,
} from "@/lib/support/contact-message";
import { sendContactMessageEmail } from "@/lib/support/send-contact-message";

export type SendContactMessageResult =
  | { ok: true; data: { email: string } }
  | { ok: false; error: "invalid-input"; fieldErrors: ContactFieldErrors }
  | { ok: false; error: "too-many-requests" | "not-sent" };

/** The space of a signed-in sender, for the answer. Never a reason not to send: without it, the message still leaves. */
const findSenderSpace = async (): Promise<ContactSenderSpace | null> => {
  try {
    const signedInUser = await getSignedInUser();
    if (!signedInUser) return null;
    const space = await findOwnedSpace(getDb(), signedInUser.id);
    return space ? { name: space.name, planName: getPlan(space.plan).name } : null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
};

/**
 * « Écrivez-nous » (/aide): the message goes by e-mail to PULSACITY's one address, its answer to the sender. Nothing is
 * kept in the database, only the counters that stop a flood (per IP, per address, per day). Whatever fails, the page
 * stays, with the text typed.
 */
export const sendContactMessage = async (
  _previousResult: SendContactMessageResult | null,
  formData: FormData,
): Promise<SendContactMessageResult> => {
  const parsed = contactMessageSchema.safeParse({
    email: formData.get("email") ?? "",
    subject: formData.get("subject") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) return { ok: false, error: "invalid-input", fieldErrors: collectContactErrors(parsed.error) };
  // A robot that fills every field is told it worked, and nothing leaves.
  if (formData.get(HONEYPOT_FIELD_NAME)) return { ok: true, data: { email: parsed.data.email } };

  try {
    const database = getDb();
    const ipKey = hashRateLimitSubject(readClientIp(await headers()));
    const isAllowed =
      (await consumeRateLimit(database, CONTACT_MESSAGES_PER_IP, ipKey)) &&
      (await consumeRateLimit(database, CONTACT_MESSAGES_PER_ADDRESS, hashRateLimitSubject(parsed.data.email)));
    if (!isAllowed) return { ok: false, error: "too-many-requests" };
    if (!(await consumeRateLimit(database, CONTACT_MESSAGES_PER_DAY, EVERY_VISITOR))) {
      Sentry.captureMessage("The daily limit of the contact messages is reached");
      return { ok: false, error: "not-sent" };
    }
    await sendContactMessageEmail(parsed.data, await findSenderSpace());
  } catch (error) {
    Sentry.captureException(error);
    return { ok: false, error: "not-sent" };
  }
  return { ok: true, data: { email: parsed.data.email } };
};
