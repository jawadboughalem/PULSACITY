import { toParisIsoDay } from "@/lib/dates/paris-date";
import { InvalidPayloadError } from "../invalid-payload-error";
import { readCustomerEmail } from "../read-customer-email";
import type { NormalizedPurchase, WebhookHeaders, WebhookReceipt } from "../types";
import { UNIVERSAL_FIELDS, type UniversalField } from "./fields";

/**
 * The sales captured from Make, n8n and Zapier on October 12, 2026 (docs-internes/connectors/universel.md), as JSON or
 * as a form: amounts as numbers or as text, « 97,50 » with a comma, dates in ISO with or without an offset, or
 * « Oct 12, 2026 ». Every delivery is a sale: one that cannot be read is put aside, never taken for something else.
 */
type FieldName = UniversalField["name"];

type Fields = Partial<Record<FieldName, string>>;

/** The offer of a sale sent without one: all of them wait for the same association. */
export const NO_OFFER_REF = "sans-offre";
export const NO_OFFER_NAME = "Sans nom d'offre";

const FIELD_NAMES = new Set<string>(UNIVERSAL_FIELDS.map((field) => field.name));

const MAX_AMOUNT_CENTS = 1_000_000_000;

const DEFAULT_CURRENCY = "EUR";

const CURRENCY_SYMBOLS = new Map([
  ["€", "EUR"],
  ["$", "USD"],
  ["£", "GBP"],
]);

const ENGLISH_MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** « Prénom », « E-mail » or « REFERENCE »: the name of the field, however the tool spells it. */
const readFieldName = (key: string): string =>
  key
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

const readValue = (value: unknown): string | null => {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string") return null;
  const text = value.replace(/\s+/g, " ").trim();
  return text || null;
};

/** The first value given to each field; an empty one counts as absent. */
const collectFields = (entries: Iterable<[string, unknown]>): Fields => {
  const fields: Fields = {};
  for (const [key, value] of entries) {
    const name = readFieldName(key);
    const text = readValue(value);
    if (FIELD_NAMES.has(name) && text && !(name in fields)) fields[name as FieldName] = text;
  }
  return fields;
};

const readFields = (payload: unknown, headers: WebhookHeaders): Fields => {
  if (typeof payload === "string") {
    if ((headers["content-type"] ?? "").toLowerCase().includes("multipart/form-data")) {
      throw new InvalidPayloadError("A multipart body is not read: send JSON or a form.");
    }
    return collectFields(new URLSearchParams(payload.trim()));
  }
  if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
    return collectFields(Object.entries(payload));
  }
  throw new InvalidPayloadError("One sale per delivery, as an object of fields.");
};

/** « 97 », « 97,50 », « 97.5 », « 1 234,56 » or « 1,234.56 € »: never three decimals, which would be thousands. */
const readAmountCents = (text: string): number | null => {
  const compact = text.replace(/[\s€$£]/gu, "");
  const match = /^(\d+|\d{1,3}(?:([.,])\d{3})+)(?:([.,])(\d{1,2}))?$/.exec(compact);
  if (!match) return null;
  const [, integer, thousandsSeparator, decimalSeparator, decimals = ""] = match;
  if (thousandsSeparator && thousandsSeparator === decimalSeparator) return null;
  const cents = Number(integer.replace(/[.,]/g, "")) * 100 + Number(decimals.padEnd(2, "0"));
  return cents <= MAX_AMOUNT_CENTS ? cents : null;
};

const readCurrency = (text: string | undefined): string | null => {
  if (!text) return DEFAULT_CURRENCY;
  const code = CURRENCY_SYMBOLS.get(text) ?? text.toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : null;
};

/** The price is only shown to the creator: an amount it cannot read leaves the sale without a price. */
const readPrice = (fields: Fields): NormalizedPurchase["productPrice"] => {
  const amountCents = fields.montant ? readAmountCents(fields.montant) : null;
  const currency = readCurrency(fields.devise);
  return amountCents !== null && currency ? { amountCents, currency } : null;
};

