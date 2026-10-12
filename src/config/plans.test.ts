import { describe, expect, it } from "vitest";
import {
  FOUNDER_PRICE_SEATS,
  PLANS,
  UNLIMITED,
  canAddTestimonial,
  canCreateWidget,
  canHideBadge,
  canRequestManually,
  canSendRequest,
  countTestimonialsLeft,
  readOpenPriceList,
  readPlanPrices,
} from "./plans";

const free = { plan: "free" } as const;
const essentiel = { plan: "essentiel" } as const;
const pro = { plan: "pro" } as const;

describe("PLANS", () => {
  it("matches the plan table of CLAUDE.md", () => {
    expect(PLANS).toEqual({
      free: {
        id: "free",
        name: "Gratuit",
        priceCents: { monthly: 0, yearly: 0 },
        founderPriceCents: { monthly: 0, yearly: 0 },
        limits: { testimonials: 15, monthlyRequests: 20, widgets: 1, manualRequestsPerDay: 20 },
        badgeRemovable: false,
      },
      essentiel: {
        id: "essentiel",
        name: "Essentiel",
        priceCents: { monthly: 1499, yearly: 14900 },
        founderPriceCents: { monthly: 999, yearly: 9900 },
        limits: { testimonials: UNLIMITED, monthlyRequests: UNLIMITED, widgets: UNLIMITED, manualRequestsPerDay: 20 },
        badgeRemovable: false,
      },
      pro: {
        id: "pro",
        name: "Pro",
        priceCents: { monthly: 2499, yearly: 24900 },
        founderPriceCents: { monthly: 1999, yearly: 19900 },
        limits: { testimonials: UNLIMITED, monthlyRequests: UNLIMITED, widgets: UNLIMITED, manualRequestsPerDay: 20 },
        badgeRemovable: true,
      },
    });
  });
});

describe("readOpenPriceList", () => {
  it("keeps the founder price open for the first 100 paying subscribers, then shows the public prices", () => {
    expect(FOUNDER_PRICE_SEATS).toBe(100);
    expect(readOpenPriceList(0)).toBe("founder");
    expect(readOpenPriceList(99)).toBe("founder");
    expect(readOpenPriceList(100)).toBe("public");
    expect(readOpenPriceList(250)).toBe("public");
  });
});

describe("readPlanPrices", () => {
  it("reads the founder prices or the public ones of decisions/tarifs.md", () => {
    expect(readPlanPrices(PLANS.essentiel, "founder")).toEqual({ monthly: 999, yearly: 9900 });
    expect(readPlanPrices(PLANS.essentiel, "public")).toEqual({ monthly: 1499, yearly: 14900 });
    expect(readPlanPrices(PLANS.pro, "founder")).toEqual({ monthly: 1999, yearly: 19900 });
    expect(readPlanPrices(PLANS.pro, "public")).toEqual({ monthly: 2499, yearly: 24900 });
  });

  it("leaves the free plan free in both", () => {
    expect(readPlanPrices(PLANS.free, "founder")).toEqual({ monthly: 0, yearly: 0 });
    expect(readPlanPrices(PLANS.free, "public")).toEqual({ monthly: 0, yearly: 0 });
  });

  it("makes the year cost ten months, rounded down to the euro, in both", () => {
    for (const plan of [PLANS.essentiel, PLANS.pro]) {
      for (const priceList of ["founder", "public"] as const) {
        const prices = readPlanPrices(plan, priceList);
        expect(prices.yearly).toBe(Math.floor((prices.monthly * 10) / 100) * 100);
      }
    }
  });
});

describe("canAddTestimonial", () => {
  it("lets the free plan hold 15 testimonials, not 16", () => {
    expect(canAddTestimonial(free, 0)).toBe(true);
    expect(canAddTestimonial(free, 14)).toBe(true);
    expect(canAddTestimonial(free, 15)).toBe(false);
    expect(canAddTestimonial(free, 40)).toBe(false);
  });

  it("never blocks the paid plans", () => {
    expect(canAddTestimonial(essentiel, 10_000)).toBe(true);
    expect(canAddTestimonial(pro, 10_000)).toBe(true);
  });
});

describe("countTestimonialsLeft", () => {
  it("counts what the free plan can still hold, never below zero", () => {
    expect(countTestimonialsLeft(free, 0)).toBe(15);
    expect(countTestimonialsLeft(free, 12)).toBe(3);
    expect(countTestimonialsLeft(free, 15)).toBe(0);
    expect(countTestimonialsLeft(free, 40)).toBe(0);
  });

  it("has no bound on the paid plans", () => {
    expect(countTestimonialsLeft(essentiel, 10_000)).toBe(UNLIMITED);
    expect(countTestimonialsLeft(pro, 10_000)).toBe(UNLIMITED);
  });
});

describe("canSendRequest", () => {
  it("lets the free plan send 20 requests a month, not 21", () => {
    expect(canSendRequest(free, 0)).toBe(true);
    expect(canSendRequest(free, 19)).toBe(true);
    expect(canSendRequest(free, 20)).toBe(false);
  });

  it("never blocks the paid plans", () => {
    expect(canSendRequest(essentiel, 10_000)).toBe(true);
    expect(canSendRequest(pro, 10_000)).toBe(true);
  });
});

describe("canCreateWidget", () => {
  it("lets the free plan have one widget", () => {
    expect(canCreateWidget(free, 0)).toBe(true);
    expect(canCreateWidget(free, 1)).toBe(false);
  });

  it("never blocks the paid plans", () => {
    expect(canCreateWidget(essentiel, 500)).toBe(true);
    expect(canCreateWidget(pro, 500)).toBe(true);
  });
});

describe("canHideBadge", () => {
  it("is reserved to the pro plan", () => {
    expect(canHideBadge(free)).toBe(false);
    expect(canHideBadge(essentiel)).toBe(false);
    expect(canHideBadge(pro)).toBe(true);
  });
});

describe("canRequestManually", () => {
  it("allows 20 requests typed in by hand a day, on every plan", () => {
    for (const space of [free, essentiel, pro]) {
      expect(canRequestManually(space, 19)).toBe(true);
      expect(canRequestManually(space, 20)).toBe(false);
    }
  });
});
