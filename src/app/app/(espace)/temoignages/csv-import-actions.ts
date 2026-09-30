"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import {
  type CsvImportReport,
  type CsvPreview,
  importTestimonialCsv,
  previewTestimonialCsv,
} from "@/lib/testimonials/csv/import-testimonial-csv";

export type CsvPreviewResult =
  | { ok: true; data: Extract<CsvPreview, { status: "previewed" }> }
  | { ok: false; error: "file-error"; message: string }
  | { ok: false; error: "space-not-found" };

export type CsvImportResult =
  | { ok: true; data: Extract<CsvImportReport, { status: "imported" }> }
  | { ok: false; error: "file-error"; message: string }
  | { ok: false; error: "space-not-found" | "missing-consent" };

const findSpaceId = async (userId: string) => (await findOwnedSpace(getDb(), userId))?.id ?? null;

export const previewCsvImport = async (text: string): Promise<CsvPreviewResult> => {
  const signedInUser = await requireSignedInUser();
  const spaceId = await findSpaceId(signedInUser.id);
  if (!spaceId || typeof text !== "string") return { ok: false, error: "space-not-found" };

  const preview = await previewTestimonialCsv(getDb(), signedInUser.id, spaceId, text);
  if (preview.status === "file-error") return { ok: false, error: "file-error", message: preview.message };
  if (preview.status !== "previewed") return { ok: false, error: preview.status };
  return { ok: true, data: preview };
};

export const importCsv = async (text: string, hasConsent: boolean): Promise<CsvImportResult> => {
  const signedInUser = await requireSignedInUser();
  if (hasConsent !== true) return { ok: false, error: "missing-consent" };
  const spaceId = await findSpaceId(signedInUser.id);
  if (!spaceId || typeof text !== "string") return { ok: false, error: "space-not-found" };

  const report = await importTestimonialCsv(getDb(), signedInUser.id, spaceId, text);
  if (report.status === "file-error") return { ok: false, error: "file-error", message: report.message };
  if (report.status !== "imported") return { ok: false, error: report.status };

  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: report };
};
