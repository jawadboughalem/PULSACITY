import { eq } from "drizzle-orm";
import { render } from "react-email";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { customers, products, spaces, testimonials } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import type { CustomerEmail } from "@/lib/email/send-email";
import { hideTestimonial } from "./hide-testimonial";
import { sendHiddenReason, sendWaitingHiddenReasons } from "./send-hidden-reason";
import { setTestimonialStatus } from "./set-testimonial-status";

vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const NOW = new Date("2026-10-19T09:00:00Z");
const MINUTE_MS = 60 * 1000;

let database: Database;
let userId: string;
let otherUserId: string;
let spaceId: string;
let productId: string;
let sent: CustomerEmail[];

const send = async (email: CustomerEmail) => {
  sent.push(email);
};

const failing = async () => {
  throw new Error("Resend est indisponible.");
};

let customerCount = 0;

/** A review answering a request: its author's address is the one the sale brought. */
const insertAnsweredTestimonial = async (customer: Partial<typeof customers.$inferInsert> = {}) => {
  customerCount += 1;
  const [{ id: customerId }] = await database
    .insert(customers)
    .values({ spaceId, email: `nadia-${customerCount}@exemple.fr`, firstName: "Nadia", ...customer })
    .returning({ id: customers.id });
  return insertTestTestimonial(database, {
    spaceId,
    productId,
    customerId,
    authorName: "Nadia B.",
    source: "form",
    provenance: "request",
    status: "pending",
    consentAt: NOW,
    consentText: "J'accepte que ce témoignage soit publié.",
    createdAt: new Date("2026-10-15T08:00:00Z"),
  });
};

