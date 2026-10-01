"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { addProduct } from "@/lib/spaces/add-product";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { productNameSchema, requestDelayDaysSchema } from "@/lib/spaces/product-rules";
import { removeProduct } from "@/lib/spaces/remove-product";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import { type ProductChange, updateProduct } from "@/lib/spaces/update-product";

export type OfferActionResult =
  | { ok: true; data: null }
  | { ok: false; error: "product-not-found" | "invalid-name" | "invalid-delay" | "has-sales" };

export type AddOfferResult =
  | { ok: true; data: { productId: string } }
  | { ok: false; error: "invalid-name" | "space-not-found" };

const productIdSchema = z.uuid();

const changeOffer = async (productId: unknown, change: ProductChange): Promise<OfferActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = productIdSchema.safeParse(productId);
  if (!parsedId.success) return { ok: false, error: "product-not-found" };

  const result = await updateProduct(getDb(), signedInUser.id, parsedId.data, change);
  if (result.status !== "updated") return { ok: false, error: result.status };

  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: null };
};

export const renameOffer = async (productId: string, name: string): Promise<OfferActionResult> => {
  const parsedName = productNameSchema.safeParse(name);
  if (!parsedName.success) {
    await requireSignedInUser();
    return { ok: false, error: "invalid-name" };
  }
  return changeOffer(productId, { name: parsedName.data });
};

export const setOfferRequestDelay = async (productId: string, days: number): Promise<OfferActionResult> => {
  const parsedDays = requestDelayDaysSchema.safeParse(days);
  if (!parsedDays.success) {
    await requireSignedInUser();
    return { ok: false, error: "invalid-delay" };
  }
  return changeOffer(productId, { requestDelayDays: parsedDays.data });
};

export const setOfferRequestsEnabled = async (productId: string, enabled: boolean): Promise<OfferActionResult> =>
  changeOffer(productId, { requestsEnabled: enabled === true });

export const addOffer = async (_previousResult: AddOfferResult | null, formData: FormData): Promise<AddOfferResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedName = productNameSchema.safeParse(formData.get("name"));
  if (!parsedName.success) return { ok: false, error: "invalid-name" };

  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  if (!space) return { ok: false, error: "space-not-found" };
  const result = await addProduct(database, signedInUser.id, space.id, parsedName.data);
  if (result.status !== "added") return { ok: false, error: "space-not-found" };

  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: { productId: result.product.id } };
};

export const removeOffer = async (productId: string): Promise<OfferActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = productIdSchema.safeParse(productId);
  if (!parsedId.success) return { ok: false, error: "product-not-found" };

  const result = await removeProduct(getDb(), signedInUser.id, parsedId.data);
  if (result.status !== "removed") return { ok: false, error: result.status };

  revalidatePath(SPACE_HOME_PATH, "layout");
  return { ok: true, data: null };
};
