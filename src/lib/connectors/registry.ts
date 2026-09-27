import type { Connector, ConnectorId } from "./types";

/**
 * The connectors the webhook route can dispatch to.
 *
 * A connector is registered here only once its real payloads are captured in
 * docs-internes/connectors/<name>.md and covered by fixture-based tests.
 * None is yet: Systeme.io is waiting for its week 1 captures.
 */
const connectors: Partial<Record<ConnectorId, Connector>> = {};

/** The connector named in a webhook URL, or `null` when there is none. */
export function getConnector(id: string): Connector | null {
  if (!Object.hasOwn(connectors, id)) return null;
  return connectors[id as ConnectorId] ?? null;
}

export function listConnectors(): Connector[] {
  return Object.values(connectors);
}
