import { BrandSymbol } from "@/components/brand/BrandSymbol";
import { cn } from "@/lib/cn";

type PoweredByPulsacityProps = {
  homeUrl: string;
  referralCode: string;
  className?: string;
};

export const PoweredByPulsacity = ({ homeUrl, referralCode, className }: PoweredByPulsacityProps) => (
  <p className={cn("flex justify-center", className)}>
    <a
      href={`${homeUrl}/?ref=${encodeURIComponent(referralCode)}`}
      className="inline-flex items-center gap-1 text-legal text-slate-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
    >
      Propulsé par
      <span className="inline-flex items-center gap-1 font-serif text-small font-semibold text-ink-900">
        <BrandSymbol variant="small" size={14} isMonochrome />
        Pulsacity
      </span>
    </a>
  </p>
);
