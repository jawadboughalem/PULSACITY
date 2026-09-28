import { STAR_PATH } from "@/components/ui/icon-paths";
import { cn } from "@/lib/cn";

type StarIconProps = {
  size: 16 | 36;
  isFilled: boolean;
};

export const StarIcon = ({ size, isFilled }: StarIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
    <path
      d={STAR_PATH}
      strokeWidth={1.5}
      strokeLinejoin="round"
      className={cn(isFilled ? "fill-carmine stroke-carmine" : "fill-none stroke-gray-400")}
    />
  </svg>
);
