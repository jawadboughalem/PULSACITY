import Link from "next/link";
import type { ReactNode } from "react";
import { RatingStars } from "@/components/testimonials/RatingStars";
import { cn } from "@/lib/cn";
import type { DashboardFigures as Figures } from "@/lib/dashboard/count-dashboard-figures";
import { formatAverageRating, formatResponseRate } from "./format-figures";

const LINK_CLASSES =
  "text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

type FigureProps = {
  value: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
};

const Figure = ({ value, aside, children, className }: FigureProps) => (
  <div className={cn("flex flex-col gap-3 border-hairline-200 py-5", className)}>
    <p className="flex flex-wrap items-center gap-3">
      <span className="font-serif text-display font-medium">{value}</span>
      {aside}
    </p>
    <div className="text-small text-slate-600">{children}</div>
  </div>
);

type DashboardFiguresProps = {
  figures: Figures;
  pendingHref: string;
};

export const DashboardFigures = ({ figures, pendingHref }: DashboardFiguresProps) => (
  <section
    aria-label="Vos chiffres"
    className="grid grid-cols-2 border-t border-ink-900 desktop:grid-cols-4 [&>*]:border-b"
  >
    <Figure value={String(figures.approved)} className="pr-4 desktop:pr-5">
      témoignages validés
    </Figure>
    <Figure
      value={formatAverageRating(figures.averageRating)}
      aside={
        figures.averageRating === null ? null : (
          <span className="hidden desktop:inline-flex">
            <RatingStars rating={figures.averageRating} size={16} />
          </span>
        )
      }
      className="border-l pl-4 desktop:px-5"
    >
      note moyenne
    </Figure>
    <Figure value={String(figures.pending)} className="pr-4 desktop:border-l desktop:px-5">
      <span className="hidden desktop:inline">
        en attente de validation
        {figures.pending > 0 ? (
          <>
            {" · "}
            <Link href={pendingHref} className={LINK_CLASSES}>
              Les voir
            </Link>
          </>
        ) : null}
      </span>
      {figures.pending > 0 ? (
        <Link href={pendingHref} className={cn(LINK_CLASSES, "desktop:hidden")}>
          en attente
        </Link>
      ) : (
        <span className="desktop:hidden">en attente</span>
      )}
    </Figure>
    <Figure
      value={formatResponseRate(figures.requestsAnsweredThisMonth, figures.requestsSentThisMonth)}
      className="border-l pl-4 desktop:px-5"
    >
      taux de réponse ce mois
      {figures.requestsSentThisMonth > 0 ? (
        <span className="hidden desktop:inline">{` · ${figures.requestsAnsweredThisMonth} sur ${figures.requestsSentThisMonth} demandes`}</span>
      ) : null}
    </Figure>
  </section>
);
