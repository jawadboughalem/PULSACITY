import type { Metadata } from "next";
import { OffersBoard } from "@/components/offers/OffersBoard";
import { BackBar } from "@/components/space/BackBar";
import { MORE_SECTION_HREF } from "@/components/space/space-sections";
import { SpacePage } from "@/components/space/SpacePage";
import { getDb } from "@/db";
import { buildCollectionUrl, displayUrl } from "@/lib/app-url";
import { readParisDate } from "@/lib/dates/paris-date";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceOffers } from "@/lib/spaces/list-space-offers";

export const metadata: Metadata = {
  title: "Offres · PULSACITY",
};

const formatIsoDay = ({ year, month, day }: { year: number; month: number; day: number }) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const OffersPage = async () => {
  const { space } = await getCurrentSpace();
  const offers = await listSpaceOffers(getDb(), space.id);

  return (
    <>
      <BackBar href={MORE_SECTION_HREF} label="Plus" />
      <SpacePage className="desktop:max-w-[1128px]">
        <OffersBoard
          today={formatIsoDay(readParisDate(new Date()))}
          offers={offers.map((offer) => {
            const collectionUrl = buildCollectionUrl(space.slug, offer.slug);
            return { offer, collectionUrl, collectionAddress: displayUrl(collectionUrl) };
          })}
        />
      </SpacePage>
    </>
  );
};

export default OffersPage;
