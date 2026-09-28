export const CONNECTOR_IDS = ["systeme", "stripe", "calendly"] as const;

export type ConnectorId = (typeof CONNECTOR_IDS)[number];

export type ConnectionConfig = Record<string, unknown>;

export type WebhookHeaders = Record<string, string>;

export type NormalizedPurchase = {
  email: string;
  firstName: string | null;
  lastName: string | null;
  offerRef: string;
  offerName: string;
  purchasedAt: Date;
};

export type Connector = {
  id: ConnectorId;
  verify(request: Request, config: ConnectionConfig): Promise<boolean>;
  normalize(payload: unknown, headers: WebhookHeaders): NormalizedPurchase | null;
};
