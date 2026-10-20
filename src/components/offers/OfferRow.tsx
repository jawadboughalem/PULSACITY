"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  type OfferActionResult,
  removeOffer,
  renameOffer,
  setOfferRequestDelay,
  setOfferRequestsEnabled,
} from "@/app/app/(espace)/offres/offer-actions";
import { useCopyLink } from "@/components/space/useCopyLink";
import { ActionDoneMessage } from "@/components/ui/ActionDoneMessage";
import {
  DANGER_BUTTON_CLASSES,
  DISCREET_BUTTON_CLASSES,
  SECONDARY_BUTTON_CLASSES,
} from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import {
  FIELD_CLASSES,
  FIELD_HINT_CLASSES,
  FIELD_LABEL_CLASSES,
  READ_ONLY_FIELD_CLASSES,
} from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/cn";
import { formatDayMonth } from "@/lib/dates/format-french-date";
import { formatPrice } from "@/lib/french/format-price";
import { quoteInFrench } from "@/lib/french/typography";
import { MAX_PRODUCT_NAME_LENGTH, MAX_REQUEST_DELAY_DAYS, MIN_REQUEST_DELAY_DAYS } from "@/lib/spaces/product-rules";
import type { SpaceOffer } from "@/lib/spaces/list-space-offers";

const ERRORS: Record<Exclude<OfferActionResult, { ok: true }>["error"] | "not-saved", string> = {
  "product-not-found": "Cette offre n'existe plus. Rechargez la page.",
  "invalid-name": "Indiquez le nom de l'offre, en 2 caractères au moins.",
  "invalid-delay": `Le délai va de ${MIN_REQUEST_DELAY_DAYS} à ${MAX_REQUEST_DELAY_DAYS} jours.`,
  "has-sales": "Cette offre a déjà des ventes : elle ne peut pas être retirée.",
  "not-saved": "La modification n'a pas été enregistrée. Vérifiez votre connexion, puis réessayez.",
};

const DAY_MS = 24 * 60 * 60 * 1000;


const isValidDelay = (days: number) =>
  Number.isInteger(days) && days >= MIN_REQUEST_DELAY_DAYS && days <= MAX_REQUEST_DELAY_DAYS;

/** A connector this space has set up: where its products are associated with offers. */
export type OfferConnector = {
  id: string;
  name: string;
  associationHref: string;
};

type OfferRowProps = {
  offer: SpaceOffer;
  connectors: OfferConnector[];
  collectionUrl: string;
  collectionAddress: string;
  /** Today in Paris, « 2026-10-01 », so the server and the browser agree on the date of the request. */
  today: string;
};

