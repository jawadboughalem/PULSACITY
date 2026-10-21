"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { buildCollectionUrl } from "@/lib/app-url";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { MAX_SPACE_NAME_LENGTH, spaceSlugSchema } from "@/lib/spaces/new-space-form-schema";
import { readTypedColor } from "@/lib/colors/read-typed-color";
import { type RequestEmailPreview, renderRequestEmailPreview } from "@/lib/spaces/render-request-email-preview";
import {
  MAX_POSTAL_ADDRESS_LENGTH,
  type SpaceSettingsFieldErrors,
  collectSpaceSettingsErrors,
  spaceSettingsFormSchema,
} from "@/lib/spaces/space-settings-schema";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import { type LogoChange, findSlugSuggestion, updateSpaceSettings } from "@/lib/spaces/update-space-settings";
import { getUploadPublicUrl } from "@/lib/uploads/presign-image-upload";
import { isLogoKeyOf } from "@/lib/uploads/upload-keys";

const LOGO_NOT_RECEIVED = "Le logo n'a pas été reçu. Choisissez-le à nouveau.";

const SLUG_TAKEN = "Cette adresse est déjà prise par un autre espace.";

export type SaveSpaceSettingsResult =
  | { ok: true; data: { savedAt: number } }
  | { ok: false; error: "invalid-input"; fieldErrors: SpaceSettingsFieldErrors; suggestedSlug?: string }
  | { ok: false; error: "space-not-found" };

/** Every point to correct at once: an address already taken is said even when another field is wrong too. */
const describeInvalidSettings = async (
  userId: string,
  fieldErrors: SpaceSettingsFieldErrors,
  formData: FormData,
): Promise<SaveSpaceSettingsResult> => {
  const slug = spaceSlugSchema.safeParse(formData.get("slug"));
  const suggestedSlug = slug.success ? await findSlugSuggestion(getDb(), userId, slug.data) : null;
  return suggestedSlug
    ? { ok: false, error: "invalid-input", fieldErrors: { ...fieldErrors, slug: SLUG_TAKEN }, suggestedSlug }
    : { ok: false, error: "invalid-input", fieldErrors };
};

/** Réglages, « Enregistrer les modifications »: only the space of the signed-in creator. */
export const saveSpaceSettings = async (
  _previousResult: SaveSpaceSettingsResult | null,
  formData: FormData,
): Promise<SaveSpaceSettingsResult> => {
  const signedInUser = await requireSignedInUser();
  const parsed = spaceSettingsFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return describeInvalidSettings(signedInUser.id, collectSpaceSettingsErrors(parsed.error), formData);

  const { logoKey, removeLogo, ...settings } = parsed.data;
  if (logoKey && !isLogoKeyOf(signedInUser.id, logoKey)) {
    return { ok: false, error: "invalid-input", fieldErrors: { logoKey: LOGO_NOT_RECEIVED } };
  }
  const logo: LogoChange = logoKey
    ? { action: "set", url: getUploadPublicUrl(logoKey) }
    : removeLogo
      ? { action: "remove" }
      : { action: "keep" };

  const result = await updateSpaceSettings(getDb(), signedInUser.id, { ...settings, logo });
  if (result.status === "space-not-found") return { ok: false, error: "space-not-found" };
  if (result.status === "slug-taken") {
    return { ok: false, error: "invalid-input", fieldErrors: { slug: SLUG_TAKEN }, suggestedSlug: result.suggestedSlug };
  }

  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: { savedAt: Date.now() } };
};

const previewInputSchema = z.object({
  spaceName: z.string().trim().max(MAX_SPACE_NAME_LENGTH),
  logoKey: z.string(),
  removeLogo: z.boolean(),
  /** As typed: an unreadable colour leaves the button in Encre, like a space without an accent. */
  accentColor: z.string().max(16),
  senderPostalAddress: z.string().max(MAX_POSTAL_ADDRESS_LENGTH * 2),
});

export type RequestEmailPreviewInput = z.infer<typeof previewInputSchema>;

export type PreviewRequestEmailResult = { ok: true; data: RequestEmailPreview } | { ok: false; error: "preview-failed" };

/** « Voir l'e-mail de demande », with what the creator typed, saved or not. */
export const previewRequestEmail = async (input: RequestEmailPreviewInput): Promise<PreviewRequestEmailResult> => {
  const signedInUser = await requireSignedInUser();
  const parsed = previewInputSchema.safeParse(input);
  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  if (!parsed.success || !space) return { ok: false, error: "preview-failed" };

  const { spaceName, logoKey, removeLogo, accentColor, senderPostalAddress } = parsed.data;
  const logoUrl = logoKey && isLogoKeyOf(signedInUser.id, logoKey) ? getUploadPublicUrl(logoKey) : removeLogo ? null : space.logoUrl;
  const [firstOffer] = await database
    .select({ name: products.name, slug: products.slug })
    .from(products)
    .where(eq(products.spaceId, space.id))
    .orderBy(asc(products.createdAt))
    .limit(1);
  const address = senderPostalAddress
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");

  return {
    ok: true,
    data: await renderRequestEmailPreview({
      spaceName: spaceName || space.name,
      logoUrl,
      accentColor: readTypedColor(accentColor),
      senderPostalAddress: address || null,
      productName: firstOffer?.name ?? null,
      collectionUrl: buildCollectionUrl(space.slug, firstOffer?.slug),
    }),
  };
};
