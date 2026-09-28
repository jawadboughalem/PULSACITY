import { eq } from "drizzle-orm";
import { type Mock, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { spaces, testimonials } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { EmailNotSentError } from "@/lib/email/email-not-sent-error";
import { notifyCreatorOfTestimonial } from "@/lib/testimonials/notify-creator-of-testimonial";
import type { TestimonialFormInput } from "@/lib/testimonials/testimonial-form-schema";
import { TESTIMONIALS_PER_IP } from "@/lib/testimonials/testimonial-rate-limits";
import { submitTestimonialForm } from "./submit-testimonial-form";

type TestContext = {
  database: Database | null;
  scheduled: Array<() => Promise<void>>;
  after: Mock;
};

const testContext = vi.hoisted(
  (): TestContext => ({ database: null, scheduled: [], after: vi.fn() }),
);

vi.mock("@/db", () => ({ getDb: () => testContext.database }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "198.51.100.23" }) }));
vi.mock("next/server", () => ({ after: testContext.after }));
vi.mock("@/lib/testimonials/notify-creator-of-testimonial", () => ({ notifyCreatorOfTestimonial: vi.fn() }));

const CAMILLE: TestimonialFormInput = {
  spaceSlug: "julie-nutrition",
  productSlug: null,
  requestToken: null,
  rating: 5,
  body: "En 30 jours j'ai arrêté de grignoter le soir.",
  authorName: "Camille R.",
  authorTitle: "",
  photoKey: null,
  hasConsented: true,
  pulsacity_check: "",
};

const countTestimonials = async () => {
  if (!testContext.database) return 0;
  return (await testContext.database.select().from(testimonials)).length;
};

const runScheduledWork = async () => {
  for (const work of testContext.scheduled) await work();
};

beforeAll(async () => {
  testContext.database = await createTestDatabase();
});

beforeEach(async () => {
  if (!testContext.database) return;
  await emptyTestDatabase(testContext.database);
  const spaceId = await insertTestSpace(
    testContext.database,
    await insertTestUser(testContext.database, "julie@exemple.fr"),
    "julie-nutrition",
  );
  await testContext.database.update(spaces).set({ name: "Julie Nutrition" }).where(eq(spaces.id, spaceId));
  testContext.scheduled = [];
  testContext.after.mockReset();
  testContext.after.mockImplementation((work: () => Promise<void>) => testContext.scheduled.push(work));
  vi.mocked(notifyCreatorOfTestimonial).mockReset();
  vi.stubEnv("BETTER_AUTH_SECRET", "a-test-secret-of-at-least-32-characters");
});

describe("submitTestimonialForm", () => {
  it("stores the testimonial, then tells the creator once the client has their answer", async () => {
    expect(await submitTestimonialForm(CAMILLE)).toEqual({ ok: true, data: null });
    expect(await countTestimonials()).toBe(1);
    expect(notifyCreatorOfTestimonial).not.toHaveBeenCalled();

    await runScheduledWork();

    expect(notifyCreatorOfTestimonial).toHaveBeenCalledWith(
      expect.objectContaining({ creatorEmail: "julie@exemple.fr", authorName: "Camille R.", rating: 5 }),
    );
  });

  it("keeps the testimonial even when the notification cannot leave", async () => {
    vi.mocked(notifyCreatorOfTestimonial).mockRejectedValue(new EmailNotSentError("internal_server_error", "Resend is down"));

    expect(await submitTestimonialForm(CAMILLE)).toEqual({ ok: true, data: null });
    await expect(runScheduledWork()).resolves.toBeUndefined();
    expect(await countTestimonials()).toBe(1);
  });

  it("refuses a testimonial without consent", async () => {
    expect(await submitTestimonialForm({ ...CAMILLE, hasConsented: false })).toMatchObject({
      ok: false,
      error: "invalid-input",
      fieldErrors: { hasConsented: "missing" },
    });
    expect(await countTestimonials()).toBe(0);
  });

  it("answers a robot that filled the trap as if all went well, and stores nothing", async () => {
    expect(await submitTestimonialForm({ ...CAMILLE, pulsacity_check: "https://spam.example" })).toEqual({
      ok: true,
      data: null,
    });
    expect(await countTestimonials()).toBe(0);
    expect(testContext.after).not.toHaveBeenCalled();
  });

  it("slows down a single IP sending many testimonials", async () => {
    for (let attempt = 0; attempt < TESTIMONIALS_PER_IP.limit; attempt += 1) {
      await submitTestimonialForm(CAMILLE);
    }

    expect(await submitTestimonialForm(CAMILLE)).toEqual({ ok: false, error: "too-many-submissions" });
    expect(await countTestimonials()).toBe(TESTIMONIALS_PER_IP.limit);
  });
});
