"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { joinConnectorWaitlist } from "@/app/(marketing)/integrations/[connector]/public-waitlist-actions";
import { HoneypotField } from "@/components/collect/HoneypotField";
import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import { MARKETING_PATHS } from "../marketing-paths";

const INVALID_EMAIL_MESSAGE = "Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr.";

type PublicWaitlistFormProps = {
  connector: string;
  connectorName: string;
};

/** « Me prévenir » for a visitor: an address, kept only until the connector is out. */
export const PublicWaitlistForm = ({ connector, connectorName }: PublicWaitlistFormProps) => {
  const [result, submitAction, isPending] = useActionState(joinConnectorWaitlist, null);
  // Kept by React state: a form action empties the fields it does not control, even when the address is refused.
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const fieldId = `waitlist-${connector}`;

  if (result?.ok) {
    return (
      <StatusBanner tone="success" title="Nous vous préviendrons par e-mail.">
        {`Un seul message, à ${result.data.email}, le jour où ${connectorName} sera disponible.`}
      </StatusBanner>
    );
  }

  return (
    <form action={submitAction} noValidate className="flex flex-col gap-4">
      {result?.error === "too-many-requests" ? (
        <StatusBanner tone="error" title="Plusieurs demandes sont parties en peu de temps.">
          Patientez quelques minutes, puis réessayez.
        </StatusBanner>
      ) : null}
      <input type="hidden" name="connector" value={connector} />
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <div className="flex flex-col gap-4 desktop:flex-row desktop:items-start">
        <div className="desktop:w-[360px]">
          <TextField
            id={fieldId}
            name="email"
            type="email"
            label="Adresse e-mail"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={result?.error === "invalid-email" ? INVALID_EMAIL_MESSAGE : undefined}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          aria-label={`Me prévenir quand ${connectorName} sera disponible`}
          className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:mt-[28px] desktop:w-auto")}
        >
          Me prévenir
        </button>
      </div>
      <p className="max-w-text text-small text-slate-600">
        {`Votre adresse ne sert qu'à vous prévenir de la sortie de ${connectorName}. Elle est supprimée ensuite. `}
        <Link
          href={MARKETING_PATHS.privacy}
          className="font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
        >
          Confidentialité
        </Link>
      </p>
    </form>
  );
};
