import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, spaces } from "@/db/schema";
import { getAppUrl } from "@/lib/app-url";
import type { Connector } from "./types";

const WEBHOOK_TOKEN_BYTES = 32;

export type SpaceConnection = typeof connections.$inferSelect;

export const generateWebhookToken = (): string => randomBytes(WEBHOOK_TOKEN_BYTES).toString("base64url");

/** « Adresse de connexion »: the creator pastes it in the platform, it receives every delivery. */
export const buildWebhookUrl = (connectorId: string, webhookToken: string): string =>
  `${getAppUrl()}/api/connectors/${connectorId}/${webhookToken}`;

export const findConnection = async (
  database: Database,
  spaceId: string,
  connectorId: string,
): Promise<SpaceConnection | null> => {
  const [connection] = await database
    .select()
    .from(connections)
    .where(and(eq(connections.spaceId, spaceId), eq(connections.connector, connectorId)))
    .limit(1);
  return connection ?? null;
};

/** The address exists from the first visit of the connector's page, ready to copy. */
export const findOrCreateConnection = async (
  database: Database,
  spaceId: string,
  connector: Connector,
): Promise<SpaceConnection> => {
  await database
    .insert(connections)
    .values({
      spaceId,
      connector: connector.id,
      webhookToken: generateWebhookToken(),
      config: connector.createConfig(),
    })
    .onConflictDoNothing({ target: [connections.spaceId, connections.connector] });
  const connection = await findConnection(database, spaceId, connector.id);
  if (!connection) throw new Error(`The ${connector.id} connection of space ${spaceId} could not be created.`);
  return connection;
};

export type RenewConnectionResult = { status: "renewed" } | { status: "connection-not-found" };

/** A new address and a new secret: the old ones stop working at once, until pasted again in the platform. */
export const renewConnectionAddress = async (
  database: Database,
  userId: string,
  connectionId: string,
  connector: Connector,
): Promise<RenewConnectionResult> => {
  const [owned] = await database
    .select({ id: connections.id })
    .from(connections)
    .innerJoin(spaces, eq(spaces.id, connections.spaceId))
    .where(and(eq(connections.id, connectionId), eq(spaces.userId, userId), eq(connections.connector, connector.id)))
    .limit(1);
  if (!owned) return { status: "connection-not-found" };

  await database
    .update(connections)
    .set({ webhookToken: generateWebhookToken(), config: connector.createConfig(), status: "pending" })
    .where(eq(connections.id, owned.id));
  return { status: "renewed" };
};
