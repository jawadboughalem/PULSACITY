import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { InvalidPayloadError } from "../invalid-payload-error";
import { signHmacSha256Hex } from "../signing";
import type { WebhookHeaders } from "../types";
import { systemeConnector } from "./connector";

/** The fixtures are the bodies captured on September 27, 2026, personal values masked (docs-internes/connectors/systeme.md). */
const readFixture = (name: string) => readFileSync(new URL(`./__fixtures__/${name}`, import.meta.url), "utf8");

const SALE_BODY = readFixture("sale-new.body.json").trimEnd();
const SALE_HEADERS = JSON.parse(readFixture("sale-new.headers.json")) as WebhookHeaders;
const ENROLLMENT_BODY = readFixture("contact-course-enrolled.body.json").trimEnd();
const ENROLLMENT_HEADERS = JSON.parse(readFixture("contact-course-enrolled.headers.json")) as WebhookHeaders;

const SECRET = "pulsacity-capture-test";

const deliver = (body: string, headers: WebhookHeaders) =>
  new Request("https://pulsacity.com/api/connectors/systeme/token", { method: "POST", body, headers });

const withHeaders = (headers: WebhookHeaders, change: Record<string, string | null>): WebhookHeaders =>
  Object.fromEntries(
    Object.entries({ ...headers, ...change }).filter((entry): entry is [string, string] => entry[1] !== null),
  );

describe("systemeConnector.normalize", () => {
  it("reads « Nouvelle vente » as a sale of the price plan", () => {
    expect(systemeConnector.normalize(JSON.parse(SALE_BODY), SALE_HEADERS)).toEqual({
      eventType: "sale",
      externalRef: "order-item:15460129",
      email: "utilisateurdemo+capture@example.com",
      firstName: "Test",
      lastName: null,
      productRef: "price-plan:3456303",
      productName: "Produit physique test PULSACITY",
      productPrice: { amountCents: 100, currency: "EUR" },
      occurredAt: new Date("2026-09-27T20:16:26Z"),
    });
  });

  it("reads « Inscrit à la formation » as an enrollment in the course", () => {
    expect(systemeConnector.normalize(JSON.parse(ENROLLMENT_BODY), ENROLLMENT_HEADERS)).toEqual({
      eventType: "enrollment",
      externalRef: "enrollment:445573087:680647",
      email: "utilisateurdemo+capture@example.com",
      firstName: "Test",
      lastName: "Capture",
      productRef: "course:680647",
      productName: "Formation test PULSACITY",
      productPrice: null,
      occurredAt: new Date("2026-09-27T19:57:41Z"),
    });
  });

  it("names the event from the header of the settings' webhooks, or from the body of an automation rule", () => {
    expect(systemeConnector.readEventType(JSON.parse(SALE_BODY), SALE_HEADERS)).toBe("SALE_NEW");
    expect(systemeConnector.readEventType(JSON.parse(ENROLLMENT_BODY), ENROLLMENT_HEADERS)).toBe(
      "contact.course.enrolled",
    );
  });

  it("keeps every event it has no capture of out of the sales", () => {
    const canceled = withHeaders(SALE_HEADERS, { "x-webhook-event": "SALE_CANCELED" });
    expect(systemeConnector.normalize(JSON.parse(SALE_BODY), canceled)).toBeNull();
    expect(systemeConnector.normalize({ type: "contact.tag.added", data: {} }, ENROLLMENT_HEADERS)).toBeNull();
    expect(systemeConnector.normalize("not json", {})).toBeNull();
  });

  it("does not take a sale's body for a sale without the header of the settings' webhooks", () => {
    expect(systemeConnector.normalize(JSON.parse(SALE_BODY), ENROLLMENT_HEADERS)).toBeNull();
  });

  it("lowercases the address and keeps the first name only when there is one", () => {
    const sale = JSON.parse(SALE_BODY) as { customer: { email: string; fields: Record<string, unknown> } };
    sale.customer.email = "  Camille.Roux@Example.com ";
    sale.customer.fields = { first_name: "  ", surname: "Roux" };
    expect(systemeConnector.normalize(sale, SALE_HEADERS)).toMatchObject({
      email: "camille.roux@example.com",
      firstName: null,
      lastName: "Roux",
    });
  });

  it("refuses a sale it recognises but cannot read", () => {
    const withoutEmail = JSON.parse(SALE_BODY) as { customer: { email?: string } };
    delete withoutEmail.customer.email;
    expect(() => systemeConnector.normalize(withoutEmail, SALE_HEADERS)).toThrow(InvalidPayloadError);

    const badDate = JSON.parse(ENROLLMENT_BODY) as { created_at: string };
    badDate.created_at = "hier";
    expect(() => systemeConnector.normalize(badDate, ENROLLMENT_HEADERS)).toThrow(InvalidPayloadError);
  });
});

describe("systemeConnector.verify", () => {
  const config = { signingSecret: SECRET };
  const signed = (body: string) => withHeaders(SALE_HEADERS, { "x-webhook-signature": signHmacSha256Hex(SECRET, Buffer.from(body)) });

  it("accepts a sale signed with the connection's secret, on the exact bytes received", async () => {
    expect(await systemeConnector.verify(deliver(SALE_BODY, signed(SALE_BODY)), config)).toBe(true);
  });

  it("signs in HMAC-SHA256 hexadecimal, as checked on the captured body", () => {
    // The masked body no longer matches the captured signature: the algorithm is checked on RFC 4231, case 2.
    expect(signHmacSha256Hex("Jefe", Buffer.from("what do ya want for nothing?"))).toBe(
      "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843",
    );
  });

  it("refuses a sale whose body or secret changed", async () => {
    const tampered = SALE_BODY.replace('"totalPrice":100', '"totalPrice":1');
    expect(await systemeConnector.verify(deliver(tampered, signed(SALE_BODY)), config)).toBe(false);
    expect(await systemeConnector.verify(deliver(SALE_BODY, signed(SALE_BODY)), { signingSecret: "autre" })).toBe(false);
    expect(await systemeConnector.verify(deliver(SALE_BODY, signed(SALE_BODY)), {})).toBe(false);
  });

  it("refuses the captured signature on the masked body, which it no longer matches", async () => {
    expect(await systemeConnector.verify(deliver(SALE_BODY, SALE_HEADERS), config)).toBe(false);
  });

  it("refuses an unsigned delivery of the settings' webhooks", async () => {
    const unsigned = withHeaders(SALE_HEADERS, { "x-webhook-signature": null });
    expect(await systemeConnector.verify(deliver(SALE_BODY, unsigned), config)).toBe(false);
  });

  it("accepts an automation rule, which Systeme.io never signs", async () => {
    expect(await systemeConnector.verify(deliver(ENROLLMENT_BODY, ENROLLMENT_HEADERS), config)).toBe(true);
  });

  it("creates each connection with its own secret, letters and digits only", () => {
    const first = systemeConnector.createConfig().signingSecret;
    expect(first).toMatch(/^[0-9a-f]{32}$/);
    expect(systemeConnector.createConfig().signingSecret).not.toBe(first);
  });
});
