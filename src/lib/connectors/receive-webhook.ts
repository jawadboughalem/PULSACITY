import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, webhookEvents } from "@/db/schema";
import { type RateLimitRule, consumeRateLimit } from "@/lib/rate-limit/consume-rate-limit";
import { getConnector } from "./registry";
import type { WebhookHeaders } from "./types";

export const MAX_WEBHOOK_BYTES = 256 * 1024;

/** A launch day of a big creator stays far below; past it, the platform retries later. */
export const WEBHOOKS_PER_CONNECTION: RateLimitRule = {
  name: "webhook-connection",
  limit: 600,
  windowSeconds: 10 * 60,
};

const WEBHOOK_TOKEN = /^[A-Za-z0-9_-]{20,128}$/;

/** Headers that say nothing of the event, or that must never be stored. */
const isKeptHeader = (name: string) => name !== "cookie" && name !== "authorization" && !name.startsWith("x-vercel-");

export type ReceivedWebhook =
  | { status: "not-found" }
  | { status: "too-large" }
  | { status: "too-many" }
  | { status: "received"; eventId: string; isVerified: boolean };

const readHeaders = (request: Request): WebhookHeaders =>
  Object.fromEntries([...request.headers.entries()].filter(([name]) => isKeptHeader(name)));

/** Never lost: a body that is not JSON is kept as text. */
const readPayload = (body: string): unknown => {
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return body;
  }
};

const isDeclaredTooLarge = (request: Request) => Number(request.headers.get("content-length") ?? 0) > MAX_WEBHOOK_BYTES;

/**
 * The raw delivery is stored before anything else. A delivery that fails the connector's verification is kept aside,
 * and the connection shows the problem: the creator decides.
 */
export const receiveWebhook = async (
  database: Database,
  connectorId: string,
  token: string,
  request: Request,
): Promise<ReceivedWebhook> => {
  const connector = getConnector(connectorId);
  if (!connector || !WEBHOOK_TOKEN.test(token)) return { status: "not-found" };
  const [connection] = await database
    .select({ id: connections.id, config: connections.config })
    .from(connections)
    .where(and(eq(connections.webhookToken, token), eq(connections.connector, connector.id)))
    .limit(1);
  if (!connection) return { status: "not-found" };
  if (isDeclaredTooLarge(request)) return { status: "too-large" };
  if (!(await consumeRateLimit(database, WEBHOOKS_PER_CONNECTION, connection.id))) return { status: "too-many" };

  const verifiedRequest = request.clone();
  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.byteLength > MAX_WEBHOOK_BYTES) return { status: "too-large" };
  const isVerified = await connector.verify(verifiedRequest, connection.config);

  const body = new TextDecoder().decode(bytes).replaceAll("\u0000", "");
  const payload = readPayload(body);
  const headers = readHeaders(request);
  const receivedAt = new Date();
  const [event] = await database
    .insert(webhookEvents)
    .values({
      connectionId: connection.id,
      rawPayload: payload,
      rawBody: body,
      headers,
      eventType: connector.readEventType(payload, headers),
      receivedAt,
      error: isVerified ? null : "invalid-signature",
    })
    .returning({ id: webhookEvents.id });
  await database
    .update(connections)
    .set(isVerified ? { status: "active", lastEventAt: receivedAt } : { status: "error" })
    .where(eq(connections.id, connection.id));

  return { status: "received", eventId: event.id, isVerified };
};
