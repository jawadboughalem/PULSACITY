"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  changePlanAction,
  openBillingPortalAction,
  previewPlanChangeAction,
} from "@/app/app/(espace)/facturation/billing-actions";
import { CheckList } from "@/components/marketing/CheckList";
import { PlanPrice } from "@/components/marketing/PlanPrice";
import {
  PRIMARY_BUTTON_CLASSES,
  SECONDARY_BUTTON_CLASSES,
} from "@/components/ui/button-styles";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FieldError } from "@/components/ui/FieldError";
import {
  SEGMENTED_CLASSES,
  SEGMENTED_OPTION_CHOSEN_CLASSES,
  SEGMENTED_OPTION_CLASSES,
  SEGMENTED_OPTION_IDLE_CLASSES,
} from "@/components/ui/segmented-styles";
import { Spinner } from "@/components/ui/Spinner";
import { ToneBadge } from "@/components/ui/ToneBadge";
import {
  type BillingPeriod,
  PLAN_IDS,
  PLANS,
  type PaidPlanId,
  type PlanId,
  type PriceList,
  comparePlans,
  isPaidPlan,
} from "@/config/plans";
import {
  YEARLY_FREE_MONTHS,
  describeBillingHighlights,
  describeLaunchPrice,
  describePricePeriod,
  readPlanPrice,
} from "@/content/plan-offer";
import { buildCheckoutPath } from "@/lib/billing/billing-paths";
import type { PlanChangePreview } from "@/lib/billing/plan-change";
import { cn } from "@/lib/cn";
import { formatLongDate, formatLongDayMonth } from "@/lib/dates/format-french-date";
import { formatPrice } from "@/lib/french/format-price";

type Target = { plan: PaidPlanId; period: BillingPeriod };

type CurrentPlanChoice = { plan: PlanId; period: BillingPeriod };

const PERIOD_WORDS = { monthly: "par mois", yearly: "par an" } as const;

const PERIOD_OPTIONS: Array<{ value: BillingPeriod; label: string }> = [
  { value: "monthly", label: "Mensuel" },
  { value: "yearly", label: "Annuel" },
];

const PREPARE_ERROR = "Le changement n'a pas pu se préparer. Rien n'a changé : réessayez dans un instant.";

const CHANGE_ERROR = "Le changement n'a pas été enregistré. Rien n'a changé : réessayez dans un instant.";

const describePeriodChange = (period: BillingPeriod) => (period === "yearly" ? "Passer à l'annuel" : "Passer au mensuel");

/** The window of confirmation: what the creator pays today, or what comes at the end of the period. */
const describeDialog = (current: CurrentPlanChoice, target: Target, preview: PlanChangePreview) => {
  const name = PLANS[target.plan].name;
  const next = `${formatPrice(preview.nextAmountCents, "EUR")} ${PERIOD_WORDS[target.period]}`;
  const action = current.plan === target.plan ? describePeriodChange(target.period) : `Passer au plan ${name}`;
  if (preview.kind === "now") {
    const today = formatPrice(preview.amountDueCents, "EUR");
    return {
      title: `${action} ?`,
      message: [
        preview.periodEnd !== null
          ? `Vous payez aujourd'hui ${today} : la différence jusqu'au ${formatLongDate(preview.periodEnd)}, au prorata.`
          : `Vous payez aujourd'hui ${today}, au prorata du temps déjà payé.`,
        `Ensuite, ${next}.`,
      ],
      confirmLabel: action,
    };
  }
  const day = preview.at === null ? "à la fin de la période payée" : `le ${formatLongDayMonth(preview.at)}`;
  const keeps =
    current.plan === target.plan ? "Jusque-là, rien ne change." : `Jusque-là, vous gardez le plan ${PLANS[current.plan].name}.`;
  return {
    title: `${action} ${day} ?`,
    message: [`${keeps} Ensuite, ${next}.`, "Sans remboursement, et rien n'est supprimé."],
    confirmLabel: action,
  };
};

