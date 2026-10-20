import { STAR_PATH } from "@/components/ui/icon-paths";
import { cn } from "@/lib/cn";
import { quoteInFrench } from "@/lib/french/typography";
import { RATINGS } from "@/lib/testimonials/ratings";
import { JULIE_ACCENT } from "./julie-page";

/** The stars of Julie's widget: full in her green, fill and outline; empty in the widget's grey (charte v2, Widget). */
const AccentStars = ({ rating }: { rating: number }) => (
  <span role="img" aria-label={`${rating} sur ${RATINGS.length}`} className="flex gap-1">
    {RATINGS.map((star) => (
      <svg key={star} width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
        <path
          d={STAR_PATH}
          strokeWidth={1.5}
          strokeLinejoin="round"
          style={star <= rating ? { fill: JULIE_ACCENT, stroke: JULIE_ACCENT } : undefined}
          className={star <= rating ? undefined : "fill-none stroke-widget-star-empty"}
        />
      </svg>
    ))}
  </span>
);

type DemoWallCardProps = {
  name: string;
  /** « Formation en ligne · 12 sept. 2026 », « Votre avis de test · à l'instant ». */
  detail: string;
  rating: number;
  text: string;
  /** The review just written: edged with Soleil (charte v2, ajouts 3.5, Démo à manipuler). */
  isNew?: boolean;
};

/** A card of the demonstration wall, drawn like a card of Julie's widget in its light theme. */
export const DemoWallCard = ({ name, detail, rating, text, isNew = false }: DemoWallCardProps) => (
  <li
    className={cn(
      "flex flex-col gap-3 rounded-card bg-widget-light-card p-5",
      isNew && "outline-2 -outline-offset-2 outline-sun",
    )}
  >
    <AccentStars rating={rating} />
    <p className="text-body [overflow-wrap:anywhere]">{quoteInFrench(text)}</p>
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-sky text-legal font-bold"
      >
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="flex min-w-[0] flex-col">
        <span className="text-small font-bold [overflow-wrap:anywhere]">{name}</span>
        <span className="text-small text-gray">{detail}</span>
      </span>
    </div>
  </li>
);