const findTestimonial = async (id: string) => {
  const [testimonial] = await database.select().from(testimonials).where(eq(testimonials.id, id));
  return testimonial;
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
  vi.stubEnv("BETTER_AUTH_SECRET", "un-secret-de-test-assez-long-pour-signer");
  await emptyTestDatabase(database);
  sent = [];
  userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  otherUserId = await insertTestUser(database, "marc@exemple.fr");
  await insertTestSpace(database, otherUserId, "marc-coaching");
  await database
    .update(spaces)
    .set({ name: "Julie Nutrition", replyToEmail: "julie@exemple.fr" })
    .where(eq(spaces.id, spaceId));
  const [product] = await database
    .insert(products)
    .values({ spaceId, name: "Programme 30 jours", slug: "programme-30-jours" })
    .returning({ id: products.id });
  productId = product.id;
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("hideTestimonial", () => {
  it("keeps the reason with the hidden testimonial, and the words of « Autre motif » only", async () => {
    const offTopic = await insertAnsweredTestimonial();
    const other = await insertAnsweredTestimonial();

    await hideTestimonial(database, userId, offTopic, { reason: "off-topic", detail: "Ignoré" }, NOW);
    await hideTestimonial(database, userId, other, { reason: "other", detail: "  Il parle d'un autre programme.  " }, NOW);

    expect(await findTestimonial(offTopic)).toMatchObject({
      status: "hidden",
      hiddenAt: NOW,
      hiddenReason: "off-topic",
      hiddenReasonDetail: null,
    });
    expect(await findTestimonial(other)).toMatchObject({
      hiddenReason: "other",
      hiddenReasonDetail: "Il parle d'un autre programme.",
    });
  });

  it("refuses to hide the testimonial of another creator", async () => {
    const id = await insertAnsweredTestimonial();

    expect(await hideTestimonial(database, otherUserId, id, { reason: "abusive", detail: null })).toEqual({
      status: "testimonial-not-found",
    });
    expect(await findTestimonial(id)).toMatchObject({ status: "pending", hiddenReason: null });
  });

  it("forgets the reason when the testimonial is shown again", async () => {
    const id = await insertAnsweredTestimonial();
    await hideTestimonial(database, userId, id, { reason: "other", detail: "Doublon." }, NOW);

    await setTestimonialStatus(database, userId, id, "approved");

    expect(await findTestimonial(id)).toMatchObject({
      status: "approved",
      hiddenAt: null,
      hiddenReason: null,
      hiddenReasonDetail: null,
    });
  });
});

describe("sendHiddenReason", () => {
  it("sends the reason to the author, in the creator's name, once", async () => {
    const id = await insertAnsweredTestimonial();
    await hideTestimonial(database, userId, id, { reason: "personal-data", detail: null }, NOW);

    expect(await sendHiddenReason(database, id, { now: NOW, send })).toBe("sent");
    expect(await sendHiddenReason(database, id, { now: NOW, send })).toBe("already-sent");

    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      to: expect.stringMatching(/^nadia-\d+@exemple\.fr$/),
      subject: "Nadia, votre avis n'est pas affiché",
      spaceName: "Julie Nutrition",
      replyTo: "julie@exemple.fr",
      idempotencyKey: `hidden-reason:${id}`,
      unsubscribeUrl: expect.stringContaining("https://pulsacity.com/api/unsubscribe"),
    });
    const html = await render(sent[0].body);
    expect(html).toContain("Il donne des informations personnelles");
    expect(html).toContain("https://pulsacity.com/a-propos-des-avis");
    expect(await findTestimonial(id)).toMatchObject({ hiddenReasonSentAt: NOW });
  });

  it("sends the words of « Autre motif » as the creator wrote them", async () => {
    const id = await insertAnsweredTestimonial();
    await hideTestimonial(database, userId, id, { reason: "other", detail: "Il parle d'un autre programme." }, NOW);

    await sendHiddenReason(database, id, { now: NOW, send });

    expect(await render(sent[0].body)).toContain("Il parle d&#x27;un autre programme.");
  });

  it("writes to no one without an address, nor to an author who unsubscribed", async () => {
    const added = await insertTestTestimonial(database, { spaceId, provenance: "added", status: "approved" });
    const unsubscribed = await insertAnsweredTestimonial({ unsubscribedAt: NOW });
    for (const id of [added, unsubscribed]) {
      await hideTestimonial(database, userId, id, { reason: "abusive", detail: null }, NOW);
    }

    expect(await sendHiddenReason(database, added, { now: NOW, send })).toBe("unreachable");
    expect(await sendHiddenReason(database, unsubscribed, { now: NOW, send })).toBe("unreachable");
    expect(sent).toEqual([]);
  });

  it("sends nothing for a testimonial shown, or hidden before reasons existed", async () => {
    const shown = await insertAnsweredTestimonial();
    const hiddenWithoutReason = await insertAnsweredTestimonial();
    await database.update(testimonials).set({ status: "hidden" }).where(eq(testimonials.id, hiddenWithoutReason));

    expect(await sendHiddenReason(database, shown, { now: NOW, send })).toBe("not-hidden");
    expect(await sendHiddenReason(database, hiddenWithoutReason, { now: NOW, send })).toBe("not-hidden");
    expect(sent).toEqual([]);
  });

  it("releases the testimonial when the e-mail does not leave, for the task to try again", async () => {
    const id = await insertAnsweredTestimonial();
    await hideTestimonial(database, userId, id, { reason: "abusive", detail: null }, NOW);

    expect(await sendHiddenReason(database, id, { now: NOW, send: failing })).toBe("failed");

    expect(await findTestimonial(id)).toMatchObject({ hiddenReasonSentAt: null });
  });
});

describe("sendWaitingHiddenReasons", () => {
  it("sends the reasons left unsent for ten minutes, never twice, never to an unsubscribed author", async () => {
    const failed = await insertAnsweredTestimonial();
    const justHidden = await insertAnsweredTestimonial();
    const unsubscribed = await insertAnsweredTestimonial({ unsubscribedAt: NOW });
    const alreadySent = await insertAnsweredTestimonial();
    const tenMinutesAgo = new Date(NOW.getTime() - 11 * MINUTE_MS);
    await hideTestimonial(database, userId, failed, { reason: "abusive", detail: null }, tenMinutesAgo);
    await hideTestimonial(database, userId, justHidden, { reason: "abusive", detail: null }, NOW);
    await hideTestimonial(database, userId, unsubscribed, { reason: "abusive", detail: null }, tenMinutesAgo);
    await hideTestimonial(database, userId, alreadySent, { reason: "abusive", detail: null }, tenMinutesAgo);
    await sendHiddenReason(database, alreadySent, { now: tenMinutesAgo, send });
    sent = [];

    expect(await sendWaitingHiddenReasons(database, { now: NOW, send })).toEqual({ hiddenReasonsSent: 1 });
    expect(sent.map((email) => email.idempotencyKey)).toEqual([`hidden-reason:${failed}`]);

    expect(await sendWaitingHiddenReasons(database, { now: NOW, send })).toEqual({ hiddenReasonsSent: 0 });
  });
});
