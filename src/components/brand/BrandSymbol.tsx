import { useId } from "react";
import { cn } from "@/lib/cn";

const INK = "#16213E";
const CORAL = "#F0674A";

/** Paths copied as is from docs-internes/design-v2/identite/logo/svg: pulsacity-symbole(-petit)(-mono).svg, grid 64. */
const ROCKET =
  "M32 4C40.5 8 45 17 45 28V40Q45 45 40 45H24Q19 45 19 40V28C19 17 23.5 8 32 4Z M19 25C12 28 8 34 8 42Q8 47.5 13.5 45.5L19 43Z M45 25C52 28 56 34 56 42Q56 47.5 50.5 45.5L45 43Z";

const STAR =
  "M32.00 41.00 L35.12 47.21 L41.99 48.26 L37.04 53.14 L38.17 59.99 L32.00 56.80 L25.83 59.99 L26.96 53.14 L22.01 48.26 L28.88 47.21Z";

/** The regular symbol has its porthole; the small one, from 16 to 31 px, a wider gap around the star instead. */
const VARIANTS = {
  regular: { hasPorthole: true, gapAroundStar: 11 },
  small: { hasPorthole: false, gapAroundStar: 13 },
} as const;

type BrandSymbolProps = {
  /** "small" from 16 to 31 px, "regular" from 32 px. */
  variant: keyof typeof VARIANTS;
  size: number;
  isMonochrome?: boolean;
  className?: string;
};

/**
 * Inline, so that the motion classes reach pz-fusee and pz-etoile, and the monochrome one takes currentColor. Each
 * instance has its own mask id: two symbols on a page never mask each other.
 */
export const BrandSymbol = ({ variant, size, isMonochrome = false, className }: BrandSymbolProps) => {
  const maskId = `pz-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const { hasPorthole, gapAroundStar } = VARIANTS[variant];
  const rocketColor = isMonochrome ? "currentColor" : INK;
  const starColor = isMonochrome ? "currentColor" : CORAL;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0 overflow-visible", className)}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <rect width="64" height="64" fill="white" />
          {hasPorthole ? <circle cx="32" cy="23" r="6.5" fill="black" /> : null}
          <path d={STAR} fill="black" stroke="black" strokeWidth={gapAroundStar} strokeLinejoin="round" />
        </mask>
      </defs>
      <g className="pz-fusee" mask={`url(#${maskId})`} fill={rocketColor}>
        <path d={ROCKET} />
      </g>
      <path
        className="pz-etoile"
        d={STAR}
        fill={starColor}
        stroke={starColor}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
    </svg>
  );
};
