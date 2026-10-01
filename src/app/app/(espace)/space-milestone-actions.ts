"use server";

import { z } from "zod";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { SPACE_MILESTONES, markSpaceMilestone } from "@/lib/spaces/mark-space-milestone";

const milestoneSchema = z.enum(SPACE_MILESTONES);

export const markMilestone = async (milestone: string): Promise<{ ok: true; data: null } | { ok: false; error: "unknown-milestone" }> => {
  const signedInUser = await requireSignedInUser();
  const parsed = milestoneSchema.safeParse(milestone);
  if (!parsed.success) return { ok: false, error: "unknown-milestone" };

  await markSpaceMilestone(getDb(), signedInUser.id, parsed.data);
  return { ok: true, data: null };
};
