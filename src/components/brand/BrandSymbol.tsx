import { useId } from "react";
import { cn } from "@/lib/cn";

const INK = "#16213E";
const CARMINE = "#A3243B";

/** Paths copied as is from docs-internes/identite-v2/assets/svg: pulsacity-symbole(-petit)(-mono).svg. */
const SYMBOLS = {
  regular: {
    porthole: true,
    maskStar:
      "M16.00 19.00 L17.76 22.77 L21.90 23.28 L18.85 26.13 L19.64 30.22 L16.00 28.20 L12.36 30.22 L13.15 26.13 L10.10 23.28 L14.24 22.77Z",
    maskStrokeWidth: 2.6,
    body: "M16 1C19.9 3.6 21.4 8 21.4 12.6V21.4H10.6V12.6C10.6 8 12.1 3.6 16 1Z",
    fins: "M11.4 13.2L6.8 17.6V22.2L11.4 20.2Z M20.6 13.2L25.2 17.6V22.2L20.6 20.2Z",
  },
  small: {
    porthole: false,
    maskStar:
      "M16.00 18.40 L17.94 22.33 L22.28 22.96 L19.14 26.02 L19.88 30.34 L16.00 28.30 L12.12 30.34 L12.86 26.02 L9.72 22.96 L14.06 22.33Z",
    maskStrokeWidth: 3,
    body: "M16 0.8C20.6 3.6 22.2 8 22.2 12.6V21H9.8V12.6C9.8 8 11.4 3.6 16 0.8Z",
    fins: "M10.6 12.8L5.6 17.4V22.4L10.6 20.2Z M21.4 12.8L26.4 17.4V22.4L21.4 20.2Z",
  },
} as const;

type BrandSymbolProps = {
  /** "small" from 16 to 31 px, "regular" from 32 px. */
  variant: keyof typeof SYMBOLS;
  size: number;
  isMonochrome?: boolean;
  className?: string;
};

/** Inline, so that the motion classes reach pz-fusee and pz-etoile, and the monochrome one takes currentColor. */
export const BrandSymbol = ({ variant, size, isMonochrome = false, className }: BrandSymbolProps) => {
  const maskId = `pz-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const symbol = SYMBOLS[variant];
  const rocketColor = isMonochrome ? "currentColor" : INK;
  const starColor = isMonochrome ? "currentColor" : CARMINE;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0 overflow-visible", className)}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
          <rect width="32" height="32" fill="white" />
          {symbol.porthole ? <circle cx="16" cy="9.6" r="2.3" fill="black" /> : null}
          <path
            d={symbol.maskStar}
            fill="black"
            stroke="black"
            strokeWidth={symbol.maskStrokeWidth}
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <g className="pz-fusee" mask={`url(#${maskId})`} fill={rocketColor}>
        <path d={symbol.body} />
        <path d={symbol.fins} />
      </g>
      <path
        className="pz-etoile"
        d={symbol.maskStar}
        fill={starColor}
        stroke={starColor}
        strokeWidth={0.6}
        strokeLinejoin="round"
      />
    </svg>
  );
};
