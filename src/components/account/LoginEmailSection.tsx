"use client";

import { useState, useTransition } from "react";
import { type ChangeLoginEmailResult, requestLoginEmailChange } from "@/app/app/(espace)/compte/account-actions";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { DISCREET_BUTTON_CLASSES, SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FIELD_HINT_CLASSES } from "@/components/ui/field-styles";
import { Spinner } from "@/components/ui/Spinner";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { TextField } from "@/components/ui/TextField";

type FailedRequest = Extract<ChangeLoginEmailResult, { ok: false }>["error"] | "network";

const ERRORS: Record<FailedRequest, string> = {
  "invalid-email": "Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr.",
  "same-email": "C'est déjà votre adresse de connexion. Écrivez la nouvelle.",
  "too-many-requests": "Vous avez demandé beaucoup de liens. Patientez un peu, puis réessayez.",
  network: "Le lien n'est pas parti. Vérifiez votre connexion, puis réessayez.",
};

type Step = { name: "idle" } | { name: "editing" } | { name: "sent"; newEmail: string };

type LoginEmailSectionProps = {
  email: string;
  /** Back from a link that did not work (expired, already used). */
  hasExpiredLink: boolean;
};

/** Mon compte, « Adresse de connexion »: a link goes to the new address, which replaces the old one once clicked. */
export const LoginEmailSection = ({ email, hasExpiredLink }: LoginEmailSectionProps) => {
  const [step, setStep] = useState<Step>({ name: "idle" });
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState<FailedRequest | null>(null);
  const [isSending, startSending] = useTransition();

  const send = () => {
    setError(null);
    startSending(async () => {
      try {
        const result = await requestLoginEmailChange(newEmail);
        if (result.ok) setStep({ name: "sent", newEmail: result.data.email });
        else setError(result.error);
      } catch {
        setError("network");
      }
    });
  };

  return (
    <SettingsSection id="account-email" title="Adresse de connexion">
      {step.name === "sent" ? (
        <StatusBanner tone="success" title={`Un lien est parti à ${step.newEmail}.`}>
          {`Votre adresse change quand vous cliquez dessus. D'ici là, gardez celle-ci : ${email}.`}
        </StatusBanner>
      ) : null}
      {step.name === "idle" ? (
        <div className="flex flex-col gap-4">
          {hasExpiredLink ? (
            <StatusBanner tone="error" title="Ce lien ne marche plus.">
              Il a expiré, ou il a déjà servi. Demandez-en un nouveau avec « Changer d&apos;adresse ».
            </StatusBanner>
          ) : null}
          <div className="flex flex-col gap-2">
            <p className="text-body font-bold break-words">{email}</p>
            <p className={FIELD_HINT_CLASSES}>C&apos;est à cette adresse que nous envoyons votre lien de connexion.</p>
          </div>
          <button
            type="button"
            onClick={() => setStep({ name: "editing" })}
            className={`${SECONDARY_COMPACT_BUTTON_CLASSES} self-start`}
          >
            Changer d&apos;adresse
          </button>
        </div>
      ) : null}
      {step.name === "editing" ? (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
          className="flex flex-col gap-4"
        >
          <p className="text-body break-words">
            Aujourd&apos;hui : <strong>{email}</strong>
          </p>
          <TextField
            id="new-login-email"
            name="email"
            type="email"
            label="Nouvelle adresse"
            autoComplete="email"
            inputMode="email"
            autoFocus
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            error={error ? ERRORS[error] : undefined}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSending}
              aria-busy={isSending || undefined}
              className={SECONDARY_COMPACT_BUTTON_CLASSES}
            >
              {isSending ? <Spinner size={18} /> : null}
              {isSending ? "Envoi…" : "Envoyer le lien"}
            </button>
            <button
              type="button"
              disabled={isSending}
              onClick={() => {
                setError(null);
                setNewEmail("");
                setStep({ name: "idle" });
              }}
              className={DISCREET_BUTTON_CLASSES}
            >
              Annuler
            </button>
          </div>
          <p className={FIELD_HINT_CLASSES}>
            Nous envoyons un lien à la nouvelle adresse. Elle remplace l&apos;ancienne dès que vous cliquez dessus.
          </p>
        </form>
      ) : null}
    </SettingsSection>
  );
};
