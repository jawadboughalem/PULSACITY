"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import { PLAN_LIMIT_NOTICE_COOKIE, PLAN_LIMIT_NOTICE_SNOOZE_SECONDS } from "./plan-limit-notice-cookie";

export const snoozePlanLimitNotice = async (): Promise<void> => {
  await requireSignedInUser();
  (await cookies()).set(PLAN_LIMIT_NOTICE_COOKIE, "1", {
    maxAge: PLAN_LIMIT_NOTICE_SNOOZE_SECONDS,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: SPACE_HOME_PATH,
  });
  revalidatePath(SPACE_HOME_PATH);
};