export const OfferRow = ({ offer, connectors, collectionUrl, collectionAddress, today }: OfferRowProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(offer.name);
  const [delay, setDelay] = useState(String(offer.requestDelayDays));
  const [requestsEnabled, setRequestsEnabled] = useState(offer.requestsEnabled);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [removal, setRemoval] = useState<"closed" | "confirm" | "impossible">("closed");
  const { isCopied, handleCopy } = useCopyLink(collectionUrl);
  const ids = {
    name: `${offer.id}-name`,
    requests: `${offer.id}-requests`,
    requestsLabel: `${offer.id}-requests-label`,
    requestsDescription: `${offer.id}-requests-description`,
    delay: `${offer.id}-delay`,
    link: `${offer.id}-link`,
  };

  const save = (change: () => Promise<OfferActionResult>, message: string, onSaved?: () => void) => {
    setError(null);
    setSavedMessage(null);
    startSaving(async () => {
      try {
        const result = await change();
        if (result.ok) {
          setSavedMessage(message);
          onSaved?.();
        } else if (result.error === "has-sales") {
          setRemoval("impossible");
        } else {
          setError(result.error);
        }
      } catch {
        setError("not-saved");
      }
    });
  };

  const handleRename = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save(() => renameOffer(offer.id, name), "Nom enregistré.", () => setIsEditingName(false));
  };

  const handleDelay = () => {
    if (delay === String(offer.requestDelayDays)) return;
    save(() => setOfferRequestDelay(offer.id, Number(delay)), "Délai enregistré.");
  };

  const handleRequestsEnabled = (isEnabled: boolean) => {
    setRequestsEnabled(isEnabled);
    save(
      () => setOfferRequestsEnabled(offer.id, isEnabled),
      isEnabled ? "Demandes automatiques activées." : "Demandes automatiques désactivées.",
    );
  };

  const shownDelay = isValidDelay(Number(delay)) ? Number(delay) : offer.requestDelayDays;
  const requestDay = formatDayMonth(new Date(new Date(`${today}T12:00:00Z`).getTime() + shownDelay * DAY_MS));

  return (
    <li className="flex flex-col gap-6 rounded-panel bg-white p-5 desktop:p-8">
      {isEditingName ? (
        <form onSubmit={handleRename} className="flex flex-col gap-2">
          <label htmlFor={ids.name} className={FIELD_LABEL_CLASSES}>
            Nom de l&apos;offre
          </label>
          <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-4">
            <input
              id={ids.name}
              value={name}
              maxLength={MAX_PRODUCT_NAME_LENGTH}
              autoFocus
              aria-describedby={`${ids.name}-hint`}
              onChange={(event) => setName(event.target.value)}
              className={cn(FIELD_CLASSES, "desktop:max-w-[400px]")}
            />
            <button type="submit" disabled={isSaving} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => {
                setName(offer.name);
                setIsEditingName(false);
              }}
              className={cn(DISCREET_BUTTON_CLASSES, "self-start desktop:self-auto")}
            >
              Annuler
            </button>
          </div>
          <p id={`${ids.name}-hint`} className={FIELD_HINT_CLASSES}>
            Le nouveau nom s&apos;affiche sur votre page de collecte. Le lien ne change pas.
          </p>
        </form>
      ) : (
        <div className="flex flex-col gap-3 desktop:flex-row desktop:items-start desktop:justify-between">
          <div className="flex min-w-[0] flex-col gap-1">
            <h2 className="font-display text-h2">{offer.name}</h2>
            <p className="text-small text-gray">
              {offer.price
                ? formatPrice(offer.price.amountCents, offer.price.currency)
                : offer.testimonialCount > 1
                  ? `${offer.testimonialCount} témoignages`
                  : `${offer.testimonialCount} témoignage`}
            </p>
          </div>
          <div className="-ml-[10px] flex gap-2 desktop:ml-[0] desktop:-mr-[10px]">
            <button type="button" onClick={() => setIsEditingName(true)} className={DISCREET_BUTTON_CLASSES}>
              Renommer
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setRemoval(removal === "closed" ? (offer.hasSales ? "impossible" : "confirm") : "closed")}
              className={DISCREET_BUTTON_CLASSES}
            >
              Retirer
            </button>
          </div>
        </div>
      )}

      {removal === "confirm" ? (
        <div
          role="alertdialog"
          aria-labelledby={`${offer.id}-removal`}
          className="flex flex-col gap-3 rounded-card border-2 border-ink bg-white p-5 desktop:p-6"
        >
          <p id={`${offer.id}-removal`} className="text-body font-bold">
            {`Retirer ${quoteInFrench(offer.name)} ?`}
          </p>
          <p className="text-body">
            Son lien de collecte ne fonctionnera plus et aucune demande ne partira. Les témoignages déjà reçus restent dans
            votre espace.
          </p>
          <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-6">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => save(() => removeOffer(offer.id), "Offre retirée.", () => setRemoval("closed"))}
              className={cn(DANGER_BUTTON_CLASSES, "w-full desktop:w-auto")}
            >
              Retirer l&apos;offre
            </button>
            <button type="button" onClick={() => setRemoval("closed")} className={cn(DISCREET_BUTTON_CLASSES, "self-start")}>
              Garder l&apos;offre
            </button>
          </div>
        </div>
      ) : null}
      {removal === "impossible" ? (
        <div
          role="alert"
          className="flex items-start gap-[14px] rounded-card border-2 border-error bg-error-surface px-5 py-4 text-ink desktop:px-6 desktop:py-5"
        >
          <Icon name="alert" size={24} className="mt-[1px] shrink-0 text-error" />
          <div className="flex min-w-[0] flex-col gap-1">
            <p className="text-body font-bold">{ERRORS["has-sales"]}</p>
            <p className="text-small">
              {`Pour ne plus envoyer de demandes, désactivez ${quoteInFrench("Demander un avis après chaque vente")}.`}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-8 desktop:grid desktop:grid-cols-2 desktop:gap-9">
        <div className="flex flex-col gap-6">
          {/* Maquettes 3.4: the switch at the right of what it turns on. */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <label id={ids.requestsLabel} htmlFor={ids.requests} className="cursor-pointer text-body font-bold">
                Demander un avis après chaque vente
              </label>
              <p id={ids.requestsDescription} className="text-small text-gray">
                {requestsEnabled
                  ? "Activé : chaque client reçoit une demande, une seule fois."
                  : "Désactivé : aucune demande ne part toute seule. Vous pouvez toujours envoyer le lien vous-même."}
              </p>
            </div>
            <Switch
              id={ids.requests}
              isOn={requestsEnabled}
              labelId={ids.requestsLabel}
              descriptionId={ids.requestsDescription}
              onChange={handleRequestsEnabled}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={ids.delay} className={FIELD_LABEL_CLASSES}>
              Délai avant la demande
            </label>
            <div className="flex items-center gap-4">
              <input
                id={ids.delay}
                type="number"
                inputMode="numeric"
                min={MIN_REQUEST_DELAY_DAYS}
                max={MAX_REQUEST_DELAY_DAYS}
                value={delay}
                disabled={!requestsEnabled}
                aria-describedby={`${ids.delay}-hint`}
                onChange={(event) => setDelay(event.target.value)}
                onBlur={handleDelay}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleDelay();
                }}
                className={cn(FIELD_CLASSES, "w-[96px]")}
              />
              <span className={cn("text-body", !requestsEnabled && "text-gray")}>jours après la vente</span>
            </div>
            <p id={`${ids.delay}-hint`} className={FIELD_HINT_CLASSES}>
              {requestsEnabled
                ? `Pour une vente aujourd'hui, la demande partira le ${requestDay}${requestDay.endsWith(".") ? "" : "."}`
                : "Activez la demande automatique pour régler le délai."}
            </p>
          </div>
          <div aria-live="polite" className="empty:hidden">
            {error ? <FieldError id={`${offer.id}-error`} message={ERRORS[error]} /> : null}
          </div>
          <ActionDoneMessage message={savedMessage && !error ? savedMessage : null} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span id={ids.link} className={FIELD_LABEL_CLASSES}>
              Lien de collecte
            </span>
            <p
              aria-labelledby={ids.link}
              className={cn(READ_ONLY_FIELD_CLASSES, "flex h-auto min-h-[56px] items-center border-cloud py-3 wrap-anywhere")}
            >
              {collectionAddress}
            </p>
            <p className={FIELD_HINT_CLASSES}>À envoyer vous-même, ou à coller dans vos e-mails et vos pages.</p>
            <button
              type="button"
              onClick={handleCopy}
              className={cn(SECONDARY_BUTTON_CLASSES, "mt-2 w-full desktop:h-[44px] desktop:w-auto desktop:self-start desktop:px-[18px]")}
            >
              <Icon name={isCopied ? "check" : "copy"} size={20} />
              {isCopied ? "Lien copié" : "Copier le lien"}
            </button>
            <ActionDoneMessage message={isCopied ? "Le lien est copié." : null} />
          </div>
          <div className="flex flex-col gap-3">
            <span className={FIELD_LABEL_CLASSES}>Identifiants par connecteur</span>
            {/* Maquettes 3.4: each identifier on its aplat, Nuage, or Attente fond while no product is associated. */}
            <ul className="flex flex-col gap-3">
              {offer.connectorRefs.map((ref) => {
                const connector = connectors.find((candidate) => candidate.id === ref.connector);
                return (
                  <li
                    key={`${ref.connector}-${ref.externalRef}`}
                    className="flex flex-wrap items-start gap-3 rounded-field bg-cloud p-4 text-small"
                  >
                    <Icon name="connection" size={20} />
                    <span className="flex min-w-[0] flex-1 basis-[180px] flex-col">
                      <span className="text-body font-bold">{connector?.name ?? ref.connector}</span>
                      <span>{ref.productName ? `Produit ${quoteInFrench(ref.productName)}` : ref.externalRef}</span>
                    </span>
                    {connector ? (
                      <Link
                        href={connector.associationHref}
                        className={cn(DISCREET_BUTTON_CLASSES, "-my-2 shrink-0 max-desktop:ml-[22px]")}
                      >
                        Modifier
                      </Link>
                    ) : null}
                  </li>
                );
              })}
              {connectors
                .filter((connector) => !offer.connectorRefs.some((ref) => ref.connector === connector.id))
                .map((connector) => (
                  <li key={connector.id} className="flex items-start gap-3 rounded-field bg-waiting-surface p-4 text-small">
                    <Icon name="clock" size={20} className="text-waiting" />
                    <span className="flex flex-col gap-1">
                      <span className="text-body font-bold">{`${connector.name} · aucun produit associé`}</span>
                      <span>Les ventes de ce produit sont gardées de côté : aucune demande n&apos;est envoyée.</span>
                      <Link href={connector.associationHref} className={cn(DISCREET_BUTTON_CLASSES, "-ml-[10px] self-start")}>
                        {`Associer un produit ${connector.name}`}
                      </Link>
                    </span>
                  </li>
                ))}
              {connectors.length === 0 && offer.connectorRefs.length === 0 ? (
                <li className="flex items-start gap-3 rounded-field bg-cloud p-4 text-small">
                  <Icon name="connection" size={20} className="text-gray" />
                  <span className="flex flex-col gap-1">
                    <span className="text-body font-bold">Aucun outil connecté</span>
                    <span className="text-gray">
                      L&apos;identifiant de chaque outil s&apos;ajoute ici à la première vente reçue.
                    </span>
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
};
