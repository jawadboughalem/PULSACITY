import Link from "next/link";
import type { ReactNode } from "react";
import { RatingStars } from "@/components/testimonials/RatingStars";
import { INLINE_LINK_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import type { DashboardFigures as Figures } from "@/lib/dashboard/count-dashboard-figures";
import { formatAverageRating, formatResponseRate } from "./format-figures";

/** Maquettes 3.4: the tiles of the key figures on Soleil, Ciel or white (white by default). */
const FIGURE_TONES = {
  sun: "bg-sun",
  sky: "bg-sky",
  white: "bg-white",
} as const;

type FigureProps = {
  value: string;
  /** Under the number, before what it counts (the stars of the average rating). */
  aside?: ReactNode;
  tone?: keyof typeof FIGURE_TONES;
  children: ReactNode;
  className?: string;
};

/** A key figure of the space, on its tile: the number in large type, what it counts below. */
export const Figure = ({ value, aside, tone = "white", children, className }: FigureProps) => (
  <div className={cn("flex min-w-[0] flex-col gap-2 rounded-panel p-4 desktop:gap-3 desktop:p-6", FIGURE_TONES[tone], className)}>
    <p className="font-display text-figure">{value}</p>
    <div className="flex flex-col gap-1">
      {aside}
      {/* On Soleil and Ciel, text is in Encre (charte v2: no Gris on Soleil). */}
      <div className={cn("text-small", tone === "white" ? "text-gray" : "text-ink")}>{children}</div>
    </div>
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
    <Figure value={String(figures.approved)} tone="sun">
      {figures.approved === 1 ? "témoignage validé" : "témoignages validés"}
    </Figure>
    <Figure
      value={formatAverageRating(figures.averageRating)}
      tone="sky"
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
