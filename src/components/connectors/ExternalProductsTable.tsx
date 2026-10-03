"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { associateProduct } from "@/app/app/(espace)/connecteurs/connector-actions";
import { setOfferRequestDelay } from "@/app/app/(espace)/offres/offer-actions";
import { FieldError } from "@/components/ui/FieldError";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { quoteInFrench } from "@/lib/french/typography";
import { MAX_REQUEST_DELAY_DAYS, MIN_REQUEST_DELAY_DAYS } from "@/lib/spaces/product-rules";
import { ASSOCIATION_BADGES } from "./connection-badges";

export type AssociableOffer = {
  id: string;
  name: string;
  requestDelayDays: number;
  requestsEnabled: boolean;
};

export type ExternalProductItem = {
  id: string;
  name: string;
  /** « 297 € · première vente le 28 août 2026 » */
  details: string;
  productId: string | null;
};

type ExternalProductsTableProps = {
  connectorName: string;
  products: ExternalProductItem[];
  offers: AssociableOffer[];
};

const NEW_OFFER = "nouvelle-offre";

const DEFAULT_DELAY_DAYS = 14;

const CONTROL_CLASSES =
  "h-[48px] rounded-sm border border-gray-400 bg-white text-body text-ink-900 focus:border-2 focus:border-ink-900 focus:outline-none disabled:cursor-not-allowed disabled:border-hairline-200 disabled:bg-paper-100 disabled:text-slate-600";

const ERRORS = {
  "not-saved": "La modification n'a pas été enregistrée. Vérifiez votre connexion, puis réessayez.",
  "not-found": "Ce produit ou cette offre n'existe plus. Rechargez la page.",
  "invalid-delay": `Le délai va de ${MIN_REQUEST_DELAY_DAYS} à ${MAX_REQUEST_DELAY_DAYS} jours.`,
  "invalid-name": "Le nom de ce produit ne convient pas à une offre. Créez l'offre depuis la page Offres.",
} as const;

type RowProps = {
  product: ExternalProductItem;
  offers: AssociableOffer[];
};

const ExternalProductRow = ({ product, offers }: RowProps) => {
  const router = useRouter();
  const offer = offers.find((candidate) => candidate.id === product.productId) ?? null;
  const [editedDelay, setEditedDelay] = useState<string | null>(null);
  const delay = editedDelay ?? String(offer?.requestDelayDays ?? DEFAULT_DELAY_DAYS);
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const ids = { offer: `${product.id}-offer`, delay: `${product.id}-delay`, error: `${product.id}-error` };

  const save = (
    change: () => Promise<{ ok: true } | { ok: false; error: keyof typeof ERRORS }>,
    message: string,
    onSaved?: () => void,
  ) => {
    setError(null);
    setSavedMessage(null);
    startSaving(async () => {
      try {
        const result = await change();
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setSavedMessage(message);
        onSaved?.();
        router.refresh();
      } catch {
        setError("not-saved");
      }
    });
  };

  const handleOffer = (value: string) => {
    if (!value || value === product.productId) return;
    const target = value === NEW_OFFER ? { newOfferName: product.name } : { productId: value };
    save(
      async () => {
        const result = await associateProduct(product.id, target);
        return result.ok ? { ok: true } : { ok: false, error: result.error };
      },
      "Produit associé. Ses ventes gardées de côté sont traitées.",
    );
  };

  const handleDelay = () => {
    if (!offer || editedDelay === null || editedDelay === String(offer.requestDelayDays)) return;
    save(
      async () => {
        const result = await setOfferRequestDelay(offer.id, Number(delay));
        return result.ok ? { ok: true } : { ok: false, error: result.error === "invalid-delay" ? "invalid-delay" : "not-found" };
      },
      "Délai enregistré.",
      () => setEditedDelay(null),
    );
  };

  const badge = product.productId ? ASSOCIATION_BADGES.associated : ASSOCIATION_BADGES.awaiting;
  const isDelayDisabled = !offer || !offer.requestsEnabled || isSaving;

  return (
    <li className="flex flex-col gap-4 border-b border-hairline-200 py-5 desktop:grid desktop:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,4fr)_minmax(0,2fr)] desktop:items-center desktop:gap-5">
      <div className="flex items-start justify-between gap-3 desktop:block">
        <div className="flex min-w-[0] flex-col gap-1">
          <p className="text-body font-semibold">{product.name}</p>
          <p className="text-small text-slate-600">{product.details}</p>
        </div>
        <span className="desktop:hidden">
          <ToneBadge {...badge} />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor={ids.offer} className="text-small font-semibold desktop:sr-only">
          Offre PULSACITY<span className="sr-only">{` pour ${quoteInFrench(product.name)}`}</span>
        </label>
        <select
          id={ids.offer}
          value={product.productId ?? ""}
          disabled={isSaving}
          onChange={(event) => handleOffer(event.target.value)}
          className={cn(CONTROL_CLASSES, "w-full px-4 focus:px-[15px]", !product.productId && "border-2 border-ink-900 px-[15px]")}
        >
          {product.productId ? null : <option value="">Choisir une offre</option>}
          {offers.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.name}
            </option>
          ))}
          <option value={NEW_OFFER}>{`Créer l'offre ${quoteInFrench(product.name)}`}</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor={ids.delay} className="text-small font-semibold desktop:sr-only">
          Demande d&apos;avis<span className="sr-only">{` pour ${quoteInFrench(product.name)}, en jours après l'achat`}</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            id={ids.delay}
            type="number"
            inputMode="numeric"
            min={MIN_REQUEST_DELAY_DAYS}
            max={MAX_REQUEST_DELAY_DAYS}
            value={delay}
            disabled={isDelayDisabled}
            onChange={(event) => setEditedDelay(event.target.value)}
            onBlur={handleDelay}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleDelay();
            }}
            className={cn(CONTROL_CLASSES, "w-[80px] px-4 focus:px-[15px]")}
          />
          <span className={cn("text-small", isDelayDisabled && "text-slate-600")}>jours après l&apos;achat</span>
        </div>
        {offer && !offer.requestsEnabled ? (
          <p className="text-small text-slate-600">Demandes désactivées pour cette offre.</p>
        ) : null}
      </div>
      <span className="hidden desktop:block">
        <ToneBadge {...badge} />
      </span>
      <div aria-live="polite" className="desktop:col-span-4 empty:hidden">
        {error ? <FieldError id={ids.error} message={ERRORS[error]} /> : null}
        {savedMessage && !error ? <p className="text-small text-success">{savedMessage}</p> : null}
      </div>
    </li>
  );
};

/** Maquette 5, « Offres à associer »: each product received, the offer it belongs to, and when to ask. */
export const ExternalProductsTable = ({ connectorName, products, offers }: ExternalProductsTableProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col">
      <div
        aria-hidden="true"
        className="hidden border-b border-ink-900 pb-3 text-small font-semibold desktop:grid desktop:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,4fr)_minmax(0,2fr)] desktop:gap-5"
      >
        <span>{`Produit reçu de ${connectorName}`}</span>
        <span>Offre PULSACITY</span>
        <span>Demande d&apos;avis</span>
        <span>État</span>
      </div>
      <ul className="flex flex-col border-t border-ink-900 desktop:border-t-0">
        {products.map((product) => (
          <ExternalProductRow key={product.id} product={product} offers={offers} />
        ))}
      </ul>
    </div>
    <p className="text-small text-slate-600">
      Tant qu&apos;un produit n&apos;est pas associé, ses ventes sont gardées de côté : aucune demande n&apos;est envoyée.
    </p>
  </div>
);
