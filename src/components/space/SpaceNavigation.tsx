import { BrandLogo } from "@/components/brand/BrandLogo";
import type { SpaceAccount } from "./SpaceAccount";
import { SpaceAccountMenu } from "./SpaceAccountMenu";
import { SpaceNavigationLinks } from "./SpaceNavigationLinks";

type SpaceNavigationProps = {
  account: SpaceAccount;
  pendingTestimonials: number;
};

/** Charte v2, Navigation de l'espace: a 264 column, white on the Nuage page, without rule; the small logo at 27. */
export const SpaceNavigation = ({ account, pendingTestimonials }: SpaceNavigationProps) => (
  <nav
    aria-label="Navigation principale"
    className="sticky top-[0] flex h-dvh w-space-nav shrink-0 flex-col gap-7 bg-white px-4 pt-7 pb-5"
  >
    <BrandLogo variant="small" height={27} alt="Pulsacity" className="mx-3" />
    <SpaceNavigationLinks pendingTestimonials={pendingTestimonials} />
    <SpaceAccountMenu account={account} />
  </nav>
);
