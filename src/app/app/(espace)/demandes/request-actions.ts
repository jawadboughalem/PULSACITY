"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { cancelOwnedRequest, correctOwnedRequestEmail, sendOwnedRequestNow } from "@/lib/requests/manage-requests";
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

const EMAIL = z.email({ pattern: z.regexes.unicodeEmail });

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
