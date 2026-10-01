import type { ReactNode } from "react";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { SpaceNavigation } from "@/components/space/SpaceNavigation";
import { SpaceTabBar } from "@/components/space/SpaceTabBar";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { getCurrentSpaceCounts } from "@/lib/spaces/get-current-space-counts";

type SpaceLayoutProps = {
  children: ReactNode;
};

const SpaceLayout = async ({ children }: SpaceLayoutProps) => {
  const { signedInUser, space } = await getCurrentSpace();
  const counts = await getCurrentSpaceCounts(space.id);
  const account = buildSpaceAccount(signedInUser, space);

  return (
    <div className="flex min-h-dvh">
      <div className="hidden desktop:flex">
        <SpaceNavigation account={account} pendingTestimonials={counts.pending} />
      </div>
      <div className="flex min-w-[0] flex-1 flex-col">
        {children}
        <div className="desktop:hidden">
          <SpaceTabBar />
        </div>
      </div>
    </div>
  );
};

export default SpaceLayout;
