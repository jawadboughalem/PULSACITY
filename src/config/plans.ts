export const PLAN_IDS = ["free", "essentiel", "pro"] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export const UNLIMITED = null;

export type Limit = number | typeof UNLIMITED;

export type PlanPrices = { monthly: number; yearly: number };

export type Plan = {
  id: PlanId;
  name: string;
  /** The public price. Final prices: what the creator pays, nothing is added to it (docs-internes/decisions/tarifs.md). */
  priceCents: PlanPrices;
  /** The founder price, kept for life while the subscription lasts: the beta testers and the first paying subscribers. */
  founderPriceCents: PlanPrices;
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
} as const satisfies Record<PlanId, Plan>;

/** The founder price goes to the beta testers and to this many first paying subscribers (arbitrages.md, n° 1). */
export const FOUNDER_PRICE_SEATS = 100;

/** « founder » while the founder price is open, « public » once it is closed. */
export type PriceList = "founder" | "public";

/** `founderSubscribers` counts the paying subscribers who got the founder price: the hundredth closes it. */
export function readOpenPriceList(founderSubscribers: number): PriceList {
  return founderSubscribers < FOUNDER_PRICE_SEATS ? "founder" : "public";
}

export function readPlanPrices(plan: Plan, priceList: PriceList): PlanPrices {
  return priceList === "founder" ? plan.founderPriceCents : plan.priceCents;
}

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
