import { useId } from "react";
import { cn } from "@/lib/cn";
import {
  MENTION_HEIGHT,
  MENTION_LOGOTYPE,
  MENTION_ROCKET,
  MENTION_STAR,
  MENTION_SYMBOL_SCALE,
  MENTION_WIDTH,
} from "../../../widget/src/brand-mention-paths";


type BrandMentionProps = {
  /** 14 px by default, 12 at least (identity specification). */
  height?: number;
  className?: string;
};

/**
 * pulsacity-mention-mono.svg inline, in currentColor: the small symbol and the logotype, for « Propulsé par ». Its own
 * mask id, so that two mentions on a page never mask each other. Decorative: the link around it names Pulsacity.
 */
export const BrandMention = ({ height = 14, className }: BrandMentionProps) => {
  const maskId = `pz-m-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <svg
      width={(height * MENTION_WIDTH) / MENTION_HEIGHT}
      height={height}
      viewBox={`0 0 ${MENTION_WIDTH} ${MENTION_HEIGHT}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <rect width="64" height="64" fill="white" />
          <path d={MENTION_STAR} fill="black" stroke="black" strokeWidth={13} strokeLinejoin="round" />
        </mask>
      </defs>
      <g transform={`translate(0 0) scale(${MENTION_SYMBOL_SCALE})`}>
        <g className="pz-fusee" mask={`url(#${maskId})`}>
          <path d={MENTION_ROCKET} />
        </g>
        <path className="pz-etoile" d={MENTION_STAR} stroke="currentColor" strokeWidth={3.5} strokeLinejoin="round" />
      </g>
      <path d={MENTION_LOGOTYPE} />
    </svg>
  );
};
