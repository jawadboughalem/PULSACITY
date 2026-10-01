import { BrandLogo } from "@/components/brand/BrandLogo";
import type { SpaceAccount } from "./SpaceAccount";
import { SpaceAccountMenu } from "./SpaceAccountMenu";
import { SpaceNavigationLinks } from "./SpaceNavigationLinks";

type SpaceNavigationProps = {
  account: SpaceAccount;
  pendingTestimonials: number;
};

export const SpaceNavigation = ({ account, pendingTestimonials }: SpaceNavigationProps) => (
  <nav
    aria-label="Navigation principale"
    className="sticky top-[0] flex h-dvh w-[248px] shrink-0 flex-col gap-6 border-r border-hairline-200 bg-white px-4 pt-6 pb-5"
  >
    <BrandLogo variant="small" height={27} alt="Pulsacity" className="mx-3" />
    <SpaceNavigationLinks pendingTestimonials={pendingTestimonials} />
    <SpaceAccountMenu account={account} />
  </nav>
);
