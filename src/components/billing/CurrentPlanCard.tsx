import Link from "next/link";
import type { ReactNode } from "react";
import { PlanPrice } from "@/components/marketing/PlanPrice";
import { WIDGETS_SECTION_HREF } from "@/components/space/space-sections";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PLANS, readPlanPrices } from "@/config/plans";
import { YEARLY_FREE_MONTHS } from "@/content/plan-offer";
import { describeCard } from "@/lib/billing/describe-card";
import type { BillingOverview, CurrentSubscription } from "@/lib/billing/billing-overview";
import { isInBeta, isPaymentFailed } from "@/lib/billing/billing-page-state";
import { BETA_REMINDER_DAYS } from "@/lib/billing/beta-reminders";
import { readCurrentPlan } from "@/lib/billing/plan-change";
import { formatLongDate, formatLongDayMonth } from "@/lib/dates/format-french-date";
import { formatPrice } from "@/lib/french/format-price";
import { quoteInFrench } from "@/lib/french/typography";
import { UsageGauge } from "./UsageGauge";
import { PassToYearlyButton } from "./PlanChanger";

const PERIOD_WORDS = { monthly: "par mois", yearly: "par an" } as const;

const PERIOD_NAMES = { monthly: "Mensuel", yearly: "Annuel" } as const;

const DAY_MS = 24 * 60 * 60 * 1000;

const LAUNCH_PRICE_KEPT = "Prix de lancement : vous le gardez à vie, tant que votre abonnement continue.";

const CardSection = ({ children }: { children: ReactNode }) => (
  <section aria-labelledby="current-plan" className="flex min-w-[0] flex-col gap-6 rounded-panel bg-white p-5 desktop:p-8">
    {children}
  </section>
);

const PriceLine = ({ figure, period }: { figure: ReactNode; period: string }) => (
  <p className="flex flex-wrap items-baseline gap-x-2">
    {figure}
    <span className="text-small text-gray">{period}</span>
  </p>
);

/** The rows of a paid plan: the label in Gris on the left on a computer, above its value on a phone. */
const Rows = ({ rows }: { rows: Array<{ label: string; value: string }> }) => (
  <dl className="grid gap-x-6 gap-y-5 desktop:grid-cols-[244px_1fr]">
    {rows.map((row) => (
      <div key={row.label} className="contents">
        <dt className="text-small text-gray max-desktop:-mb-4">{row.label}</dt>
        <dd className="text-body">{row.value}</dd>
      </div>
    ))}
  </dl>
);

type FreePlanCardProps = { overview: BillingOverview };

/** Maquettes 8.3, plan Gratuit: what the plan allows and what the space uses of it. */
const FreePlanCard = ({ overview }: FreePlanCardProps) => {
  const { limits } = PLANS.free;
  const { usage } = overview;
  const isOverTestimonials = usage.approvedTestimonials > limits.testimonials;
  const hasPausedWidgets = usage.pausedWidgets > 0;
  return (
    <CardSection>
      <div className="flex flex-col gap-4">
        <h2 id="current-plan" className="font-display text-h2">
          Plan {PLANS.free.name}
        </h2>
        <PriceLine figure={<PlanPrice amountCents={0} />} period="pour toujours" />
      </div>
      <div className="grid gap-6 desktop:grid-cols-3">
        <UsageGauge
          label="Témoignages validés"
          value={usage.approvedTestimonials}
          max={limits.testimonials}
          note={
            isOverTestimonials
              ? `Le widget en montre ${limits.testimonials} : ceux mis en avant, puis les plus récents. Les nouveaux attendent dans votre espace.`
              : "Limite atteinte"
          }
        />
        <UsageGauge
          label="Demandes automatiques ce mois"
          value={usage.requestsThisMonth}
          max={limits.monthlyRequests}
          note="Limite atteinte"
        />
        <UsageGauge
          label="Widgets"
          value={usage.widgets}
          max={limits.widgets}
          note={hasPausedWidgets ? `${usage.widgets - usage.pausedWidgets} affiché, ${usage.pausedWidgets} en pause` : "Limite atteinte"}
        />
      </div>
      {hasPausedWidgets ? (
        <Link href={WIDGETS_SECTION_HREF} className={`${SECONDARY_BUTTON_CLASSES} self-start max-desktop:w-full`}>
          Voir mes widgets
        </Link>
      ) : (
        <p className="text-small text-gray">
          {`Dépasser une limite ne supprime rien : l'ajout est bloqué et le plan ${PLANS.essentiel.name} vous est proposé. Les demandes au-delà de ${limits.monthlyRequests} partent le 1er du mois suivant.`}
        </p>
      )}
    </CardSection>
  );
};

const describeNextPayment = (subscription: CurrentSubscription): string => {
  if (subscription.cancelAt !== null) return `Aucune : l'abonnement s'arrête le ${formatLongDate(subscription.cancelAt)}`;
  if (subscription.currentPeriodEnd === null) return "—";
  return `${formatLongDate(subscription.currentPeriodEnd)} · ${formatPrice(subscription.amountCents, "EUR")}`;
};

type PaidPlanCardProps = { subscription: CurrentSubscription; overview: BillingOverview; now: Date };

