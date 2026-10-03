import { systemeConnector } from "./systeme/connector";
import type { Connector } from "./types";

/** Adding a connector: its folder under src/lib/connectors, and one line here. */
const CONNECTORS = {
  systeme: systemeConnector,
} as const satisfies Record<string, Connector>;

export type ConnectorId = keyof typeof CONNECTORS;

export const listConnectors = (): Connector[] => Object.values(CONNECTORS);

export const getConnector = (id: string): Connector | null =>
  Object.hasOwn(CONNECTORS, id) ? CONNECTORS[id as ConnectorId] : null;

export const getConnectorBySlug = (slug: string): Connector | null =>
  listConnectors().find((connector) => connector.slug === slug) ?? null;

/** A connector removed from the registry keeps its past sales: they show its id. */
export const readConnectorName = (id: string): string => getConnector(id)?.name ?? id;
