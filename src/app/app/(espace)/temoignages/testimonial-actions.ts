"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import { cancelCorrection, proposeCorrection } from "@/lib/testimonials/corrections/manage-corrections";
import { type MaskPassageResult, maskPassage } from "@/lib/testimonials/corrections/mask-passage";
import { deleteTestimonial } from "@/lib/testimonials/delete-testimonial";
import { HIDDEN_REASONS, MAX_HIDDEN_REASON_DETAIL_LENGTH } from "@/lib/testimonials/hidden-reasons";
import { hideTestimonial } from "@/lib/testimonials/hide-testimonial";
import { sendHiddenReason } from "@/lib/testimonials/send-hidden-reason";
import { editTestimonialPresentation, setTestimonialProduct } from "@/lib/testimonials/edit-testimonial-presentation";
import { restoreTestimonialOriginal } from "@/lib/testimonials/restore-testimonial-original";
import { setTestimonialFeatured } from "@/lib/testimonials/set-testimonial-featured";
import { type TestimonialChangeResult, setTestimonialStatus } from "@/lib/testimonials/set-testimonial-status";
import {
  MAX_AUTHOR_NAME_LENGTH,
  MAX_AUTHOR_TITLE_LENGTH,
  MAX_TESTIMONIAL_LENGTH,
} from "@/lib/testimonials/testimonial-form-schema";
import { deleteUploadedImage } from "@/lib/uploads/delete-uploaded-image";

export type TestimonialActionResult =
  | { ok: true; data: null }
  | { ok: false; error: "testimonial-not-found" | "product-not-found" };

export type TestimonialPresentationField = "authorName" | "authorTitle";

export type SaveTestimonialPresentationResult =
  | { ok: true; data: null }
  | { ok: false; error: "testimonial-not-found" }
  | { ok: false; error: "invalid-input"; fields: TestimonialPresentationField[] };

const testimonialIdSchema = z.uuid();

const presentationSchema = z.object({
  authorName: z.string().trim().min(1).max(MAX_AUTHOR_NAME_LENGTH),
  authorTitle: z
    .string()
    .trim()
    .max(MAX_AUTHOR_TITLE_LENGTH)
    .transform((title) => title || null),
});

const changeTestimonial = async (
  testimonialId: unknown,
  change: (
    userId: string,
    testimonialId: string,
  ) => Promise<TestimonialChangeResult | { status: "product-not-found" }>,
): Promise<TestimonialActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };

  const result = await change(signedInUser.id, parsedId.data);
  if (result.status !== "updated") return { ok: false, error: result.status };

  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: null };
};

export type ApproveTestimonialResult =
  | { ok: true; data: { isFirstApproval: boolean } }
  | { ok: false; error: "testimonial-not-found" }
  | { ok: false; error: "plan-limit-reached"; planName: string; testimonialLimit: number | null };

export const approveTestimonial = async (testimonialId: string): Promise<ApproveTestimonialResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };

  const result = await setTestimonialStatus(getDb(), signedInUser.id, parsedId.data, "approved");
  if (result.status === "testimonial-not-found") return { ok: false, error: result.status };

  revalidatePath(SPACE_HOME_PATH, "layout");
  if (result.status === "plan-limit-reached") return { ok: false, error: "plan-limit-reached", ...result };
  return { ok: true, data: { isFirstApproval: result.isFirstApproval } };
};

const hidingSchema = z
  .object({
    reason: z.enum(HIDDEN_REASONS),
    detail: z.string().trim().max(MAX_HIDDEN_REASON_DETAIL_LENGTH).nullable(),
  })
  .refine((hiding) => hiding.reason !== "other" || Boolean(hiding.detail), { path: ["detail"] });

export type HideTestimonialResult =
  /** reasonSent: the reason left by e-mail to the author just now. */
  | { ok: true; data: { reasonSent: boolean } }
  | { ok: false; error: "testimonial-not-found" | "invalid-reason" };

/** « Masquer » with its reason (point 6): the testimonial leaves the widgets, the reason leaves to its author. */
export const hideTestimonialWithReason = async (
  testimonialId: string,
  hiding: { reason: string; detail: string | null },
): Promise<HideTestimonialResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };
  const parsedHiding = hidingSchema.safeParse(hiding);
  if (!parsedHiding.success) return { ok: false, error: "invalid-reason" };

  const database = getDb();
  const result = await hideTestimonial(database, signedInUser.id, parsedId.data, parsedHiding.data);
  if (result.status !== "updated") return { ok: false, error: result.status };
  const sent = await sendHiddenReason(database, parsedId.data);
  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: { reasonSent: sent === "sent" } };
};

