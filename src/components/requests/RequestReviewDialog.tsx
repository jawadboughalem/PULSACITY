"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useId, useRef, useState, useTransition } from "react";
import { type RequestReviewResult, requestReview } from "@/app/app/(espace)/demandes/request-actions";
import { markLinkShared } from "@/components/space/mark-link-shared";
import {
  ASK_FOR_REVIEW_PARAMETER,
  BILLING_HREF,
  OFFERS_SECTION_HREF,
  READY_REQUEST_PARAMETER,
  REQUESTS_SECTION_HREF,
} from "@/components/space/space-sections";
import { useCopyLink } from "@/components/space/useCopyLink";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Checkbox } from "@/components/ui/Checkbox";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import { formatDayMonth } from "@/lib/dates/format-french-date";
import { REQUEST_STATUS_FILTERS, REQUEST_STATUS_PARAMETER } from "./describe-request";
import {
  describeEmailGreeting,
  describeEmailReason,
  describeExistingRequest,
  describeInvalidEmail,
} from "./describe-manual-request";

const LINK_CLASSES =
  "inline-flex min-h-[44px] items-center gap-2 text-body font-semibold text-carmine hover:text-carmine-dark hover:underline underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

const SELECT_CLASSES =
  "h-[48px] w-full appearance-none rounded-sm border border-gray-400 bg-white pr-7 pl-4 text-body text-ink-900 focus:border-2 focus:border-ink-900 focus:pl-[15px] focus:outline-none";

/** Looks like an address before it goes to the server, which checks it for good. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Offer = { id: string; name: string; slug: string };

type RequestReviewDialogProps = {
  spaceName: string;
  offers: Offer[];
  /** The space's collection link: an offer's link adds its slug. */
  collectionUrl: string;
  /** « 2026-10-05 », today in Paris: the default and the latest purchase day. */
  today: string;
  /** The plan's monthly requests are all sent: what leaves now waits for the 1st of next month. */
  monthlyLimit: { count: number; month: string; nextMonth: string } | null;
  /** The plan's requests typed in by hand in a day (`plans.ts`). */
  dailyLimit: number | null;
  isOpenAtFirst: boolean;
};

type Refusal = Extract<RequestReviewResult, { ok: false }> | { ok: false; error: "network" };

const RefusalBox = ({ title, children }: { title: string; children: ReactNode }) => (
  <div role="alert" className="flex items-start gap-3 border-2 border-error bg-error-surface p-4 desktop:p-5">
    <Icon name="alert" size={20} className="mt-[2px] shrink-0 text-error" />
    <div className="flex min-w-[0] flex-col gap-2 text-small">
      <p className="text-body font-semibold text-error">{title}</p>
      {children}
    </div>
  </div>
);

const ToDo = ({ children }: { children: ReactNode }) => (
  <p>
    <strong className="font-semibold">À faire :</strong> {children}
  </p>
);

const CopyCollectionLink = ({ url }: { url: string }) => {
  const { isCopied, handleCopy } = useCopyLink(url, markLinkShared);
  return (
    <button type="button" onClick={handleCopy} className={LINK_CLASSES}>
      <Icon name={isCopied ? "valid" : "copy"} size={20} />
      {isCopied ? "Lien copié" : "Copier mon lien de collecte"}
    </button>
  );
};

