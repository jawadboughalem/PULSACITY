import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { InvalidPayloadError } from "../invalid-payload-error";
import type { Connector, NormalizedPurchase, WebhookHeaders } from "../types";
import { universalConnector } from "./connector";
import { NO_OFFER_NAME, NO_OFFER_REF } from "./normalize";

/**
 * The fixtures are the six test sales captured on October 12, 2026, from Make, n8n and Zapier, each as JSON and as a
 * form, with their content type, user agent and moment of reception (docs-internes/connectors/universel.md).
 */
const readFixture = (name: string) => readFileSync(new URL(`./__fixtures__/${name}`, import.meta.url), "utf8");

const RECEIVED_AT = JSON.parse(readFixture("received-at.json")) as Record<string, string>;

type Capture = { payload: unknown; headers: WebhookHeaders; receivedAt: Date };

/** As the engine stores it: JSON parsed, a form kept as text. */
const readCapture = (name: string): Capture => {
  const isJson = name.endsWith("-json");
  const body = readFixture(`${name}.body.${isJson ? "json" : "txt"}`).trimEnd();
  return {
    payload: isJson ? (JSON.parse(body) as unknown) : body,
    headers: JSON.parse(readFixture(`${name}.headers.json`)) as WebhookHeaders,
    receivedAt: new Date(RECEIVED_AT[name]),
  };
};

const normalize = ({ payload, headers, receivedAt }: Capture) =>
  universalConnector.normalize(payload, headers, { receivedAt });

const RECEIVED = new Date("2026-10-12T18:00:00Z");

const JSON_HEADERS = { "content-type": "application/json" };
const FORM_HEADERS = { "content-type": "application/x-www-form-urlencoded" };

const sendJson = (fields: Record<string, unknown>, receivedAt = RECEIVED) =>
  universalConnector.normalize(fields, JSON_HEADERS, { receivedAt });

const sendForm = (body: string, receivedAt = RECEIVED) =>
  universalConnector.normalize(body, FORM_HEADERS, { receivedAt });

const CAMILLE = { email: "camille@example.com", offre: "Programme 30 jours" };

const PROGRAMME: Pick<NormalizedPurchase, "eventType" | "firstName" | "lastName" | "productRef" | "productName"> = {
  eventType: "sale",
  firstName: "Camille",
  lastName: "Martin",
  productRef: "offre:programme 30 jours",
  productName: "Programme 30 jours",
};

