import Link from "next/link";
import type { DashboardFigures } from "@/lib/dashboard/count-dashboard-figures";
import { pluralize } from "./format-figures";

type RequestsSummaryProps = {
  figures: DashboardFigures;
  requestsHref: string;
};

export const RequestsSummary = ({ figures, requestsHref }: RequestsSummaryProps) => (
  <section aria-labelledby="requests-summary" className="flex flex-col gap-2 border-b border-hairline-200 pb-5">
    <h2 id="requests-summary" className="font-serif text-quote font-medium">
      Demandes ce mois
    </h2>
    <p className="text-small text-slate-600">
      {[
        pluralize(figures.requestsSentThisMonth, "envoyée", "envoyées"),
        pluralize(figures.requestsAnsweredThisMonth, "réponse", "réponses"),
        pluralize(figures.remindersScheduled, "relance prévue", "relances prévues"),
      ].join(" · ")}
    </p>
    <Link
      href={requestsHref}
      className="self-start text-small font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
    >
      Voir les demandes
    </Link>
  </section>
);