export const featureTestimonial = async (testimonialId: string, featured: boolean): Promise<TestimonialActionResult> =>
  changeTestimonial(testimonialId, (userId, id) => setTestimonialFeatured(getDb(), userId, id, featured === true));

export const saveTestimonialPresentation = async (
  testimonialId: string,
  presentation: { authorName: string; authorTitle: string },
): Promise<SaveTestimonialPresentationResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };
  const parsed = presentationSchema.safeParse(presentation);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((issue) => issue.path[0]))].filter(
      (field): field is TestimonialPresentationField => field === "authorName" || field === "authorTitle",
    );
    return { ok: false, error: "invalid-input", fields };
  }

  const result = await editTestimonialPresentation(getDb(), signedInUser.id, parsedId.data, parsed.data);
  if (result.status !== "updated") return { ok: false, error: result.status };

  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: null };
};

export const linkTestimonialProduct = async (
  testimonialId: string,
  productId: string | null,
): Promise<TestimonialActionResult> => {
  const parsedProductId = z.uuid().nullable().safeParse(productId);
  if (!parsedProductId.success) {
    await requireSignedInUser();
    return { ok: false, error: "product-not-found" };
  }
  return changeTestimonial(testimonialId, (userId, id) =>
    setTestimonialProduct(getDb(), userId, id, parsedProductId.data),
  );
};

export type ProposeCorrectionActionResult =
  | { ok: true; data: null }
  | {
      ok: false;
      error:
        | "testimonial-not-found"
        | "invalid-input"
        | "unreachable"
        | "already-waiting"
        | "too-many"
        | "unchanged"
        | "not-sent";
    };

const correctionSchema = z.string().trim().min(1).max(MAX_TESTIMONIAL_LENGTH);

/** « Envoyer à … pour accord » (point 4): nothing changes on the pages before the author accepts. */
export const proposeTestimonialCorrection = async (
  testimonialId: string,
  body: string,
): Promise<ProposeCorrectionActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };
  const parsedBody = correctionSchema.safeParse(body);
  if (!parsedBody.success) return { ok: false, error: "invalid-input" };

  const result = await proposeCorrection(getDb(), signedInUser.id, parsedId.data, parsedBody.data);
  if (result.status !== "sent") return { ok: false, error: result.status };
  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: null };
};

/** « Annuler la correction »: the author's link no longer proposes it. */
export const cancelTestimonialCorrection = async (testimonialId: string): Promise<TestimonialActionResult> =>
  changeTestimonial(testimonialId, async (userId, id) => {
    const result = await cancelCorrection(getDb(), userId, id);
    return result.status === "testimonial-not-found" ? result : { status: "updated" };
  });

export type MaskPassageActionResult =
  | { ok: true; data: null }
  | { ok: false; error: Exclude<MaskPassageResult["status"], "masked"> | "invalid-input" };

const maskSchema = z.object({
  text: z.string().max(MAX_TESTIMONIAL_LENGTH),
  start: z.number().int().min(0),
  end: z.number().int().min(0),
  kind: z.enum(["name", "contact"]),
});

/** « Masquer ce passage »: a name or a coordinate, no agreement needed, the original kept. */
export const maskTestimonialPassage = async (
  testimonialId: string,
  selection: { text: string; start: number; end: number; kind: string },
): Promise<MaskPassageActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };
  const parsedSelection = maskSchema.safeParse(selection);
  if (!parsedSelection.success) return { ok: false, error: "invalid-input" };

  const result = await maskPassage(getDb(), signedInUser.id, parsedId.data, parsedSelection.data);
  if (result.status !== "masked") return { ok: false, error: result.status };
  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: null };
};

export const restoreTestimonialDisplay = async (testimonialId: string): Promise<TestimonialActionResult> =>
  changeTestimonial(testimonialId, (userId, id) => restoreTestimonialOriginal(getDb(), userId, id));

export const deleteTestimonialForGood = async (testimonialId: string): Promise<TestimonialActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = testimonialIdSchema.safeParse(testimonialId);
  if (!parsedId.success) return { ok: false, error: "testimonial-not-found" };

  const result = await deleteTestimonial(getDb(), signedInUser.id, parsedId.data);
  if (result.status !== "deleted") return { ok: false, error: result.status };

  const { authorPhotoUrl } = result;
  if (authorPhotoUrl) {
    after(async () => {
      try {
        await deleteUploadedImage(authorPhotoUrl);
      } catch (error) {
        Sentry.captureException(error);
      }
    });
  }
  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: null };
};
