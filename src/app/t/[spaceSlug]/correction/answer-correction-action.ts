"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db";
import {
  CORRECTION_PAGE_SEGMENT,
  CORRECTION_TOKEN_PARAMETER,
  answerCorrection,
} from "@/lib/testimonials/corrections/manage-corrections";
import { CORRECTION_ANSWER_PARAMETER } from "./correction-answer-parameter";

/** A button of the page, never the link of the e-mail: the author's answer, then the page that says it. */
export const answerCorrectionFromPage = async (formData: FormData): Promise<void> => {
  const spaceSlug = String(formData.get("espace") ?? "");
  const token = String(formData.get(CORRECTION_TOKEN_PARAMETER) ?? "");
  const answer = formData.get("reponse") === "accepter" ? "accept" : "keep";
  const result = token && spaceSlug ? await answerCorrection(getDb(), spaceSlug, token, answer) : null;
  const page = `/t/${encodeURIComponent(spaceSlug)}/${CORRECTION_PAGE_SEGMENT}?${CORRECTION_TOKEN_PARAMETER}=${encodeURIComponent(token)}`;
  if (result?.status === "answered") {
    redirect(`${page}&${CORRECTION_ANSWER_PARAMETER}=${result.outcome === "accepted" ? "acceptee" : "gardee"}`);
  }
  redirect(page);
};
