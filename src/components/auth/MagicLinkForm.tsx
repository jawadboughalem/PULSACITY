"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/components/analytics/track-event";
import { PRIMARY_BUTTON_CLASSES, DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FIELD_LABEL_CLASSES, OPTIONAL_MARK_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { SelectControl } from "@/components/ui/SelectControl";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { TextField } from "@/components/ui/TextField";
import { HEARD_FROM_OPTIONS } from "@/lib/acquisition/heard-from";
import { HEARD_FROM_PARAMETER, type SignupSource, SOURCE_PARAMETERS } from "@/lib/acquisition/signup-source";
import { MAGIC_LINK_LIFETIME_MINUTES } from "@/lib/auth/magic-link-lifetime";
import { cn } from "@/lib/cn";
import { useMagicLinkRequest } from "./useMagicLinkRequest";

const INVALID_EMAIL_MESSAGE = "Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr.";

type MagicLinkFormProps = {
  /** The page's title and text, and what follows the form: once the link is sent, its own message takes their place. */
  heading?: ReactNode;
  footer?: ReactNode;
  /** Inscription: where the visitor comes from, carried by the sign-in link until the space is created. */
  source?: SignupSource;
  /** Inscription: « Comment avez-vous connu PULSACITY ? » (maquette 3.4), optional. */
  asksHeardFrom?: boolean;
};

const HEARD_FROM_FIELD_ID = "heard-from";

export const MagicLinkForm = ({ heading, footer, source = {}, asksHeardFrom = false }: MagicLinkFormProps) => {
  const {
    email,
    heardFrom,
    isSent,
    error,
    isPending,
    handleSubmit,
    handleChangeEmail,
    handleChangeHeardFrom,
    handleUseAnotherAddress,
  } = useMagicLinkRequest(
    asksHeardFrom
      ? (answer) => trackEvent("inscription-lien-demande", { connu: answer === "" ? "sans-reponse" : answer })
      : undefined,
  );

  // Maquettes 3.4, « Lien envoyé »: the message takes the whole card, under its icon on a Ciel disc.
  if (isSent) {
    return (
      <div role="status" className="flex flex-col gap-4">
        <span aria-hidden="true" className="flex size-[44px] items-center justify-center rounded-full bg-sky text-ink">
          <Icon name="mail" size={20} />
        </span>
        <h1 className="font-display text-h1">Un lien vous attend dans votre boîte de réception.</h1>
        <p className="text-body">
          Nous l&apos;avons envoyé à <strong className="font-bold break-all">{email}</strong>. Il est valable{" "}
          {MAGIC_LINK_LIFETIME_MINUTES} minutes.
        </p>
        <p className="text-small text-gray">Rien reçu ? Regardez dans vos courriers indésirables.</p>
        <button
          type="button"
          onClick={handleUseAnotherAddress}
          className={cn(DISCREET_BUTTON_CLASSES, "-ml-[10px] self-start")}
        >
          Utiliser une autre adresse
        </button>
      </div>
    );
  }

  return (
    <>
      {heading}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {error === "too-many-requests" ? (
          <StatusBanner tone="error" title="Vous avez demandé plusieurs liens en peu de temps.">
            Patientez quelques minutes, puis réessayez. Pensez à regarder dans vos courriers indésirables.
          </StatusBanner>
        ) : null}
        {error === "email-not-sent" ? (
          <StatusBanner tone="error" title="Le lien n'a pas pu partir.">
            Réessayez dans quelques minutes.
          </StatusBanner>
        ) : null}
        <TextField
          id="email"
          name="email"
          type="email"
          label="Adresse e-mail"
          autoComplete="email"
          inputMode="email"
          placeholder="vous@example.com"
          required
          value={email}
          onChange={(event) => handleChangeEmail(event.target.value)}
          error={error === "invalid-email" ? INVALID_EMAIL_MESSAGE : undefined}
        />
        {asksHeardFrom ? (
          <div className="flex flex-col gap-2">
            <label htmlFor={HEARD_FROM_FIELD_ID} className={FIELD_LABEL_CLASSES}>
              Comment avez-vous connu PULSACITY ? <span className={OPTIONAL_MARK_CLASSES}>(facultatif)</span>
            </label>
            <SelectControl
              id={HEARD_FROM_FIELD_ID}
              name={HEARD_FROM_PARAMETER}
              value={heardFrom}
              onChange={(event) => handleChangeHeardFrom(event.target.value)}
            >
              <option value="">Choisissez une réponse</option>
              {HEARD_FROM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectControl>
          </div>
        ) : null}
        {SOURCE_PARAMETERS.map((parameter) =>
          source[parameter] === undefined ? null : (
            <input key={parameter} type="hidden" name={parameter} value={source[parameter]} />
          ),
        )}
        <button type="submit" disabled={isPending} className={cn(PRIMARY_BUTTON_CLASSES, "w-full")}>
          Recevoir mon lien
        </button>
      </form>
      {footer}
    </>
  );
};
