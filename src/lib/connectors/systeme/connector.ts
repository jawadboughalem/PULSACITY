import { generateSigningSecret, isHmacSha256HexValid } from "../signing";
import type { Connector } from "../types";
import { EVENT_HEADER, normalizeSystemeEvent, readSystemeEventType } from "./normalize";

const SIGNATURE_HEADER = "x-webhook-signature";

/**
 * The webhooks of the settings sign the raw body with the secret, in HMAC-SHA256 hexadecimal. The webhooks of
 * automation rules (« Inscrit à la formation ») are not signed: the secret token of the address authenticates them.
 */
export const systemeConnector = {
  id: "systeme",
  slug: "systeme-io",
  name: "Systeme.io",
  description: "Formations, coachings et tunnels de vente",
  createConfig: () => ({ signingSecret: generateSigningSecret() }),
  verify: async (request, config) => {
    const signature = request.headers.get(SIGNATURE_HEADER);
    if (signature === null) return request.headers.get(EVENT_HEADER) === null;
    if (!config.signingSecret) return false;
    const body = new Uint8Array(await request.arrayBuffer());
    return isHmacSha256HexValid(config.signingSecret, body, signature);
  },
  readEventType: readSystemeEventType,
  normalize: normalizeSystemeEvent,
} as const satisfies Connector;
