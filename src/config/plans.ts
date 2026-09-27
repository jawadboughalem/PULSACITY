/**
 * PULSACITY plans and their limits.
 *
 * This is the only place where a plan limit is defined (CLAUDE.md, rule 6).
 * Going over a limit never deletes data: the caller blocks the addition and
 * offers the next plan.
 */

export const PLAN_IDS = ["free", "essentiel", "pro"] as const;

export type PlanId = (typeof PLAN_IDS)[number];

/** A maximum count, or `null` when the plan has no limit. */
export type Limit = number | null;

export type Plan = {
  id: PlanId;
  name: string;
  /** Prices in euro cents. */
  priceCents: { monthly: number; yearly: number };
  limits: {
    testimonials: Limit;
    /** Automatic review requests sent in a calendar month. */
    monthlyRequests: Limit;
    widgets: Limit;
  };
  /** Whether the "Propulsé par PULSACITY" badge can be removed. */
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
    limits: { testimonials: null, monthlyRequests: null, widgets: null },
    badgeRemovable: false,
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceCents: { monthly: 1900, yearly: 19000 },
    limits: { testimonials: null, monthlyRequests: null, widgets: null },
    badgeRemovable: true,
  },
} as const satisfies Record<PlanId, Plan>;

/** The only thing the limit checks need to know about a space. */
export type SpacePlan = { plan: PlanId };

export function getPlan(id: PlanId): Plan {
  return PLANS[id];
}

function isBelow(limit: Limit, count: number): boolean {
  return limit === null || count < limit;
}

/** `count`: testimonials the space already holds. */
export function canAddTestimonial(space: SpacePlan, count: number): boolean {
  return isBelow(getPlan(space.plan).limits.testimonials, count);
}

/** `monthCount`: automatic requests already sent this calendar month. */
export function canSendRequest(space: SpacePlan, monthCount: number): boolean {
  return isBelow(getPlan(space.plan).limits.monthlyRequests, monthCount);
}

/** `count`: widgets the space already has. */
export function canCreateWidget(space: SpacePlan, count: number): boolean {
  return isBelow(getPlan(space.plan).limits.widgets, count);
}

export function canHideBadge(space: SpacePlan): boolean {
  return getPlan(space.plan).badgeRemovable;
}
