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
import { DISCREET_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Checkbox } from "@/components/ui/Checkbox";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import { CONNECTOR_NAMES } from "@/lib/connectors/connector-names";
import { quoteInFrench } from "@/lib/french/typography";
import { MAX_PRODUCT_NAME_LENGTH, MAX_REQUEST_DELAY_DAYS, MIN_REQUEST_DELAY_DAYS } from "@/lib/spaces/product-rules";
import type { SpaceOffer } from "@/lib/spaces/list-space-offers";

const ERRORS: Record<Exclude<OfferActionResult, { ok: true }>["error"] | "not-saved", string> = {
  "product-not-found": "Cette offre n'existe plus. Rechargez la page.",
  "invalid-name": "Indiquez le nom de l'offre, en 2 caractères au moins.",
  "invalid-delay": `Le délai va de ${MIN_REQUEST_DELAY_DAYS} à ${MAX_REQUEST_DELAY_DAYS} jours.`,
  "has-sales": "Cette offre a déjà des ventes : elle reste en place pour les garder.",
  "not-saved": "La modification n'a pas été enregistrée. Vérifiez votre connexion, puis réessayez.",
};

type OfferRowProps = {
  offer: SpaceOffer;
  collectionUrl: string;
  collectionAddress: string;
};

const groupRefs = (refs: SpaceOffer["connectorRefs"]) =>
  Object.entries(
    refs.reduce<Record<string, string[]>>((groups, ref) => {
      const name = CONNECTOR_NAMES[ref.connector];
      return { ...groups, [name]: [...(groups[name] ?? []), ref.externalRef] };
    }, {}),
  );

export const OfferRow = ({ offer, collectionUrl, collectionAddress }: OfferRowProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(offer.name);
  const [delay, setDelay] = useState(String(offer.requestDelayDays));
  const [requestsEnabled, setRequestsEnabled] = useState(offer.requestsEnabled);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isRemovalConfirmationOpen, setIsRemovalConfirmationOpen] = useState(false);
  const { isCopied, handleCopy } = useCopyLink(collectionUrl);
  const delayId = `${offer.id}-delay`;

  const save = (change: () => Promise<OfferActionResult>, message: string, onSaved?: () => void) => {
    setError(null);
    setSavedMessage(null);
    startSaving(async () => {
      try {
        const result = await change();
        if (result.ok) {
          setSavedMessage(message);
          onSaved?.();
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

  return (
    <li className="flex flex-col gap-5 border-b border-hairline-200 py-5 desktop:py-6">
      <div className="flex flex-col gap-3 desktop:flex-row desktop:items-start desktop:justify-between">
        {isEditingName ? (
          <form onSubmit={handleRename} className="flex flex-1 flex-col gap-3">
            <div className="flex-1">
              <TextField
                id={`${offer.id}-name`}
                label="Nom de l'offre"
                value={name}
                maxLength={MAX_PRODUCT_NAME_LENGTH}
                autoFocus
                onChange={(event) => setName(event.target.value)}
                hint="Le lien de collecte ne change pas : ceux déjà envoyés marchent toujours."
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={isSaving} className={SECONDARY_BUTTON_CLASSES}>
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => {
                  setName(offer.name);
                  setIsEditingName(false);
                }}
                className={DISCREET_BUTTON_CLASSES}
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="flex min-w-[0] flex-col gap-1">
            <h2 className="text-body font-semibold">{offer.name}</h2>
            <p className="text-small text-slate-600">
              {offer.testimonialCount > 1 ? `${offer.testimonialCount} témoignages` : `${offer.testimonialCount} témoignage`}
            </p>
          </div>
        )}
        {isEditingName ? null : (
          <div className="flex gap-5">
            <button type="button" onClick={() => setIsEditingName(true)} className={DISCREET_BUTTON_CLASSES}>
              Renommer
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsRemovalConfirmationOpen(true)}
              className={DISCREET_BUTTON_CLASSES}
            >
              Retirer
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-small font-semibold">Lien de collecte</span>
        <div className="flex items-center gap-3">
          <span className="min-w-[0] flex-1 text-small break-all text-slate-600">{collectionAddress}</span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copier le lien de collecte de ${offer.name}`}
            className="flex size-[44px] shrink-0 items-center justify-center rounded-sm hover:bg-paper-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
          >
            <Icon name={isCopied ? "valid" : "copy"} size={20} className={cn(isCopied && "text-success")} />
          </button>
        </div>
        <p aria-live="polite" className="sr-only">
          {isCopied ? "Le lien est copié." : ""}
        </p>
      </div>

      <div className="flex flex-col gap-4 desktop:flex-row desktop:items-start desktop:gap-7">
        <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-body desktop:flex-1">
          <Checkbox checked={requestsEnabled} onChange={(event) => handleRequestsEnabled(event.target.checked)} />
          <span className="flex flex-col">
            <span>Demander un avis après chaque vente</span>
            <span className="text-small text-slate-600">Un e-mail part à votre client, puis une relance.</span>
          </span>
        </label>
        <div className="flex flex-col gap-2">
          <label htmlFor={delayId} className="text-small font-semibold">
            Délai avant la demande
          </label>
          <div className="flex items-center gap-3">
            <input
              id={delayId}
              type="number"
              inputMode="numeric"
              min={MIN_REQUEST_DELAY_DAYS}
              max={MAX_REQUEST_DELAY_DAYS}
              value={delay}
              disabled={!requestsEnabled}
              aria-describedby={`${delayId}-hint`}
              onChange={(event) => setDelay(event.target.value)}
              onBlur={handleDelay}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleDelay();
              }}
              className="h-[48px] w-[96px] rounded-sm border border-gray-400 bg-white px-4 text-body text-ink-900 focus:border-2 focus:border-ink-900 focus:px-[15px] focus:outline-none disabled:border-hairline-200 disabled:bg-paper-100 disabled:text-slate-600"
            />
            <span className="text-body">jours après la vente</span>
          </div>
          <p id={`${delayId}-hint`} className="text-small text-slate-600">
            S&apos;applique aux prochaines ventes.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-small font-semibold">Identifiants dans vos outils</span>
        {offer.connectorRefs.length > 0 ? (
          <ul className="flex flex-col gap-1 text-small text-slate-600">
            {groupRefs(offer.connectorRefs).map(([connector, refs]) => (
              <li key={connector}>{`${connector} : ${refs.join(", ")}`}</li>
            ))}
          </ul>
        ) : (
          <p className="text-small text-slate-600">
            Aucun pour l&apos;instant. Il s&apos;ajoute à la première vente reçue d&apos;un outil connecté.
          </p>
        )}
      </div>

      <ConfirmDialog
        isOpen={isRemovalConfirmationOpen}
        title={`Retirer l'offre ${quoteInFrench(offer.name)} ?`}
        message="Son lien de collecte ne marchera plus. Ses témoignages restent dans votre espace, sans offre."
        confirmLabel="Retirer l'offre"
        onConfirm={() => {
          setIsRemovalConfirmationOpen(false);
          save(() => removeOffer(offer.id), "Offre retirée.");
        }}
        onCancel={() => setIsRemovalConfirmationOpen(false)}
      />
      <div aria-live="polite">
        {error ? <FieldError id={`${offer.id}-error`} message={ERRORS[error]} /> : null}
        {savedMessage && !error ? <p className="text-small text-success">{savedMessage}</p> : null}
      </div>
    </li>
  );
};
