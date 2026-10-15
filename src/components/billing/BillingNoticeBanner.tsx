import Link from "next/link";
import type { ReactNode } from "react";
import {
  cancelScheduledChangeAction,
  openBillingPortalAction,
  resumeSubscriptionAction,
} from "@/app/app/(espace)/facturation/billing-actions";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { WIDGETS_SECTION_HREF } from "@/components/space/space-sections";
import { SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { PLANS } from "@/config/plans";
import { buildCheckoutPath } from "@/lib/billing/billing-paths";
import type { BillingBanner } from "@/lib/billing/billing-page-state";
import { formatLongDate, formatLongDayMonth } from "@/lib/dates/format-french-date";
import { formatPrice } from "@/lib/french/format-price";
import { quoteInFrench } from "@/lib/french/typography";

const PERIOD_WORDS = { monthly: "par mois", yearly: "par an" } as const;

const ActionForm = ({ action, label }: { action: () => Promise<void>; label: string }) => (
  <form action={action} className="mt-3">
    <button type="submit" className={SECONDARY_COMPACT_BUTTON_CLASSES}>
      {label}
    </button>
  </form>
);

const ActionLink = ({ href, label }: { href: string; label: string }) => (
  <Link href={href} className={`mt-3 ${SECONDARY_COMPACT_BUTTON_CLASSES}`}>
    {label}
  </Link>
);

const ERROR_TITLES = {
  checkout: "Le paiement ne s'est pas ouvert.",
  portal: "La page de paiement de Stripe ne s'est pas ouverte.",
  change: "Le changement n'a pas été enregistré.",
} as const;

const describePausedWidgets = (count: number): string =>
  count === 1
    ? "L'autre est en pause : il ne s'affiche plus sur vos pages, sans rien y déplacer, et revient avec le plan Essentiel."
    : `Les ${count} autres sont en pause : ils ne s'affichent plus sur vos pages, sans rien y déplacer, et reviennent avec le plan Essentiel.`;

/** The detail of a change programmed: what the creator keeps until then, and what comes after. */
const describeScheduled = (banner: Extract<BillingBanner, { kind: "scheduled" }>): { title: string; detail: string } => {
  const day = formatLongDayMonth(banner.at);
  const price = `${formatPrice(banner.to.amountCents, "EUR")} ${PERIOD_WORDS[banner.to.period]}`;
  if (banner.from.plan === banner.to.plan) {
    const period = banner.to.period === "yearly" ? "au paiement annuel" : "au paiement mensuel";
    return {
      title: `Le ${day}, votre plan ${PLANS[banner.to.plan].name} passe ${period}.`,
      detail: `Jusque-là, rien ne change. Ensuite, ${price}.`,
    };
  }
  const title = `Le ${day}, votre espace passe du plan ${PLANS[banner.from.plan].name} au plan ${PLANS[banner.to.plan].name}.`;
  return banner.from.plan === "pro"
    ? {
        title,
        detail: `Jusque-là, vous gardez le Pro. Ensuite, la mention ${quoteInFrench("Propulsé par PULSACITY")} revient sous vos widgets.`,
      }
    : { title, detail: `Jusque-là, rien ne change. Ensuite, ${price}.` };
};

const Banner = ({ banner }: { banner: BillingBanner }): ReactNode => {
  switch (banner.kind) {
    case "error":
      return (
        <StatusBanner tone="error" title={ERROR_TITLES[banner.error]}>
          <p>Rien n&apos;a changé. Réessayez dans un instant ; si cela recommence, écrivez-nous.</p>
          <ActionLink href={MARKETING_PATHS.contact} label="Écrivez-nous" />
        </StatusBanner>
      );
    case "failed":
      return (
        <StatusBanner tone="error" title="Votre dernier paiement a échoué.">
          <p>{`Mettez à jour votre carte pour garder le plan ${PLANS[banner.plan].name}.`}</p>
          <ActionForm action={openBillingPortalAction.bind(null, "payment-method")} label="Mettre à jour ma carte" />
        </StatusBanner>
      );
    case "pending":
      return (
        <StatusBanner tone="waiting" title="Votre paiement est en cours de confirmation.">
          <p>
            Votre banque le vérifie. Cette page se met à jour toute seule ; vous pouvez la quitter, nous vous écrivons
            dès qu&apos;il est confirmé.
          </p>
        </StatusBanner>
      );
    case "beta":
      return (
        <StatusBanner tone="info" title="Merci de tester PULSACITY.">
          <p>
            {`Le plan Essentiel vous est offert pendant 3 mois. Votre carte est enregistrée ; rien n'est prélevé avant le ${formatLongDate(banner.until)}.`}
          </p>
        </StatusBanner>
      );
    case "welcome":
      return (
        <StatusBanner tone="success" title={`Bienvenue dans ${PLANS[banner.plan].name}.`}>
          <p>Votre paiement est confirmé. Témoignages, demandes et widgets sont illimités dès maintenant.</p>
        </StatusBanner>
      );
    case "stopping":
      return (
        <StatusBanner
          tone="waiting"
          title={`Votre plan ${PLANS[banner.plan].name} s'arrête le ${formatLongDayMonth(banner.at)}.`}
        >
          <p>Jusque-là, tout fonctionne. Ensuite, votre espace repasse au plan Gratuit : rien n&apos;est supprimé.</p>
          <ActionForm action={resumeSubscriptionAction} label="Reprendre mon abonnement" />
        </StatusBanner>
      );
    case "scheduled": {
      const { title, detail } = describeScheduled(banner);
      return (
        <StatusBanner tone="info" title={title}>
          <p>{detail}</p>
          <ActionForm action={cancelScheduledChangeAction} label="Annuler ce changement" />
        </StatusBanner>
      );
    }
    case "abandoned":
      return (
        <StatusBanner tone="info" title="Le paiement n'a pas été fait.">
          <p>Rien n&apos;a changé : vous êtes toujours au plan Gratuit, et rien n&apos;a été prélevé.</p>
          <ActionLink href={buildCheckoutPath(banner.choice)} label="Reprendre le paiement" />
        </StatusBanner>
      );
    case "back-to-free":
      return (
        <StatusBanner
          tone="info"
          title={`Votre espace est repassé au plan Gratuit le ${formatLongDayMonth(banner.since)}.`}
        >
          <p>
            {`Rien n'est supprimé. Un widget reste affiché${banner.displayedWidget ? ` : ${quoteInFrench(banner.displayedWidget)}` : ""}. ${describePausedWidgets(banner.pausedWidgets)}`}
          </p>
          <ActionLink href={WIDGETS_SECTION_HREF} label="Choisir le widget affiché" />
        </StatusBanner>
      );
  }
};

/** Maquettes 8.3: the states of « Abonnement et factures », each with its banner and, where one helps, its action. */
export const BillingNoticeBanner = ({ banner }: { banner: BillingBanner }) => <Banner banner={banner} />;
