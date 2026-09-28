"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { addProduct } from "@/lib/spaces/add-product";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { ONBOARDING_FORMATIONS_STEP_PATH } from "@/lib/spaces/space-paths";
import { removeProduct } from "@/lib/spaces/remove-product";

const MAX_FORMATION_NAME_LENGTH = 80;

const formationNameSchema = z.string().trim().min(2).max(MAX_FORMATION_NAME_LENGTH);

export type AddFormationResult =
  | { ok: true; data: { productId: string } }
  | { ok: false; error: "invalid-name" | "space-not-found" };

export type RemoveFormationResult = { ok: true; data: null } | { ok: false; error: "product-not-found" | "has-sales" };

export const addFormation = async (
  _previousResult: AddFormationResult | null,
  formData: FormData,
): Promise<AddFormationResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedName = formationNameSchema.safeParse(formData.get("name"));
  if (!parsedName.success) return { ok: false, error: "invalid-name" };

  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  if (!space) return { ok: false, error: "space-not-found" };

  const result = await addProduct(database, signedInUser.id, space.id, parsedName.data);
  if (result.status !== "added") return { ok: false, error: "space-not-found" };

  revalidatePath(ONBOARDING_FORMATIONS_STEP_PATH);
  return { ok: true, data: { productId: result.product.id } };
};

export const removeFormation = async (productId: string): Promise<RemoveFormationResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = z.uuid().safeParse(productId);
  if (!parsedId.success) return { ok: false, error: "product-not-found" };

  const result = await removeProduct(getDb(), signedInUser.id, parsedId.data);
  if (result.status !== "removed") return { ok: false, error: result.status };

  revalidatePath(ONBOARDING_FORMATIONS_STEP_PATH);
  return { ok: true, data: null };
};
