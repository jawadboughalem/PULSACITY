export type ConnectionConfig = {
  /** Pasted in the platform, which signs each delivery with it. */
  signingSecret?: string;
} & Record<string, unknown>;

export type WebhookHeaders = Record<string, string>;

export type PurchaseEventType = "sale" | "enrollment";

/** All the core of PULSACITY knows of a sale or an enrollment, whatever the platform it comes from. */
export type NormalizedPurchase = {
  eventType: PurchaseEventType;
  /** The sale on the platform: the same sale received twice is recorded once. */
  externalRef: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  productRef: string;
  productName: string;
  productPrice: { amountCents: number; currency: string } | null;
  occurredAt: Date;
};

export type Connector = {
  id: string;
  /** In the addresses of the space: /app/connecteurs/systeme-io. */
  slug: string;
  name: string;
  /** One line on the Connecteurs page. */
  description: string;
  /** What the connection holds from its creation, a signing secret for a platform that signs. */
  createConfig(): ConnectionConfig;
  /** false: the delivery does not come from the platform. The webhook token has already been checked. */
  verify(request: Request, config: ConnectionConfig): Promise<boolean>;
  /** The platform's own name for the event, kept with the raw payload. */
  readEventType(payload: unknown, headers: WebhookHeaders): string | null;
  /** null: an event that is not a sale or an enrollment. Throws InvalidPayloadError on a sale it cannot read. */
  normalize(payload: unknown, headers: WebhookHeaders): NormalizedPurchase | null;
};
