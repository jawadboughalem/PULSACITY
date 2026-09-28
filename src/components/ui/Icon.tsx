import { cn } from "@/lib/cn";
import { ICON_PATHS, type IconName } from "./icon-paths";

type IconProps = {
  name: IconName;
  size: 16 | 20 | 24 | 32;
  className?: string;
};

export const Icon = ({ name, size, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={cn("shrink-0", className)}
  >
    {ICON_PATHS[name].map((path) => (
      <path key={path} d={path} />
    ))}
  </svg>
);
