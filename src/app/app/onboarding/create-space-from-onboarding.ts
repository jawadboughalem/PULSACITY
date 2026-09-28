"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { createSpace } from "@/lib/spaces/create-space";
import { type NewSpaceFieldErrors, collectFirstFieldErrors, newSpaceFormSchema } from "@/lib/spaces/new-space-form-schema";
import { ONBOARDING_FORMATIONS_STEP_PATH } from "@/lib/spaces/space-paths";
import { getUploadPublicUrl } from "@/lib/uploads/presign-image-upload";
import { isLogoKeyOf } from "@/lib/uploads/upload-keys";

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

  const result = await createSpace(getDb(), signedInUser.id, {
    ...fields,
    logoUrl: logoKey ? getUploadPublicUrl(logoKey) : null,
  });
  if (result.status === "slug-taken") return { ok: false, error: "slug-taken", suggestedSlug: result.suggestedSlug };

  redirect(ONBOARDING_FORMATIONS_STEP_PATH);
};
