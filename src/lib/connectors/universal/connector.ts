import type { Connector } from "../types";

/**
 * Every other tool: an address of the space that receives the sales sent by Zapier, Make, n8n or a tool's own
 * webhook, as JSON or as a form, in the format of ./fields.ts. The secret token of the address authenticates them, as
 * it does the enrollments of Systeme.io. Until the test sales of docs-internes/connectors/universel.md are captured,
 * it keeps each delivery raw and reads none of them (rule n° 1 of CLAUDE.md).
 */
export const universalConnector = {
  id: "universal",
  slug: "connecteur-universel",
  name: "Connecteur universel",
  description: "Vos autres outils, directement ou avec Zapier, Make ou n8n",
  createConfig: () => ({}),
  verify: async () => true,
  readEventType: () => null,
  normalize: () => null,
} as const satisfies Connector;
