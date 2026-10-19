import { eq } from "drizzle-orm";
import { render } from "react-email";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { customers, products, spaces, testimonialCorrections, testimonials } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { insertTestTestimonial } from "@/db/testimonial-fixtures";
import type { CustomerEmail } from "@/lib/email/send-email";
import { answerCorrection, cancelCorrection, findCorrection, proposeCorrection } from "./manage-corrections";

vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const NOW = new Date("2026-10-19T09:00:00Z");
const ORIGINAL = "En 30 jours j'ai arrêté de grignoter le soir.";
const CORRECTED = "En 30 jours, j'ai arrêté de grignoter le soir.";

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

const insertAnsweredTestimonial = async (customer: Partial<typeof customers.$inferInsert> = {}) => {
  customerCount += 1;
  const [{ id: customerId }] = await database
    .insert(customers)
    .values({ spaceId, email: `camille-${customerCount}@exemple.fr`, firstName: "Camille", ...customer })
    .returning({ id: customers.id });
  return insertTestTestimonial(database, {
    spaceId,
    productId,
    customerId,
    body: ORIGINAL,
    source: "form",
    provenance: "request",
    status: "approved",
    consentAt: NOW,
    consentText: "J'accepte que ce témoignage soit publié.",
  });
};

const findTestimonial = async (id: string) => {
  const [testimonial] = await database.select().from(testimonials).where(eq(testimonials.id, id));
  return testimonial;
};

const findCorrections = (testimonialId: string) =>
  database.select().from(testimonialCorrections).where(eq(testimonialCorrections.testimonialId, testimonialId));

/** The token of the e-mail's link, as the author receives it. */
const readSentToken = async (email: CustomerEmail) => {
  const html = await render(email.body);
  const match = html.match(/\/t\/julie-nutrition\/correction\?c=([\w-]+)/);
  if (!match) throw new Error("No answer link in the e-mail.");
  return match[1];
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

describe("proposeCorrection", () => {
  it("sends the correction to the author and changes nothing displayed until they answer", async () => {
    const id = await insertAnsweredTestimonial();

    expect(await proposeCorrection(database, userId, id, CORRECTED, { now: NOW, send })).toEqual({ status: "sent" });

    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      to: expect.stringMatching(/^camille-\d+@exemple\.fr$/),
      subject: "Camille, puis-je corriger votre avis\u00a0?",
      spaceName: "Julie Nutrition",
      replyTo: "julie@exemple.fr",
    });
    const [correction] = await findCorrections(id);
    expect(correction).toMatchObject({ fromBody: ORIGINAL, body: CORRECTED, sentAt: NOW, outcome: null });
    expect(await readSentToken(sent[0])).toBe(correction.token);
    expect(await findTestimonial(id)).toMatchObject({ body: ORIGINAL, displayBody: null });
  });

  it("cannot reach an author without an address, nor one who unsubscribed", async () => {
    const added = await insertTestTestimonial(database, { spaceId, provenance: "added", body: ORIGINAL });
    const unsubscribed = await insertAnsweredTestimonial({ unsubscribedAt: NOW });

    expect(await proposeCorrection(database, userId, added, CORRECTED, { now: NOW, send })).toEqual({
      status: "unreachable",
      reach: "no-address",
    });
    expect(await proposeCorrection(database, userId, unsubscribed, CORRECTED, { now: NOW, send })).toEqual({
      status: "unreachable",
      reach: "unsubscribed",
    });
    expect(sent).toEqual([]);
    expect(await findCorrections(added)).toEqual([]);
  });

  it("refuses a text identical to the one displayed", async () => {
    const id = await insertAnsweredTestimonial();

    expect(await proposeCorrection(database, userId, id, `  ${ORIGINAL}\r\n`, { now: NOW, send })).toEqual({
      status: "unchanged",
    });
    expect(sent).toEqual([]);
  });

  it("keeps one correction waiting at a time, and two at most for a testimonial", async () => {
    const id = await insertAnsweredTestimonial();
    await proposeCorrection(database, userId, id, CORRECTED, { now: NOW, send });

    expect(await proposeCorrection(database, userId, id, `${CORRECTED} Merci.`, { now: NOW, send })).toEqual({
      status: "already-waiting",
    });

    await answerCorrection(database, "julie-nutrition", (await findCorrections(id))[0].token, "keep", NOW);
    expect(await proposeCorrection(database, userId, id, `${CORRECTED} Merci.`, { now: NOW, send })).toEqual({
      status: "sent",
    });
    await cancelCorrection(database, userId, id);
    expect(await proposeCorrection(database, userId, id, `${CORRECTED} Merci Julie.`, { now: NOW, send })).toEqual({
      status: "too-many",
    });
    expect(sent).toHaveLength(2);
  });

  it("forgets the correction when the e-mail does not leave", async () => {
    const id = await insertAnsweredTestimonial();

    expect(await proposeCorrection(database, userId, id, CORRECTED, { now: NOW, send: failing })).toEqual({
      status: "not-sent",
    });
    expect(await findCorrections(id)).toEqual([]);
  });

  it("refuses to correct the testimonial of another creator", async () => {
    const id = await insertAnsweredTestimonial();

    expect(await proposeCorrection(database, otherUserId, id, CORRECTED, { now: NOW, send })).toEqual({
      status: "testimonial-not-found",
    });
    expect(await cancelCorrection(database, otherUserId, id)).toEqual({ status: "testimonial-not-found" });
  });
});

