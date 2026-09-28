import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { findOwnedSpace } from "./find-owned-space";
import { ONBOARDING_SPACE_STEP_PATH } from "./space-paths";

export const getCurrentSpace = cache(async () => {
  const signedInUser = await requireSignedInUser();
  const space = await findOwnedSpace(getDb(), signedInUser.id);
  if (!space) redirect(ONBOARDING_SPACE_STEP_PATH);
  return { signedInUser, space };
});
