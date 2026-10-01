import type { Metadata } from "next";
import { MobilePageHeader } from "@/components/space/MobilePageHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { AddOfferForm } from "@/components/offers/AddOfferForm";
import { OfferRow } from "@/components/offers/OfferRow";
import { getDb } from "@/db";
import { buildCollectionUrl, displayUrl } from "@/lib/app-url";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceOffers } from "@/lib/spaces/list-space-offers";

export const metadata: Metadata = {
  title: "Offres · PULSACITY",
};

const OffersPage = async () => {
  const { space } = await getCurrentSpace();
  const offers = await listSpaceOffers(getDb(), space.id);

  return (
    <>
      <MobilePageHeader title="Offres" />
      <SpacePage className="desktop:max-w-[1024px]">
        <div className="flex flex-col gap-2">
          <h1 className="hidden font-serif text-h1 font-medium desktop:block">Offres</h1>
          <p className="max-w-text text-body text-slate-600">
            Vos formations, accompagnements et séances. Chacune a son lien de collecte et ses demandes d&apos;avis.
          </p>
        </div>
        <AddOfferForm />
        {offers.length === 0 ? (
          <p className="border-t border-ink-900 pt-5 text-body">
            Pas encore d&apos;offre. Ajoutez votre première formation pour lui donner son lien de collecte.
          </p>
        ) : (
          <ul className="flex flex-col border-t border-ink-900">
            {offers.map((offer) => {
              const collectionUrl = buildCollectionUrl(space.slug, offer.slug);
              return (
                <OfferRow
                  key={`${offer.id}-${offer.name}-${offer.requestDelayDays}-${offer.requestsEnabled}`}
                  offer={offer}
                  collectionUrl={collectionUrl}
                  collectionAddress={displayUrl(collectionUrl)}
                />
              );
            })}
          </ul>
        )}
      </SpacePage>
    </>
  );
};

export default OffersPage;
