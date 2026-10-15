import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { SpaceNavigation } from "@/components/space/SpaceNavigation";
import { SpaceTabBar } from "@/components/space/SpaceTabBar";
import { CHECKOUT_PATH, PLAN_CHOICE_COOKIE } from "@/lib/billing/billing-paths";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { getCurrentSpaceCounts } from "@/lib/spaces/get-current-space-counts";

type SpaceLayoutProps = {
  children: ReactNode;
};

const SpaceLayout = async ({ children }: SpaceLayoutProps) => {
  const { signedInUser, space } = await getCurrentSpace();
  // A plan chosen on Tarifs before signing up or in: its payment opens as soon as the space exists.
  if ((await cookies()).has(PLAN_CHOICE_COOKIE)) redirect(CHECKOUT_PATH);
  const counts = await getCurrentSpaceCounts(space.id);
  const account = buildSpaceAccount(signedInUser, space);

  return (
    <div className="flex min-h-dvh bg-cloud">
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