/** Maquettes 8.3, a paid plan: its price, how it is paid, the next payment, the founder price kept. */
const PaidPlanCard = ({ subscription, overview, now }: PaidPlanCardProps) => {
  const current = readCurrentPlan(subscription);
  if (current === null) return null;
  const plan = PLANS[current.plan];
  const isFounder = current.priceList === "founder";
  const price = formatPrice(subscription.amountCents, "EUR");

  if (isInBeta(subscription, now) && subscription.betaUntil !== null) {
    const until = subscription.betaUntil;
    return (
      <CardSection>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-3 desktop:flex-row desktop:items-center">
            <h2 id="current-plan" className="font-display text-h2">
              Plan {plan.name}
            </h2>
            <ToneBadge tone="soon" label="Bêta-testeur" />
          </div>
          <PriceLine figure={<span className="font-display text-figure">Offert</span>} period="pendant 3 mois" />
        </div>
        <Rows
          rows={[
            { label: "Offert jusqu'au", value: formatLongDate(until) },
            {
              label: "Premier prélèvement",
              value: `${formatLongDate(until)} · ${price} ${PERIOD_WORDS[current.period]}${isFounder ? ", prix de lancement gardé à vie" : ""}`,
            },
            ...(subscription.cardLast4 !== null && subscription.cardBrand !== null
              ? [{ label: "Carte enregistrée", value: describeCard({ brand: subscription.cardBrand, last4: subscription.cardLast4 }) }]
              : []),
          ]}
        />
        <p className="text-small text-gray">
          {`Nous vous écrivons le ${formatLongDayMonth(new Date(until.getTime() - BETA_REMINDER_DAYS * DAY_MS))}, ${BETA_REMINDER_DAYS} jours avant le premier prélèvement. Vous pouvez arrêter avant cette date : rien ne sera prélevé.`}
        </p>
      </CardSection>
    );
  }

  const isFailed = isPaymentFailed(subscription);
  const scheduledPlan = subscription.scheduledPlan;
  const hasScheduledChange =
    scheduledPlan !== null && scheduledPlan !== "free" && subscription.scheduledAt !== null && subscription.cancelAt === null;
  const rows: Array<{ label: string; value: string }> = [{ label: "Paiement", value: PERIOD_NAMES[current.period] }];
  if (isFailed && subscription.lastPaymentFailedAt !== null) {
    rows.push({
      label: "Dernier paiement",
      value: `${formatLongDate(subscription.lastPaymentFailedAt)} · ${formatPrice(subscription.lastPaymentFailedAmountCents ?? subscription.amountCents, "EUR")} · refusé par votre banque`,
    });
  } else if (hasScheduledChange && subscription.scheduledAt !== null && subscription.scheduledPeriod !== null) {
    const day = formatLongDate(subscription.scheduledAt);
    const keepsFounder = subscription.scheduledPriceList === "founder" ? ", prix de lancement gardé à vie" : "";
    rows.push(
      { label: `Jusqu'au ${day}`, value: `Plan ${plan.name} · ${price} ${PERIOD_WORDS[current.period]}` },
      {
        label: `À partir du ${day}`,
        value: `Plan ${PLANS[scheduledPlan].name} · ${formatPrice(subscription.scheduledAmountCents ?? 0, "EUR")} ${PERIOD_WORDS[subscription.scheduledPeriod]}${keepsFounder}`,
      },
    );
  } else {
    rows.push({ label: "Prochaine échéance", value: describeNextPayment(subscription) });
  }
  if (isFounder && !hasScheduledChange) rows.push({ label: "Votre prix", value: LAUNCH_PRICE_KEPT });
  if (plan.badgeRemovable && !hasScheduledChange) {
    rows.push({
      label: `Mention ${quoteInFrench("Propulsé par PULSACITY")}`,
      value:
        overview.usage.widgetsWithoutMention > 0
          ? "Retirée de vos widgets"
          : "Retirable dans les réglages de chaque widget",
    });
  }
  const offersYearly =
    current.period === "monthly" && !isFailed && !hasScheduledChange && subscription.cancelAt === null;
  const yearlyPrice = readPlanPrices(plan, current.priceList).yearly;

  return (
    <CardSection>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-3 desktop:flex-row desktop:items-center">
          <h2 id="current-plan" className="font-display text-h2">
            Plan {plan.name}
          </h2>
          {isFounder ? <ToneBadge tone="soon" label="Prix de lancement" /> : null}
        </div>
        <PriceLine figure={<PlanPrice amountCents={subscription.amountCents} />} period={PERIOD_WORDS[current.period]} />
      </div>
      <Rows rows={rows} />
      {offersYearly ? (
        <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-4">
          <PassToYearlyButton plan={current.plan} />
          <p className="text-small text-gray">
            {`${formatPrice(yearlyPrice, "EUR")} par an : ${YEARLY_FREE_MONTHS} mois offerts.`}
          </p>
        </div>
      ) : null}
    </CardSection>
  );
};

/** A paid plan given without a subscription (the demo space, an offer from PULSACITY): nothing to pay. */
const GivenPlanCard = ({ overview }: { overview: BillingOverview }) => (
  <CardSection>
    <h2 id="current-plan" className="font-display text-h2">
      Plan {PLANS[overview.plan].name}
    </h2>
    <p className="text-body">Ce plan vous est offert par PULSACITY : aucun paiement.</p>
  </CardSection>
);

type CurrentPlanCardProps = { overview: BillingOverview; now: Date };

/** The first panel of « Abonnement et factures »: the free plan and its gauges, or the paid plan and its payment. */
export const CurrentPlanCard = ({ overview, now }: CurrentPlanCardProps) => {
  const { subscription } = overview;
  if (subscription !== null && subscription.status !== "incomplete") {
    return <PaidPlanCard subscription={subscription} overview={overview} now={now} />;
  }
  return overview.plan === "free" ? <FreePlanCard overview={overview} /> : <GivenPlanCard overview={overview} />;
};