describe("universalConnector.normalize, on the captures", () => {
  it("reads Make's JSON, its amount a number and its date in UTC", () => {
    expect(normalize(readCapture("make-json"))).toEqual({
      ...PROGRAMME,
      externalRef: "reference:make-json-1",
      email: "camille.make@example.com",
      productPrice: { amountCents: 9700, currency: "EUR" },
      occurredAt: new Date("2026-10-12T15:12:13.173Z"),
    });
  });

  it("reads Make's form, its spaces as « + » and its amount with a comma", () => {
    expect(normalize(readCapture("make-form"))).toEqual({
      ...PROGRAMME,
      externalRef: "reference:make-form-1",
      email: "camille.make@example.com",
      productPrice: { amountCents: 9750, currency: "EUR" },
      occurredAt: new Date("2026-10-12T15:15:56.493Z"),
    });
  });

  it("reads n8n's JSON, its amount as text and its date with the offset of Paris", () => {
    expect(normalize(readCapture("n8n-json"))).toEqual({
      ...PROGRAMME,
      externalRef: "reference:n8n-json-1",
      email: "camille.n8n@example.com",
      productPrice: { amountCents: 9700, currency: "EUR" },
      occurredAt: new Date("2026-10-12T17:35:21.044Z"),
    });
  });

  it("reads n8n's form, its spaces as « %20 »", () => {
    expect(normalize(readCapture("n8n-form"))).toEqual({
      ...PROGRAMME,
      externalRef: "reference:n8n-form-1",
      email: "camille.n8n@example.com",
      productPrice: { amountCents: 9750, currency: "EUR" },
      occurredAt: new Date("2026-10-12T17:36:50.069Z"),
    });
  });

  it("reads Zapier's JSON, its content type with a charset and its date without a time, at midday", () => {
    const capture = readCapture("zapier-json");
    expect(capture.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(normalize(capture)).toEqual({
      ...PROGRAMME,
      externalRef: "reference:zapier-json-1",
      email: "camille.zapier@example.com",
      productPrice: { amountCents: 9700, currency: "EUR" },
      occurredAt: new Date("2026-10-12T12:00:00Z"),
    });
  });

  it("reads Zapier's form, « Oct 12, 2026 » encoded with its comma", () => {
    expect(normalize(readCapture("zapier-form"))).toEqual({
      ...PROGRAMME,
      externalRef: "reference:zapier-form-1",
      email: "camille.zapier@example.com",
      productPrice: { amountCents: 9750, currency: "EUR" },
      occurredAt: new Date("2026-10-12T12:00:00Z"),
    });
  });

  it("names the same offer the same way, from the six tools and the two formats", () => {
    const names = ["make-json", "make-form", "n8n-json", "n8n-form", "zapier-json", "zapier-form"];
    const refs = new Set(names.map((name) => normalize(readCapture(name))?.productRef));
    expect([...refs]).toEqual(["offre:programme 30 jours"]);
  });

  it("names no event: every delivery is a sale", () => {
    const { payload, headers } = readCapture("make-json");
    const connector: Connector = universalConnector;
    expect(connector.readEventType(payload, headers)).toBeNull();
  });
});

describe("universalConnector.normalize, the reference", () => {
  it("reads the same sale received twice as the same sale", () => {
    const sale = { ...CAMILLE, reference: "commande-1042" };
    const first = sendJson(sale, new Date("2026-10-12T18:00:00Z"));
    const again = sendJson(sale, new Date("2026-10-12T18:05:00Z"));
    expect(first?.externalRef).toBe("reference:commande-1042");
    expect(again?.externalRef).toBe(first?.externalRef);
  });

  it("takes the same customer and offer on the same day in Paris for the same sale, without a reference", () => {
    const morning = sendJson(CAMILLE, new Date("2026-10-12T07:00:00Z"));
    const evening = sendJson(CAMILLE, new Date("2026-10-12T21:30:00Z"));
    const nextDay = sendJson(CAMILLE, new Date("2026-10-12T22:30:00Z"));
    expect(morning?.externalRef).toBe("same-day:camille@example.com:offre:programme 30 jours:2026-10-12");
    expect(evening?.externalRef).toBe(morning?.externalRef);
    expect(nextDay?.externalRef).toBe("same-day:camille@example.com:offre:programme 30 jours:2026-10-13");
  });

  it("never mixes a reference with a sale without one", () => {
    expect(sendJson({ ...CAMILLE, reference: "same-day" })?.externalRef).toBe("reference:same-day");
  });
});

describe("universalConnector.normalize, the fields", () => {
  it("needs only the e-mail address, and sends a sale without an offer to its own offer to associate", () => {
    expect(sendForm("email=Camille%40Example.com")).toEqual({
      eventType: "sale",
      externalRef: `same-day:camille@example.com:${NO_OFFER_REF}:2026-10-12`,
      email: "camille@example.com",
      firstName: null,
      lastName: null,
      productRef: NO_OFFER_REF,
      productName: NO_OFFER_NAME,
      productPrice: null,
      occurredAt: RECEIVED,
    });
  });

  it("takes an empty field for an absent one", () => {
    expect(sendJson({ ...CAMILLE, prenom: "", nom: "  ", montant: "", devise: "", date: "", reference: "" })).toMatchObject({
      firstName: null,
      lastName: null,
      productPrice: null,
      occurredAt: RECEIVED,
      externalRef: "same-day:camille@example.com:offre:programme 30 jours:2026-10-12",
    });
  });

  it("reads the names of the fields whatever their capitals and accents", () => {
    expect(sendJson({ "E-mail": "camille@example.com", Prénom: "Camille", Offre: "Atelier", Référence: "r-1" })).toMatchObject({
      email: "camille@example.com",
      firstName: "Camille",
      productName: "Atelier",
      externalRef: "reference:r-1",
    });
  });

  it("decodes the accents of a form and keeps the offer's name as written, its key in lowercase", () => {
    expect(sendForm("email=helene%40example.com&prenom=H%C3%A9l%C3%A8ne&offre=S%C3%A9ance++d%27%C3%A9t%C3%A9")).toMatchObject({
      firstName: "Hélène",
      productName: "Séance d'été",
      productRef: "offre:séance d'été",
    });
  });

  it("takes the same offer for the same name whatever its capitals and spaces", () => {
    expect(sendJson({ ...CAMILLE, offre: "  PROGRAMME   30 Jours " })?.productRef).toBe("offre:programme 30 jours");
  });

  it("keeps the first value of a field sent twice in a form", () => {
    expect(sendForm("email=camille%40example.com&prenom=Camille&prenom=Lea")?.firstName).toBe("Camille");
  });

  it("ignores the fields it does not know", () => {
    expect(sendJson({ ...CAMILLE, statut: "payé", produit: { id: 3 } })).toMatchObject({ productName: "Programme 30 jours" });
  });
});

describe("universalConnector.normalize, the amount", () => {
  it.each([
    ["97", 9700],
    [97, 9700],
    [97.5, 9750],
    ["97,50", 9750],
    ["97.5", 9750],
    ["0", 0],
    ["1 234,56", 123456],
    ["1 234,56", 123456],
    ["1.234,56", 123456],
    ["1,234.56", 123456],
    ["1,234", 123400],
    ["97 €", 9700],
  ])("reads %j as %i cents", (montant, amountCents) => {
    expect(sendJson({ ...CAMILLE, montant })?.productPrice).toEqual({ amountCents, currency: "EUR" });
  });

  it.each(["gratuit", "-97", "97,5,0", "1.234.56", "99999999999"])("leaves %j without a price", (montant) => {
    expect(sendJson({ ...CAMILLE, montant })?.productPrice).toBeNull();
  });

  it("reads the currency, in capitals or as a symbol, and EUR without one", () => {
    expect(sendJson({ ...CAMILLE, montant: "50", devise: "chf" })?.productPrice).toEqual({ amountCents: 5000, currency: "CHF" });
    expect(sendJson({ ...CAMILLE, montant: "50", devise: "$" })?.productPrice).toEqual({ amountCents: 5000, currency: "USD" });
    expect(sendJson({ ...CAMILLE, montant: "50", devise: "euros" })?.productPrice).toBeNull();
  });
});

describe("universalConnector.normalize, the date", () => {
  it.each([
    ["2026-10-01", "2026-10-01T12:00:00Z"],
    ["2026-10-01T09:30:00Z", "2026-10-01T09:30:00Z"],
    ["2026-10-01T09:30:00+02:00", "2026-10-01T07:30:00Z"],
    ["2026-10-01T09:30:00+0200", "2026-10-01T07:30:00Z"],
    ["2026-10-01 09:30", "2026-10-01T09:30:00Z"],
    ["2026-10-01T09:30:00.123456Z", "2026-10-01T09:30:00.123Z"],
    ["01/10/2026", "2026-10-01T12:00:00Z"],
    ["1.10.2026", "2026-10-01T12:00:00Z"],
    ["Oct 1, 2026", "2026-10-01T12:00:00Z"],
    ["October 1 2026", "2026-10-01T12:00:00Z"],
    ["1790847000", "2026-10-01T09:30:00Z"],
    ["1790847000000", "2026-10-01T09:30:00Z"],
  ])("reads %j", (date, occurredAt) => {
    expect(sendJson({ ...CAMILLE, date })?.occurredAt).toEqual(new Date(occurredAt));
  });

  it.each(["hier", "2026-02-30", "31/02/2026", "Foo 1, 2026", "10/13/2026"])(
    "takes the moment of reception for %j, a date it cannot read",
    (date) => {
      expect(sendJson({ ...CAMILLE, date })?.occurredAt).toEqual(RECEIVED);
    },
  );

  it("never dates a sale after its reception", () => {
    expect(sendJson({ ...CAMILLE, date: "2026-12-10" })?.occurredAt).toEqual(RECEIVED);
    expect(sendJson({ ...CAMILLE, date: "2026-10-12" }, new Date("2026-10-12T08:00:00Z"))?.occurredAt).toEqual(
      new Date("2026-10-12T08:00:00Z"),
    );
  });
});

describe("universalConnector.normalize, what it puts aside", () => {
  it.each([
    ["no e-mail address", { offre: "Programme 30 jours" }],
    ["an empty e-mail address", { email: " ", offre: "Programme 30 jours" }],
    ["an address that is not one", { email: "camille.example.com" }],
    ["an address as a number", { email: 42 }],
  ])("puts aside a sale with %s", (_, fields) => {
    expect(() => sendJson(fields)).toThrow(InvalidPayloadError);
  });

  it("puts aside a list of sales, a body that is not an object, and a multipart form", () => {
    expect(() => sendJson([CAMILLE] as unknown as Record<string, unknown>)).toThrow(InvalidPayloadError);
    expect(() => universalConnector.normalize(42, JSON_HEADERS, { receivedAt: RECEIVED })).toThrow(InvalidPayloadError);
    expect(() => universalConnector.normalize(null, JSON_HEADERS, { receivedAt: RECEIVED })).toThrow(InvalidPayloadError);
    const multipart = '--x\r\nContent-Disposition: form-data; name="email"\r\n\r\ncamille@example.com\r\n--x--';
    expect(() =>
      universalConnector.normalize(multipart, { "content-type": "multipart/form-data; boundary=x" }, { receivedAt: RECEIVED }),
    ).toThrow(InvalidPayloadError);
  });

  it("puts aside a JSON body cut short, kept as text by the engine", () => {
    expect(() => universalConnector.normalize('{"email":"camille@exa', JSON_HEADERS, { receivedAt: RECEIVED })).toThrow(
      InvalidPayloadError,
    );
  });
});
