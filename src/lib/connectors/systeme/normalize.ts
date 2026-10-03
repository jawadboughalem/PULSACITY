import { z } from "zod";
import { InvalidPayloadError } from "../invalid-payload-error";
import type { NormalizedPurchase, WebhookHeaders } from "../types";

/**
 * The two formats captured on September 27, 2026 (docs-internes/connectors/systeme.md): « Nouvelle vente » from the
 * webhooks of the settings, and « Inscrit à la formation » from an automation rule. Nothing else is read.
 */
export const SALE_NEW = "SALE_NEW";
export const COURSE_ENROLLED = "contact.course.enrolled";

export const EVENT_HEADER = "x-webhook-event";

const identifierSchema = z.union([z.number(), z.string().min(1)]);

const fieldsSchema = z.record(z.string(), z.unknown()).nullish();

const saleSchema = z.object({
  customer: z.object({ email: z.string(), fields: fieldsSchema }),
  order: z.object({ createdAt: z.string() }),
  orderItem: z.object({ id: identifierSchema }),
  pricePlan: z.object({
    id: identifierSchema,
    name: z.string(),
    amount: z.number().int().nullish(),
    currency: z.string().nullish(),
  }),
});

const enrollmentSchema = z.object({
  type: z.literal(COURSE_ENROLLED),
  data: z.object({
    course: z.object({ id: identifierSchema, name: z.string() }),
    contact: z.object({ id: identifierSchema, email: z.string(), fields: fieldsSchema }),
  }),
  created_at: z.string(),
});

const readText = (value: unknown): string | null => (typeof value === "string" && value.trim() ? value.trim() : null);

const readEmail = (value: string): string => {
  const email = value.trim().toLowerCase();
  // Systeme.io accepts accented addresses: so does PULSACITY.
  if (!z.email({ pattern: z.regexes.unicodeEmail }).safeParse(email).success) {
    throw new InvalidPayloadError("The e-mail address is not valid.");
  }
  return email;
};

const readDate = (value: string): Date => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new InvalidPayloadError(`The date « ${value} » is not valid.`);
  return date;
};

const readName = (value: string): string => {
  const name = readText(value);
  if (!name) throw new InvalidPayloadError("The product has no name.");
  return name;
};

const readPrice = (amount: number | null | undefined, currency: string | null | undefined) => {
  const code = readText(currency);
  return typeof amount === "number" && code ? { amountCents: amount, currency: code.toUpperCase() } : null;
};

const parse = <T>(schema: z.ZodType<T>, payload: unknown, eventType: string): T => {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new InvalidPayloadError(`Unexpected ${eventType} payload: ${z.prettifyError(parsed.error)}`);
  return parsed.data;
};

/** A sale is the price plan bought: a course sold with two price plans arrives as two products to associate. */
const normalizeSale = (payload: unknown): NormalizedPurchase => {
  const sale = parse(saleSchema, payload, SALE_NEW);
  return {
    eventType: "sale",
    externalRef: `order-item:${sale.orderItem.id}`,
    email: readEmail(sale.customer.email),
    firstName: readText(sale.customer.fields?.first_name),
    lastName: readText(sale.customer.fields?.surname),
    productRef: `price-plan:${sale.pricePlan.id}`,
    productName: readName(sale.pricePlan.name),
    productPrice: readPrice(sale.pricePlan.amount, sale.pricePlan.currency),
    occurredAt: readDate(sale.order.createdAt),
  };
};

const normalizeEnrollment = (payload: unknown): NormalizedPurchase => {
  const { data, created_at: createdAt } = parse(enrollmentSchema, payload, COURSE_ENROLLED);
  return {
    eventType: "enrollment",
    // Enrolled twice in the same course: the same enrollment.
    externalRef: `enrollment:${data.contact.id}:${data.course.id}`,
    email: readEmail(data.contact.email),
    firstName: readText(data.contact.fields?.first_name),
    lastName: readText(data.contact.fields?.surname),
    productRef: `course:${data.course.id}`,
    productName: readName(data.course.name),
    productPrice: null,
    occurredAt: readDate(createdAt),
  };
};

export const readSystemeEventType = (payload: unknown, headers: WebhookHeaders): string | null => {
  const header = readText(headers[EVENT_HEADER]);
  if (header) return header;
  if (typeof payload === "object" && payload !== null && "type" in payload) return readText(payload.type);
  return null;
};

/** Every other event, « Vente annulée » included (no capture yet), is kept as received and not read. */
export const normalizeSystemeEvent = (payload: unknown, headers: WebhookHeaders): NormalizedPurchase | null => {
  const eventType = readSystemeEventType(payload, headers);
  if (eventType === SALE_NEW && headers[EVENT_HEADER] !== undefined) return normalizeSale(payload);
  if (eventType === COURSE_ENROLLED && headers[EVENT_HEADER] === undefined) return normalizeEnrollment(payload);
  return null;
};
