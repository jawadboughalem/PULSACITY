"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { toParisIsoDay } from "@/lib/dates/paris-date";
import { cancelOwnedRequest, correctOwnedRequestEmail, sendOwnedRequestNow } from "@/lib/requests/manage-requests";
import { type ExistingRequest, requestReviewManually } from "@/lib/requests/request-review-manually";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";

export type CancelRequestActionResult =
  | { ok: true; data: { isReminderOnly: boolean } }
  | { ok: false; error: "not-found" | "not-cancellable" };

export type SendRequestNowResult =
  | { ok: true; data: null }
  | { ok: false; error: "not-found" | "plan-limit" | "stopped" | "not-sent" };

export type CorrectRequestEmailResult =
  | { ok: true; data: null }
  | { ok: false; error: "invalid-email" | "email-taken" | "not-failed" | "not-found" };

export type RequestReviewResult =
  | { ok: true; data: { requestId: string } }
  | { ok: false; error: "invalid-email" | "invalid-date" | "not-attested" | "offer-not-found" | "daily-limit" }
  | { ok: false; error: "request-exists"; customerName: string; existing: ExistingRequest }
  | { ok: false; error: "unsubscribed"; customerName: string; unsubscribedAt: Date };

export type RequestReviewInput = {
  firstName: string;
  lastName: string;
  email: string;
  productId: string;
  purchasedOn: string;
  isAttested: boolean;
};

const EMAIL = z.email({ pattern: z.regexes.unicodeEmail });

const OPTIONAL_NAME = z
  .string()
  .trim()
  .max(80)
  .transform((name) => name || null);

const refresh = () => revalidatePath(SPACE_HOME_PATH, "layout");

export const cancelRequest = async (requestId: string): Promise<CancelRequestActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = z.uuid().safeParse(requestId);
  if (!parsedId.success) return { ok: false, error: "not-found" };

  const result = await cancelOwnedRequest(getDb(), signedInUser.id, parsedId.data);
  if (result.status === "not-found" || result.status === "not-cancellable") return { ok: false, error: result.status };
  refresh();
  return { ok: true, data: { isReminderOnly: result.status === "reminder-cancelled" } };
};

export const sendRequestNow = async (requestId: string): Promise<SendRequestNowResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = z.uuid().safeParse(requestId);
  if (!parsedId.success) return { ok: false, error: "not-found" };

  const { status } = await sendOwnedRequestNow(getDb(), signedInUser.id, parsedId.data);
  refresh();
  if (status === "sent" || status === "already-sent") return { ok: true, data: null };
  if (status === "plan-limit") return { ok: false, error: "plan-limit" };
  if (status === "cancelled") return { ok: false, error: "stopped" };
  if (status === "failed") return { ok: false, error: "not-sent" };
  return { ok: false, error: "not-found" };
};

export const correctRequestEmail = async (requestId: string, email: string): Promise<CorrectRequestEmailResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = z.uuid().safeParse(requestId);
  if (!parsedId.success) return { ok: false, error: "not-found" };
  const parsedEmail = EMAIL.safeParse(email.trim().toLowerCase());
  if (!parsedEmail.success) return { ok: false, error: "invalid-email" };

  const { status } = await correctOwnedRequestEmail(getDb(), signedInUser.id, parsedId.data, parsedEmail.data);
  if (status !== "rescheduled") return { ok: false, error: status };
  refresh();
  return { ok: true, data: null };
};

/** m20, « Demander un avis »: a customer typed in by the creator, who has bought the offer from them. */
export const requestReview = async (input: RequestReviewInput): Promise<RequestReviewResult> => {
  const signedInUser = await requireSignedInUser();
  if (input.isAttested !== true) return { ok: false, error: "not-attested" };
  const email = EMAIL.safeParse(input.email.trim().toLowerCase());
  if (!email.success) return { ok: false, error: "invalid-email" };
  const purchasedOn = z.iso.date().safeParse(input.purchasedOn);
  if (!purchasedOn.success || purchasedOn.data > toParisIsoDay(new Date())) return { ok: false, error: "invalid-date" };
  const names = z.object({ firstName: OPTIONAL_NAME, lastName: OPTIONAL_NAME, productId: z.uuid() }).safeParse(input);
  if (!names.success) return { ok: false, error: "offer-not-found" };

  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  if (!space) return { ok: false, error: "offer-not-found" };
  const result = await requestReviewManually(database, space.id, {
    ...names.data,
    email: email.data,
    purchasedOn: purchasedOn.data,
  });
  switch (result.status) {
    case "scheduled":
      refresh();
      return { ok: true, data: { requestId: result.requestId } };
    case "request-exists":
      return { ok: false, error: result.status, customerName: result.customerName, existing: result.existing };
    case "unsubscribed":
      return { ok: false, error: result.status, customerName: result.customerName, unsubscribedAt: result.unsubscribedAt };
    default:
      return { ok: false, error: result.status };
  }
};
