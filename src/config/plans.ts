export const PLAN_IDS = ["free", "essentiel", "pro"] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export const UNLIMITED = null;

export type Limit = number | typeof UNLIMITED;

export type Plan = {
  id: PlanId;
  name: string;
  priceCents: { monthly: number; yearly: number };
  limits: {
    testimonials: Limit;
    monthlyRequests: Limit;
    widgets: Limit;
  };
  badgeRemovable: boolean;
};

export const PLANS = {
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
} as const satisfies Record<PlanId, Plan>;

export type SpacePlan = { plan: PlanId };

export function getPlan(id: PlanId): Plan {
  return PLANS[id];
}

function isBelow(limit: Limit, count: number): boolean {
  return limit === UNLIMITED || count < limit;
}

export function canAddTestimonial(space: SpacePlan, count: number): boolean {
  return isBelow(getPlan(space.plan).limits.testimonials, count);
}

export function canSendRequest(space: SpacePlan, monthCount: number): boolean {
  return isBelow(getPlan(space.plan).limits.monthlyRequests, monthCount);
}

export function canCreateWidget(space: SpacePlan, count: number): boolean {
  return isBelow(getPlan(space.plan).limits.widgets, count);
}

export function canHideBadge(space: SpacePlan): boolean {
  return getPlan(space.plan).badgeRemovable;
}
