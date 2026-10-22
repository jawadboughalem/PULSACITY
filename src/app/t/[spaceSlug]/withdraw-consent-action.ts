"use server";

import * as Sentry from "@sentry/nextjs";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { REQUEST_TOKEN_PARAMETER } from "@/lib/testimonials/read-request-token";
import { withdrawConsent } from "@/lib/testimonials/withdraw-consent";
import { WITHDRAWAL_PARAMETER, WITHDRAWAL_STEPS } from "@/lib/testimonials/withdrawal-parameter";
import { deleteUploadedImage } from "@/lib/uploads/delete-uploaded-image";

/** « Retirer mon accord », the button of the page: the review goes, then the page says so. */
export const withdrawConsentFromPage = async (formData: FormData): Promise<void> => {
  const spaceSlug = String(formData.get("espace") ?? "");
  const token = String(formData.get(REQUEST_TOKEN_PARAMETER) ?? "");
  const result = spaceSlug && token ? await withdrawConsent(getDb(), spaceSlug, token) : null;
  const authorPhotoUrl = result?.status === "withdrawn" ? result.authorPhotoUrl : null;
  if (authorPhotoUrl) {
    after(async () => {
      try {
        await deleteUploadedImage(authorPhotoUrl);
      } catch (error) {
        Sentry.captureException(error);
      }
    });
  }
  const page = `/t/${encodeURIComponent(spaceSlug)}?${REQUEST_TOKEN_PARAMETER}=${encodeURIComponent(token)}`;
  redirect(result?.status === "withdrawn" ? `${page}&${WITHDRAWAL_PARAMETER}=${WITHDRAWAL_STEPS.done}` : page);
};