/** Prepares a change (its cost, its date), asks for a confirmation, then makes it. */
const usePlanChange = (current: CurrentPlanChoice) => {
  const [pending, setPending] = useState<{ target: Target; preview: PlanChangePreview } | null>(null);
  const [preparing, setPreparing] = useState<Target | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPreparing, startPreparing] = useTransition();
  const [isChanging, startChanging] = useTransition();

  const ask = (target: Target) => {
    setError(null);
    setPreparing(target);
    startPreparing(async () => {
      const result = await previewPlanChangeAction(target);
      setPreparing(null);
      if (result.ok) setPending({ target, preview: result.data });
      else setError(PREPARE_ERROR);
    });
  };

  const confirm = () => {
    if (pending === null) return;
    startChanging(async () => {
      const result = await changePlanAction(pending.target);
      if (result.ok) {
        window.location.assign(result.data.location);
        return;
      }
      setPending(null);
      setError(CHANGE_ERROR);
    });
  };

  const dialog =
    pending === null ? null : { ...describeDialog(current, pending.target, pending.preview), isPending: isChanging };
  return {
    ask,
    confirm,
    cancel: () => setPending(null),
    dialog,
    error,
    isPreparing: (target: Target) =>
      isPreparing && preparing?.plan === target.plan && preparing.period === target.period,
  };
};

const ChangeDialog = ({ change }: { change: ReturnType<typeof usePlanChange> }) => (
  <ConfirmDialog
    isOpen={change.dialog !== null}
    title={change.dialog?.title ?? ""}
    message={change.dialog?.message ?? ""}
    confirmLabel={change.dialog?.confirmLabel ?? ""}
    isPending={change.dialog?.isPending ?? false}
    onConfirm={change.confirm}
    onCancel={change.cancel}
  />
);

const PreparingLabel = ({ isPreparing, label }: { isPreparing: boolean; label: string }) => (
  <>
    {isPreparing ? <Spinner size={18} /> : null}
    {isPreparing ? "Envoi…" : label}
  </>
);

/** « Passer à l'annuel », under a monthly plan (maquette 8.3, Essentiel mensuel). */
export const PassToYearlyButton = ({ plan }: { plan: PaidPlanId }) => {
  const change = usePlanChange({ plan, period: "monthly" });
  const target: Target = { plan, period: "yearly" };
  const isPreparing = change.isPreparing(target);
  return (
    <>
      <button
        type="button"
        onClick={() => change.ask(target)}
        aria-busy={isPreparing || undefined}
        className={cn(SECONDARY_BUTTON_CLASSES, "max-desktop:w-full")}
      >
        <PreparingLabel isPreparing={isPreparing} label="Passer à l'annuel" />
      </button>
      {change.error ? <FieldError id="pass-to-yearly-error" message={change.error} /> : null}
      <ChangeDialog change={change} />
    </>
  );
};

type PlanChangerProps = {
  current: CurrentPlanChoice;
  /** The space's own prices while subscribed (the founder price kept), else those a new subscriber gets. */
  priceList: PriceList;
  /** A Stripe subscription to change; without one, a paid plan opens Checkout. */
  isSubscribed: boolean;
};

/** The plan just above the current one carries the main button (one per screen); Pro has none above it. */
const readNextPlan = (current: PlanId): PlanId | null =>
  PLAN_IDS.find((id) => comparePlans(current, id) === 1) ?? null;

/**
 * Maquettes 8.3, « Changer de plan »: Mensuel or Annuel, three columns, the current plan on Ciel with « Votre plan ».
 * A higher plan is taken at once, the rest at the end of the period paid (the rules written under the columns).
 */
