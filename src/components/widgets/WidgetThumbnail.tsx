import type { ReactElement } from "react";
import { cn } from "@/lib/cn";
import type { WidgetType } from "../../../widget/src/payload";

/** Maquettes 3.4: the vignettes in the colours of the charte v2, Ciel, White, Givre, and Soleil for the rating. */
const SKY = "#DCEBFF";
const WHITE = "#FFFFFF";
const FROST = "#B9C2D6";
const SUN = "#FFBE3B";

/** The wall's columns of cards, in miniature. */
const WallDrawing = () => (
  <g fill={WHITE}>
    <rect x="10" y="10" width="31" height="32" rx="3" />
    <rect x="10" y="46" width="31" height="24" rx="3" />
    <rect x="45" y="10" width="30" height="21" rx="3" />
    <rect x="45" y="35" width="30" height="35" rx="3" />
    <rect x="79" y="10" width="31" height="38" rx="3" />
    <rect x="79" y="52" width="31" height="18" rx="3" />
  </g>
);

const CarouselDrawing = () => (
  <g>
    <g fill={FROST}>
      <circle cx="15" cy="40" r="5" />
      <circle cx="105" cy="40" r="5" />
    </g>
    <g fill={WHITE}>
      <rect x="24" y="19" width="34" height="42" rx="4" />
      <rect x="62" y="19" width="34" height="42" rx="4" />
    </g>
    <g fill={FROST}>
      <rect x="30" y="25" width="18" height="4" rx="2" />
      <rect x="30" y="33" width="13" height="4" rx="2" />
      <rect x="68" y="25" width="18" height="4" rx="2" />
      <rect x="68" y="33" width="13" height="4" rx="2" />
    </g>
  </g>
);

const BadgeDrawing = () => (
  <g>
    <rect x="19" y="26" width="83" height="29" rx="14.5" fill={WHITE} />
    <g fill={FROST}>
      <circle cx="32" cy="40.5" r="6" />
      <circle cx="47" cy="40.5" r="6" />
      <rect x="81" y="38" width="14" height="5" rx="2.5" />
    </g>
    <rect x="59" y="38" width="19" height="5" rx="2.5" fill={SUN} />
  </g>
);

const DRAWINGS: Record<WidgetType, () => ReactElement> = {
  wall: WallDrawing,
  carousel: CarouselDrawing,
  badge: BadgeDrawing,
};

type WidgetThumbnailProps = { type: WidgetType; className?: string };

/** The shape of a widget at a glance, beside its name in the list, on its Ciel aplat. */
export const WidgetThumbnail = ({ type, className }: WidgetThumbnailProps) => {
  const Drawing = DRAWINGS[type];
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true" focusable="false" className={cn("shrink-0", className)}>
      <rect width="120" height="80" rx="12" fill={SKY} />
      <Drawing />
    </svg>
  );
};
