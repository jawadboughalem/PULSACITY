import { useId } from "react";
import { STAR_PATH } from "@/components/ui/icon-paths";
import { cn } from "@/lib/cn";

export type StarFill = "full" | "half" | "empty";

type StarIconProps = {
  size: 16 | 20 | 36;
  isFilled?: boolean;
  fill?: StarFill;
};

export const StarIcon = ({ size, isFilled = false, fill = isFilled ? "full" : "empty" }: StarIconProps) => {
  const halfId = `star-half-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      {fill === "half" ? (
        <defs>
          <clipPath id={halfId}>
            <rect width="12" height="24" />
          </clipPath>
        </defs>
      ) : null}
      <path
        d={STAR_PATH}
        strokeWidth={1.5}
        strokeLinejoin="round"
        className={cn(fill === "full" ? "fill-carmine stroke-carmine" : "fill-none stroke-gray-400")}
      />
      {fill === "half" ? (
        <path
          d={STAR_PATH}
          strokeWidth={1.5}
          strokeLinejoin="round"
          clipPath={`url(#${halfId})`}
          className="fill-carmine stroke-carmine"
        />
      ) : null}
    </svg>
  );
};
