import type { Connector } from "../types";
import { normalizeUniversalSale } from "./normalize";

/**
 * Every other tool: an address of the space that receives the sales sent by Zapier, Make, n8n or a tool's own
 * webhook, as JSON or as a form, in the format of ./fields.ts. The secret token of the address authenticates them, as
 * it does the enrollments of Systeme.io. Every delivery is a sale: there is no event to name.
 */
export const universalConnector = {
  id: "universal",
  slug: "connecteur-universel",
  name: "Connecteur universel",
  description: "Vos autres outils, directement ou avec Zapier, Make ou n8n",
  createConfig: () => ({}),
  verify: async () => true,
  readEventType: () => null,
  normalize: normalizeUniversalSale,
} as const satisfies Connector;