/** A day without its time: midday, as for the requests typed by hand. Null for a day that does not exist. */
const readDay = (year: number, month: number, day: number): Date | null => {
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
};

const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_DATE_TIME = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2})?)(?:\.(\d+))?(Z|([+-]\d{2}):?(\d{2}))?$/i;
const FRENCH_DAY = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/;
const ENGLISH_DAY = /^([a-z]{3,9})\.? (\d{1,2}),? (\d{4})$/i;

/** ISO with or without its time (UTC without an offset), « 12/10/2026 » day first, « Oct 12, 2026 », or Unix time. */
const parseDate = (text: string): Date | null => {
  if (/^\d{10}$/.test(text)) return new Date(Number(text) * 1000);
  if (/^\d{13}$/.test(text)) return new Date(Number(text));
  const isoDay = ISO_DAY.exec(text);
  if (isoDay) return readDay(Number(isoDay[1]), Number(isoDay[2]), Number(isoDay[3]));
  const isoDateTime = ISO_DATE_TIME.exec(text);
  if (isoDateTime) {
    const [, day, time, fraction = "0", zone, offsetHours, offsetMinutes] = isoDateTime;
    const offset = zone && offsetHours ? `${offsetHours}:${offsetMinutes}` : "Z";
    const seconds = time.length === 5 ? ":00" : "";
    const date = new Date(`${day}T${time}${seconds}.${fraction.slice(0, 3).padEnd(3, "0")}${offset}`);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const frenchDay = FRENCH_DAY.exec(text);
  if (frenchDay) return readDay(Number(frenchDay[3]), Number(frenchDay[2]), Number(frenchDay[1]));
  const englishDay = ENGLISH_DAY.exec(text);
  const month = englishDay ? ENGLISH_MONTHS.indexOf(englishDay[1].slice(0, 3).toLowerCase()) + 1 : 0;
  if (englishDay && month > 0) return readDay(Number(englishDay[3]), month, Number(englishDay[2]));
  return null;
};

/** Without a date, or with one it cannot read: the moment of reception. Never later: a sale is told after it happens. */
const readOccurredAt = (text: string | undefined, receivedAt: Date): Date => {
  const date = text ? parseDate(text) : null;
  return date && date.getTime() < receivedAt.getTime() ? date : receivedAt;
};

/** The same offer, whatever its capitals and spaces. */
const readOfferKey = (name: string): string => name.normalize("NFC").toLocaleLowerCase("fr");

/**
 * The sale as the tool identifies it. Without a reference, the same customer and the same offer on the same day in
 * Paris are the same sale: a tool that sends it again, after a timeout, creates nothing.
 */
const readExternalRef = (fields: Fields, email: string, productRef: string, occurredAt: Date): string =>
  fields.reference ? `reference:${fields.reference}` : `same-day:${email}:${productRef}:${toParisIsoDay(occurredAt)}`;

export const normalizeUniversalSale = (
  payload: unknown,
  headers: WebhookHeaders,
  { receivedAt }: WebhookReceipt,
): NormalizedPurchase => {
  const fields = readFields(payload, headers);
  if (!fields.email) throw new InvalidPayloadError("The sale has no e-mail address.");
  const email = readCustomerEmail(fields.email);
  const productRef = fields.offre ? `offre:${readOfferKey(fields.offre)}` : NO_OFFER_REF;
  const occurredAt = readOccurredAt(fields.date, receivedAt);
  return {
    eventType: "sale",
    externalRef: readExternalRef(fields, email, productRef, occurredAt),
    email,
    firstName: fields.prenom ?? null,
    lastName: fields.nom ?? null,
    productRef,
    productName: fields.offre ?? NO_OFFER_NAME,
    productPrice: readPrice(fields),
    occurredAt,
  };
};
