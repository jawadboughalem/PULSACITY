import type { Metadata } from "next";
import { OffersBoard } from "@/components/offers/OffersBoard";
import { BackBar } from "@/components/space/BackBar";
import { MORE_SECTION_HREF, connectorHref } from "@/components/space/space-sections";
import { SpacePage } from "@/components/space/SpacePage";
import { getDb } from "@/db";
import { getConnector } from "@/lib/connectors/registry";
import { buildCollectionUrl, displayUrl } from "@/lib/app-url";
import { toParisIsoDay } from "@/lib/dates/paris-date";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceConnectors, listSpaceOffers } from "@/lib/spaces/list-space-offers";

export const metadata: Metadata = {
  title: "Offres · PULSACITY",
};

const OffersPage = async () => {
  const { space } = await getCurrentSpace();
  const database = getDb();
  const [offers, connectorIds] = await Promise.all([
    listSpaceOffers(database, space.id),
    listSpaceConnectors(database, space.id),
  ]);
  const connectors = connectorIds.flatMap((id) => {
    const connector = getConnector(id);
    return connector
      ? [{ id, name: connector.name, associationHref: `${connectorHref(connector.slug)}#offres-a-associer` }]
      : [];
  });

  return (
    <>
      <BackBar href={MORE_SECTION_HREF} label="Plus" />
      <SpacePage className="desktop:max-w-[1128px]">
        <OffersBoard
          connectors={connectors}
          today={toParisIsoDay(new Date())}
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
