import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { type Mock, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { referrals, spaces, stripeEvents, subscriptions } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { buildEvent, buildInvoice, buildSubscription } from "@/lib/billing/stripe-fixtures";
import { processStripeEvent, recordStripeEvent } from "@/lib/billing/stripe-events";
import { readReferralOverview } from "./read-referral-overview";
import { REFERRAL_CREDIT_DESCRIPTION, endReferralMonths, rewardReferrer } from "./reward-referrer";

vi.mock("@/lib/email/send-email", () => ({ sendAccountEmail: vi.fn() }));

const NOW = new Date("2026-10-12T10:00:00Z");
const ONE_MONTH_LATER = new Date("2026-11-12T10:00:00Z");

let database: Database;
let referrerId: string;
let refereeId: string;
let createBalanceTransaction: Mock;
let stripe: Pick<Stripe, "customers">;

const readReferrer = async () => {
  const [space] = await database.select().from(spaces).where(eq(spaces.id, referrerId));
  return space;
};

const addReferee = async (slug: string) => {
  const spaceId = await insertTestSpace(database, await insertTestUser(database, `${slug}@exemple.fr`), slug);
  await database.insert(referrals).values({ referrerSpaceId: referrerId, refereeSpaceId: spaceId, createdAt: NOW });
  return spaceId;
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  referrerId = await insertTestSpace(database, await insertTestUser(database, "julie@exemple.fr"), "julie-nutrition");
  refereeId = await addReferee("atelier-sophie");
  createBalanceTransaction = vi.fn().mockResolvedValue({ id: "cbtxn_test" });
  stripe = { customers: { createBalanceTransaction } } as unknown as Pick<Stripe, "customers">;
});

describe("rewardReferrer", () => {
  it("gives a referrer on the free plan a month of Essentiel, once", async () => {
    expect(await rewardReferrer(database, stripe, { refereeSpaceId: refereeId, invoiceId: "in_1", now: NOW })).toEqual({
      status: "rewarded",
      referrerSpaceId: referrerId,
      reward: "free-month",
    });
    expect(await readReferrer()).toMatchObject({ plan: "essentiel", referralEssentielUntil: ONE_MONTH_LATER });

    // The referee's next payments earn nothing more.
    expect(await rewardReferrer(database, stripe, { refereeSpaceId: refereeId, invoiceId: "in_2", now: NOW })).toEqual({
      status: "nothing-to-reward",
    });
    expect(createBalanceTransaction).not.toHaveBeenCalled();
    expect(await database.select().from(referrals)).toEqual([
      expect.objectContaining({ rewardedAt: NOW, reward: "free-month", rewardInvoiceId: "in_1" }),
    ]);
  });

  it("adds a month after the months already offered, one per paying referee", async () => {
    const secondRefereeId = await addReferee("coaching-karim");
    await rewardReferrer(database, stripe, { refereeSpaceId: refereeId, invoiceId: "in_1", now: NOW });
    await rewardReferrer(database, stripe, { refereeSpaceId: secondRefereeId, invoiceId: "in_2", now: NOW });

    expect((await readReferrer()).referralEssentielUntil).toEqual(new Date("2026-12-12T10:00:00Z"));
  });

  it("takes a month of Essentiel, at the referrer's price, off the next payments of a subscribed referrer", async () => {
    await database.insert(subscriptions).values({
      id: "sub_julie",
      spaceId: referrerId,
      status: "active",
      plan: "pro",
      period: "monthly",
      priceList: "founder",
      amountCents: 1999,
    });
    await database
      .update(spaces)
      .set({ plan: "pro", stripeCustomerId: "cus_julie", stripeSubscriptionId: "sub_julie" })
      .where(eq(spaces.id, referrerId));

    const outcome = await rewardReferrer(database, stripe, { refereeSpaceId: refereeId, invoiceId: "in_1", now: NOW });

    expect(outcome).toMatchObject({ reward: "credit" });
    expect(createBalanceTransaction).toHaveBeenCalledWith(
      "cus_julie",
      expect.objectContaining({ amount: -999, currency: "eur", description: REFERRAL_CREDIT_DESCRIPTION }),
      { idempotencyKey: expect.stringMatching(/^referral-reward-/) },
    );
    expect((await readReferrer()).plan).toBe("pro");
  });

  it("releases the referral when Stripe does not answer, for the replay of the event to give the month", async () => {
    await database
      .update(spaces)
      .set({ plan: "essentiel", stripeCustomerId: "cus_julie", stripeSubscriptionId: "sub_julie" })
      .where(eq(spaces.id, referrerId));
    createBalanceTransaction.mockRejectedValueOnce(new Error("Stripe is down"));

    await expect(
      rewardReferrer(database, stripe, { refereeSpaceId: refereeId, invoiceId: "in_1", now: NOW }),
    ).rejects.toThrow("Stripe is down");
    expect(await database.select({ rewardedAt: referrals.rewardedAt }).from(referrals)).toEqual([{ rewardedAt: null }]);

    expect(await rewardReferrer(database, stripe, { refereeSpaceId: refereeId, invoiceId: "in_1", now: NOW })).toMatchObject({
      reward: "credit",
    });
    expect(createBalanceTransaction.mock.calls[0][2]).toEqual(createBalanceTransaction.mock.calls[1][2]);
  });

  it("gives nothing for a space nobody referred", async () => {
    expect(await rewardReferrer(database, stripe, { refereeSpaceId: referrerId, invoiceId: "in_1", now: NOW })).toEqual({
      status: "nothing-to-reward",
    });
  });
});

