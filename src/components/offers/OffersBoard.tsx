"use client";

import Link from "next/link";
import { useState } from "react";
import { CONNECTORS_SECTION_HREF } from "@/components/space/space-sections";
import { INLINE_LINK_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import type { SpaceOffer } from "@/lib/spaces/list-space-offers";
import { AddOfferForm } from "./AddOfferForm";
import { type OfferConnector, OfferRow } from "./OfferRow";

export type BoardOffer = {
  offer: SpaceOffer;
  collectionUrl: string;
  collectionAddress: string;
};

type OffersBoardProps = {
  offers: BoardOffer[];
  connectors: OfferConnector[];
  today: string;
};

/** The offers page of maquette 17: the list, the « Nouvelle offre » panel, and the first-day state. */
export const OffersBoard = ({ offers, connectors, today }: OffersBoardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const isEmpty = offers.length === 0;
  const addButton = (
    <button type="button" onClick={() => setIsAdding(true)} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
      Ajouter une offre
    </button>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 desktop:flex-row desktop:items-end desktop:justify-between desktop:gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-h1">Offres</h1>
          <p className="max-w-text text-body">
            Chaque offre a son lien de collecte et ses réglages de demande d&apos;avis.
          </p>
        </div>
        {isEmpty || isAdding ? null : addButton}
      </div>
      {isAdding ? (
        <AddOfferForm onDone={() => setIsAdding(false)} />
      ) : null}
      {isEmpty && !isAdding ? (
        <section className="flex flex-col gap-4 rounded-panel bg-white p-5 desktop:p-8">
          <h2 className="font-display text-h2">Aucune offre pour l&apos;instant</h2>
          <p className="max-w-text text-body">
            Ajoutez la formation ou le service que vous vendez. Chaque offre reçoit son lien de collecte, à envoyer à vos
            clients.
          </p>
          <div className="pt-2">{addButton}</div>
          <p className="pt-2 text-small text-gray">
            Vous vendez en ligne ?{" "}
            <Link href={CONNECTORS_SECTION_HREF} className={INLINE_LINK_CLASSES}>
              Connectez votre outil
            </Link>{" "}
            : vos produits arriveront tout seuls.
          </p>
        </section>
      ) : null}
      {isEmpty ? null : (
        <ul className="flex flex-col gap-6">
          {offers.map(({ offer, collectionUrl, collectionAddress }) => (
            <OfferRow
              key={offer.id}
              offer={offer}
              connectors={connectors}
              collectionUrl={collectionUrl}
              collectionAddress={collectionAddress}
              today={today}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
