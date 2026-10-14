import Link from "next/link";
import type { ReactNode } from "react";
import { RatingStars } from "@/components/testimonials/RatingStars";
import { INLINE_LINK_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import type { DashboardFigures as Figures } from "@/lib/dashboard/count-dashboard-figures";
import { formatAverageRating, formatResponseRate } from "./format-figures";

type FigureProps = {
  value: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A key figure of the space, on its white tile: the number in large type, what it counts below. */
export const Figure = ({ value, aside, children, className }: FigureProps) => (
  <div className={cn("flex min-w-[0] flex-col gap-3 rounded-panel bg-white p-6", className)}>
    <p className="flex flex-wrap items-center gap-3">
      <span className="font-display text-figure">{value}</span>
      {aside}
    </p>
    <div className="text-small text-gray">{children}</div>
  </div>
);

/** The row of tiles, on Nuage: two by two on a phone, four in a row on a computer. */
export const FIGURE_ROW_CLASSES = "grid grid-cols-2 gap-3 desktop:grid-cols-4 desktop:gap-4";

type DashboardFiguresProps = {
  figures: Figures;
  pendingHref: string;
};

export const DashboardFigures = ({ figures, pendingHref }: DashboardFiguresProps) => (
  <section aria-label="Vos chiffres" className={FIGURE_ROW_CLASSES}>
    <Figure value={String(figures.approved)}>témoignages validés</Figure>
    <Figure
      value={formatAverageRating(figures.averageRating)}
      aside={
        figures.averageRating === null ? null : (
          <span className="hidden desktop:inline-flex">
            <RatingStars rating={figures.averageRating} size={16} />
          </span>
        )
      }
    >
      note moyenne
    </Figure>
    <Figure value={String(figures.pending)}>
      <span className="hidden desktop:inline">
        en attente de validation
        {figures.pending > 0 ? (
          <>
            {" · "}
            <Link href={pendingHref} className={INLINE_LINK_CLASSES}>
              Les voir
            </Link>
          </>
        ) : null}
      </span>
      {figures.pending > 0 ? (
        <Link href={pendingHref} className={cn(INLINE_LINK_CLASSES, "desktop:hidden")}>
          en attente
        </Link>
      ) : (
        <span className="desktop:hidden">en attente</span>
      )}
    </Figure>
    <Figure value={formatResponseRate(figures.requestsAnsweredThisMonth, figures.requestsSentThisMonth)}>
      taux de réponse ce mois
      {figures.requestsSentThisMonth > 0 ? (
        <span className="hidden desktop:inline">{` · ${figures.requestsAnsweredThisMonth} sur ${figures.requestsSentThisMonth} demandes`}</span>
      ) : null}
    </Figure>
  </section>
);
