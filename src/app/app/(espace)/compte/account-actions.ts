"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { MAX_FIRST_NAME_LENGTH } from "@/lib/auth/first-name";
import { getAuth } from "@/lib/auth/get-auth";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { type RateLimitRule, consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { ACCOUNT_PATH, NEW_LOGIN_ADDRESS_PARAMETER, SPACE_DELETED_PATH } from "@/lib/spaces/account-paths";
import { deleteSpace } from "@/lib/spaces/delete-space";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import { deleteUploadedFolder } from "@/lib/uploads/delete-uploaded-folder";
import { logoFolderOf, testimonialPhotoFolderOf } from "@/lib/uploads/upload-keys";

const NEW_LOGIN_ADDRESSES_PER_USER: RateLimitRule = { name: "new-login-address", limit: 5, windowSeconds: 60 * 60 };

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export type ChangeLoginEmailResult =
  | { ok: true; data: { email: string } }
  | { ok: false; error: "invalid-email" | "same-email" | "too-many-requests" };

/**
 * Mon compte, « Envoyer le lien »: Better Auth sends a link to the new address; once clicked, it replaces the old one,
 * and the creator lands back on Mon compte. An address already used by another account gets no e-mail, and the
 * answer is the same, so that nobody learns who has an account. Better Auth keeps a failed send to itself (logged,
 * and sent to Sentry by the sender): the creator asks again.
 */
export const requestLoginEmailChange = async (newEmail: string): Promise<ChangeLoginEmailResult> => {
  const signedInUser = await requireSignedInUser();
  const parsed = emailSchema.safeParse(newEmail);
  if (!parsed.success) return { ok: false, error: "invalid-email" };
  if (parsed.data === signedInUser.email) return { ok: false, error: "same-email" };
  if (!(await consumeRateLimit(getDb(), NEW_LOGIN_ADDRESSES_PER_USER, signedInUser.id))) {
    return { ok: false, error: "too-many-requests" };
  }

  await getAuth().api.changeEmail({
    body: { newEmail: parsed.data, callbackURL: `${ACCOUNT_PATH}?${NEW_LOGIN_ADDRESS_PARAMETER}=1` },
    headers: await headers(),
  });
  return { ok: true, data: { email: parsed.data } };
};

export type SaveFirstNameResult = { ok: true; data: { firstName: string } } | { ok: false; error: "too-long" };

/** Mon compte, « Votre prénom »: to say hello on the home of the space. Empty: « Bonjour » alone. */
export const saveFirstName = async (firstName: string): Promise<SaveFirstNameResult> => {
  await requireSignedInUser();
  const cleaned = firstName.trim().replace(/\s+/g, " ");
  if (cleaned.length > MAX_FIRST_NAME_LENGTH) return { ok: false, error: "too-long" };

  await getAuth().api.updateUser({ body: { name: cleaned }, headers: await headers() });
  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: { firstName: cleaned } };
};

/** Mon compte, « Se déconnecter partout ailleurs »: every session of the creator but this one. */
export const signOutOtherDevices = async (): Promise<{ ok: true; data: null }> => {
  await requireSignedInUser();
  await getAuth().api.revokeOtherSessions({ headers: await headers() });
  revalidatePath(ACCOUNT_PATH);
  return { ok: true, data: null };
};

export type DeleteMySpaceResult = { ok: false; error: "name-mismatch" | "subscription-not-stopped" | "space-not-found" };

/**
 * Mon compte, « Supprimer définitivement »: the space and the account go, the files follow, the creator is signed out
 * and lands on « Votre espace est supprimé ».
 */
export const deleteMySpace = async (typedName: string): Promise<DeleteMySpaceResult> => {
  const signedInUser = await requireSignedInUser();
  const requestHeaders = await headers();
  const result = await deleteSpace(getDb(), signedInUser.id, typedName);
  if (result.status !== "deleted") return { ok: false, error: result.status };

  after(async () => {
    for (const folder of [testimonialPhotoFolderOf(result.spaceId), logoFolderOf(result.userId)]) {
      try {
        await deleteUploadedFolder(folder);
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  });
  try {
    await getAuth().api.signOut({ headers: requestHeaders });
  } catch (error) {
    Sentry.captureException(error);
  }
  redirect(SPACE_DELETED_PATH);
};
