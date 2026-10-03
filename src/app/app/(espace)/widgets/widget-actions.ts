"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { WIDGETS_SECTION_HREF } from "@/components/space/space-sections";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { createWidget, updateWidget } from "@/lib/widgets/space-widgets";
import { widgetChangeSchema } from "@/lib/widgets/widget-settings";

export type SaveWidgetResult =
  | { ok: true; data: null }
  | { ok: false; error: "widget-not-found" | "invalid-settings" | "offer-not-found" };

export type CreateWidgetResult = { ok: false; error: "plan-limit" | "space-not-found" };

/** The editor saves what the creator just changed, and only that: another editor left open on the widget loses nothing. */
export const saveWidget = async (widgetId: string, change: unknown): Promise<SaveWidgetResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = z.uuid().safeParse(widgetId);
  if (!parsedId.success) return { ok: false, error: "widget-not-found" };
  const parsedChange = widgetChangeSchema.safeParse(change);
  if (!parsedChange.success) return { ok: false, error: "invalid-settings" };

  const result = await updateWidget(getDb(), signedInUser.id, parsedId.data, parsedChange.data);
  if (result.status !== "updated") return { ok: false, error: result.status };

  revalidatePath(WIDGETS_SECTION_HREF);
  return { ok: true, data: null };
};

export const createWidgetFromList = async (): Promise<CreateWidgetResult> => {
  const signedInUser = await requireSignedInUser();
  const result = await createWidget(getDb(), signedInUser.id);
  if (result.status !== "created") return { ok: false, error: result.status };

  revalidatePath(WIDGETS_SECTION_HREF);
  redirect(`${WIDGETS_SECTION_HREF}/${result.widgetId}`);
};
