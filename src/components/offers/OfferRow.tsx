"use client";

import { useState, useTransition } from "react";
import {
  type OfferActionResult,
  removeOffer,
  renameOffer,
  setOfferRequestDelay,
  setOfferRequestsEnabled,
} from "@/app/app/(espace)/offres/offer-actions";
import { useCopyLink } from "@/components/space/useCopyLink";
import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/cn";
import { CONNECTOR_NAMES } from "@/lib/connectors/connector-names";
import { formatDayMonth } from "@/lib/dates/format-french-date";
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

const LABEL_CLASSES = "text-small font-semibold";

const isValidDelay = (days: number) =>
  Number.isInteger(days) && days >= MIN_REQUEST_DELAY_DAYS && days <= MAX_REQUEST_DELAY_DAYS;

type OfferRowProps = {
  offer: SpaceOffer;
  collectionUrl: string;
  collectionAddress: string;
  /** Today in Paris, « 2026-10-01 », so the server and the browser agree on the date of the request. */
  today: string;
};

const groupRefs = (refs: SpaceOffer["connectorRefs"]) =>
  Object.entries(
    refs.reduce<Record<string, string[]>>((groups, ref) => {
      const name = CONNECTOR_NAMES[ref.connector];
      return { ...groups, [name]: [...(groups[name] ?? []), ref.externalRef] };
    }, {}),
  );

export const OfferRow = ({ offer, collectionUrl, collectionAddress, today }: OfferRowProps) => {
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
    <li className="flex flex-col gap-6 border-b border-hairline-200 py-6 desktop:py-7">
      {isEditingName ? (
        <form onSubmit={handleRename} className="flex flex-col gap-2">
          <label htmlFor={ids.name} className={LABEL_CLASSES}>
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
              className="h-[48px] w-full rounded-sm border border-gray-400 bg-white px-4 text-body text-ink-900 focus:border-2 focus:border-ink-900 focus:px-[15px] focus:outline-none desktop:max-w-[400px]"
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
          <p id={`${ids.name}-hint`} className="text-small text-slate-600">
            Le nouveau nom s&apos;affiche sur votre page de collecte. Le lien ne change pas.
          </p>
        </form>
      ) : (
        <div className="flex flex-col gap-3 desktop:flex-row desktop:items-start desktop:justify-between">
          <div className="flex min-w-[0] flex-col gap-1">
            <h2 className="font-serif text-quote font-medium">{offer.name}</h2>
            <p className="text-small text-slate-600">
              {offer.testimonialCount > 1 ? `${offer.testimonialCount} témoignages` : `${offer.testimonialCount} témoignage`}
            </p>
          </div>
          <div className="flex gap-5">
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
        <div role="alertdialog" aria-labelledby={`${offer.id}-removal`} className="flex flex-col gap-3 border-2 border-ink-900 p-5">
          <p id={`${offer.id}-removal`} className="text-body font-semibold">
            {`Retirer ${quoteInFrench(offer.name)} ?`}
          </p>
          <p className="text-body">
            Son lien de collecte ne fonctionnera plus et aucune demande ne partira. Les témoignages déjà reçus restent dans
            votre espace.
          </p>
          <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-5">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => save(() => removeOffer(offer.id), "Offre retirée.", () => setRemoval("closed"))}
              className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
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
        <div role="alert" className="flex items-start gap-3 border-2 border-error bg-error-surface p-4 text-error desktop:p-5">
          <Icon name="alert" size={20} className="mt-[2px]" />
          <div className="flex flex-col gap-1">
            <p className="text-body font-semibold">{ERRORS["has-sales"]}</p>
            <p className="text-small text-ink-900">
              {`Pour ne plus envoyer de demandes, désactivez ${quoteInFrench("Demander un avis après chaque vente")}.`}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-6 desktop:grid desktop:grid-cols-2 desktop:gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <Switch
              id={ids.requests}
              isOn={requestsEnabled}
              labelId={ids.requestsLabel}
              descriptionId={ids.requestsDescription}
              onChange={handleRequestsEnabled}
            />
            <div className="flex flex-col gap-1">
              <label id={ids.requestsLabel} htmlFor={ids.requests} className="cursor-pointer text-body font-semibold">
                Demander un avis après chaque vente
              </label>
              <p id={ids.requestsDescription} className="text-small text-slate-600">
                {requestsEnabled
                  ? "Activé : chaque client reçoit une demande, une seule fois."
                  : "Désactivé : aucune demande ne part toute seule. Vous pouvez toujours envoyer le lien vous-même."}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={ids.delay} className={LABEL_CLASSES}>
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
                className="h-[48px] w-[96px] rounded-sm border border-gray-400 bg-white px-4 text-body text-ink-900 focus:border-2 focus:border-ink-900 focus:px-[15px] focus:outline-none disabled:border-hairline-200 disabled:bg-paper-100 disabled:text-slate-600"
              />
              <span className={cn("text-body", !requestsEnabled && "text-slate-600")}>jours après la vente</span>
            </div>
            <p id={`${ids.delay}-hint`} className="text-small text-slate-600">
              {requestsEnabled
                ? `Pour une vente aujourd'hui, la demande partira le ${requestDay}${requestDay.endsWith(".") ? "" : "."}`
                : "Activez la demande automatique pour régler le délai."}
            </p>
          </div>
          <div aria-live="polite">
            {error ? <FieldError id={`${offer.id}-error`} message={ERRORS[error]} /> : null}
            {savedMessage && !error ? <p className="text-small text-success">{savedMessage}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span id={ids.link} className={LABEL_CLASSES}>
              Lien de collecte
            </span>
            <p
              aria-labelledby={ids.link}
              className="flex min-h-[48px] items-center rounded-sm border border-hairline-200 bg-paper-100 px-4 py-3 text-body break-all"
            >
              {collectionAddress}
            </p>
            <p className="text-small text-slate-600">À envoyer vous-même, ou à coller dans vos e-mails et vos pages.</p>
            <button
              type="button"
              onClick={handleCopy}
              className={cn(SECONDARY_BUTTON_CLASSES, "mt-2 w-full desktop:w-auto desktop:self-start")}
            >
              <Icon name={isCopied ? "valid" : "copy"} size={20} className={cn(isCopied && "text-success")} />
              {isCopied ? "Lien copié" : "Copier le lien"}
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <span className={LABEL_CLASSES}>Identifiants par connecteur</span>
            <ul className="flex flex-col border-t border-hairline-200">
              {offer.connectorRefs.length > 0 ? (
                groupRefs(offer.connectorRefs).map(([connector, refs]) => (
                  <li key={connector} className="flex items-start gap-3 border-b border-hairline-200 py-4 text-small">
                    <Icon name="connection" size={20} />
                    <span className="flex flex-col gap-1">
                      <span className="text-body font-semibold">{connector}</span>
                      <span>{refs.join(", ")}</span>
                    </span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-3 border-b border-hairline-200 py-4 text-small">
                  <Icon name="connection" size={20} className="text-slate-600" />
                  <span className="flex flex-col gap-1">
                    <span className="text-body font-semibold">Aucun outil connecté</span>
                    <span className="text-slate-600">
                      L&apos;identifiant de chaque outil s&apos;ajoute ici à la première vente reçue.
                    </span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
};