/** m20, « Demander un avis »: a window on a desktop, the whole screen on a phone. */
export const RequestReviewDialog = ({
  spaceName,
  offers,
  collectionUrl,
  today,
  monthlyLimit,
  dailyLimit,
  isOpenAtFirst,
}: RequestReviewDialogProps) => {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(isOpenAtFirst);
  const [firstName, setFirstName] = useState("");
  const [productId, setProductId] = useState("");
  const [purchasedOn, setPurchasedOn] = useState(today);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [offerError, setOfferError] = useState<string | null>(null);
  const [attestationError, setAttestationError] = useState<string | null>(null);
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const [isAtDailyLimit, setIsAtDailyLimit] = useState(false);
  const [isSending, startSending] = useTransition();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setRefusal(null);
    setEmailError(null);
    setDateError(null);
    setOfferError(null);
    setAttestationError(null);
    setIsAtDailyLimit(false);
    formRef.current?.reset();
    setFirstName("");
    setProductId("");
    setPurchasedOn(today);
    // Opened from the home's button: closing it leaves Demandes as it is, without reopening on a reload.
    if (new URLSearchParams(window.location.search).has(ASK_FOR_REVIEW_PARAMETER)) {
      router.replace(REQUESTS_SECTION_HREF, { scroll: false });
    }
  };

  const offer = offers.find((candidate) => candidate.id === productId) ?? null;
  const offerUrl = offer ? `${collectionUrl}/${offer.slug}` : collectionUrl;

  const handleSubmit = (form: HTMLFormElement) => {
    const values = new FormData(form);
    const read = (name: string) => {
      const value = values.get(name);
      return typeof value === "string" ? value : "";
    };
    const email = read("email").trim();
    const isAttested = values.get("isAttested") === "on";
    const errors = {
      email: LOOKS_LIKE_EMAIL.test(email) ? null : describeInvalidEmail(email),
      offer: read("productId") ? null : "Choisissez l'offre que cette personne a achetée.",
      attestation: isAttested ? null : "Cochez cette case : une demande ne part qu'à un client qui a acheté l'offre.",
    };
    setRefusal(null);
    setDateError(null);
    setEmailError(errors.email);
    setOfferError(errors.offer);
    setAttestationError(errors.attestation);
    if (errors.email || errors.offer || errors.attestation) return;
    startSending(async () => {
      try {
        const result = await requestReview({
          firstName: read("firstName"),
          lastName: read("lastName"),
          email,
          productId: read("productId"),
          purchasedOn: read("purchasedOn"),
          isAttested,
        });
        if (result.ok) {
          close();
          router.push(`${REQUESTS_SECTION_HREF}?${READY_REQUEST_PARAMETER}=${result.data.requestId}`);
          return;
        }
        if (result.error === "invalid-email") setEmailError(describeInvalidEmail(email));
        else if (result.error === "invalid-date") setDateError("Choisissez le jour de l'achat : aujourd'hui ou avant.");
        else setRefusal(result);
        if (result.error === "daily-limit") setIsAtDailyLimit(true);
      } catch {
        setRefusal({ ok: false, error: "network" });
      }
    });
  };

  const renderRefusal = () => {
    if (!refusal) return null;
    switch (refusal.error) {
      case "request-exists": {
        const { detail, todo } = describeExistingRequest(refusal.existing, new Date());
        const filter = REQUEST_STATUS_FILTERS.find((candidate) => candidate.status === refusal.existing.status);
        return (
          <RefusalBox title={`${refusal.customerName} a déjà une demande pour ${offer?.name ?? "cette offre"}.`}>
            <p>{detail}</p>
            <ToDo>{todo}</ToDo>
            <div className="flex flex-wrap gap-x-6">
              <CopyCollectionLink url={offerUrl} />
              <Link
                href={`${REQUESTS_SECTION_HREF}${filter ? `?${REQUEST_STATUS_PARAMETER}=${filter.value}` : ""}`}
                onClick={close}
                className={LINK_CLASSES}
              >
                Voir sa demande
              </Link>
            </div>
          </RefusalBox>
        );
      }
      case "unsubscribed":
        return (
          <RefusalBox title={`${refusal.customerName} ne reçoit plus vos e-mails.`}>
            <p>
              {`Cette personne s'est désinscrite le ${formatDayMonth(new Date(refusal.unsubscribedAt))} des demandes d'avis de ${spaceName}. PULSACITY ne lui écrira plus, quelle que soit l'offre.`}
            </p>
            <ToDo>si elle souhaite tout de même donner son avis, partagez-lui votre lien de collecte par un autre moyen, à sa demande.</ToDo>
            <div>
              <CopyCollectionLink url={offerUrl} />
            </div>
          </RefusalBox>
        );
      case "daily-limit":
        return (
          <RefusalBox
            title={
              dailyLimit === null
                ? "Vous avez saisi le maximum de demandes du jour."
                : `Vous avez saisi ${dailyLimit} demandes aujourd'hui, le maximum par jour.`
            }
          >
            <p>
              Ce plafond ne concerne que les demandes saisies à la main. Il protège votre espace et vos clients contre les
              envois en masse. Les demandes déjà saisies partent normalement.
            </p>
            <ToDo>réessayez demain, à partir de minuit. Votre saisie est gardée dans ce formulaire jusqu&apos;à ce que vous le fermiez.</ToDo>
          </RefusalBox>
        );
      case "offer-not-found":
        return (
          <RefusalBox title="Cette offre n'existe plus.">
            <ToDo>rechargez la page, puis choisissez une autre offre.</ToDo>
          </RefusalBox>
        );
      case "not-attested":
        return (
          <RefusalBox title="La case n'est pas cochée.">
            <ToDo>cochez « Cette personne a acheté cette offre auprès de moi. », puis envoyez la demande.</ToDo>
          </RefusalBox>
        );
      default:
        return (
          <RefusalBox title="La demande n'est pas partie.">
            <ToDo>vérifiez votre connexion, puis réessayez.</ToDo>
          </RefusalBox>
        );
    }
  };

  const purchaseDay = /^\d{4}-\d{2}-\d{2}$/.test(purchasedOn) ? new Date(`${purchasedOn}T12:00:00Z`) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(SECONDARY_BUTTON_CLASSES, "w-full shrink-0 desktop:w-auto")}
      >
        Demander un avis
      </button>
      <dialog
        ref={dialogRef}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        aria-labelledby={titleId}
        className={cn(
          "overflow-y-auto bg-white text-ink-900 backdrop:bg-[rgba(22,33,62,0.12)]",
          "max-desktop:m-[0] max-desktop:h-dvh max-desktop:max-h-none max-desktop:w-full max-desktop:max-w-none",
          "desktop:m-auto desktop:max-h-[calc(100dvh-48px)] desktop:w-[600px] desktop:border desktop:border-hairline-200 desktop:shadow-float",
        )}
      >
        {/* Focus starts on the window itself, not on its close button: nothing looks selected when it opens. */}
        <div autoFocus tabIndex={-1} className="outline-none">
          <div className="sticky top-[0] z-10 flex items-center gap-3 border-b border-hairline-200 bg-white px-5 py-3 desktop:hidden">
            <button
              type="button"
              onClick={close}
              aria-label="Fermer"
              className="flex size-[44px] items-center justify-center focus-visible:outline-2 focus-visible:outline-ink-900"
            >
              <Icon name="close" size={24} />
            </button>
            <h2 id={titleId} className="text-body font-semibold">
              Demander un avis
            </h2>
          </div>
          <div className="flex flex-col gap-5 px-5 py-5 desktop:p-7">
            <div className="hidden items-start justify-between gap-4 desktop:flex">
              <p aria-hidden="true" className="font-serif text-h2 font-medium">
                Demander un avis
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Fermer"
                className="-mt-2 -mr-2 flex size-[44px] items-center justify-center focus-visible:outline-2 focus-visible:outline-ink-900"
              >
                <Icon name="close" size={24} />
              </button>
            </div>
            <p className="text-body text-slate-600">
              {`Pour un client qui a acheté en dehors d'un outil connecté : virement, séance, autre plateforme. Il reçoit le même e-mail qu'après une vente Systeme.io, au nom de ${spaceName}.`}
            </p>

            {offers.length === 0 ? (
              <div className="flex flex-col gap-3 bg-paper-100 p-5">
                <p className="text-body font-semibold">Ajoutez d&apos;abord une offre.</p>
                <p className="text-small">
                  Une demande d&apos;avis porte toujours sur une offre : c&apos;est elle que l&apos;e-mail nomme, et c&apos;est
                  sur elle que l&apos;avis s&apos;affichera. Votre espace n&apos;en a pas encore.
                </p>
                <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-5">
                  <Link href={OFFERS_SECTION_HREF} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
                    Aller à Offres
                  </Link>
                  <button type="button" onClick={close} className={cn(LINK_CLASSES, "self-center desktop:self-auto")}>
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <form
                ref={formRef}
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit(event.currentTarget);
                }}
                className="flex flex-col gap-5"
              >
                {renderRefusal()}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-5 desktop:flex-row desktop:gap-4">
                    <div className="flex-1">
                      <TextField
                        id={`${titleId}-first-name`}
                        name="firstName"
                        label={
                          <>
                            Prénom <span className="font-normal text-slate-600">(facultatif)</span>
                          </>
                        }
                        placeholder="Par exemple : Élodie"
                        autoComplete="off"
                        maxLength={80}
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <TextField
                        id={`${titleId}-last-name`}
                        name="lastName"
                        label={
                          <>
                            Nom <span className="font-normal text-slate-600">(facultatif)</span>
                          </>
                        }
                        placeholder="Par exemple : V."
                        autoComplete="off"
                        maxLength={80}
                      />
                    </div>
                  </div>
                  <p className="text-small text-slate-600">{describeEmailGreeting(firstName)}</p>
                </div>
                <TextField
                  id={`${titleId}-email`}
                  name="email"
                  type="email"
                  label="Adresse e-mail"
                  placeholder="elodie@example.com"
                  autoComplete="off"
                  required
                  error={emailError ?? undefined}
                  onChange={() => setEmailError(null)}
                />
                <div className="flex flex-col gap-2">
                  <label htmlFor={`${titleId}-offer`} className="text-small font-semibold">
                    Offre
                  </label>
                  <span className="relative flex">
                    <select
                      id={`${titleId}-offer`}
                      name="productId"
                      required
                      value={productId}
                      aria-invalid={offerError ? true : undefined}
                      aria-describedby={offerError ? `${titleId}-offer-error` : undefined}
                      onChange={(event) => {
                        setProductId(event.target.value);
                        setOfferError(null);
                      }}
                      className={cn(SELECT_CLASSES, offerError && "border-2 border-error pl-[15px]")}
                    >
                      <option value="" disabled>
                        Choisir une offre
                      </option>
                      {offers.map((candidate) => (
                        <option key={candidate.id} value={candidate.id}>
                          {candidate.name}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="chevronDown"
                      size={20}
                      className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
                    />
                  </span>
                  {offerError ? <FieldError id={`${titleId}-offer-error`} message={offerError} /> : null}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="desktop:w-[200px]">
                    <TextField
                      id={`${titleId}-date`}
                      name="purchasedOn"
                      type="date"
                      label="Date d'achat"
                      required
                      max={today}
                      value={purchasedOn}
                      error={dateError ?? undefined}
                      onChange={(event) => {
                        setPurchasedOn(event.target.value);
                        setDateError(null);
                      }}
                    />
                  </div>
                  <p className="text-small text-slate-600">{describeEmailReason(offer?.name ?? null, spaceName, purchaseDay)}</p>
                </div>
                <div className="flex flex-col gap-2 border-t border-hairline-200 pt-5">
                  <label className="flex cursor-pointer items-start gap-3 text-body">
                    <Checkbox
                      name="isAttested"
                      hasError={attestationError !== null}
                      aria-describedby={attestationError ? `${titleId}-attestation-error` : undefined}
                      onChange={() => setAttestationError(null)}
                    />
                    Cette personne a acheté cette offre auprès de moi.
                  </label>
                  {attestationError ? <FieldError id={`${titleId}-attestation-error`} message={attestationError} /> : null}
                </div>
                {monthlyLimit ? (
                  <div role="status" className="flex items-start gap-3 bg-paper-100 p-4 desktop:p-5">
                    <Icon name="info" size={20} className="mt-[2px] shrink-0" />
                    <div className="flex flex-col gap-2 text-small">
                      <p className="text-body font-semibold">{`Les ${monthlyLimit.count} demandes ${monthlyLimit.month} sont parties.`}</p>
                      <p>
                        {`Celle-ci est gardée et partira le 1er ${monthlyLimit.nextMonth} : rien n'est perdu. Avec le plan Essentiel, elle part tout de suite.`}
                      </p>
                      <Link
                        href={BILLING_HREF}
                        className="self-start font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark"
                      >
                        Voir le plan Essentiel
                      </Link>
                    </div>
                  </div>
                ) : null}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-5">
                    <button
                      type="submit"
                      disabled={isSending || isAtDailyLimit}
                      className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
                    >
                      Envoyer la demande
                    </button>
                    <button type="button" onClick={close} className={cn(LINK_CLASSES, "hidden desktop:inline-flex")}>
                      Annuler
                    </button>
                  </div>
                  <p className="text-small text-slate-600">
                    {monthlyLimit
                      ? `Elle partira le 1er ${monthlyLimit.nextMonth}, au premier envoi du mois. Sans réponse, une seule relance part quatre jours plus tard.`
                      : "Elle part au prochain envoi, dans les minutes qui suivent. Sans réponse, une seule relance part quatre jours plus tard."}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};
