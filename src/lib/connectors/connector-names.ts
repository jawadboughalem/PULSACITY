import type { ConnectorId } from "./types";

export const CONNECTOR_NAMES = {
  systeme: "Systeme.io",
  stripe: "Stripe",
  calendly: "Calendly",
} as const satisfies Record<ConnectorId, string>;