describe("a referee's first payment, from the Stripe event", () => {
  it("rewards the referrer when the referee's invoice is paid with money, never for a free invoice", async () => {
    const fakeStripe = {
      subscriptions: { retrieve: vi.fn().mockResolvedValue(buildSubscription({ spaceId: refereeId })) },
      customers: { createBalanceTransaction },
    } as unknown as Stripe;
    const free = buildEvent("invoice.paid", buildInvoice({ id: "in_free", spaceId: refereeId, amountPaid: 0 }), "evt_free");
    await recordStripeEvent(database, free);
    await processStripeEvent(database, fakeStripe, free.id, NOW);
    expect((await readReferrer()).plan).toBe("free");

    const paid = buildEvent("invoice.paid", buildInvoice({ id: "in_paid", spaceId: refereeId, amountPaid: 999 }), "evt_paid");
    await recordStripeEvent(database, paid);
    await processStripeEvent(database, fakeStripe, paid.id, NOW);

    expect(await readReferrer()).toMatchObject({ plan: "essentiel", referralEssentielUntil: ONE_MONTH_LATER });
    expect(await database.select({ processedAt: stripeEvents.processedAt }).from(stripeEvents)).toEqual([
      { processedAt: NOW },
      { processedAt: NOW },
    ]);
  });
});

describe("endReferralMonths", () => {
  it("brings the space back to the free plan when its months end, nothing deleted", async () => {
    await rewardReferrer(database, stripe, { refereeSpaceId: refereeId, invoiceId: "in_1", now: NOW });

    expect(await endReferralMonths(database, new Date("2026-11-12T09:59:00Z"))).toBe(0);
    expect(await endReferralMonths(database, ONE_MONTH_LATER)).toBe(1);

    expect(await readReferrer()).toMatchObject({ plan: "free", freeSince: ONE_MONTH_LATER, referralEssentielUntil: null });
  });

  it("leaves a space that subscribed meanwhile on the plan of its subscription", async () => {
    await rewardReferrer(database, stripe, { refereeSpaceId: refereeId, invoiceId: "in_1", now: NOW });
    await database.update(spaces).set({ plan: "pro", stripeSubscriptionId: "sub_julie" }).where(eq(spaces.id, referrerId));

    expect(await endReferralMonths(database, ONE_MONTH_LATER)).toBe(0);
    expect(await readReferrer()).toMatchObject({ plan: "pro", referralEssentielUntil: null });
  });
});

describe("readReferralOverview", () => {
  it("lists the referees with their status, and counts the months offered, a deleted referee's included", async () => {
    const secondRefereeId = await addReferee("coaching-karim");
    await database.update(spaces).set({ stripeSubscriptionId: "sub_sophie" }).where(eq(spaces.id, refereeId));
    await rewardReferrer(database, stripe, { refereeSpaceId: refereeId, invoiceId: "in_1", now: NOW });
    const thirdRefereeId = await addReferee("ancien-espace");
    await rewardReferrer(database, stripe, { refereeSpaceId: thirdRefereeId, invoiceId: "in_3", now: NOW });
    await database.delete(spaces).where(eq(spaces.id, thirdRefereeId));

    const overview = await readReferralOverview(database, referrerId);

    expect(overview).toMatchObject({ signedUp: 2, subscribed: 1, monthsOffered: 2 });
    expect(overview.referrals.map((row) => [row.spaceName, row.isSubscribed, row.rewardedAt])).toEqual(
      expect.arrayContaining([
        ["Espace atelier-sophie", true, NOW],
        ["Espace coaching-karim", false, null],
      ]),
    );
    expect(secondRefereeId).toBeDefined();
  });
});
