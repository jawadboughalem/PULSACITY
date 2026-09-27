import type { Connector, ConnectorId } from "./types";

const connectors: Partial<Record<ConnectorId, Connector>> = {};

export function getConnector(id: string): Connector | null {
  if (!Object.hasOwn(connectors, id)) return null;
  return connectors[id as ConnectorId] ?? null;
}
