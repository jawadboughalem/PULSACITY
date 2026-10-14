import Link from "next/link";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import type { DashboardFigures } from "@/lib/dashboard/count-dashboard-figures";
import { pluralize } from "./format-figures";

type RequestsSummaryProps = {
  figures: DashboardFigures;
  requestsHref: string;
};

/** A white panel on Nuage, beside the latest testimonials. */
export const RequestsSummary = ({ figures, requestsHref }: RequestsSummaryProps) => (
  <section aria-labelledby="requests-summary" className="flex flex-col gap-2 rounded-panel bg-white p-6">
    <h2 id="requests-summary" className="font-display text-h3">
      Demandes ce mois
    </h2>
    <p className="text-small text-gray">
      {[
        pluralize(figures.requestsSentThisMonth, "envoyée", "envoyées"),
        pluralize(figures.requestsAnsweredThisMonth, "réponse", "réponses"),
        pluralize(figures.remindersScheduled, "relance prévue", "relances prévues"),
      ].join(" · ")}
    </p>
    <Link href={requestsHref} className={cn(DISCREET_BUTTON_CLASSES, "self-start")}>
      Voir les demandes
    </Link>
  </section>
);
