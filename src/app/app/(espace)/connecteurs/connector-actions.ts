"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CONNECTORS_SECTION_HREF } from "@/components/space/space-sections";
import { getDb } from "@/db";
import { requireSignedInUser } from "@/lib/auth/require-signed-in-user";
import { renewConnectionAddress } from "@/lib/connectors/connections";
import { associateExternalProduct, joinConnectorWaitlist, replayOwnedEvent } from "@/lib/connectors/manage-connection";
import { getConnectorBySlug } from "@/lib/connectors/registry";
import { OTHER_TOOL, UPCOMING_CONNECTOR_IDS } from "@/lib/connectors/upcoming-connectors";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { productNameSchema } from "@/lib/spaces/product-rules";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";

export type ConnectorActionResult<ActionError extends string = "not-found"> =
  | { ok: true; data: null }
  | { ok: false; error: ActionError };

const MAX_TOOL_NAME_LENGTH = 80;

const associationSchema = z.union([
  z.object({ productId: z.uuid() }),
  z.object({ newOfferName: productNameSchema }),
]);

const refresh = () => revalidatePath(SPACE_HOME_PATH, "layout");

export const associateProduct = async (
  externalProductId: string,
  target: unknown,
): Promise<ConnectorActionResult<"not-found" | "invalid-name">> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = z.uuid().safeParse(externalProductId);
  if (!parsedId.success) return { ok: false, error: "not-found" };
  const parsedTarget = associationSchema.safeParse(target);
  if (!parsedTarget.success) return { ok: false, error: "invalid-name" };

  const result = await associateExternalProduct(getDb(), signedInUser.id, parsedId.data, parsedTarget.data);
  if (result.status !== "associated") return { ok: false, error: "not-found" };
  refresh();
  return { ok: true, data: null };
};

export const replayEvent = async (eventId: string): Promise<ConnectorActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsedId = z.uuid().safeParse(eventId);
  if (!parsedId.success) return { ok: false, error: "not-found" };

  const result = await replayOwnedEvent(getDb(), signedInUser.id, parsedId.data);
  if (result.status !== "replayed") return { ok: false, error: "not-found" };
  refresh();
  return { ok: true, data: null };
};

export const renewAddress = async (connectorSlug: string, connectionId: string): Promise<ConnectorActionResult> => {
  const signedInUser = await requireSignedInUser();
  const connector = getConnectorBySlug(connectorSlug);
  const parsedId = z.uuid().safeParse(connectionId);
  if (!connector || !parsedId.success) return { ok: false, error: "not-found" };

  const result = await renewConnectionAddress(getDb(), signedInUser.id, parsedId.data, connector);
  if (result.status !== "renewed") return { ok: false, error: "not-found" };
  refresh();
  return { ok: true, data: null };
};

export const askToBeNotified = async (connector: string): Promise<ConnectorActionResult> => {
  const signedInUser = await requireSignedInUser();
  const parsed = z.enum(UPCOMING_CONNECTOR_IDS).safeParse(connector);
  if (!parsed.success) return { ok: false, error: "not-found" };
  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  if (!space) return { ok: false, error: "not-found" };

  await joinConnectorWaitlist(database, space.id, parsed.data);
  revalidatePath(CONNECTORS_SECTION_HREF);
  return { ok: true, data: null };
};

export const suggestTool = async (toolName: string): Promise<ConnectorActionResult<"not-found" | "invalid-name">> => {
  const signedInUser = await requireSignedInUser();
  const parsed = z.string().trim().min(2).max(MAX_TOOL_NAME_LENGTH).safeParse(toolName);
  if (!parsed.success) return { ok: false, error: "invalid-name" };
  const database = getDb();
  const space = await findOwnedSpace(database, signedInUser.id);
  if (!space) return { ok: false, error: "not-found" };

  await joinConnectorWaitlist(database, space.id, OTHER_TOOL, parsed.data);
  return { ok: true, data: null };
};
