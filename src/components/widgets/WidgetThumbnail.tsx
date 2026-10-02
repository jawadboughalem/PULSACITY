import type { ReactElement } from "react";
import { cn } from "@/lib/cn";
import type { WidgetType } from "../../../widget/src/payload";

const PAPER = "#F3F3F0";
const HAIRLINE = "#D8D9DD";
const WHITE = "#FFFFFF";
const GRAY = "#7E8390";
const CARMINE = "#A3243B";

/** Maquette 18: the wall's columns of cards, in miniature. */
const WallDrawing = () => (
  <g fill={WHITE} stroke={HAIRLINE}>
    <rect x="12" y="9.5" width="28" height="34" />
    <rect x="12" y="49.5" width="28" height="20" />
    <rect x="46" y="9.5" width="28" height="22.5" />
    <rect x="46" y="37.5" width="28" height="32.5" />
    <rect x="80" y="9.5" width="28" height="40.5" />
    <rect x="80" y="55.5" width="28" height="14.5" />
  </g>
);

const CarouselDrawing = () => (
  <g>
    <circle cx="12" cy="40" r="4" fill="none" stroke={GRAY} />
    <circle cx="108" cy="40" r="4" fill="none" stroke={GRAY} />
    <g fill={WHITE} stroke={HAIRLINE}>
      <rect x="24" y="16" width="34" height="48" />
      <rect x="62" y="16" width="34" height="48" />
    </g>
    <g fill={HAIRLINE}>
      <rect x="30" y="24" width="22" height="2.5" />
      <rect x="30" y="30.5" width="18" height="2.5" />
      <rect x="68" y="24" width="22" height="2.5" />
      <rect x="68" y="30.5" width="18" height="2.5" />
    </g>
  </g>
);

const BadgeDrawing = () => (
  <g>
    <rect x="20" y="33" width="80" height="14" rx="7" fill={WHITE} stroke={HAIRLINE} />
    <circle cx="29" cy="40" r="4" fill={HAIRLINE} />
    <circle cx="35" cy="40" r="4" fill={HAIRLINE} stroke={WHITE} />
    <rect x="46" y="39" width="16" height="2.5" fill={CARMINE} />
    <rect x="68" y="39" width="22" height="2.5" fill={HAIRLINE} />
  </g>
);

const DRAWINGS: Record<WidgetType, () => ReactElement> = {
  wall: WallDrawing,
  carousel: CarouselDrawing,
  badge: BadgeDrawing,
};

type WidgetThumbnailProps = { type: WidgetType; className?: string; isOnPaper?: boolean };

/** The shape of a widget at a glance, beside its name in the list: on Paper, or on White when laid on Paper. */
export const WidgetThumbnail = ({ type, className, isOnPaper = false }: WidgetThumbnailProps) => {
  const Drawing = DRAWINGS[type];
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true" focusable="false" className={cn("shrink-0", className)}>
      <rect width="120" height="80" fill={isOnPaper ? WHITE : PAPER} />
      <Drawing />
    </svg>
  );
};
