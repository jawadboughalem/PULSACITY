"use client";

import { PRIMARY_BUTTON_CLASSES, DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { TextField } from "@/components/ui/TextField";
import { MAGIC_LINK_LIFETIME_MINUTES } from "@/lib/auth/magic-link-lifetime";
import { cn } from "@/lib/cn";
import { useMagicLinkRequest } from "./useMagicLinkRequest";

const INVALID_EMAIL_MESSAGE = "Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr.";

export const MagicLinkForm = () => {
  const { email, isSent, error, isPending, submitAction, handleChangeEmail, handleUseAnotherAddress } =
    useMagicLinkRequest();

  if (isSent) {
    return (
      <div className="flex flex-col gap-4">
        <StatusBanner tone="success" title="Un lien vous attend dans votre boîte de réception.">
          Nous l&apos;avons envoyé à {email}. Il est valable {MAGIC_LINK_LIFETIME_MINUTES} minutes.
        </StatusBanner>
        <p className="text-small text-slate-600">
          Rien reçu ? Regardez dans vos courriers indésirables.
        </p>
        <button type="button" onClick={handleUseAnotherAddress} className={cn(DISCREET_BUTTON_CLASSES, "self-start")}>
          Utiliser une autre adresse
        </button>
      </div>
    );
  }

  return (
    <form action={submitAction} noValidate className="flex flex-col gap-5">
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
        required
        value={email}
        onChange={(event) => handleChangeEmail(event.target.value)}
        error={error === "invalid-email" ? INVALID_EMAIL_MESSAGE : undefined}
      />
      <button type="submit" disabled={isPending} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}>
        Recevoir mon lien
      </button>
    </form>
  );
};
