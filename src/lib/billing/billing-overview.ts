import { and, count, eq, sql } from "drizzle-orm";
import { type PlanId, type PriceList, getPlan } from "@/config/plans";
import type { Database } from "@/db/database";
import { subscriptions, widgets } from "@/db/schema";
import { countDashboardFigures } from "@/lib/dashboard/count-dashboard-figures";
import { listRankedWidgets, readDisplayedWidgetIds } from "@/lib/widgets/free-plan-widgets";
import { readCurrentPriceList } from "./founder-seats";
import { isSubscriptionOver } from "./read-subscription-snapshot";

export type CurrentSubscription = typeof subscriptions.$inferSelect;

export type BillingUsage = {
  approvedTestimonials: number;
  requestsThisMonth: number;
  widgets: number;
  pausedWidgets: number;
  widgetsWithoutMention: number;
};

export type BillingOverview = {
  plan: PlanId;
  /** The current subscription, while it is not over: paid, retried, waiting for its first payment. */
  subscription: CurrentSubscription | null;
  /** A Stripe customer: past invoices to see on Stripe's page. */
  hasCustomer: boolean;
  freeSince: Date | null;
  usage: BillingUsage;
  /** The prices of « Changer de plan »: the space's own while subscribed, else those a new subscriber gets. */
  priceList: PriceList;
};

type BillingSpace = {
  id: string;
  plan: PlanId;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  freeSince: Date | null;
};

const countUsage = async (database: Database, space: BillingSpace): Promise<BillingUsage> => {
  const [figures, ranked, [mention]] = await Promise.all([
    countDashboardFigures(database, space.id),
    listRankedWidgets(database, space.id),
    database
      .select({ value: count() })
      .from(widgets)
      .where(and(eq(widgets.spaceId, space.id), sql`(${widgets.settings}->>'hidePoweredBy')::boolean is true`)),
  ]);
  const displayed = readDisplayedWidgetIds(ranked, getPlan(space.plan).limits.widgets);
  return {
    approvedTestimonials: figures.approved,
    requestsThisMonth: figures.requestsSentThisMonth,
    widgets: ranked.length,
    pausedWidgets: ranked.length - displayed.size,
    widgetsWithoutMention: mention?.value ?? 0,
  };
};

/** Everything « Abonnement et factures » shows, from the database: Stripe is read only by the events. */
export const readBillingOverview = async (database: Database, space: BillingSpace): Promise<BillingOverview> => {
  const [usage, current, openPriceList] = await Promise.all([
    countUsage(database, space),
    space.stripeSubscriptionId === null
      ? Promise.resolve(undefined)
      : database
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.id, space.stripeSubscriptionId))
          .then((rows) => rows[0]),
    readCurrentPriceList(database),
  ]);
  const subscription = current !== undefined && !isSubscriptionOver(current.status) ? current : null;
  return {
    plan: space.plan,
    subscription,
    hasCustomer: space.stripeCustomerId !== null,
    freeSince: space.freeSince,
    usage,
    priceList: subscription?.priceList ?? openPriceList,
  };
};
