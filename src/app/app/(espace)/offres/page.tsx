import type { Metadata } from "next";
import { OffersBoard } from "@/components/offers/OffersBoard";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { MobileBackLink } from "@/components/space/MobileBackLink";
import { connectorHref } from "@/components/space/space-sections";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
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
  const { signedInUser, space } = await getCurrentSpace();
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
      <SpaceMobileHeader account={buildSpaceAccount(signedInUser, space)} />
      <SpacePage className="gap-4">
        <MobileBackLink />
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