export const PlanChanger = ({ current, priceList, isSubscribed }: PlanChangerProps) => {
  const [period, setPeriod] = useState<BillingPeriod>(current.period);
  const change = usePlanChange(current);
  const nextPlan = readNextPlan(current.plan);

  const renderAction = (id: PlanId) => {
    if (id === current.plan && (period === current.period || !isPaidPlan(id))) {
      return <p className="flex min-h-[56px] items-center text-small text-gray">Votre plan actuel</p>;
    }
    const classes = cn(id === nextPlan ? PRIMARY_BUTTON_CLASSES : SECONDARY_BUTTON_CLASSES, "w-full");
    const label = id === current.plan ? describePeriodChange(period) : `Passer au plan ${PLANS[id].name}`;
    if (!isPaidPlan(id)) {
      return (
        <form action={openBillingPortalAction.bind(null, "stop")} className="flex min-h-[56px] items-center">
          <button type="submit" className={classes}>
            {label}
          </button>
        </form>
      );
    }
    const target: Target = { plan: id, period };
    if (!isSubscribed) {
      return (
        <div className="flex min-h-[56px] items-center">
          <Link href={buildCheckoutPath(target)} className={classes}>
            {label}
          </Link>
        </div>
      );
    }
    const isPreparing = change.isPreparing(target);
    return (
      <div className="flex min-h-[56px] items-center">
        <button
          type="button"
          onClick={() => change.ask(target)}
          aria-busy={isPreparing || undefined}
          className={classes}
        >
          <PreparingLabel isPreparing={isPreparing} label={label} />
        </button>
      </div>
    );
  };

  return (
    <section aria-labelledby="change-plan" className="flex min-w-[0] flex-col gap-6 rounded-panel bg-white p-5 desktop:p-8">
      <h2 id="change-plan" className="font-display text-h2">
        Changer de plan
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-4 desktop:flex-row desktop:items-center">
          <div role="group" aria-label="Période de paiement" className={SEGMENTED_CLASSES}>
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={period === option.value}
                onClick={() => setPeriod(option.value)}
                className={cn(
                  SEGMENTED_OPTION_CLASSES,
                  period === option.value ? SEGMENTED_OPTION_CHOSEN_CLASSES : SEGMENTED_OPTION_IDLE_CLASSES,
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-small font-bold">{`Annuel : ${YEARLY_FREE_MONTHS} mois offerts`}</p>
        </div>
        <p className="text-small text-gray">Prix finaux : rien ne s&apos;ajoute au paiement.</p>
      </div>
      <ul className="grid gap-4 desktop:grid-cols-3">
        {PLAN_IDS.map((id) => {
          const isCurrent = id === current.plan;
          const launchPrice = describeLaunchPrice(id, period, priceList);
          return (
            <li
              key={id}
              className={cn(
                "flex flex-col gap-4 rounded-panel p-6 desktop:row-span-5 desktop:grid desktop:grid-rows-subgrid",
                isCurrent ? "bg-sky" : "bg-cloud",
              )}
            >
              <div className="flex min-h-[32px] items-end max-desktop:empty:hidden">
                {isCurrent ? <ToneBadge tone="sun" label="Votre plan" /> : null}
              </div>
              <h3 className="font-display text-h3">{PLANS[id].name}</h3>
              <div className="flex flex-col gap-2">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <PlanPrice
                    amountCents={readPlanPrice(id, period, priceList)}
                    className="text-[40px] leading-[44px]"
                  />
                  <span className="text-small text-gray">{describePricePeriod(id, period)}</span>
                </p>
                {launchPrice ? <p className="text-small text-gray">{launchPrice}</p> : null}
              </div>
              {renderAction(id)}
              <CheckList items={describeBillingHighlights(id)} size="compact" />
            </li>
          );
        })}
      </ul>
      {change.error ? <FieldError id="change-plan-error" message={change.error} /> : null}
      <p className="text-small text-gray">
        Plan supérieur : tout de suite, au prorata. Plan inférieur, passage à l&apos;annuel ou au mensuel : à la fin
        de la période payée, sans remboursement. Rien n&apos;est jamais supprimé.
      </p>
      <ChangeDialog change={change} />
    </section>
  );
};
