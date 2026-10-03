export const PLAN_IDS = ["free", "essentiel", "pro"] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export const UNLIMITED = null;

export type Limit = number | typeof UNLIMITED;

export type Plan = {
  id: PlanId;
  name: string;
  /** What the creator pays, VAT included (docs-internes/decision_tarifs.md). */
  priceCents: { monthly: number; yearly: number };
  limits: {
    testimonials: Limit;
    monthlyRequests: Limit;
    widgets: Limit;
    /** Requests typed in by hand (« Demander un avis ») in a day in Paris: a guard against mass sending, on every plan. */
    manualRequestsPerDay: Limit;
  };
  badgeRemovable: boolean;
};

export const PLANS = {
  free: {
    id: "free",
    name: "Gratuit",
    priceCents: { monthly: 0, yearly: 0 },
    limits: { testimonials: 15, monthlyRequests: 20, widgets: 1, manualRequestsPerDay: 20 },
    badgeRemovable: false,
  },
  essentiel: {
    id: "essentiel",
    name: "Essentiel",
    priceCents: { monthly: 999, yearly: 9900 },
    limits: { testimonials: UNLIMITED, monthlyRequests: UNLIMITED, widgets: UNLIMITED, manualRequestsPerDay: 20 },
    badgeRemovable: false,
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceCents: { monthly: 1999, yearly: 19900 },
    limits: { testimonials: UNLIMITED, monthlyRequests: UNLIMITED, widgets: UNLIMITED, manualRequestsPerDay: 20 },
    badgeRemovable: true,
  },
} as const satisfies Record<PlanId, Plan>;

export type SpacePlan = { plan: PlanId };

export function getPlan(id: PlanId): Plan {
  return PLANS[id];
}

function isBelow(limit: Limit, count: number): boolean {
  return limit === UNLIMITED || count < limit;
}

/** `count` is the number of validated testimonials: past the limit, new ones wait in pending. */
export function canAddTestimonial(space: SpacePlan, count: number): boolean {
  return isBelow(getPlan(space.plan).limits.testimonials, count);
}

export function countTestimonialsLeft(space: SpacePlan, count: number): Limit {
  const limit = getPlan(space.plan).limits.testimonials;
  return limit === UNLIMITED ? UNLIMITED : Math.max(0, limit - count);
}

export function canSendRequest(space: SpacePlan, monthCount: number): boolean {
  return isBelow(getPlan(space.plan).limits.monthlyRequests, monthCount);
}

/** `todayCount` is the number of requests typed in by hand today, in Paris. */
export function canRequestManually(space: SpacePlan, todayCount: number): boolean {
  return isBelow(getPlan(space.plan).limits.manualRequestsPerDay, todayCount);
}

export function canCreateWidget(space: SpacePlan, count: number): boolean {
  return isBelow(getPlan(space.plan).limits.widgets, count);
}

export function canHideBadge(space: SpacePlan): boolean {
  return getPlan(space.plan).badgeRemovable;
}
