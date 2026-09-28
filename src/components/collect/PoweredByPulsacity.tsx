import { cn } from "@/lib/cn";

type PoweredByPulsacityProps = {
  homeUrl: string;
  referralCode: string;
  className?: string;
};

export const PoweredByPulsacity = ({ homeUrl, referralCode, className }: PoweredByPulsacityProps) => (
  <p className={cn("text-center text-legal text-slate-600", className)}>
    <a
      href={`${homeUrl}/?ref=${encodeURIComponent(referralCode)}`}
      className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
    >
      Propulsé par PULSACITY
    </a>
  </p>
);
