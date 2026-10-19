import { BrandMention } from "@/components/brand/BrandMention";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import { buildBadgeReferralUrl } from "@/lib/referrals/referral-links";

type PoweredByPulsacityProps = {
  homeUrl: string;
  referralCode: string;
  className?: string;
};

/** Identity v2: « Propulsé par » 12/16 in the secondary colour, then the drawn mention, 14 high, 6 px further. */
export const PoweredByPulsacity = ({ homeUrl, referralCode, className }: PoweredByPulsacityProps) => (
  <p className={cn("flex justify-center", className)}>
    <a
      href={buildBadgeReferralUrl(homeUrl, referralCode, "collecte")}
      className={cn("inline-flex min-h-[44px] items-center gap-[6px] text-mention text-gray hover:underline", FOCUS_RING)}
    >
      Propulsé par
      <BrandMention />
      <span className="sr-only">Pulsacity</span>
    </a>
  </p>
);
