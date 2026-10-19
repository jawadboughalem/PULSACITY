import * as Sentry from "@sentry/nextjs";
import type { Metadata } from "next";
import { BillingNoticeBanner } from "@/components/billing/BillingNoticeBanner";
import { CurrentPlanCard } from "@/components/billing/CurrentPlanCard";
import { PaymentAndInvoices } from "@/components/billing/PaymentAndInvoices";
import { PlanChanger } from "@/components/billing/PlanChanger";
import { ReferralCard } from "@/components/billing/ReferralCard";
import { RefreshWhilePending } from "@/components/billing/RefreshWhilePending";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { MobileBackLink } from "@/components/space/MobileBackLink";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { describeWidget } from "@/components/widgets/describe-widget";
import { getPlan } from "@/config/plans";
import { getDb } from "@/db";
import type { Database } from "@/db/database";
import {
  ABANDONED_PAYMENT,
  parseBillingError,
  parseCheckoutSessionId,
  parsePlanWelcome,
} from "@/lib/billing/billing-notices";
import { readBillingOverview } from "@/lib/billing/billing-overview";
import { chooseBillingBanner, isPaymentPending } from "@/lib/billing/billing-page-state";
import { parsePlanChoice } from "@/lib/billing/billing-paths";
import { syncReturnFromCheckout } from "@/lib/billing/checkout";
import { readCurrentPlan } from "@/lib/billing/plan-change";
import { getStripe, isStripeConfigured } from "@/lib/billing/stripe-client";
import { findOwnedSpace } from "@/lib/spaces/find-owned-space";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listRankedWidgets, readDisplayedWidgetIds } from "@/lib/widgets/free-plan-widgets";
import { listSpaceWidgets } from "@/lib/widgets/space-widgets";

export const metadata: Metadata = {
  title: "Abonnement et factures · PULSACITY",
};

/** « Un widget reste affiché : « Mur · Programme 30 jours » »: the name the list of widgets gives it. */
const readDisplayedWidgetTitle = async (database: Database, spaceId: string, limit: number | null) => {
  const [listed, ranked] = await Promise.all([listSpaceWidgets(database, spaceId), listRankedWidgets(database, spaceId)]);
  const displayed = readDisplayedWidgetIds(ranked, limit);
  const widget = listed.find((candidate) => displayed.has(candidate.id));
  return widget === undefined ? null : (widget.name ?? describeWidget(widget.type, widget.productName));
};

/** Maquettes 8.3, Abonnement et factures: the plan, changing it, paying and the invoices on Stripe's page. */
const BillingPage = async ({ searchParams }: PageProps<"/app/facturation">) => {
  const { signedInUser, space: openedSpace } = await getCurrentSpace();
  const parameters = await searchParams;
  const database = getDb();
  const sessionId = parseCheckoutSessionId(parameters.paiement);
  if (sessionId !== null && isStripeConfigured()) {
    try {
      await syncReturnFromCheckout(database, getStripe(), openedSpace.id, sessionId);
    } catch (error) {
      // The event will tell it: meanwhile, the page says the payment is on its way.
      Sentry.captureException(error);
    }
  }
  const space = sessionId === null ? openedSpace : ((await findOwnedSpace(database, signedInUser.id)) ?? openedSpace);
  const now = new Date();
  const overview = await readBillingOverview(database, space);
  const displayedWidget =
    overview.usage.pausedWidgets > 0
      ? await readDisplayedWidgetTitle(database, space.id, getPlan(space.plan).limits.widgets)
      : null;
  const banner = chooseBillingBanner(overview, {
    error: parseBillingError(parameters.erreur),
    welcome: sessionId !== null ? "checkout" : parsePlanWelcome(parameters.bienvenue),
    abandoned: parameters.paiement === ABANDONED_PAYMENT ? parsePlanChoice(parameters.plan, parameters.periode) : null,
    displayedWidget,
    now,
  });
  const isPending = isPaymentPending(overview.subscription) || banner?.kind === "pending";
  const current = overview.subscription === null ? null : readCurrentPlan(overview.subscription);

  return (
    <>
      <SpaceMobileHeader account={buildSpaceAccount(signedInUser, space)} />
      <SpacePage hidesPaymentProblem className="desktop:max-w-[1176px] desktop:gap-8">
        <div className="flex flex-col gap-4">
          <MobileBackLink />
          <h1 className="font-display text-h1">Abonnement et factures</h1>
        </div>
        {banner !== null ? <BillingNoticeBanner banner={banner} /> : null}
        {isPending ? <RefreshWhilePending /> : null}
        <CurrentPlanCard overview={overview} now={now} />
        {isPending ? null : (
          <PlanChanger
            current={current ?? { plan: overview.plan, period: "monthly" }}
            priceList={overview.priceList}
            isSubscribed={current !== null}
            referralEssentielUntil={overview.referralEssentielUntil}
          />
        )}
        <PaymentAndInvoices
          isSubscribed={current !== null && !isPending}
          hasPastInvoices={overview.hasCustomer && overview.freeSince !== null}
        />
        <ReferralCard />
      </SpacePage>
    </>
  );
};

export default BillingPage;
