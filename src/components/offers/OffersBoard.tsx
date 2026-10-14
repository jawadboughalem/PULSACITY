"use client";

import Link from "next/link";
import { useState } from "react";
import { CONNECTORS_SECTION_HREF } from "@/components/space/space-sections";
import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
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
    <div className="flex flex-col gap-8">
      <div
        className={cn(
          "flex flex-col gap-6 desktop:flex-row desktop:items-end desktop:justify-between",
          !isEmpty && !isAdding && "border-b border-ink pb-6 desktop:pb-8",
        )}
      >
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-h1 font-semibold">Offres</h1>
          <p className="max-w-text text-body text-gray">
            Chaque offre a son lien de collecte et ses réglages de demande d&apos;avis.
          </p>
        </div>
        {isEmpty || isAdding ? null : addButton}
      </div>
      {isAdding ? (
        <div className={cn(!isEmpty && "border-b border-ink pb-8")}>
          <AddOfferForm onDone={() => setIsAdding(false)} />
        </div>
      ) : null}
      {isEmpty && !isAdding ? (
        <section className="flex flex-col gap-4 bg-sky p-6 desktop:p-10">
          <h2 className="font-display text-h2 font-semibold">Aucune offre pour l&apos;instant</h2>
          <p className="max-w-text text-body">
            Ajoutez la formation ou le service que vous vendez. Chaque offre reçoit son lien de collecte, à envoyer à vos
            clients.
          </p>
          <div className="pt-2">{addButton}</div>
          <p className="border-t border-hairline-200 pt-4 text-small text-gray">
            Vous vendez en ligne ?{" "}
            <Link
              href={CONNECTORS_SECTION_HREF}
              className="font-semibold text-ink underline underline-offset-[3px] hover:text-ink-800 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
            >
              Connectez votre outil
            </Link>{" "}
            : vos produits arriveront tout seuls.
          </p>
        </section>
      ) : null}
      {isEmpty ? null : (
        <ul className="flex flex-col">
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
