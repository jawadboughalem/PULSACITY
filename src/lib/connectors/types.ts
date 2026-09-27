/**
 * The connector contract (CLAUDE.md, absolute rule 1).
 *
 * A connector is the only code that knows a platform's format: it checks that
 * a webhook really comes from the platform and turns its payload into a
 * NormalizedPurchase. The core of the product only ever sees
 * NormalizedPurchase.
 *
 * No connector is written before its real payloads are captured in
 * docs-internes/connectors/<name>.md and turned into test fixtures.
 */

/** Platforms named in the data model (`connections.connector`). */
export const CONNECTOR_IDS = ["systeme", "stripe", "calendly"] as const;

export type ConnectorId = (typeof CONNECTOR_IDS)[number];

/** Connector-specific settings saved with a connection (`connections.config`). */
export type ConnectionConfig = Record<string, unknown>;

/** A sale or an enrolment, as the core of the product sees it. */
export type NormalizedPurchase = {
  email: string;
  firstName: string | null;
  lastName: string | null;
  /** The offer's identifier on the platform, matched against `product_refs.externalRef`. */
  offerRef: string;
  offerName: string;
  purchasedAt: Date;
};

export type Connector = {
  id: ConnectorId;
  /**
   * Whether the request really comes from the platform (signature, shared
   * secret…), using the settings of the connection it arrived on. Reads the
   * body from `request.clone()`: the caller still stores the raw payload.
   */
  verify(request: Request, config: ConnectionConfig): Promise<boolean>;
  /**
   * The purchase carried by the payload, or `null` when the payload is not a
   * purchase (another event, a test call…). The raw payload is already stored
   * in `webhook_events` when this runs, so nothing is lost either way.
   */
  normalize(payload: unknown): NormalizedPurchase | null;
};
