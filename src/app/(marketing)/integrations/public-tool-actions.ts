"use server";

import { headers } from "next/headers";
import { getDb } from "@/db";
import {
  PUBLIC_TOOL_SUGGESTION_PER_IP,
  saveToolSuggestion,
  toolNameSchema,
} from "@/lib/connectors/public-tool-suggestion";
import { HONEYPOT_FIELD_NAME } from "@/lib/forms/honeypot";
import { consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { hashRateLimitSubject } from "@/lib/rate-limit/hash-rate-limit-subject";
import { readClientIp } from "@/lib/rate-limit/read-client-ip";

export type SuggestToolResult = { ok: true; data: null } | { ok: false; error: "invalid-name" | "too-many-requests" };

/** « Dites-nous quel outil » on /integrations, for a visitor without a space. */
export const suggestPublicTool = async (
  _previousResult: SuggestToolResult | null,
  formData: FormData,
): Promise<SuggestToolResult> => {
  const parsed = toolNameSchema.safeParse(formData.get("toolName"));
  if (!parsed.success) return { ok: false, error: "invalid-name" };
  // A robot that fills every field is told it worked, and nothing is kept.
  if (formData.get(HONEYPOT_FIELD_NAME)) return { ok: true, data: null };

  const database = getDb();
  const isAllowed = await consumeRateLimit(
    database,
    PUBLIC_TOOL_SUGGESTION_PER_IP,
    hashRateLimitSubject(readClientIp(await headers())),
  );
  if (!isAllowed) return { ok: false, error: "too-many-requests" };

  await saveToolSuggestion(database, parsed.data);
  return { ok: true, data: null };
};
