import { cn } from "@/lib/cn";
import { STAR_PATH } from "./icon-paths";

type LogotypeProps = {
  className?: string;
};

export const Logotype = ({ className }: LogotypeProps) => (
  <span
    role="img"
    aria-label="Pulsacity"
    className={cn("font-serif font-semibold leading-none tracking-title whitespace-nowrap", className)}
  >
    Pulsac
    <span className="relative inline-block">
      ı
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="absolute top-[0.04em] left-1/2 -ml-[0.15em] size-[0.3em]"
      >
        <path d={STAR_PATH} className="fill-carmine" />
      </svg>
    </span>
    ty
  </span>
);
