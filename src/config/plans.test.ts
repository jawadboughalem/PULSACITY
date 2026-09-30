import { describe, expect, it } from "vitest";
import {
  PLANS,
  UNLIMITED,
  canAddTestimonial,
  canCreateWidget,
  canHideBadge,
  canSendRequest,
  countTestimonialsLeft,
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
        limits: { testimonials: 15, monthlyRequests: 20, widgets: 1 },
        badgeRemovable: false,
      },
      essentiel: {
        id: "essentiel",
        name: "Essentiel",
        priceCents: { monthly: 900, yearly: 9000 },
        limits: { testimonials: UNLIMITED, monthlyRequests: UNLIMITED, widgets: UNLIMITED },
        badgeRemovable: false,
      },
      pro: {
        id: "pro",
        name: "Pro",
        priceCents: { monthly: 1900, yearly: 19000 },
        limits: { testimonials: UNLIMITED, monthlyRequests: UNLIMITED, widgets: UNLIMITED },
        badgeRemovable: true,
      },
    });
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
