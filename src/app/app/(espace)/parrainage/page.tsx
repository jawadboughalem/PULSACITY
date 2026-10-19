import type { Metadata } from "next";
import { ReferralLinkCard } from "@/components/referrals/ReferralLinkCard";
import { HowReferralWorks, ReferralFigures, ReferralList } from "@/components/referrals/ReferralPanels";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { MobileBackLink } from "@/components/space/MobileBackLink";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { getDb } from "@/db";
import { displayUrl, getAppUrl } from "@/lib/app-url";
import { buildReferralLink } from "@/lib/referrals/referral-links";
import { readReferralOverview } from "@/lib/referrals/read-referral-overview";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

export const metadata: Metadata = {
  title: "Parrainage · PULSACITY",
};

/**
 * Maquettes 3.3, Parrainage: the link to share, the referees and the months of Essentiel they earned, how it works.
 * On a computer, the link and the figures beside « Comment ça marche », the referees below over the whole width.
 */
const ReferralPage = async () => {
  const { signedInUser, space } = await getCurrentSpace();
  const overview = await readReferralOverview(getDb(), space.id);
  const url = buildReferralLink(getAppUrl(), space.slug);
  const hasReferees = overview.referrals.length > 0;

  return (
    <>
      <SpaceMobileHeader account={buildSpaceAccount(signedInUser, space)} />
      <SpacePage className="desktop:max-w-[1176px] desktop:gap-8">
        <div className="flex flex-col gap-4">
          <MobileBackLink />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-h1">Parrainage</h1>
            <p className="text-lead">
              Invitez un créateur. Quand il passe à un plan payant, vous recevez un mois d&apos;Essentiel offert.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 desktop:grid-cols-[minmax(0,1fr)_minmax(0,450px)] desktop:items-start">
          <div className="flex min-w-[0] flex-col gap-6">
            <ReferralLinkCard url={url} shownUrl={displayUrl(url)} />
            {hasReferees ? <ReferralFigures overview={overview} /> : <ReferralList overview={overview} url={url} />}
          </div>
          <HowReferralWorks className="order-last desktop:order-none" />
          {hasReferees ? (
            <div className="min-w-[0] desktop:col-span-2">
              <ReferralList overview={overview} url={url} />
            </div>
          ) : null}
        </div>
      </SpacePage>
    </>
  );
};

export default ReferralPage;
