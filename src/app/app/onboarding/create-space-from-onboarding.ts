"use server";

import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { getDb } from "@/db";
import { readHeardFrom, readSignupSource } from "@/lib/acquisition/signup-source";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { createSpace } from "@/lib/spaces/create-space";
import { type NewSpaceFieldErrors, collectFirstFieldErrors, newSpaceFormSchema } from "@/lib/spaces/new-space-form-schema";
import { ONBOARDING_FORMATIONS_STEP_PATH } from "@/lib/spaces/space-paths";
import { getUploadPublicUrl } from "@/lib/uploads/presign-image-upload";
import { isLogoKeyOf } from "@/lib/uploads/upload-keys";
import { sendWelcomeEmail } from "@/lib/welcome-emails/send-welcome-emails";

const LOGO_NOT_RECEIVED = "Le logo n'a pas été reçu. Choisissez-le à nouveau.";

export type CreateSpaceFormResult =
  | { ok: false; error: "invalid-input"; fieldErrors: NewSpaceFieldErrors }
  | { ok: false; error: "slug-taken"; suggestedSlug: string };

export const createSpaceFromOnboarding = async (
  _previousResult: CreateSpaceFormResult | null,
  formData: FormData,
): Promise<CreateSpaceFormResult> => {
  const signedInUser = await requireSignedInUser();
  const parsed = newSpaceFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: "invalid-input", fieldErrors: collectFirstFieldErrors(parsed.error) };
  }

  const { logoKey, ...fields } = parsed.data;
  if (logoKey && !isLogoKeyOf(signedInUser.id, logoKey)) {
    return { ok: false, error: "invalid-input", fieldErrors: { logoKey: LOGO_NOT_RECEIVED } };
  }

  const result = await createSpace(
    getDb(),
    signedInUser.id,
    { ...fields, logoUrl: logoKey ? getUploadPublicUrl(logoKey) : null },
    { source: readSignupSource(formData), heardFrom: readHeardFrom(formData) },
  );
  if (result.status === "slug-taken") return { ok: false, error: "slug-taken", suggestedSlug: result.suggestedSlug };
  if (result.status === "created") {
    // The welcome e-mail J0 leaves at once, once the page has answered; the cron task catches it up if it failed.
    const spaceId = result.space.id;
    after(async () => {
      try {
        await sendWelcomeEmail(getDb(), spaceId, "j0");
      } catch (error) {
        Sentry.captureException(error);
      }
    });
  }

  redirect(ONBOARDING_FORMATIONS_STEP_PATH);
};