describe("answerCorrection", () => {
  const proposeAndReadToken = async (id: string) => {
    await proposeCorrection(database, userId, id, CORRECTED, { now: NOW, send });
    return readSentToken(sent.at(-1) as CustomerEmail);
  };

  it("accepted, shows the corrected text and keeps the original as written", async () => {
    const id = await insertAnsweredTestimonial();
    const token = await proposeAndReadToken(id);

    expect(await findCorrection(database, "julie-nutrition", token)).toMatchObject({
      status: "waiting",
      fromBody: ORIGINAL,
      body: CORRECTED,
      space: { name: "Julie Nutrition", replyToEmail: "julie@exemple.fr" },
    });
    expect(await answerCorrection(database, "julie-nutrition", token, "accept", NOW)).toMatchObject({
      status: "answered",
      outcome: "accepted",
    });

    expect(await findTestimonial(id)).toMatchObject({ body: ORIGINAL, displayBody: CORRECTED, displayEditedAt: NOW });
    expect((await findCorrections(id))[0]).toMatchObject({ outcome: "accepted", answeredAt: NOW });
  });

  it("refused, changes nothing on the creator's pages", async () => {
    const id = await insertAnsweredTestimonial();
    const token = await proposeAndReadToken(id);

    expect(await answerCorrection(database, "julie-nutrition", token, "keep", NOW)).toMatchObject({
      status: "answered",
      outcome: "refused",
    });

    expect(await findTestimonial(id)).toMatchObject({ body: ORIGINAL, displayBody: null });
  });

  it("takes the first answer only: a second one says what was answered", async () => {
    const id = await insertAnsweredTestimonial();
    const token = await proposeAndReadToken(id);
    await answerCorrection(database, "julie-nutrition", token, "keep", NOW);

    expect(await answerCorrection(database, "julie-nutrition", token, "accept", NOW)).toMatchObject({
      status: "answered",
      outcome: "refused",
    });
    expect(await findTestimonial(id)).toMatchObject({ displayBody: null });
  });

  it("withdrawn by the creator, accepts nothing", async () => {
    const id = await insertAnsweredTestimonial();
    const token = await proposeAndReadToken(id);

    expect(await cancelCorrection(database, userId, id)).toEqual({ status: "cancelled" });
    expect(await cancelCorrection(database, userId, id)).toEqual({ status: "not-waiting" });

    expect(await answerCorrection(database, "julie-nutrition", token, "accept", NOW)).toMatchObject({
      status: "withdrawn",
    });
    expect(await findTestimonial(id)).toMatchObject({ displayBody: null });
  });

  it("knows no token of another space, nor an unknown one", async () => {
    const id = await insertAnsweredTestimonial();
    const token = await proposeAndReadToken(id);

    expect(await findCorrection(database, "marc-coaching", token)).toEqual({ status: "not-found" });
    expect(await answerCorrection(database, "julie-nutrition", "inconnu", "accept", NOW)).toEqual({
      status: "not-found",
    });
  });
});
