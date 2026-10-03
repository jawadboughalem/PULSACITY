import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { DashboardFigures } from "@/components/dashboard/DashboardFigures";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { FirstDay } from "@/components/dashboard/FirstDay";
import { PlanLimitNotice } from "@/components/dashboard/PlanLimitNotice";
import { PLAN_LIMIT_NOTICE_COOKIE } from "@/components/dashboard/plan-limit-notice-cookie";
import { RequestsSummary } from "@/components/dashboard/RequestsSummary";
import { SetupStepsPanel, countDoneSteps } from "@/components/dashboard/SetupStepsPanel";
import { ASK_FOR_REVIEW_HREF, REQUESTS_SECTION_HREF, TESTIMONIALS_SECTION_HREF } from "@/components/space/space-sections";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { FirstApprovalCelebration } from "@/components/testimonials/FirstApprovalCelebration";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { canAddTestimonial, getPlan } from "@/config/plans";
import { getDb } from "@/db";
import { buildCollectionUrl, getAppUrl } from "@/lib/app-url";
import { cn } from "@/lib/cn";
import { countDashboardFigures } from "@/lib/dashboard/count-dashboard-figures";
import { readSetupSteps } from "@/lib/dashboard/read-setup-steps";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { getCurrentSpaceCounts } from "@/lib/spaces/get-current-space-counts";
import { getFirstName } from "@/lib/testimonials/format-customer-name";
import { listLatestTestimonials } from "@/lib/testimonials/list-space-testimonials";
import { STATUS_SEARCH_VALUES } from "@/lib/testimonials/testimonial-filters";
import { buildWidgetSnippet } from "@/lib/widgets/build-widget-snippet";
import { findDefaultWidget } from "@/lib/widgets/find-default-widget";

export const metadata: Metadata = {
  title: "Accueil · PULSACITY",
};

const LINK_CLASSES =
  "text-small font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

const ASK_FOR_REVIEW = "Demander un avis";

const SpaceHomePage = async () => {
  const { signedInUser, space } = await getCurrentSpace();
  const counts = await getCurrentSpaceCounts(space.id);
  const firstName = getFirstName(signedInUser.name) || null;
  const collectionUrl = buildCollectionUrl(space.slug);

  const mobileHeader = <SpaceMobileHeader account={buildSpaceAccount(signedInUser, space)} />;

  if (counts.total === 0) {
    return (
      <>
        {mobileHeader}
        <SpacePage>
          <FirstDay
            firstName={firstName}
            collectionUrl={collectionUrl}
            shouldTakeOff={space.firstDayCelebratedAt === null}
          />
        </SpacePage>
      </>
    );
  }

  const database = getDb();
  const [figures, steps, latest, defaultWidget, cookieStore] = await Promise.all([
    countDashboardFigures(database, space.id),
    readSetupSteps(database, space.id),
    listLatestTestimonials(database, space.id),
    findDefaultWidget(database, space.id),
    cookies(),
  ]);
  const plan = getPlan(space.plan);
  const isApprovalAllowed = canAddTestimonial(space, figures.approved);
  const showsPlanLimit =
    plan.limits.testimonials !== null && !isApprovalAllowed && !cookieStore.has(PLAN_LIMIT_NOTICE_COOKIE);
  const { done, total } = countDoneSteps(steps);
  const showsSteps = done < total;
  const showsRequests = figures.requestsSentThisMonth > 0 || figures.remindersScheduled > 0;
  const hasAside = showsSteps || showsRequests;
  const askForReviewLink = (
    <Link href={ASK_FOR_REVIEW_HREF} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:hidden")}>
      {ASK_FOR_REVIEW}
    </Link>
  );

  return (
    <>
      {mobileHeader}
      <SpacePage>
      <FirstApprovalCelebration>
        <div className="flex flex-col gap-5 desktop:gap-7">
          <header className="flex items-start justify-between gap-5">
            <div className="flex flex-col gap-2">
              <h1 className="font-serif text-h1 font-medium">{firstName ? `Bonjour ${firstName}` : "Bonjour"}</h1>
              <p className="text-body text-slate-600">Voici où en sont vos témoignages ce mois-ci.</p>
            </div>
            <Link href={ASK_FOR_REVIEW_HREF} className={cn(PRIMARY_BUTTON_CLASSES, "hidden shrink-0 desktop:inline-flex")}>
              {ASK_FOR_REVIEW}
            </Link>
          </header>
          {showsPlanLimit ? askForReviewLink : null}
          {showsPlanLimit && plan.limits.testimonials !== null ? (
            <PlanLimitNotice planName={plan.name} testimonialLimit={plan.limits.testimonials} pendingCount={figures.pending} />
          ) : null}
          <DashboardFigures
            figures={figures}
            pendingHref={`${TESTIMONIALS_SECTION_HREF}?statut=${STATUS_SEARCH_VALUES.pending}`}
          />
          {showsPlanLimit ? null : askForReviewLink}
          <div className={cn("grid gap-7", hasAside && "desktop:grid-cols-[1fr_360px] desktop:gap-x-7 desktop:gap-y-6")}>
            {showsSteps ? (
              <div className="desktop:col-start-2 desktop:row-start-1">
                <SetupStepsPanel
                  steps={steps}
                  collectionUrl={collectionUrl}
                  widgetSnippet={defaultWidget ? buildWidgetSnippet(getAppUrl(), defaultWidget) : null}
                  approvedCount={figures.approved}
                />
              </div>
            ) : null}
            <section
              aria-labelledby="latest-testimonials"
              className={cn("flex min-w-[0] flex-col", hasAside && "desktop:col-start-1 desktop:row-span-2 desktop:row-start-1")}
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline-200 pb-3 desktop:border-b-0 desktop:pb-[0]">
                <h2 id="latest-testimonials" className="font-serif text-quote font-medium desktop:text-h2">
                  <span className="desktop:hidden">Derniers reçus</span>
                  <span className="hidden desktop:inline">Derniers témoignages reçus</span>
                </h2>
                <Link href={TESTIMONIALS_SECTION_HREF} className={LINK_CLASSES}>
                  Tout voir
                </Link>
              </div>
              <div className="flex flex-col desktop:pt-3">
                {latest.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    variant="dashboard"
                    detailHref={`${TESTIMONIALS_SECTION_HREF}/${testimonial.id}`}
                    isApprovalAllowed={isApprovalAllowed}
                  />
                ))}
              </div>
            </section>
            {showsRequests ? (
              <div className={cn(showsSteps ? "desktop:row-start-2" : "desktop:row-start-1", "desktop:col-start-2")}>
                <RequestsSummary figures={figures} requestsHref={REQUESTS_SECTION_HREF} />
              </div>
            ) : null}
          </div>
        </div>
      </FirstApprovalCelebration>
      </SpacePage>
    </>
  );
};

export default SpaceHomePage;
